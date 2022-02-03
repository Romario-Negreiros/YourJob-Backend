import { Model, DataTypes } from 'sequelize'
import db from '../../database'
import bcrypt from 'bcryptjs'

class User extends Model {
  public readonly id!: number
  public name!: string
  public email!: string
  public password!: string
  public passwordResetToken!: string | null
  public resetTokenExpiration!: Date | null
  public verifyEmailToken!: string | null
  public verifyTokenExpiration!: Date | null
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
}

User.init(
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    passwordResetToken: DataTypes.STRING,
    resetTokenExpiration: DataTypes.DATE,
    verifyEmailToken: DataTypes.STRING,
    verifyTokenExpiration: DataTypes.DATE
  },
  {
    tableName: 'users',
    sequelize: db,
    hooks: {
      beforeCreate: async user => {
        const hash = await bcrypt.hash(user.password, 15)
        user.password = hash
      },
      beforeUpdate: async user => {
        const hash = await bcrypt.hash(user.password, 15)
        user.password = hash
      }
    }
  }
)

export default User
