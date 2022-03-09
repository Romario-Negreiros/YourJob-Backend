'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('users', 'pictureURL', 'profilePicture')
    await queryInterface.renameColumn('users', 'curriculumURL', 'curriculum')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('users', 'profilePicture', 'pictureURL')
    await queryInterface.renameColumn('users', 'curriculum', 'curriculumURL')
  }
}
