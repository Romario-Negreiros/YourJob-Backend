import { Request, Response } from 'express'
import { Op, WhereOptions } from 'sequelize'
import { Company, Avaliation } from '../models'
import { checkFieldsNotNull } from '../../modules'

class CompaniesController {
  public async list (req: Request, res: Response) {
    const companiesQueries: WhereOptions = {}
    const { name } = req.query
    if (name) {
      companiesQueries.name = {
        [Op.iLike]: `${name}%`
      }
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
    const { companyID } = req.params
    const authenticatedCompanyID = res.locals.decoded.id

    if (Number(companyID) !== authenticatedCompanyID) {
      return res.status(403).json({ error: 'You do not have authorization to access this area!' })
    }

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

      await company.save({ hooks: false })

      return res.status(200).json({ company })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }

  public async delete (req: Request, res: Response) {
    const { companyID } = req.params
    const authenticatedCompanyID = res.locals.decoded.id

    if (Number(companyID) !== authenticatedCompanyID) {
      return res.status(403).json({ error: 'You do not have authorization to access this area!' })
    }

    try {
      const company = await Company.findByPk(companyID)

      if (!company) {
        return res.status(404).json({ error: 'Company not found!' })
      }

      await company.destroy()

      return res.status(200).json({ success: 'Company succesfully deleted!' })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
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
