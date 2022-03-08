import { Request, Response } from 'express'
import { Company } from '../models'
import { checkFieldsNotNull, generateJwt } from '../../modules'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import Mail from '../../lib/email/nodemailer'
import libphonenumber from 'google-libphonenumber'

const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance()
const mail = new Mail()

class CompaniesAuthController {
  public async register (req: Request, res: Response) {
    const nullField = checkFieldsNotNull(req.body)
    if (nullField) {
      return res.status(400).json({ error: nullField })
    }
    const isPhoneNumberValid = phoneUtil.isValidNumberForRegion(
      phoneUtil.parse(req.body.contactNumber, req.body.alpha2Code),
      req.body.alpha2Code
    )
    if (!isPhoneNumberValid) {
      return res.status(400).json({ error: 'Invalid phone number!' })
    }

    try {
      if (await Company.findOne({ where: { email: req.body.email } })) {
        return res.status(400).json({ error: 'This email is already in use!' })
      }
      const verifyEmailToken = crypto.randomBytes(20).toString('hex')

      const verifyTokenExpiration = new Date()
      verifyTokenExpiration.setHours(verifyTokenExpiration.getHours() + 1)

      const company = await Company.create({
        ...req.body,
        verifyEmailToken,
        verifyTokenExpiration
      })

      mail.to = req.body.email
      mail.subject = 'Verify your email'
      mail.templateName = 'verify-email'
      mail.templateVars = {
        name: req.body.name,
        email: req.body.email,
        link: `http://localhost:3000/${company.id}/${verifyEmailToken}/companies`
      }
      mail.sendMail()
      if (mail.error) {
        return res.status(500).json({ error: mail.error })
      }

      company.password = undefined

      return res.status(201).json({ company })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }

  public async verifyEmail (req: Request, res: Response) {
    const { companyID, token } = req.params

    try {
      const company = await Company.findByPk(companyID)

      if (!company) {
        return res.status(404).json({ error: 'This company does not exist!' })
      }

      if (!company.verifyEmailToken && !company.verifyTokenExpiration) {
        company.password = undefined
        return res.status(400).json({ company, error: 'This email is already verified!' })
      }

      if (company.verifyEmailToken !== token) {
        return res.status(400).json({ error: 'Invalid token!' })
      }

      const now = new Date()
      if (now > company.verifyTokenExpiration) {
        await company.destroy()
        return res.status(400).json({ error: 'Verify email token has expirated, register again and verify in time!' })
      }

      company.verifyEmailToken = null
      company.verifyTokenExpiration = null

      await company.save({ hooks: false })

      company.password = undefined

      const jwtoken = generateJwt({ id: company.id }, 86400)

      return res.status(200).json({ company, token: jwtoken, success: 'Email succesfully verified!' })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }

  public async authenticate (req: Request, res: Response) {
    const { email, password } = req.body
    const nullField = checkFieldsNotNull(req.body)
    if (nullField) {
      return res.status(400).json({ error: nullField })
    }

    try {
      const company = await Company.findOne({
        where: {
          email
        }
      })
      if (!company) {
        return res
          .status(404)
          .json({ error: 'This company does not exist, check your email field and try again!' })
      }

      if (company.verifyEmailToken) {
        return res.status(400).json({ error: 'This company has not verified its email yet!' })
      }

      const matchPWD = await bcrypt.compare(password, company.password)
      if (!matchPWD) {
        return res.status(400).json({ error: 'Wrong password!' })
      }

      company.password = undefined

      const token = generateJwt({ id: company.id }, 86400)

      return res.status(200).json({ company, token })
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'This company does not exist, check your email field and try again!' })
    }
  }

  public async forgotPassword (req: Request, res: Response) {
    const { email } = req.body

    try {
      const company = await Company.findOne({
        where: {
          email
        }
      })

      if (!company) {
        return res.status(404).json({ error: 'This company does not exist!' })
      }

      const token = crypto.randomBytes(20).toString('hex')

      const tokenExpiration = new Date()
      tokenExpiration.setHours(tokenExpiration.getHours() + 1)

      company.passwordResetToken = token
      company.resetTokenExpiration = tokenExpiration

      await company.save({ hooks: false })

      mail.to = 'nromario482@gmail.com'
      mail.subject = 'Reset your password'
      mail.templateName = 'reset-password'
      mail.templateVars = {
        name: company.name,
        email,
        link: `http://localhost:3000/reset_password/${company.passwordResetToken}/companies`
      }
      mail.sendMail()
      if (mail.error) {
        return res.status(500).json({ error: mail.error })
      }

      return res
        .status(200)
        .json({ success: 'Token to reset password was succesfully generated and the email was sent!' })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }

  public async resetPassword (req: Request, res: Response) {
    const { token } = req.params
    const { password, email } = req.body
    const nullField = checkFieldsNotNull([password, email])
    if (nullField) {
      return res.status(400).json({ error: nullField })
    }

    try {
      const company = await Company.findOne({
        where: {
          email
        }
      })

      if (!company) {
        return res
          .status(404)
          .json({ error: 'This company does not exist, check your email field and try again!' })
      }

      if (token !== company.passwordResetToken) {
        return res.status(400).json({ error: 'Invalid token!' })
      }

      const now = new Date()
      if (now > company.resetTokenExpiration) {
        return res
          .status(400)
          .json({ error: 'Token expirated, generate a new token to try again!' })
      }

      company.password = password
      company.passwordResetToken = null
      company.resetTokenExpiration = null

      await company.save()

      return res.status(200).json({ success: 'Password succesfully changed!' })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }
}

export default new CompaniesAuthController()
