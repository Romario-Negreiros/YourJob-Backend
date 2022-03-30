import User from './User'
import Company from './Company'
import Vacancy from './Vacancy'
import Avaliation from './Avaliation'
import db from '../../database'

Company.hasMany(db.models.Vacancy, { foreignKey: 'companyID', as: 'company:vacancies' })
Vacancy.belongsTo(db.models.Company, { foreignKey: 'companyID', as: 'company:vacancies' })

Company.hasMany(db.models.Avaliation, { foreignKey: 'companyID', as: 'company:avaliations' })
Avaliation.belongsTo(db.models.Company, { foreignKey: 'companyID', as: 'company:avaliations' })

User.belongsToMany(db.models.Vacancy, {
  foreignKey: 'userID',
  through: 'user-vacancies',
  as: 'savedVacancies'
})
Vacancy.belongsToMany(db.models.User, {
  foreignKey: 'vacancyID',
  through: 'user-vacancies',
  as: 'savedVacancies'
})

export { default as User } from './User'
export { default as Company } from './Company'
export { default as Vacancy } from './Vacancy'
export { default as Avaliation } from './Avaliation'
