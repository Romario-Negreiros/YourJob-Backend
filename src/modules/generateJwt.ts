import jwt from 'jsonwebtoken'
import jwtConfig from '../config/jwt.json'

const generateJwt = (payload: Object, expirationTime: number): string => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: expirationTime
  })
}

export default generateJwt
