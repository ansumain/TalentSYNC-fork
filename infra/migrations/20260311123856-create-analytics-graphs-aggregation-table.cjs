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
        skillId: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        skillName: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        demandCount: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        supplyCount: {
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

    await queryInterface.addConstraint(
      { tableName: 'analytics_graphs', schema: 'aggregation' },
      {
        fields: ['date', 'skillId'],
        type: 'unique',
        name: 'date_skill_unique_constraint'
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
