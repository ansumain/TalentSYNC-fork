'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      { tableName: 'interviews', schema: 'management' },
      {
        interviewId: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()'),
          primaryKey: true,
        },
        applicationId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: { tableName: 'job_applications', schema: 'management' },
            key: 'applicationId'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        interviewerId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: { tableName: 'users', schema: 'auth' },
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        managerId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: { tableName: 'users', schema: 'auth' },
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        scheduledAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        scheduledBy: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: { tableName: 'users', schema: 'auth' },
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        status: {
          type: Sequelize.ENUM('scheduled', 'completed', 'failed', 'cancelled'),
          allowNull: false,
          defaultValue: 'scheduled'
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      }
    );

    // Create composite unique constraint to prevent duplicate interviews for same applicationId
    await queryInterface.addConstraint(
      { tableName: 'interviews', schema: 'management' },
      {
        fields: ['applicationId', 'interviewerId'],
        type: 'unique',
        name: 'interview_unique_constraint'
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable({
      tableName: 'interviews',
      schema: 'management',
    });
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_management_interviews_status";');
  }
};

