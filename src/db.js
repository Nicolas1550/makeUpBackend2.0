const mysql = require('mysql2/promise');
require('dotenv').config();

let connection;

async function dbConnect() {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    console.log('Conexión a MySQL establecida');
  } catch (error) {
    console.error('Error al conectar a MySQL:', error.message);
    throw error;
  }
}

async function query(sql, params) {
  const [results] = await connection.execute(sql, params);
  return results;
}

module.exports = { dbConnect, query };
