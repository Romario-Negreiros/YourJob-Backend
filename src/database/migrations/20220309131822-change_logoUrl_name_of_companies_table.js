'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('companies', 'logoURL', 'companyLogo')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('companies', 'companyLogo', 'logoURL')
  }
}
