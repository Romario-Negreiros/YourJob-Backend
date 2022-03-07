'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('companies', 'region')
    await queryInterface.renameColumn('companies', 'phoneNumber', 'contactNumber')
    await queryInterface.renameColumn('companies', 'companyLink', 'website')
    await queryInterface.renameColumn('companies', 'pictureURL', 'logoURL')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('companies', 'region', Sequelize.STRING, {
      allowNull: false
    })
    await queryInterface.renameColumn('companies', 'contactNumber', 'phoneNumber')
    await queryInterface.renameColumn('companies', 'webiste', 'companyLink')
    await queryInterface.renameColumn('companies', 'logoURL', 'pictureURL')
  }
}
