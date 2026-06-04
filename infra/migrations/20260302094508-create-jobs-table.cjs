'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      { tableName: 'jobs', schema: 'management' },
      {
        jobId: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()'),
          primaryKey: true,
        },
        title: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        location: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        jobType: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        openings: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        createdBy: {
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
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable({
      tableName: 'jobs',
      schema: 'management',
    });
  }
};

