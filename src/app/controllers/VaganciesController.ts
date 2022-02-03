import { Request, Response } from 'express'
import { checkFieldsNotNull } from '../../modules'
import { Company, Vagancy } from '../models'
import { Op, WhereOptions } from 'sequelize'

class VaganciesController {
  public async register (req: Request, res: Response) {
    const companyID = res.locals.id
    const nullField = checkFieldsNotNull(req.body)
    if (nullField) {
      return res.status(400).json({ error: nullField })
    }

    try {
      const company = await Company.findByPk(companyID)

      if (!company) {
        return res.status(404).json({ error: 'Company not found!' })
      }

      const vagancy = await Vagancy.create({
        ...req.body,
        companyID
      })

      return res.status(200).json({ vagancy })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }

  public async list (req: Request, res: Response) {
    const companyQueries: WhereOptions = {}
    const vagancyQueries: WhereOptions = {}
    const { region, category, position, salary } = req.query
    if (region) {
      companyQueries.region = region
    }
    if (category) {
      vagancyQueries.category = category
    }
    if (position) {
      vagancyQueries.position = position
    }
    if (salary) {
      const [min, max] = String(salary).split('/')
      vagancyQueries.salary = {
        [Op.between]: [Number(min), Number(max)]
      }
    }

    try {
      const vagancies = await Vagancy.findAll({
        where: vagancyQueries,
        include: [
          {
            association: 'company',
            attributes: {
              exclude: [
                'password',
                'passwordResetToken',
                'resetTokenExpiration',
                'verifyEmailToken',
                'verifyTokenExpiration'
              ]
            },
            where: companyQueries
          }
        ]
      })

      return res.status(200).json({ vagancies })
    } catch (err) {
      if (err.parent.code === '42703') {
        return res.status(500).json({ error: 'Invalid query string!' })
      }
      return res
        .status(500)
        .json({ error: 'Internal server error, please try again!' })
    }
  }
}

export default new VaganciesController()
