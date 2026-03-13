'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT id, email FROM auth.users
       WHERE email IN ('candidate@gmail.com', 'manager@gmail.com', 'admin@gmail.com')`
    );

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

    const userMap = {};
    users.forEach((user) => {
      userMap[user.email] = user.id;
    });

    const jobMap = {};
    jobs.forEach((job) => {
      jobMap[job.title] = job.jobId;
    });

    const rows = [
      {
        applicationId: Sequelize.literal('gen_random_uuid()'),
        userId: userMap['candidate@gmail.com'],
        jobId: jobMap['Frontend Engineer'],
        currentStatus: 'hired',
        createdAt: new Date('2026-03-02T10:00:00.000Z'),
        updatedAt: new Date('2026-03-10T12:00:00.000Z'),
      },
      {
        applicationId: Sequelize.literal('gen_random_uuid()'),
        userId: userMap['candidate@gmail.com'],
        jobId: jobMap['Backend Engineer'],
        currentStatus: 'selected',
        createdAt: new Date('2026-03-03T10:00:00.000Z'),
        updatedAt: new Date('2026-03-11T12:00:00.000Z'),
      },
      {
        applicationId: Sequelize.literal('gen_random_uuid()'),
        userId: userMap['candidate@gmail.com'],
        jobId: jobMap['Data Engineer'],
        currentStatus: 'rejected',
        createdAt: new Date('2026-03-04T10:00:00.000Z'),
        updatedAt: new Date('2026-03-12T12:00:00.000Z'),
      },
      {
        applicationId: Sequelize.literal('gen_random_uuid()'),
        userId: userMap['candidate@gmail.com'],
        jobId: jobMap['Cloud Engineer'],
        currentStatus: 'interviewing',
        createdAt: new Date('2026-03-05T10:00:00.000Z'),
        updatedAt: new Date('2026-03-12T15:00:00.000Z'),
      },
      {
        applicationId: Sequelize.literal('gen_random_uuid()'),
        userId: userMap['candidate@gmail.com'],
        jobId: jobMap['Automation Engineer'],
        currentStatus: 'interviewing',
        createdAt: new Date('2026-03-06T10:00:00.000Z'),
        updatedAt: new Date('2026-03-13T09:00:00.000Z'),
      },
      {
        applicationId: Sequelize.literal('gen_random_uuid()'),
        userId: userMap['candidate@gmail.com'],
        jobId: jobMap['Platform Engineer'],
        currentStatus: 'shortlisted',
        createdAt: new Date('2026-03-07T10:00:00.000Z'),
        updatedAt: new Date('2026-03-13T10:00:00.000Z'),
      },
    ];

    await queryInterface.bulkInsert(
      { tableName: 'job_applications', schema: 'management' },
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
      { tableName: 'job_applications', schema: 'management' },
      { jobId: jobs.map((job) => job.jobId) }
    );
  },
};
