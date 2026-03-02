'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      {
        tableName: 'skills',
        schema: 'management'
      },
      {
        skillId: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()'),
          primaryKey: true
        },
        skillName: {
          type: Sequelize.STRING(50),
          allowNull: false,
          unique: true
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

    await queryInterface.addIndex(
      { tableName: 'skills', schema: 'management' },
      [Sequelize.fn('lower', Sequelize.col('skillName'))],
      {
        unique: true,
        name: 'skillName_caseInsensitive_unique'
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable({
      tableName: 'skills',
      schema: 'management'
    });
  }
};