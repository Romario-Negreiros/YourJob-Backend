import { Sequelize } from 'sequelize'
import dbConfig from '../config/dbConfig'

const db = new Sequelize(dbConfig)

export default db
