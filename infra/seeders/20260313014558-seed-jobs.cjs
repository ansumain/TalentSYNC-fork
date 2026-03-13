'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date('2026-03-13T10:00:00.000Z');

    const [users] = await queryInterface.sequelize.query(
      `SELECT id, email FROM auth.users WHERE email IN ('manager@gmail.com', 'admin@gmail.com')`
    );

    const userMap = {};
    users.forEach((user) => {
      userMap[user.email] = user.id;
    });

    const jobs = [
      {
        jobId: Sequelize.literal('gen_random_uuid()'),
        title: 'Frontend Engineer',
        description: 'Build recruiter-facing dashboards and candidate workflows.',
        location: 'Bengaluru',
        jobType: 'full-time',
        openings: 2,
        createdBy: userMap['manager@gmail.com'],
        createdAt: new Date('2026-03-01T09:00:00.000Z'),
        updatedAt: now,
      },
      {
        jobId: Sequelize.literal('gen_random_uuid()'),
        title: 'Backend Engineer',
        description: 'Own APIs, queue pipelines, and platform integrations.',
        location: 'Hyderabad',
        jobType: 'full-time',
        openings: 1,
        createdBy: userMap['manager@gmail.com'],
        createdAt: new Date('2026-03-02T09:00:00.000Z'),
        updatedAt: now,
      },
      {
        jobId: Sequelize.literal('gen_random_uuid()'),
        title: 'Data Engineer',
        description: 'Build analytics models and warehouse refresh jobs.',
        location: 'Pune',
        jobType: 'full-time',
        openings: 1,
        createdBy: userMap['admin@gmail.com'],
        createdAt: new Date('2026-03-03T09:00:00.000Z'),
        updatedAt: now,
      },
      {
        jobId: Sequelize.literal('gen_random_uuid()'),
        title: 'Cloud Engineer',
        description: 'Manage cloud infra, CI pipelines, and deployments.',
        location: 'Remote',
        jobType: 'contract',
        openings: 1,
        createdBy: userMap['admin@gmail.com'],
        createdAt: new Date('2026-03-04T09:00:00.000Z'),
        updatedAt: now,
      },
      {
        jobId: Sequelize.literal('gen_random_uuid()'),
        title: 'Automation Engineer',
        description: 'Own testing automation across application and web stacks.',
        location: 'Chennai',
        jobType: 'full-time',
        openings: 1,
        createdBy: userMap['manager@gmail.com'],
        createdAt: new Date('2026-03-05T09:00:00.000Z'),
        updatedAt: now,
      },
      {
        jobId: Sequelize.literal('gen_random_uuid()'),
        title: 'Platform Engineer',
        description: 'Improve reliability, observability, and deployment tooling.',
        location: 'Mumbai',
        jobType: 'full-time',
        openings: 1,
        createdBy: userMap['admin@gmail.com'],
        createdAt: new Date('2026-03-06T09:00:00.000Z'),
        updatedAt: now,
      },
    ];

    await queryInterface.bulkInsert(
      { tableName: 'jobs', schema: 'management' },
      jobs
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      { tableName: 'jobs', schema: 'management' },
      {
        title: [
          'Frontend Engineer',
          'Backend Engineer',
          'Data Engineer',
          'Cloud Engineer',
          'Automation Engineer',
          'Platform Engineer',
        ],
      }
    );
  },
};
