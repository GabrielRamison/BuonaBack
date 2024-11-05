// knexfile.js
require('dotenv').config();
const path = require('path');

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'vinicola_db',
      port: 3306,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, 'src', 'database', 'seeds')
    }
  }
};