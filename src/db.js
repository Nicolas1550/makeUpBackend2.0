const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear un pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Limitar el número de conexiones
  queueLimit: 0, // Sin límite para la cola
});

// Función `query` para ejecutar consultas con una conexión temporal
async function query(sql, params) {
  const connection = await pool.getConnection(); // Obtener una conexión desde el pool
  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    connection.release(); // Liberar la conexión de vuelta al pool
  }
}

// Exportar tanto el `query` como el `pool` para casos donde necesites transacciones manuales
module.exports = { query, pool };
