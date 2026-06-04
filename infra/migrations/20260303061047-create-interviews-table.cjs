'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "management"."enum_interviews_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "management"."enum_interviews_result";');
    await queryInterface.sequelize.query('CREATE TYPE "management"."enum_interviews_status" AS ENUM(\'scheduled\', \'completed\', \'cancelled\', \'noshow\');');
    await queryInterface.sequelize.query('CREATE TYPE "management"."enum_interviews_result" AS ENUM(\'passed\', \'failed\');');

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
          type: Sequelize.ENUM('scheduled', 'completed', 'cancelled', 'noshow'),
          allowNull: false,
          defaultValue: 'scheduled'
        },
        result: {
          type: Sequelize.ENUM('passed', 'failed'),
          allowNull: true,
          defaultValue: null
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

    // Unique constraint: one interview per application
    await queryInterface.addConstraint(
      { tableName: 'interviews', schema: 'management' },
      {
        fields: ['applicationId'],
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
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "management"."enum_interviews_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "management"."enum_interviews_result";');
  }
};

