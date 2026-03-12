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

    const [users] = await queryInterface.sequelize.query(
      `SELECT id FROM auth.users WHERE email IN ('candidate@gmail.com', 'interviewer@gmail.com');`
    );

    if (users.length === 0) {
      console.error("No matching users found. Please seed users first.");
      return;
    }

    const userIds = users.map(u => u.id);

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
