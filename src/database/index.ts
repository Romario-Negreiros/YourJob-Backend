import { Sequelize } from 'sequelize'
import dbConfig from '../config/db'
import dotEnv from 'dotenv'
dotEnv.config()

const db = new Sequelize(
  process.env.DATABASE_URL
    ? (process.env.DATABASE_URL,
      {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      })
    : dbConfig
)

export default db
