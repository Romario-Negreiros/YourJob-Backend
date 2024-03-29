import { Request, Response } from 'express'
import { User } from '../models'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import Mail from '../../lib/mailgun'
import { generateJwt, checkFieldsNotNull } from '../../modules'

const mail = new Mail()

class AuthController {
  public async authenticateWithJwt (req: Request, res: Response) {
    const id = res.locals.decoded.id

    try {
      const user = await User.findByPk(id, {
        include: [
          {
            association: 'savedVacancies',
            through: {
              attributes: []
            },
            include: [
              {
                association: 'company:vacancies'
              }
            ]
          }
        ]
      })

      res.status(200).json({ user })
    } catch (err) {
      res.status(500).json({ error: 'Internal server error!' })
    }
  }

  public async register (req: Request, res: Response) {
    const nullField = checkFieldsNotNull(req.body)
    if (nullField) {
      return res.status(400).json({ error: nullField })
    }

    try {
      if (await User.findOne({ where: { email: req.body.email } })) {
        return res.status(400).json({ error: 'This email is already in use!' })
      }
      const verifyEmailToken = crypto.randomBytes(20).toString('hex')

      const verifyTokenExpiration = new Date()
      verifyTokenExpiration.setHours(verifyTokenExpiration.getHours() + 1)

      req.body.email.toLowerCase()
      const user = await User.create({
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
        link: `https://yourjob.vercel.app/verify_email/${user.id}/${verifyEmailToken}/users`
      }
      await mail.send()
      if (mail.error) {
        await user.destroy()
        return res.status(500).json({ error: mail.error })
      }

      return res.status(201).json({ user, password: undefined })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  public async verifyEmail (req: Request, res: Response) {
    const { userID, token } = req.params

    try {
      const user = await User.findByPk(userID)

      if (!user) {
        return res.status(404).json({ error: 'This user does not exist!' })
      }

      if (!user.verifyEmailToken || !user.verifyTokenExpiration) {
        return res.status(400).json({ error: 'This email has already been verified!' })
      }

      if (user.verifyEmailToken !== token) {
        return res.status(400).json({ error: 'Invalid token!' })
      }

      const now = new Date()
      if (now > user.verifyTokenExpiration) {
        await user.destroy()
        return res
          .status(400)
          .json({ error: 'Verify email token has expirated, register again and verify in time!' })
      }

      user.verifyEmailToken = null
      user.verifyTokenExpiration = null

      await user.save({ hooks: false })

      return res.status(200).json({ success: 'Email succesfully verified!' })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }

  public async authenticate (req: Request, res: Response) {
    const { password, email } = req.body
    const nullField = checkFieldsNotNull(req.body)
    if (nullField) {
      return res.status(400).json({ error: nullField })
    }

    try {
      const user = await User.findOne({
        where: {
          email
        },
        include: [
          {
            association: 'savedVacancies',
            through: {
              attributes: []
            },
            include: [
              {
                association: 'company:vacancies'
              }
            ]
          }
        ]
      })
      if (!user) {
        return res
          .status(404)
          .json({ error: 'This user does not exist, check your email field and try again!' })
      }

      if (user.verifyEmailToken) {
        return res.status(400).json({ error: 'This user has not verified its email yet!' })
      }

      const matchPWD = await bcrypt.compare(password, user.password)
      if (!matchPWD) {
        return res.status(400).json({ error: 'Wrong password!' })
      }

      const token = generateJwt({ id: user.id }, 86400)

      return res.status(200).json({ user, token, password: undefined })
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'Internal server error, please try again!' })
    }
  }

  public async forgotPassword (req: Request, res: Response) {
    const { email } = req.body

    try {
      const user = await User.findOne({
        where: {
          email
        }
      })

      if (!user) {
        return res.status(404).json({ error: 'This user does not exist!' })
      }

      const token = crypto.randomBytes(20).toString('hex')

      const tokenExpiration = new Date()
      tokenExpiration.setHours(tokenExpiration.getHours() + 1)

      user.passwordResetToken = token
      user.resetTokenExpiration = tokenExpiration

      await user.save({ hooks: false })

      mail.to = email
      mail.subject = 'Reset your password'
      mail.templateName = 'reset-password'
      mail.templateVars = {
        name: user.name,
        email,
        link: `https://yourjob.vercel.app/reset_password/${user.passwordResetToken}/users/${user.email}`
      }
      mail.send()
      if (mail.error) {
        return res.status(500).json({ error: mail.error })
      }

      return res.status(200).json({
        success: 'Token to reset password was succesfully generated and the email was sent!'
      })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }

  public async resetPassword (req: Request, res: Response) {
    const { token } = req.params
    const { password, email } = req.body
    const nullField = checkFieldsNotNull(req.body)
    if (nullField) {
      return res.status(400).json({ error: nullField })
    }

    try {
      const user = await User.findOne({
        where: {
          email
        },
        include: [
          {
            association: 'savedVacancies',
            through: {
              attributes: []
            },
            include: [
              {
                association: 'company:vacancies'
              }
            ]
          }
        ]
      })

      if (!user) {
        return res
          .status(404)
          .json({ error: 'This user does not exist, check your email field and try again!' })
      }

      if (!user.passwordResetToken || !user.resetTokenExpiration) {
        return res.status(404).json({ error: 'Password reset token not found, please generate a new one!' })
      }

      if (token !== user.passwordResetToken) {
        return res.status(400).json({ error: 'Invalid token!' })
      }

      const now = new Date()
      if (now > user.resetTokenExpiration) {
        return res
          .status(400)
          .json({ error: 'Token expirated, generate a new token to try again!' })
      }

      user.password = password
      user.passwordResetToken = null
      user.resetTokenExpiration = null

      await user.save()

      return res.status(200).json({ success: 'Password succesfully changed!' })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }
}

export default new AuthController()
