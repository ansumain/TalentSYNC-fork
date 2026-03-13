'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      {
        tableName: 'job_application_lifecycle',
        schema: 'management'
      },
      {
        applicationId: {
          type: Sequelize.UUID,
          primaryKey: true,
          references: {
            model: { tableName: 'job_applications', schema: 'management' },
            key: 'applicationId'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        completedStatus: {
          type: Sequelize.JSONB,
          allowNull: true
        },
        lastChangedBy: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: { tableName: 'users', schema: 'auth' },
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
  },

  async down(queryInterface) {
    await queryInterface.dropTable({
      tableName: 'job_application_lifecycle',
      schema: 'management'
    });
  }
};
