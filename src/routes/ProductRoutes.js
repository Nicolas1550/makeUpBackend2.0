const express = require('express');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const mongoose = require('mongoose'); // Asegúrate de importar mongoose
const isAdmin = require('../middleware/isAdmin');
const Product = require('../models/Product');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Middleware de validación
const validateProduct = [
    body('name').isString().withMessage('El nombre debe ser una cadena de texto.'),
    body('price').isFloat({ gt: 0 }).withMessage('El precio debe ser un número mayor que 0.'),
    body('quantity').isInt({ min: 0 }).withMessage('La cantidad debe ser un número entero no negativo.'),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      next();
    },
  ];

// Ruta para insertar productos, accesible solo por usuarios autenticados con rol 'admin'
router.post('/add', passport.authenticate('jwt', { session: false }), isAdmin, upload.single('image'), validateProduct, async (req, res) => {
    try {
      const productData = {
        ...req.body,
        imageFileName: req.file ? req.file.filename : null
      };
      const product = new Product(productData);
      await product.save();
      res.status(201).send({ message: 'Producto agregado con éxito', product });
    } catch (error) {
      res.status(400).send(error);
    }
  });

// Ruta para obtener todos los productos, accesible sin autenticación
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Ruta para actualizar un producto por su ID, accesible solo por usuarios autenticados con rol 'admin'
router.put('/update/:id', passport.authenticate('jwt', { session: false }), isAdmin, upload.single('image'), validateProduct, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'ID de producto no válido' });
  }

  try {
    const updateData = {
      ...req.body,
      ...(req.file && { imageFileName: req.file.filename })
    };

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) {
      return res.status(404).send({ message: 'Producto no encontrado' });
    }
    res.status(200).send(product);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).send({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

  
// Ruta para eliminar un producto por su ID, accesible solo por usuarios autenticados con rol 'admin'
router.delete('/delete/:id', passport.authenticate('jwt', { session: false }), isAdmin, async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'ID de producto no válido' });
    }

    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).send({ message: 'Producto no encontrado' });
        }
        res.status(200).send({ message: 'Producto eliminado con éxito' });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
