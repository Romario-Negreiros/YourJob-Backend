import Company from './Company'
import Vagancy from './Vagancy'
import db from '../../database'

Company.hasMany(db.models.Vagancy, { foreignKey: 'companyID', as: 'company:vagancies' })
Vagancy.belongsTo(db.models.Company, { foreignKey: 'companyID', as: 'company:vagancies' })

export { default as User } from './User'
export { default as Company } from './Company'
export { default as Vagancy } from './Vagancy'
