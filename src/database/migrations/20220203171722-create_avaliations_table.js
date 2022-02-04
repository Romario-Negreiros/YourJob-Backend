'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('avaliations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      companyID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        reference: { model: 'companies', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      recommendation: {
        type: Sequelize.STRING,
        allowNull: false
      },
      comment: {
        type: Sequelize.STRING,
        allowNull: false
      },
      grade: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('avaliations')
  }
}
