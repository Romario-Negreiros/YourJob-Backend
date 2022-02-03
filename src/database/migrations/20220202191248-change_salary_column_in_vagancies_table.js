'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('vagancies', 'salary')
    await queryInterface.addColumn('vagancies', 'salary', Sequelize.INTEGER, {
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('vagancies', 'salary')
    await queryInterface.addColumn('vagancies', 'salary', Sequelize.STRING, {
      allowNull: true
    })
  }
}