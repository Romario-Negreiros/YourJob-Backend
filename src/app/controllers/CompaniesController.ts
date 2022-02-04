import { Request, Response } from 'express'
import { Op, WhereOptions } from 'sequelize'
import { Company, Avaliation } from '../models'
import { checkFieldsNotNull } from '../../modules'

class CompaniesController {
  public async list (req: Request, res: Response) {
    const companiesQueries: WhereOptions = {}
    const { name, region } = req.query
    if (name) {
      companiesQueries.name = {
        [Op.iLike]: `${name}%`
      }
    }
    if (region) {
      companiesQueries.region = region
    }

    try {
      const companies = await Company.findAll({
        attributes: {
          exclude: [
            'password',
            'passwordResetToken',
            'resetTokenExpiration',
            'verifyEmailToken',
            'verifyTokenExpiration'
          ]
        },
        where: companiesQueries,
        include: [
          {
            association: 'company:vagancies'
          },
          {
            association: 'company:avaliations'
          }
        ]
      })

      return res.status(200).json({ companies })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }

  public async fetchOne (req: Request, res: Response) {
    const { companyID } = req.params

    try {
      const company = await Company.findByPk(companyID, {
        attributes: {
          exclude: [
            'password'
          ]
        },
        include: [
          {
            association: 'company:vagancies'
          },
          {
            association: 'company:avaliations'
          }
        ]
      })

      if (!company) {
        return res.status(404).json({ error: 'Company not found!' })
      }

      return res.status(200).json({ company })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }

  public async update (req: Request, res: Response) {
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

      for (const field in req.body) {
        company[field] = req.body[field]
      }

      await company.save()
      return res.status(200).json({ company })
    } catch (err) {
      return res.status(500).json({ err: err.message, error: 'Internal server error, please try again!' })
    }
  }

  public async setAvaliation (req: Request, res: Response) {
    const { companyID } = req.params
    const nullField = checkFieldsNotNull(req.body)
    if (nullField) {
      return res.status(400).json({ error: nullField })
    }

    try {
      const avaliation = await Avaliation.create({
        companyID,
        ...req.body
      })

      return res.status(201).json({ avaliation })
    } catch (err) {
      if (err.parent.code === '23502') {
        return res.status(400).json({ error: `Missing ${err.parent.column} field!` })
      }
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }
}

export default new CompaniesController()
