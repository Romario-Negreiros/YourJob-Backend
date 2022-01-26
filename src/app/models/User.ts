import { Model, DataTypes } from 'sequelize'
import db from '../../database'

class User extends Model {
  public id!: string
  public name!: string
  public email!: string
  public password!: string
  public passwordResetToken!: string | null
  public resetTokenExpiration!: Date | null
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

User.init(
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    passwordResetToken: DataTypes.STRING,
    resetTokenExpiration: DataTypes.DATE
  },
  {
    tableName: 'users',
    sequelize: db
  }
)

export default User
