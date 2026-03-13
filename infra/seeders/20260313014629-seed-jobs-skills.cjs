'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [jobs] = await queryInterface.sequelize.query(
      `SELECT "jobId", title FROM management.jobs
       WHERE title IN (
         'Frontend Engineer',
         'Backend Engineer',
         'Data Engineer',
         'Cloud Engineer',
         'Automation Engineer',
         'Platform Engineer'
       )`
    );

    const [skills] = await queryInterface.sequelize.query(
      `SELECT "skillId", "skillName" FROM management.skills
       WHERE "skillName" IN ('react', 'nodejs', 'python', 'javascript', 'typescript', 'aws', 'azure', 'docker', 'gcp', 'java')`
    );

    const jobMap = {};
    jobs.forEach((job) => {
      jobMap[job.title] = job.jobId;
    });

    const skillMap = {};
    skills.forEach((skill) => {
      skillMap[skill.skillName] = skill.skillId;
    });

    const pairs = [
      ['Frontend Engineer', ['react', 'javascript', 'typescript']],
      ['Backend Engineer', ['nodejs', 'javascript', 'typescript']],
      ['Data Engineer', ['python', 'docker', 'gcp']],
      ['Cloud Engineer', ['aws', 'azure', 'docker']],
      ['Automation Engineer', ['java', 'javascript', 'typescript']],
      ['Platform Engineer', ['nodejs', 'aws', 'docker']],
    ];

    const rows = [];
    const now = new Date('2026-03-13T10:00:00.000Z');

    pairs.forEach(([jobTitle, skillNames]) => {
      skillNames.forEach((skillName) => {
        rows.push({
          id: Sequelize.literal('gen_random_uuid()'),
          jobId: jobMap[jobTitle],
          skillId: skillMap[skillName],
          createdAt: now,
          updatedAt: now,
        });
      });
    });

    await queryInterface.bulkInsert(
      { tableName: 'job_skills', schema: 'management' },
      rows
    );
  },

  async down(queryInterface) {
    const [jobs] = await queryInterface.sequelize.query(
      `SELECT "jobId" FROM management.jobs
       WHERE title IN (
         'Frontend Engineer',
         'Backend Engineer',
         'Data Engineer',
         'Cloud Engineer',
         'Automation Engineer',
         'Platform Engineer'
       )`
    );

    await queryInterface.bulkDelete(
      { tableName: 'job_skills', schema: 'management' },
      { jobId: jobs.map((job) => job.jobId) }
    );
  },
};
