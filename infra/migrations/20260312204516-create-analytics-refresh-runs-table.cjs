'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      {
        tableName: 'analytics_refresh_runs',
        schema: 'aggregation'
      },
      {
        refreshId: {
          type: Sequelize.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },
        startedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        completedAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM('running', 'success', 'failed'),
          allowNull: false,
          defaultValue: 'running'
        },
        triggeredBy: {
          type: Sequelize.ENUM('cron', 'manual'),
          allowNull: false,
          defaultValue: 'cron'
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true
        }
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable({
      tableName: 'analytics_refresh_runs',
      schema: 'aggregation'
    });

    await queryInterface.sequelize.query("DROP TYPE IF EXISTS \"aggregation\".\"enum_analytics_refresh_runs_status\"");
    await queryInterface.sequelize.query("DROP TYPE IF EXISTS \"aggregation\".\"enum_analytics_refresh_runs_triggeredBy\"");
  }
};
