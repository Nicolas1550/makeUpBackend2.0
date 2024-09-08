const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');
const Role = require('../models/Role'); 

// Verificación del estado de autenticación del usuario con JWT
router.get('/verify', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'No se pudo autenticar al usuario.' });
    }

    const user = await User.findByPk(req.user.id, { 
      include: [{ model: Role, as: 'rolesAssociation' }]  
    });

    // Log para verificar el usuario y sus roles

    if (user) {
      return res.json({
        isAuthenticated: true,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          roles: user.rolesAssociation?.map(role => role.nombre), 
        },
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
    res.redirect('https://peluqueria-the-best.vercel.app/'); 
  } catch (error) {
    res.status(500).json({ message: 'Error al cerrar sesión', error: error.message });
  }
});

module.exports = router;
