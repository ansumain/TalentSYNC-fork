'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const now = new Date();

    // Define all skills
    const skills = [
      { skillId: Sequelize.literal('gen_random_uuid()'), skillName: 'react', createdAt: now, updatedAt: now },
      { skillId: Sequelize.literal('gen_random_uuid()'), skillName: 'nodejs', createdAt: now, updatedAt: now },
      { skillId: Sequelize.literal('gen_random_uuid()'), skillName: 'python', createdAt: now, updatedAt: now },
      { skillId: Sequelize.literal('gen_random_uuid()'), skillName: 'javascript', createdAt: now, updatedAt: now },
      { skillId: Sequelize.literal('gen_random_uuid()'), skillName: 'typescript', createdAt: now, updatedAt: now },
      { skillId: Sequelize.literal('gen_random_uuid()'), skillName: 'java', createdAt: now, updatedAt: now },
      { skillId: Sequelize.literal('gen_random_uuid()'), skillName: 'c', createdAt: now, updatedAt: now },
      { skillId: Sequelize.literal('gen_random_uuid()'), skillName: 'c++', createdAt: now, updatedAt: now },
      { skillId: Sequelize.literal('gen_random_uuid()'), skillName: 'aws', createdAt: now, updatedAt: now },
      { skillId: Sequelize.literal('gen_random_uuid()'), skillName: 'azure', createdAt: now, updatedAt: now },
      { skillId: Sequelize.literal('gen_random_uuid()'), skillName: 'gcp', createdAt: now, updatedAt: now },
      { skillId: Sequelize.literal('gen_random_uuid()'), skillName: 'docker', createdAt: now, updatedAt: now },
      { skillId: Sequelize.literal('gen_random_uuid()'), skillName: 'go', createdAt: now, updatedAt: now },
      { skillId: Sequelize.literal('gen_random_uuid()'), skillName: 'ruby', createdAt: now, updatedAt: now },
    ];

    // Insert all defined skills in bulk to DB
    await queryInterface.bulkInsert(
      { tableName: 'skills', schema: 'management' },
      skills
    );
  },

  /* eslint-disable @typescript-eslint/no-unused-vars */
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      { tableName: 'skills', schema: 'management' }
    );
  }
};