'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('avaliations', 'companyID', {
      type: Sequelize.INTEGER,
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('avaliations', 'companyID', {
      type: Sequelize.INTEGER,
      allowNull: false,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
  }
}
