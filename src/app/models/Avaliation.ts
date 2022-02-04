import { Model, DataTypes } from 'sequelize'
import db from '../../database'

class Avaliation extends Model {
  public readonly id!: string
  public companyID!: string
  public recommendation!: string
  public comment!: string
  public grade!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

Avaliation.init(
  {
    recommendation: DataTypes.STRING,
    comment: DataTypes.STRING,
    grade: DataTypes.FLOAT
  },
  {
    tableName: 'avaliations',
    sequelize: db
  }
)

export default Avaliation
