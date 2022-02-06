'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'bio', Sequelize.STRING, {
      allowNull: false
    })
    await queryInterface.addColumn('users', 'pictureURL', Sequelize.STRING, {
      allowNull: true
    })
    await queryInterface.addColumn('users', 'curriculumURL', Sequelize.STRING, {
      allowNull: true
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'bio')
    await queryInterface.removeColumn('users', 'pictureURL')
    await queryInterface.removeColumn('users', 'curriculumURL')
  }
}
