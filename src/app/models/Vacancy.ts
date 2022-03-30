import { Model, DataTypes } from 'sequelize'
import db from '../../database'

class Vacancy extends Model {
  public readonly id!: number
  public readonly companyID!: number
  public description!: string
  public salary!: number
  public category!: string
  public position!: string
  public readonly createdAt: Date
  public readonly updatedAt: Date
}

Vacancy.init({
  description: DataTypes.STRING,
  salary: DataTypes.INTEGER,
  category: DataTypes.STRING,
  position: DataTypes.STRING
}, {
  tableName: 'vacancies',
  sequelize: db
})

export default Vacancy
