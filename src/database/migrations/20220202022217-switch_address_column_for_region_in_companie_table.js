'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('companies', 'region', Sequelize.STRING, {
      allowNull: false
    })
    await queryInterface.removeColumn('companies', 'address')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('companies', 'region')
    await queryInterface.addColumn('companies', 'address', Sequelize.STRING, {
      allowNull: false
    })
  }
}
