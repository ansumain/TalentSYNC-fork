/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER || 'rms_user',
        password: process.env.DB_PASSWORD || 'rms_password',
        database: process.env.DB_NAME || 'rms_db',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT? Number(process.env.DB_PORT): 5432,
        dialect: 'postgres'
    },
};