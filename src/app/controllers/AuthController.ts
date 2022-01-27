import { Request, Response } from 'express'
import { User } from '../models'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import jwtConfig from '../../config/jwtConfig.json'

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

      return res.status(201).json({ user, token })
    } catch (err) {
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
        return res.status(404).json({ error: 'This user does not exist!' })
      }

      const matchPWD = await bcrypt.compare(password, user.password)
      if (!matchPWD) {
        return res.status(400).json({ error: 'Wrong password!' })
      }

      user.password = undefined

      const token = generateJwtToken({ user_id: user.id }, 86400)

      return res.status(200).json({ user, token })
    } catch (err) {
      return res.status(500).json({ error: 'Internal server error, please try again!' })
    }
  }
}

export default new AuthController()
