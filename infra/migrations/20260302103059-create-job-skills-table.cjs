'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      {
        tableName: 'job_skills',
        schema: 'management'
      },
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()'),
          primaryKey: true
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
        skillId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: { tableName: 'skills', schema: 'management' },
            key: 'skillId'
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

    // Create composite unique constraint to prevent duplicate user-role pairs
    await queryInterface.addConstraint(
      { tableName: 'job_skills', schema: 'management' },
      {
        fields: ['jobId', 'skillId'],
        type: 'unique',
        name: 'jobSkills_unique_constraint'
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable({
      tableName: 'job_skills',
      schema: 'management'
    });
  }
};
