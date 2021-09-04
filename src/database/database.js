// require
const config = require('../config/keys');
const sql = require('mssql');

const connection = new sql.ConnectionPool(config)
const pool = connection.connect()

module.exports = {pool, connection, sql}