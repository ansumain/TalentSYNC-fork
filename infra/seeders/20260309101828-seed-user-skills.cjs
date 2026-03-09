'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [skills] = await queryInterface.sequelize.query(
      `SELECT "skillId" FROM "management"."skills" LIMIT 5;`
    );

    if (skills.length === 0) {
      console.error("No skills found in management.skills. Please seed skills first.");
      return;
    }

    const userIds = [
      '49c7305a-daeb-4f16-84ee-35928c25619a',
      '15e6e8b3-82ae-4fe3-8fb0-640d63752868'
    ];

    const userSkillsData = [];
    const now = new Date();

    userIds.forEach(userId => {
      skills.forEach(skill => {
        userSkillsData.push({
          userId: userId,
          skillId: skill.skillId,
          createdAt: now,
          updatedAt: now
        });
      });
    });

    await queryInterface.bulkInsert(
      { tableName: 'user_skills', schema: 'resume' },
      userSkillsData
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      { tableName: 'user_skills', schema: 'resume' },
    );
  }
};
