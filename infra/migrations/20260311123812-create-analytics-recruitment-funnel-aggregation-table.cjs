'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      { tableName: 'analytics_recruitment_funnel', schema: 'aggregation' },
      {
        date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
          primaryKey: true
        },
        jobId: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true
        },
        jobTitle: {
          type: Sequelize.STRING(120),
          allowNull: false
        },
        timeToHireDays: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        conversionRate: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        applied: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        shortlisted: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        selected: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        hired: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        lastRefreshedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable({
      tableName: 'analytics_recruitment_funnel',
      schema: 'aggregation',
    });
  }
};

