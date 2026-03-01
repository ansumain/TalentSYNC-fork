'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      {
        tableName: 'permissions',
        schema: 'auth'
      },
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()'),
          primaryKey: true
        },
        permission: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable({
      tableName: 'permissions',
      schema: 'auth'
    });
  }
};

