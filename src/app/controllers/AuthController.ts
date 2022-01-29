import { Request, Response } from 'express'
import { User } from '../models'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import jwtConfig from '../../config/jwt.json'
import crypto from 'crypto'
import path from 'path'
import fs from 'fs'

const generateJwtToken = (payload: Object, expirationTime: number): string => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: expirationTime
  })
}

/**
 * @param Fields is an array which:
 * fields[0] always = password
 * fields[1] always = email
 * fields[2] always = name
 **/
const checkFieldsNotNull = (fields: Array<string>): null | string => {
  const nullFieldIndex = fields.findIndex(field => !field)
  if (nullFieldIndex === -1) return null

  switch (nullFieldIndex) {
    case 0:
      return 'Password field is required!'
    case 1:
      return 'Email field is required!'
    case 2:
      return 'Name field is required!'
  }
}

class AuthController {
  public async register (req: Request, res: Response): Promise<any> {
    const { password, email, name } = req.body
    const nullField = checkFieldsNotNull([password, email, name])

    if (nullField) {
      return res.status(400).json({ error: nullField })
    }

    try {
      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password
      })

      user.password = undefined

      const token = generateJwtToken({ user_id: user.id }, 86400)

      const temp = path.resolve(__dirname, '..', '..', '..', 'tmp', 'uploads')
      fs.readdirSync(temp).forEach(file => {
        fs.rm(`${temp}/${file}`, err => {
          if (err) {
            throw err
          }
        })
      })
      return res.status(201).json({ user, token })
    } catch (err) {
      console.log(err)
      if (err.name.includes('UniqueConstraint')) {
        return res.status(400).json({ error: 'This email is already in use!' })
      }
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }

  public async authenticate (req: Request, res: Response): Promise<any> {
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

      const matchPWD = await bcrypt.compare(password, user.password)
      if (!matchPWD) {
        return res.status(400).json({ error: 'Wrong password!' })
      }

      user.password = undefined

      const token = generateJwtToken({ user_id: user.id }, 86400)

      return res.status(200).json({ user, token })
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'This user does not exist, check your email field and try again!' })
    }
  }

  public async forgotPassword (req: Request, res: Response): Promise<any> {
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
      await user.save()

      return res
        .status(200)
        .json({ success: 'Token to reset password was succesfully generated and sent!' })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }

  public async resetPassword (req: Request, res: Response): Promise<any> {
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
      await user.save()

      return res.status(200).json({ success: 'Password succesfully changed!' })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }
}

export default new AuthController()
