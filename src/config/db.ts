import { Options } from 'sequelize'
import dotenv from 'dotenv'
dotenv.config()

const dbConfig: Options = {
  dialect: 'postgres',
  port: Number(process.env.DBPORT) || 8080,
  host: process.env.DBHOST || 'localhost',
  username: process.env.DBUSER || 'postgres',
  password: process.env.DBPWD || 'rOmArIo18o6fAb',
  database: process.env.DBNAME || 'YourJob',
  define: {
    timestamps: true
  }
}

export default dbConfig
