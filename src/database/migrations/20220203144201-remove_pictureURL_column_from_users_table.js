'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'pictureURL')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'pictureURL', Sequelize.STRING, {
      allowNull: true
    })
  }
}
