'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`CREATE SCHEMA IF NOT EXISTS resume`);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP SCHEMA IF EXISTS resume CASCADE`);
  }
};