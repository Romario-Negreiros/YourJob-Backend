'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'verifyEmailToken', {
      type: Sequelize.STRING,
      allowNull: true
    })

    await queryInterface.addColumn('users', 'verifyTokenExpiration', {
      type: Sequelize.DATE,
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'verifyEmailToken')

    await queryInterface.removeColumn('users', 'verifyTokenExpiration')
  }
}
