import { Model, DataTypes, BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin } from 'sequelize'
import { Vacancy } from '.'
import db from '../../database'
import bcrypt from 'bcryptjs'

class User extends Model {
  public readonly id!: number
  public name!: string
  public email!: string
  public password!: string
  public bio!: string
  public profilePicture!: string | null
  public curriculum!: string | null
  public workingArea!: string
  public age!: number
  public passwordResetToken!: string | null
  public resetTokenExpiration!: Date | null
  public verifyEmailToken!: string | null
  public verifyTokenExpiration!: Date | null
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public addSavedVacancies: BelongsToManyAddAssociationMixin<Vacancy, number>
  public removeSavedVacancies: BelongsToManyRemoveAssociationMixin<Vacancy, number>
}

User.init(
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.STRING,
    profilePicture: DataTypes.STRING,
    curriculum: DataTypes.STRING,
    workingArea: DataTypes.STRING,
    age: DataTypes.INTEGER,
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
