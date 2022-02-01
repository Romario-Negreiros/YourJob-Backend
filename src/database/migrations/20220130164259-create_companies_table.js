'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('companies', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        minLenght: 5,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        minLenght: 5,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      companyLink: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pictureURL: {
        type: Sequelize.STRING,
        allowNull: true
      },
      verifyEmailToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      verifyTokenExpiration: {
        type: Sequelize.DATE,
        allowNull: true
      },
      passwordResetToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      resetTokenExpiration: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.dropTable('companies')
  }
}
