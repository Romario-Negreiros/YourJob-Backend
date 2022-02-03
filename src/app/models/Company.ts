import { Model, DataTypes } from 'sequelize'
import db from '../../database'
import bcrypt from 'bcryptjs'

class Company extends Model {
  public readonly id!: number
  public name!: string
  public email!: string
  public password!: string
  public description!: string
  public phoneNumber!: string
  public alpha2Code!: string
  public region!: string
  public companyLink!: string
  public pictureURL!: string | null
  public verifyEmailToken!: string | null
  public verifyTokenExpiration!: Date | null
  public passwordResetToken!: string | null
  public resetTokenExpiration!: Date | null
  public readonly createdAt: Date
  public readonly updatedAt: Date
}

Company.init({
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  description: DataTypes.STRING,
  phoneNumber: DataTypes.STRING,
  alpha2Code: DataTypes.STRING,
  region: DataTypes.STRING,
  companyLink: DataTypes.STRING,
  pictureURL: DataTypes.STRING,
  verifyEmailToken: DataTypes.STRING,
  verifyTokenExpiration: DataTypes.DATE,
  passwordResetToken: DataTypes.STRING,
  resetTokenExpiration: DataTypes.DATE
}, {
  tableName: 'companies',
  sequelize: db,
  hooks: {
    beforeCreate: async company => {
      const hash = await bcrypt.hash(company.password, 15)
      company.password = hash
    },
    beforeUpdate: async company => {
      const hash = await bcrypt.hash(company.password, 15)
      company.password = hash
    }
  }
})

export default Company
