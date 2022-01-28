import { Options } from 'sequelize'

const dbConfig: Options = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'rOmArIo18o6fAb',
  database: 'YourJob',
  define: {
    timestamps: true
  }
}

export default dbConfig
