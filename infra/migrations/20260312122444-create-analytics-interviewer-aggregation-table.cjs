'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      {
        tableName: 'analytics_interviewers',
        schema: 'aggregation'
      },
      {
        date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
          primaryKey: true
        },
        interviewerId: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true
        },
        interviewerName: {
          type: Sequelize.STRING(120),
          allowNull: false
        },
        totalInterviews: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        passedCount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        failedCount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        passRate: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0
        },
        lastRefreshedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }
    );
    await queryInterface.addConstraint(
      { tableName: 'analytics_interviewers', schema: 'aggregation' },
      {
        fields: ['date', 'interviewerId'],
        type: 'unique',
        name: 'date_interviewer_unique_constraint'
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable({
      tableName: 'analytics_interviewers',
      schema: 'aggregation'
    })
  }
};
