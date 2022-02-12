import jwt from 'jsonwebtoken'
import dotEnv from 'dotenv'
dotEnv.config()

const generateJwt = (payload: Object, expirationTime: number): string => {
  return jwt.sign(payload, process.env.AUTH_SECRET, {
    expiresIn: expirationTime
  })
}

export default generateJwt
