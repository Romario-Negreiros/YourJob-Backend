import { Request, Response } from 'express'
import { checkFieldsNotNull } from '../../modules'
import { Company, Vacancy, User } from '../models'
import { Op, WhereOptions } from 'sequelize'

class VacanciesController {
  public async register (req: Request, res: Response) {
    const companyID = res.locals.decoded.id
    const nullField = checkFieldsNotNull(req.body)
    if (nullField) {
      return res.status(400).json({ error: nullField })
    }

    try {
      const company = await Company.findByPk(companyID)

      if (!company) {
        return res.status(404).json({ error: 'Company not found!' })
      }

      const vacancy = await Vacancy.create({
        ...req.body,
        companyID
      })

      return res.status(201).json({ vacancy })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }

  public async list (req: Request, res: Response) {
    const companyQueries: WhereOptions = {}
    const vacancyQueries: WhereOptions = {}
    const { country, category, position, salary } = req.query
    if (country) {
      companyQueries.country = country
    }
    if (category) {
      vacancyQueries.category = category
    }
    if (position) {
      vacancyQueries.position = position
    }
    if (salary) {
      const [min, max] = String(salary).split('/')
      vacancyQueries.salary = {
        [Op.between]: [Number(min), Number(max)]
      }
    }

    try {
      const vacancies = await Vacancy.findAll({
        limit: 20,
        where: vacancyQueries,
        include: [
          {
            association: 'company:vacancies',
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

      return res.status(200).json({ vacancies })
    } catch (err) {
      if (err.parent.code === '42703') {
        return res.status(500).json({ error: 'Invalid query string!' })
      }
      return res
        .status(500)
        .json({ error: 'Internal server error!' })
    }
  }

  public async fetchOne (req: Request, res: Response) {
    const { vacancyID } = req.params

    try {
      const vacancy = await Vacancy.findByPk(vacancyID, {
        include: [
          {
            association: 'company:vacancies',
            attributes: {
              exclude: [
                'password',
                'passwordResetToken',
                'resetTokenExpiration',
                'verifyEmailToken',
                'verifyTokenExpiration'
              ]
            }
          }
        ]
      })

      if (!vacancy) {
        return res.status(404).json({ error: 'Vacancy not found!' })
      }

      return res.status(200).json({ vacancy })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }

  public async saveVacancy (req: Request, res: Response) {
    const userID = res.locals.decoded.id
    const { vacancyID } = req.params

    try {
      const user = await User.findByPk(userID)

      if (!user) {
        return res.status(404).json({ error: 'User not found!' })
      }

      const vacancy = await Vacancy.findByPk(vacancyID)

      if (!vacancy) {
        return res.status(404).json({ error: 'Vacancy not found!' })
      }

      await user.addSavedVacancies(vacancy)

      return res.status(200).json({ success: 'Vacancy saved!' })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }

  public async removeSavedVacancy (req: Request, res: Response) {
    const userID = res.locals.decoded.id
    const { vacancyID } = req.params

    try {
      const user = await User.findByPk(userID)

      if (!user) {
        return res.status(404).json({ error: 'User not found!' })
      }

      const vacancy = await Vacancy.findByPk(vacancyID)

      if (!vacancy) {
        return res.status(404).json({ error: 'Vacancy not found!' })
      }

      await user.removeSavedVacancies(vacancy)

      return res.status(200).json({ success: 'Removed saved vacancy!' })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }

  public async delete (req: Request, res: Response) {
    const { companyID, vacancyID } = req.params
    const authenticatedCompanyID = res.locals.decoded.id

    if (Number(companyID) !== authenticatedCompanyID) {
      return res.status(403).json({ error: 'You do not have authorization to access this area!' })
    }
    try {
      if (!await Company.findByPk(companyID)) {
        return res.status(404).json({ error: 'Company not found!' })
      }

      const vacancy = await Vacancy.findByPk(vacancyID)

      if (!vacancy) {
        return res.status(404).json({ error: 'Vacancy not found!' })
      }

      await vacancy.destroy()

      const company = await Company.findByPk(companyID, {
        attributes: {
          exclude: [
            'password'
          ]
        },
        include: [
          {
            association: 'company:vacancies'
          },
          {
            association: 'company:avaliations'
          }
        ]
      })

      return res.status(200).json({ company })
    } catch (err) {
      return res.status(500).json({ err: err.message, error: 'Internal server error, please try again!' })
    }
  }

  public async update (req: Request, res: Response) {
    const { companyID, vacancyID } = req.params
    const authenticatedCompanyID = res.locals.decoded.id

    if (Number(companyID) !== authenticatedCompanyID) {
      return res.status(403).json({ error: 'You do not have authorization to access this area!' })
    }

    const nullField = checkFieldsNotNull(req.body)
    if (nullField) {
      return res.status(400).json({ error: nullField })
    }

    try {
      if (!await Company.findByPk(companyID)) {
        return res.status(404).json({ error: 'Company not found!' })
      }

      const vacancy = await Vacancy.findByPk(vacancyID)

      if (!vacancy) {
        return res.status(404).json({ error: 'Vacancy not found!' })
      }

      for (const field in req.body) {
        vacancy[field] = req.body[field]
      }

      await vacancy.save()

      const company = await Company.findByPk(companyID, {
        attributes: {
          exclude: [
            'password'
          ]
        },
        include: [
          {
            association: 'company:vacancies'
          },
          {
            association: 'company:avaliations'
          }
        ]
      })

      return res.status(200).json({ company })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }
}

export default new VacanciesController()
