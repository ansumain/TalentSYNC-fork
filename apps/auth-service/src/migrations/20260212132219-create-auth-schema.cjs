'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`CREATE SCHEMA IF NOT EXISTS auth`);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`DROP SCHEMA IF EXISTS auth CASCADE`);
  }
};
