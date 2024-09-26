const express = require('express');
const passport = require('passport');
const router = express.Router();
const { query } = require('../db'); // Conexión directa a la base de datos

// Verificación del estado de autenticación del usuario con JWT
router.get('/verify', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'No se pudo autenticar al usuario.' });
    }

    // Consulta SQL para obtener el usuario y sus roles
    const userQuery = `
      SELECT u.*, GROUP_CONCAT(r.nombre) AS roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.UserId
      LEFT JOIN roles r ON ur.RoleId = r.id
      WHERE u.id = ?
      GROUP BY u.id
    `;

    const [user] = await query(userQuery, [req.user.id]);

    if (user) {
      return res.json({
        isAuthenticated: true,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          roles: user.roles ? user.roles.split(',') : [] // Convertir los roles en un array
        }
      });
    } else {
      return res.status(404).json({ isAuthenticated: false, message: 'Usuario no encontrado.' });
    }
  } catch (error) {
    console.error('Error al verificar usuario:', error);
    res.status(500).json({ message: 'Error al verificar usuario', error: error.message });
  }
});

// Manejar cierre de sesión en el cliente
router.post('/logout', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    // Redirigir al cliente después de cerrar sesión
    res.redirect('https://make-up2-0.vercel.app/');
  } catch (error) {
    res.status(500).json({ message: 'Error al cerrar sesión', error: error.message });
  }
});

module.exports = router;
