'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('vacancies', 'salary')
    await queryInterface.addColumn('vacancies', 'salary', Sequelize.INTEGER, {
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('vacancies', 'salary')
    await queryInterface.addColumn('vacancies', 'salary', Sequelize.STRING, {
      allowNull: true
    })
  }
}
