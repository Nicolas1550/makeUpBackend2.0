const express = require('express');
const passport = require('passport');
const router = express.Router();

// Verificación del estado de autenticación del usuario con JWT
router.get('/verify', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log(`Solicitud a /verify recibida. Usuario autenticado: ${req.user ? req.user.nombre : "No autenticado"}`);
  if (req.user) {
    res.json({ isAuthenticated: true, user: { id: req.user._id, nombre: req.user.nombre, email: req.user.email } });
  } else {
    res.json({ isAuthenticated: false });
  }
});


// Manejar cierre de sesión en el cliente
router.post('/logout', (req, res) => {
  // El cierre de sesión se maneja en el cliente eliminando el JWT almacenado
  res.json({ message: 'Has cerrado sesión exitosamente.' });
});

module.exports = router;
