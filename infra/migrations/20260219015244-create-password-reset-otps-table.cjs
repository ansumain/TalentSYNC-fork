'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      {
        tableName: 'password_reset_otps',
        schema: 'auth'
      },
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()'),
          primaryKey: true
        },
        email: {
          type: Sequelize.STRING(150),
          allowNull: false
        },
        hashedOtp: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        expiresAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }
    );
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable({
      tableName: 'password_reset_otps',
      schema: 'auth'
    });
  }
};
