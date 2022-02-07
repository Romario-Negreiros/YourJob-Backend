import { Options } from 'sequelize'

const dbConfig: Options = {
  dialect: 'postgres',
  host: process.env.DBHOST || 'localhost',
  username: 'postgres',
  password: 'rOmArIo18o6fAb',
  database: 'YourJob',
  define: {
    timestamps: true
  }
}

export default dbConfig
