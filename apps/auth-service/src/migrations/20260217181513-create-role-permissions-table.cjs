'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      {
        tableName: 'role_permissions',
        schema: 'auth'
      },
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()'),
          primaryKey: true
        },
        roleId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: { tableName: 'roles', schema: 'auth' },
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        permissionId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: { tableName: 'permissions', schema: 'auth' },
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
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

    // Create composite unique constraint to prevent duplicate role-permission pairs
    await queryInterface.addConstraint(
      { tableName: 'role_permissions', schema: 'auth' },
      {
        fields: ['roleId', 'permissionId'],
        type: 'unique',
        name: 'role_permissions_unique_constraint'
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable({
      tableName: 'role_permissions',
      schema: 'auth'
    });
  }
};
