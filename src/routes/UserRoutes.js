const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Ruta para obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ruta para crear un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ruta para actualizar el rol de un usuario
router.patch('/updateRole/:id', async (req, res) => {
  const { role } = req.body;
  if (!role) {
    return res.status(400).json({ message: 'Role is required' });
  }

  try {
    const [updatedRows, [updatedUser]] = await User.update({ role }, {
      where: { id: req.params.id },
      returning: true,
    });
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
