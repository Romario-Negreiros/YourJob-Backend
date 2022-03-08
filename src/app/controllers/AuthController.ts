import { Request, Response } from 'express'
import { User } from '../models'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import Mail from '../../lib/email/nodemailer'
import { generateJwt, checkFieldsNotNull } from '../../modules'

const mail = new Mail()

class AuthController {
  public async register (req: Request, res: Response) {
    const { password, email, name, bio, workingArea, age } = req.body
    const nullField = checkFieldsNotNull({
      password,
      email,
      name,
      bio,
      workingArea,
      age
    })
    if (nullField) {
      return res.status(400).json({ error: nullField })
    }

    try {
      const verifyEmailToken = crypto.randomBytes(20).toString('hex')

      const verifyTokenExpiration = new Date()
      verifyTokenExpiration.setHours(verifyTokenExpiration.getHours() + 1)

      req.body.email.toLowerCase()
      const user = await User.create({
        ...req.body,
        verifyEmailToken,
        verifyTokenExpiration
      })

      mail.to = email
      mail.subject = 'Verify your email'
      mail.templateName = 'verify-email'
      mail.templateVars = {
        name: user.name,
        email,
        link: `https://yourjob-api.herokuapp.com/users/verify_email/${user.id}/${verifyEmailToken}`
      }
      mail.sendMail()
      if (mail.error) {
        return res.status(500).json({ error: mail.error })
      }
      user.password = undefined

      return res.status(201).json({ user })
    } catch (err) {
      if (err.name.includes('UniqueConstraint')) {
        return res.status(400).json({ error: 'This email is already in use!' })
      }
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }

  public async verifyEmail (req: Request, res: Response) {
    const { userID, token } = req.params

    try {
      const user = await User.findByPk(userID)

      if (!user) {
        return res.status(404).json({ error: 'This user does not exist!' })
      }

      if (!user.verifyEmailToken && !user.verifyTokenExpiration) {
        user.password = undefined
        const jwtoken = generateJwt({ id: user.id }, 86400)

        return res.status(200).json({ user, token: jwtoken, success: 'Email succesfully verified!' })
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

      user.password = undefined

      const jwtoken = generateJwt({ id: user.id }, 86400)

      return res.status(200).json({ user, token: jwtoken, success: 'Email succesfully verified!' })
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
        }
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

      user.password = undefined

      const token = generateJwt({ id: user.id }, 86400)

      return res.status(200).json({ user, token })
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'This user does not exist, check your email field and try again!' })
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

      mail.to = 'nromario482@gmail.com'
      mail.subject = 'Reset your password'
      mail.templateName = 'reset-password'
      mail.templateVars = {
        name: user.name,
        email,
        link: `https://yourjob-api.herokuapp.com/users/reset_password/${user.passwordResetToken}`
      }
      mail.sendMail()
      if (mail.error) {
        return res.status(500).json({ error: mail.error })
      }

      return res.status(200).json({
        success: 'Token to reset password was succesfully generated and the email was   xsent!'
      })
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
      const user = await User.findOne({
        where: {
          email
        }
      })

      if (!user) {
        return res
          .status(404)
          .json({ error: 'This user does not exist, check your email field and try again!' })
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
