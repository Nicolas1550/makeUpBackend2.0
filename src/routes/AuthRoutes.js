const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
require('dotenv').config();

// Middleware para manejar errores asíncronos
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Middleware de validación
const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    res.status(400).json({ errors: errors.array() });
  };
};

// Ruta para registrar un nuevo usuario
router.post('/register',
  validate([
    body('nombre').isString().notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Debe ser un correo válido'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
  ]),
  asyncHandler(async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ nombre, email, password: hashedPassword });
      res.status(201).json({ message: 'Usuario registrado con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
    }
  })
);

// Ruta para iniciar sesión
router.post('/login',
  validate([
    body('email').isEmail().withMessage('Debe ser un correo válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria')
  ]),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user: { id: user.id, nombre: user.nombre, email: user.email, role: user.role } });
    } catch (error) {
      res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
  })
);

module.exports = router;
