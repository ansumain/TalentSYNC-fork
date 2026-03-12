'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      {
        tableName: 'analytics_graphs',
        schema: 'aggregation'
      },
      {
        date: {
          type: Sequelize.DATEONLY,
          allowNull: false
        },
        skill: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        count: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
      }
    );

    await queryInterface.addConstraint(
      { tableName: 'analytics_graphs', schema: 'aggregation' },
      {
        fields: ['date', 'skill'],
        type: 'unique',
        name: 'dateSkills_unique_constraint'
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable({
      tableName: 'analytics_graphs',
      schema: 'aggregation'
    })
  }
};
