import { Sequelize } from 'sequelize'
// import dbConfig from '../config/db'
import dotEnv from 'dotenv'
dotEnv.config()

const db = new Sequelize(
  'postgres://bvviytrawfaqns:ab1f04008f1313aff283d82672bb958ded5faeeb56fcde014d1cd8ddbb786e63@ec2-18-215-8-186.compute-1.amazonaws.com:5432/ddgp3a4qehhtg8',
  {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
)

export default db
