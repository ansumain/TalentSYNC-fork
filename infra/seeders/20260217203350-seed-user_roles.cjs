'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // Fetch seeded users - id and mail
    const [insertedUsers] = await queryInterface.sequelize.query(
      `SELECT id, email FROM auth.users WHERE email IN ('candidate@gmail.com', 'interviewer@gmail.com', 'manager@gmail.com', 'admin@gmail.com')`
    );

    // Fetch inserted roles and their respective IDs
    const [insertedRoles] = await queryInterface.sequelize.query(
      `SELECT id, role FROM auth.roles WHERE role IN ('candidate', 'interviewer', 'manager', 'admin')`
    );

    // User lookup map
    const userMap = {};
    insertedUsers.forEach(u => {
      userMap[u.email] = u.id;
    });

    // Roles lookup map
    const roleMap = {};
    insertedRoles.forEach(r => {
      roleMap[r.role] = r.id;
    });

    // Map user-role
    const userRoles = [
      {
        id: Sequelize.literal('gen_random_uuid()'),
        userId: userMap['candidate@gmail.com'],
        roleId: roleMap['candidate'],
        assignedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        userId: userMap['interviewer@gmail.com'],
        roleId: roleMap['interviewer'],
        assignedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        userId: userMap['manager@gmail.com'],
        roleId: roleMap['manager'],
        assignedAt: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        userId: userMap['admin@gmail.com'],
        roleId: roleMap['admin'],
        assignedAt: now,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert(
      { tableName: 'user_roles', schema: 'auth' },
      userRoles
    );
  },

  async down(queryInterface) {
    // Fetch seeded user IDs
    const [insertedUsers] = await queryInterface.sequelize.query(
      `SELECT id FROM auth.users WHERE email IN ('candidate@gmail.com', 'interviewer@gmail.com', 'manager@gmail.com', 'admin@gmail.com')`
    );

    const userIds = insertedUsers.map(u => u.id);

    await queryInterface.bulkDelete(
      { tableName: 'user_roles', schema: 'auth' },
      { userId: userIds }
    );
  }
};
