'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      {
        tableName: 'job_applications',
        schema: 'management'
      },
      {
        applicationId: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()'),
          primaryKey: true
        },
        userId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: { tableName: 'users', schema: 'auth' },
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        jobId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: { tableName: 'jobs', schema: 'management' },
            key: 'jobId'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        currentStatus: {
          type: Sequelize.ENUM('applied', 'shortlisted', 'interviewing', 'hired', 'rejected'),
          allowNull: false,
          defaultValue: 'applied'
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      }
    );

    // Create composite unique constraint to prevent duplicate job_applications
    await queryInterface.addConstraint(
      { tableName: 'job_applications', schema: 'management' },
      {
        fields: ['userId', 'jobId'],
        type: 'unique',
        name: 'jobApplication_unique_constraint'
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable({
      tableName: 'job_applications',
      schema: 'management'
    });
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_management_job_applications_currentStatus";');
  }
};
