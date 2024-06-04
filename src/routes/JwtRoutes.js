const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

// Verificación del estado de autenticación del usuario con JWT
router.get('/verify', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user) {
    res.json({ isAuthenticated: true, user: { id: req.user.id, nombre: req.user.nombre, email: req.user.email } });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Manejar cierre de sesión en el cliente
router.post('/logout', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    res.redirect('http://localhost:3000'); // Redirigir a la página de inicio
  } catch (error) {
    res.status(500).json({ message: 'Error al cerrar sesión', error: error.message });
  }
});

module.exports = router;
