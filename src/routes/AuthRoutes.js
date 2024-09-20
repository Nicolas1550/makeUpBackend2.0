const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const multer = require('multer'); 
const path = require('path');
const router = express.Router();
const { query } = require('../db'); // Usa la conexión directa a la base de datos

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
      const [existingUser] = await query('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUser) {
        return res.status(400).json({ message: 'El usuario ya existe' });
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear un nuevo usuario con los datos proporcionados
      const newUserQuery = `
        INSERT INTO users (nombre, apellido, email, password, telefono, foto, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`;
      
      await query(newUserQuery, [nombre, apellido, email, hashedPassword, telefono, foto]);

      res.status(201).json({ message: 'Usuario registrado con éxito' });
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
      // Buscar el usuario por su correo electrónico
      const userQuery = `
        SELECT u.*, GROUP_CONCAT(r.nombre) as roles
        FROM users u
        LEFT JOIN user_roles ur ON u.id = ur.UserId
        LEFT JOIN roles r ON ur.RoleId = r.id
        WHERE u.email = ?
        GROUP BY u.id`;

      const [user] = await query(userQuery, [email]);

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Generar el token JWT
      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

      // Devolver el token y los datos del usuario
      res.json({
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          telefono: user.telefono,
          foto: user.foto,
          roles: user.roles ? user.roles.split(',') : [] // Convertir los roles en un array
        }
      });
    } catch (error) {
      console.error("Error al verificar usuario:", error); 
      res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
    }
  })
);

module.exports = router;
