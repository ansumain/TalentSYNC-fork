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
          allowNull: false
        },
        timeToHire: {
          type: Sequelize.STRING,
          allowNull: false
        },
        conversionRate: {
          type: Sequelize.STRING,
          allowNull: false
        },
        applied: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        shortListed: {
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

