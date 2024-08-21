// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Asegúrate de usar la clave secreta correcta
    const user = await User.findByPk(decoded.id); // Usar findByPk en lugar de findAll
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user; // Adjuntar usuario autenticado a la solicitud
    next();
  } catch (error) {
    console.error('Token is not valid:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authenticate;
