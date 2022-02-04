import User from './User'
import Company from './Company'
import Vagancy from './Vagancy'
import Avaliation from './Avaliation'
import db from '../../database'

Company.hasMany(db.models.Vagancy, { foreignKey: 'companyID', as: 'company:vagancies' })
Vagancy.belongsTo(db.models.Company, { foreignKey: 'companyID', as: 'company:vagancies' })

Company.hasMany(db.models.Avaliation, { foreignKey: 'companyID', as: 'company:avaliations' })
Avaliation.belongsTo(db.models.Company, { foreignKey: 'companyID', as: 'company:avaliations' })

User.belongsToMany(db.models.Vagancy, {
  foreignKey: 'userID',
  through: 'user-vagancies',
  as: 'savedVagancies'
})
Vagancy.belongsToMany(db.models.User, {
  foreignKey: 'vagancyID',
  through: 'user-vagancies',
  as: 'savedVagancies'
})

export { default as User } from './User'
export { default as Company } from './Company'
export { default as Vagancy } from './Vagancy'
export { default as Avaliation } from './Avaliation'
