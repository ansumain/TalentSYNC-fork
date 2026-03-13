'use strict';

/* eslint-disable @typescript-eslint/no-require-imports */
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    
    // Hash password for all seeded users (password: "password123")
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = [
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'candidate',
        email: 'candidate@gmail.com',
        phone: '1111111111',
        hashedPassword,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'interviewer',
        email: 'interviewer@gmail.com',
        phone: '2222222222',
        hashedPassword,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'manager',
        email: 'manager@gmail.com',
        phone: '3333333333',
        hashedPassword,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: Sequelize.literal('gen_random_uuid()'),
        name: 'admin',
        email: 'admin@gmail.com',
        phone: '4444444444',
        hashedPassword,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert(
      { tableName: 'users', schema: 'auth' },
      users
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      { tableName: 'users', schema: 'auth' },
      {
        email: [
          'candidate@gmail.com',
          'interviewer@gmail.com',
          'manager@gmail.com',
          'admin@gmail.com',
        ],
      }
    );
  }
};
