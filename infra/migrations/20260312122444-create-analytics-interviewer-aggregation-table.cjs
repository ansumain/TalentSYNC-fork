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
          allowNull: false
        },
        selected: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        rejected: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        }
      }
    );
    await queryInterface.addConstraint(
      { tableName: 'analytics_interviewers', schema: 'aggregation' },
      {
        fields: ['date', 'interviewerId'],
        type: 'unique',
        name: 'dateInterviewId_unique_constraint'
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
