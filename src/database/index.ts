import { Sequelize } from 'sequelize'
import dbConfig from '../config/db'
import dotEnv from 'dotenv'
dotEnv.config()

const db = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  })
  : new Sequelize(dbConfig)

export default db
