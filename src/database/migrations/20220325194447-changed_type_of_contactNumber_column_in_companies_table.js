'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('companies', 'contactNumber')
    await queryInterface.addColumn('companies', 'contactNumber', Sequelize.INTEGER)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('companies', 'contactNumber')
    await queryInterface.addColumn('companies', 'contactNumber', Sequelize.STRING)
  }
}
