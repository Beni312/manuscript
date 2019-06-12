const dotenv = require('dotenv').config();

export const development = {
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  'host': 'localhost',
  'dialect': 'mysql'
};

export const test = {
  dialect: 'sqlite',
  storage: 'tests/sqlite.db',
  logging: false
};

export const production = {
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  dialect: 'mysql',
  logging: false
};
