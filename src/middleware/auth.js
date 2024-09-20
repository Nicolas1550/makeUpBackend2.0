const jwt = require('jsonwebtoken');
const { query } = require('../db'); // Usamos la conexión directa a la base de datos

const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header not provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodificar el token para obtener el ID del usuario
    const [user] = await query('SELECT id, nombre, email FROM users WHERE id = ?', [decoded.sub]); // Consulta directa SQL para obtener el usuario
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // Asignar el usuario encontrado al objeto req
    next(); // Pasar al siguiente middleware o controlador
  } catch (error) {
    console.error('Token is not valid:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authenticate;
