'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('companies', 'alpha2Code')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('companies', 'alpha2Code', Sequelize.STRING, {
      allowNull: false
    })
  }
}
