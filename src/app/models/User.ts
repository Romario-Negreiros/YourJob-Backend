import { Model, DataTypes } from 'sequelize'
import db from '../../database'

class User extends Model {
  public name: string
  public email: string
  public password: string
}

User.init(
  {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  },
  {
    tableName: 'users',
    sequelize: db
  }
)

export default User
