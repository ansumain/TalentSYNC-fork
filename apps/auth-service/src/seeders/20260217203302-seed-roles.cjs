'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const now = new Date();

    // Define all roles
    const roles = [
      { id: Sequelize.literal('gen_random_uuid()'), role: 'candidate', createdAt: now, updatedAt: now },
      { id: Sequelize.literal('gen_random_uuid()'), role: 'interviewer', createdAt: now, updatedAt: now },
      { id: Sequelize.literal('gen_random_uuid()'), role: 'manager', createdAt: now, updatedAt: now },
      { id: Sequelize.literal('gen_random_uuid()'), role: 'admin', createdAt: now, updatedAt: now },
    ];

    // Insert all defined roles in bulk to DB
    await queryInterface.bulkInsert(
      { tableName: 'roles', schema: 'auth' },
      roles
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      { tableName: 'roles', schema: 'auth' }
    );
  }
};
