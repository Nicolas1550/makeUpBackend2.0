const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: process.env.DB_PORT || 3306,  // Utiliza el puerto proporcionado por Ngrok o el puerto predeterminado de MySQL
  logging: false,
});

async function dbConnect() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MySQL establecida');
  } catch (error) {
    console.error('Error al conectar a MySQL:', error.message);
    throw error;
  }
}

module.exports = { sequelize, dbConnect };
