import { Model, DataTypes } from 'sequelize'
import db from '../../database'

class Vagancy extends Model {
  public readonly id!: number
  public readonly companyID!: number
  public description!: string
  public salary!: string
  public category!: string
  public position!: string
  public readonly createdAt: Date
  public readonly updatedAt: Date
}

Vagancy.init({
  description: DataTypes.STRING,
  salary: DataTypes.STRING,
  category: DataTypes.STRING,
  position: DataTypes.STRING
}, {
  tableName: 'vagancies',
  sequelize: db
})

export default Vagancy
