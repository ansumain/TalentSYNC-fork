/* eslint-disable @typescript-eslint/no-require-imports */
const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    '^@talentsync/models$': '<rootDir>/../../packages/models/src/index.ts',
    '^@talentsync/config$': '<rootDir>/../../packages/config/src/index.ts',
    '^@talentsync/types$': '<rootDir>/../../packages/types/src/index.ts',
  },
  testPathIgnorePatterns: ['/node_modules/', '/src/docs/'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/controllers/*.ts',
    'src/services/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/server.ts',
    '!src/app.ts',
  ],
};