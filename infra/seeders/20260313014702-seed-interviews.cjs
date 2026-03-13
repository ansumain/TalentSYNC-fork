'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [users] = await queryInterface.sequelize.query(
      `SELECT id, email FROM auth.users
       WHERE email IN ('interviewer@gmail.com', 'manager@gmail.com')`
    );

    const [applications] = await queryInterface.sequelize.query(
      `SELECT ja."applicationId", j.title
       FROM management.job_applications ja
       INNER JOIN management.jobs j ON j."jobId" = ja."jobId"
       WHERE j.title IN (
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

    const applicationMap = {};
    applications.forEach((application) => {
      applicationMap[application.title] = application.applicationId;
    });

    const rows = [
      {
        interviewId: Sequelize.literal('gen_random_uuid()'),
        applicationId: applicationMap['Frontend Engineer'],
        interviewerId: userMap['interviewer@gmail.com'],
        managerId: userMap['manager@gmail.com'],
        scheduledAt: new Date('2026-03-08T10:00:00.000Z'),
        scheduledBy: userMap['manager@gmail.com'],
        status: 'completed',
        result: 'passed',
        createdAt: new Date('2026-03-07T10:00:00.000Z'),
        updatedAt: new Date('2026-03-08T12:00:00.000Z'),
      },
      {
        interviewId: Sequelize.literal('gen_random_uuid()'),
        applicationId: applicationMap['Backend Engineer'],
        interviewerId: userMap['interviewer@gmail.com'],
        managerId: userMap['manager@gmail.com'],
        scheduledAt: new Date('2026-03-09T11:00:00.000Z'),
        scheduledBy: userMap['manager@gmail.com'],
        status: 'completed',
        result: 'passed',
        createdAt: new Date('2026-03-08T11:00:00.000Z'),
        updatedAt: new Date('2026-03-09T13:00:00.000Z'),
      },
      {
        interviewId: Sequelize.literal('gen_random_uuid()'),
        applicationId: applicationMap['Data Engineer'],
        interviewerId: userMap['interviewer@gmail.com'],
        managerId: userMap['manager@gmail.com'],
        scheduledAt: new Date('2026-03-10T11:30:00.000Z'),
        scheduledBy: userMap['manager@gmail.com'],
        status: 'completed',
        result: 'failed',
        createdAt: new Date('2026-03-09T11:30:00.000Z'),
        updatedAt: new Date('2026-03-10T14:00:00.000Z'),
      },
      {
        interviewId: Sequelize.literal('gen_random_uuid()'),
        applicationId: applicationMap['Cloud Engineer'],
        interviewerId: userMap['interviewer@gmail.com'],
        managerId: userMap['manager@gmail.com'],
        scheduledAt: new Date('2026-03-11T15:00:00.000Z'),
        scheduledBy: userMap['manager@gmail.com'],
        status: 'cancelled',
        result: null,
        createdAt: new Date('2026-03-10T15:00:00.000Z'),
        updatedAt: new Date('2026-03-11T13:00:00.000Z'),
      },
      {
        interviewId: Sequelize.literal('gen_random_uuid()'),
        applicationId: applicationMap['Automation Engineer'],
        interviewerId: userMap['interviewer@gmail.com'],
        managerId: userMap['manager@gmail.com'],
        scheduledAt: new Date('2026-03-12T16:00:00.000Z'),
        scheduledBy: userMap['manager@gmail.com'],
        status: 'noshow',
        result: null,
        createdAt: new Date('2026-03-11T16:00:00.000Z'),
        updatedAt: new Date('2026-03-12T17:00:00.000Z'),
      },
      {
        interviewId: Sequelize.literal('gen_random_uuid()'),
        applicationId: applicationMap['Platform Engineer'],
        interviewerId: userMap['interviewer@gmail.com'],
        managerId: userMap['manager@gmail.com'],
        scheduledAt: new Date('2026-03-14T10:30:00.000Z'),
        scheduledBy: userMap['manager@gmail.com'],
        status: 'scheduled',
        result: null,
        createdAt: new Date('2026-03-13T10:30:00.000Z'),
        updatedAt: new Date('2026-03-13T10:30:00.000Z'),
      },
    ];

    await queryInterface.bulkInsert(
      { tableName: 'interviews', schema: 'management' },
      rows
    );
  },

  async down(queryInterface) {
    const [applications] = await queryInterface.sequelize.query(
      `SELECT ja."applicationId"
       FROM management.job_applications ja
       INNER JOIN management.jobs j ON j."jobId" = ja."jobId"
       WHERE j.title IN (
         'Frontend Engineer',
         'Backend Engineer',
         'Data Engineer',
         'Cloud Engineer',
         'Automation Engineer',
         'Platform Engineer'
       )`
    );

    await queryInterface.bulkDelete(
      { tableName: 'interviews', schema: 'management' },
      { applicationId: applications.map((application) => application.applicationId) }
    );
  },
};
