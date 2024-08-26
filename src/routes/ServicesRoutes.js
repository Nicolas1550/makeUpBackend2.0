const express = require('express');
const Servicio = require('../models/Services');
const router = express.Router();
const passport = require('passport');

// Ruta para obtener todos los servicios
router.get('/', async (req, res) => {
  try {
    const servicios = await Servicio.findAll();
    res.json(servicios);
  } catch (error) {
    console.error('Error fetching servicios:', error.message);
    res.status(500).json({ message: 'Error fetching servicios' });
  }
});

// Ruta para agregar un nuevo servicio, protegida con autenticación
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  try {
    if (!nombre || !precio) {
      return res.status(400).json({ message: 'Nombre y precio son obligatorios' });
    }

    const nuevoServicio = await Servicio.create({ nombre, descripcion, precio });
    res.status(201).json(nuevoServicio);
  } catch (error) {
    console.error('Error adding servicio:', error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
