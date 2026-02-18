'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const now = new Date();

    // Define all permissions
    const permissions = [
      { id: Sequelize.literal('gen_random_uuid()'), permission: 'user:read:own', createdAt: now, updatedAt: now },
      { id: Sequelize.literal('gen_random_uuid()'), permission: 'user:read:all', createdAt: now, updatedAt: now },
      { id: Sequelize.literal('gen_random_uuid()'), permission: 'user:update:own', createdAt: now, updatedAt: now },
      { id: Sequelize.literal('gen_random_uuid()'), permission: 'user:update:all', createdAt: now, updatedAt: now },
      { id: Sequelize.literal('gen_random_uuid()'), permission: 'user:delete:all', createdAt: now, updatedAt: now },
      { id: Sequelize.literal('gen_random_uuid()'), permission: 'interviews:read:assigned', createdAt: now, updatedAt: now },
      { id: Sequelize.literal('gen_random_uuid()'), permission: 'interviews:read:all', createdAt: now, updatedAt: now },
      { id: Sequelize.literal('gen_random_uuid()'), permission: 'interviews:create', createdAt: now, updatedAt: now },
      { id: Sequelize.literal('gen_random_uuid()'), permission: 'interviews:update:assigned', createdAt: now, updatedAt: now },
      { id: Sequelize.literal('gen_random_uuid()'), permission: 'interviews:update:all', createdAt: now, updatedAt: now },
      { id: Sequelize.literal('gen_random_uuid()'), permission: 'interviews:delete:all', createdAt: now, updatedAt: now },
      { id: Sequelize.literal('gen_random_uuid()'), permission: 'analytics:view', createdAt: now, updatedAt: now },
    ];

    // Insert all defined permissions in bulk to DB
    await queryInterface.bulkInsert(
      { tableName: 'permissions', schema: 'auth' },
      permissions
    );
  },

  /* eslint-disable @typescript-eslint/no-unused-vars */
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      { tableName: 'permissions', schema: 'auth' }
    );
  }
};
