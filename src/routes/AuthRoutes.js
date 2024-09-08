const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const multer = require('multer'); 
const path = require('path');
const router = express.Router();
const User = require('../models/User');
const Role = require('../models/Role');  

require('dotenv').config();

// Importa el middleware de subida
const upload = require('../middleware/uploadMiddleware');

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
router.post(
  '/register',
  upload.single('foto'), 
  validate([
    body('nombre').isString().notEmpty().withMessage('El nombre es obligatorio'),
    body('apellido').isString().notEmpty().withMessage('El apellido es obligatorio'),
    body('email').isEmail().withMessage('Debe ser un correo válido'),
    body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('telefono').isString().notEmpty().withMessage('El teléfono es obligatorio'), 
  ]),
  asyncHandler(async (req, res) => {
    const { nombre, apellido, email, password, telefono } = req.body;
    const foto = req.file ? req.file.filename : null; 

    try {
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear un nuevo usuario con los datos proporcionados
      const newUser = await User.create({
        nombre,
        apellido,
        email,
        password: hashedPassword,
        telefono,
        foto, 
      });

      res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
    } catch (error) {
      res.status(500).json({ message: 'Error al registrar el usuario', error: error.message });
    }
  })
);

// Ruta para iniciar sesión
router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Debe ser un correo válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria')
  ]),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
      // Buscar el usuario por su correo electrónico, incluyendo los roles con el alias correcto
      const user = await User.findOne({ 
        where: { email },
        include: {
          model: Role, 
          as: 'rolesAssociation', 
          attributes: ['id', 'nombre']
        }
      });


      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Generar el token JWT
      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

      // Devolver el token y los datos del usuario, incluyendo los roles
      res.json({
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          telefono: user.telefono,
          foto: user.foto,
          roles: user.rolesAssociation 
        }
      });
    } catch (error) {
      console.error("Error al verificar usuario:", error); 
      res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
  })
);


module.exports = router;
