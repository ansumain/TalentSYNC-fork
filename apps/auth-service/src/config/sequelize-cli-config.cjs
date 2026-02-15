/* eslint-disable @typescript-eslint/no-require-imports */
// require('dotenv').config();
import { config } from "./env"

module.exports = {
    development: {
        username: config.dbUser || 'rms_user',
        password: config.dbPassword || 'rms_password',
        database: config.dbName || 'rms_db',
        host: config.dbHost || 'localhost',
        port: config.dbPort? Number(config.dbPort): 5432,
        dialect: 'postgres'
    },
};