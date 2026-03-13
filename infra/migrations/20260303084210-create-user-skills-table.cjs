'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      {
        tableName: 'user_skills',
        schema: 'resume'
      },
      {
        userId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: { tableName: 'users', schema: 'auth' },
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        skillId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: { tableName: 'skills', schema: 'management' },
            key: 'skillId'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
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

    // Create composite unique constraint to prevent duplicate user-skill pairs
    await queryInterface.addConstraint(
      { tableName: 'user_skills', schema: 'resume' },
      {
        fields: ['userId', 'skillId'],
        type: 'unique',
        name: 'userSkills_unique_constraint'
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable({
      tableName: 'user_skills',
      schema: 'resume'
    });
  }
};
