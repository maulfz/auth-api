/* istanbul ignore file */
const { Pool } = require('pg');
const config = require('../../../Commons/config');
// console.log(config, 'confignye', process.env.NODE_ENV )
const pool = new Pool(config.testConfig);

module.exports = pool;
