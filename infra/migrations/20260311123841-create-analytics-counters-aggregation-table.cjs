'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      {
        tableName: 'analytics_counters',
        schema: 'aggregation'
      },
      {
        date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
          primaryKey: true
        },
        scheduled: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        completed: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        cancelled: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        noShow: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        openJobs: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        hires: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        lastRefreshedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable({
      tableName: 'analytics_counters',
      schema: 'aggregation'
    })
  }
};
