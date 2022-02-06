'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'workingArea', Sequelize.STRING, {
      allowNull: false
    })
    await queryInterface.addColumn('users', 'age', Sequelize.INTEGER, {
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'workingArea')
    await queryInterface.removeColumn('users', 'age')
  }
}
