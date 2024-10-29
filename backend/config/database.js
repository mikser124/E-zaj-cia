const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'projekt_db',
  password: '',  
});

module.exports = pool;
