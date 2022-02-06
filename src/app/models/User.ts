import { Model, DataTypes, BelongsToManyAddAssociationMixin, BelongsToManyRemoveAssociationMixin } from 'sequelize'
import { Vagancy } from '.'
import db from '../../database'
import bcrypt from 'bcryptjs'

class User extends Model {
  public readonly id!: number
  public name!: string
  public email!: string
  public password!: string
  public bio!: string
  public pictureURL!: string | null
  public curriculumURL!: string | null
  public workingArea!: string
  public age!: number
  public passwordResetToken!: string | null
  public resetTokenExpiration!: Date | null
  public verifyEmailToken!: string | null
  public verifyTokenExpiration!: Date | null
  public readonly createdAt!: Date
  public readonly updatedAt!: Date

  public addSavedVagancies: BelongsToManyAddAssociationMixin<Vagancy, number>
  public removeSavedVagancies: BelongsToManyRemoveAssociationMixin<Vagancy, number>
}

User.init(
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.STRING,
    pictureURL: DataTypes.STRING,
    curriculumURL: DataTypes.STRING,
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
