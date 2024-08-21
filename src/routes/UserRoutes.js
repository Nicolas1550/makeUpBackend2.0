const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');

// Ruta para obtener todos los usuarios
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Ruta para crear un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(400).json({ message: 'Error creating user' });
  }
});

// Ruta para actualizar el rol de un usuario, accesible solo por administradores
router.patch('/updateRole/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
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
    console.error('Error updating user role:', error.message);
    res.status(500).json({ message: 'Error updating user role' });
  }
});

module.exports = router;

