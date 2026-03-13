'use strict';

const allowedMimeTypes = {
    IMAGE: ['image/jpeg', 'image/png', 'image/webp'],
    PDF: ['application/pdf'],
    DOCX: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document']
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      { tableName: 'resume_data', schema: 'resume' },
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('gen_random_uuid()'),
          primaryKey: true,
        },
        userId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: { tableName: 'users', schema: 'auth' },
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        fileName: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        mimeType: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        fileURL: {
          type: Sequelize.STRING(150),
          allowNull: false,
          unique: true,
        },
        status: {
          type: Sequelize.ENUM('queued', 'processing', 'completed', 'failed'),
          allowNull: false
        },
        rawText: {
          type: Sequelize.TEXT
        },
        parsedJSON: {
          type: Sequelize.JSONB
        },
        errorMessage: {
          type: Sequelize.TEXT
        },
        createdAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable({
      tableName: 'resume_data',
      schema: 'resume',
    });
  }
};

