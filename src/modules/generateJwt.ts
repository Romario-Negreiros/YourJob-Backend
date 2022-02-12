import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const generateJwt = (payload: Object, expirationTime: number): string => {
  return jwt.sign(payload, process.env.AUTH_SECRET, {
    expiresIn: expirationTime
  })
}

export default generateJwt
