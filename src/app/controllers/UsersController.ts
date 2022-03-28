import { Request, Response } from 'express'
import { Op, WhereOptions } from 'sequelize'
import { checkFieldsNotNull } from '../../modules'
import { User } from '../models'

class UsersController {
  public async fetchOne (req: Request, res: Response) {
    const { userID } = req.params

    try {
      const user = await User.findByPk(userID, {
        attributes: {
          exclude: [
            'password'
          ]
        },
        include: [
          {
            association: 'savedVagancies',
            through: {
              attributes: []
            }
          }
        ]
      })

      if (!user) {
        return res.status(404).json({ error: 'User not found!' })
      }

      return res.status(200).json({ user })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }

  public async update (req: Request, res: Response) {
    const { userID } = req.params
    const authenticatedUserID = res.locals.decoded.id

    if (Number(userID) !== authenticatedUserID) {
      return res.status(403).json({ error: 'You do not have authorization to access this area!' })
    }

    const nullField = checkFieldsNotNull(req.body)
    if (nullField) {
      return res.status(400).json({ error: nullField })
    }

    try {
      const user = await User.findByPk(userID)

      if (!user) {
        return res.status(404).json({ error: 'User not found!' })
      }

      for (const field in req.body) {
        user[field] = req.body[field]
      }

      await user.save({ hooks: false })

      return res.status(200).json({ user })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }

  public async delete (req: Request, res: Response) {
    const { userID } = req.params
    const authenticatedUserID = res.locals.decoded.id

    if (Number(userID) !== authenticatedUserID) {
      return res.status(403).json({ error: 'You do not have authorization to access this area!' })
    }

    try {
      const user = await User.findByPk(userID)

      if (!user) {
        return res.status(404).json({ error: 'User not found!' })
      }

      await user.destroy()

      return res.status(200).json({ error: 'User succesfully deleted!' })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error please try again!' })
    }
  }

  public async list (req: Request, res: Response) {
    const userQueries: WhereOptions = {}
    const { workingArea, age } = req.query
    if (workingArea) {
      userQueries.workingArea = workingArea
    }
    if (age) {
      const [min, max] = String(age).split('/')
      userQueries.age = {
        [Op.between]: [Number(min), Number(max)]
      }
    }

    try {
      const users = await User.findAll({
        where: userQueries,
        attributes: {
          exclude: [
            'password',
            'passwordResetToken',
            'resetTokenExpiration',
            'verifyEmailToken',
            'verifyTokenExpiration'
          ]
        },
        include: [
          {
            association: 'savedVagancies',
            through: {
              attributes: []
            }
          }
        ]
      })

      return res.status(200).json({ users })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error please try again!' })
    }
  }
}

export default new UsersController()
