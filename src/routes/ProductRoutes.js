const express = require('express');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const isAdmin = require('../middleware/IsAdmin');
const Product = require('../models/Product');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

// Middleware de validación para productos
const validateProduct = [
  body('name')
    .isString()
    .withMessage('El nombre debe ser una cadena de texto.')
    .notEmpty()
    .withMessage('El nombre es obligatorio.'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('El precio debe ser un número mayor que 0.')
    .notEmpty()
    .withMessage('El precio es obligatorio.'),
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('La cantidad debe ser un número entero no negativo.')
    .notEmpty()
    .withMessage('La cantidad es obligatoria.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error("Errores de validación:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Ruta para agregar productos (solo administradores)
router.post('/add', 
  passport.authenticate('jwt', { session: false }), 
  isAdmin, 
  upload.single('image'), 
  (req, res, next) => {
    if (req.file) {
    } else {
    }

    req.body.price = parseFloat(req.body.price); 
    req.body.quantity = parseInt(req.body.quantity, 10); 
    next();
  }, 
  validateProduct, 
  async (req, res) => {
    try {
      const productData = {
        ...req.body,
        imageFileName: req.file ? req.file.filename : null 
      };

      const product = await Product.create(productData);
      res.status(201).json({ message: 'Producto agregado con éxito', product });
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ruta para actualizar un producto por ID (solo administradores)
router.put('/update/:id', 
  passport.authenticate('jwt', { session: false }), 
  isAdmin, 
  upload.single('image'), 
  (req, res, next) => {
    if (req.file) {
    } else {
    }

    req.body.price = parseFloat(req.body.price); 
    req.body.quantity = parseInt(req.body.quantity, 10); 
    next();
  }, 
  validateProduct, 
  async (req, res) => {
    try {
      const updateData = {
        ...req.body,
        ...(req.file && { imageFileName: req.file.filename }) 
      };

      const [updated] = await Product.update(updateData, {
        where: { id: req.params.id }
      });
      if (updated) {
        const updatedProduct = await Product.findOne({ where: { id: req.params.id } });
        res.status(200).json({ message: 'Producto actualizado con éxito', product: updatedProduct });
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// Ruta para eliminar un producto por ID (solo administradores)
router.delete('/delete/:id', 
  passport.authenticate('jwt', { session: false }), 
  isAdmin, 
  async (req, res) => {
    try {
      const deleted = await Product.destroy({
        where: { id: req.params.id }
      });
      if (deleted) {
        res.status(200).json({ message: 'Producto eliminado con éxito' });
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);
router.get('/featured', async (req, res) => {
  try {
    const featuredProducts = await Product.findAll({
      where: { isFeatured: true }
    });
    res.status(200).json(featuredProducts);
  } catch (error) {
    console.error('Error al obtener productos destacados:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar el estado de "destacado" de un producto (solo administradores)
router.put('/featured/:id', 
  passport.authenticate('jwt', { session: false }), 
  isAdmin, 
  async (req, res) => {
    try {
      const { isFeatured } = req.body;  
      const [updated] = await Product.update({ isFeatured }, {
        where: { id: req.params.id }
      });

      if (updated) {
        const updatedProduct = await Product.findOne({ where: { id: req.params.id } });
        res.status(200).json({ message: 'Producto actualizado como destacado', product: updatedProduct });
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error('Error al actualizar el estado de destacado:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);
// Quitar un producto del carrusel de ofertas (solo administradores)
router.put('/unfeature/:id', 
  passport.authenticate('jwt', { session: false }), 
  isAdmin, 
  async (req, res) => {
    try {
      const [updated] = await Product.update({ isFeatured: false }, {
        where: { id: req.params.id }
      });

      if (updated) {
        const updatedProduct = await Product.findOne({ where: { id: req.params.id } });
        res.status(200).json({ message: 'Producto removido del carrusel de ofertas', product: updatedProduct });
      } else {
        res.status(404).json({ message: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error('Error al quitar producto del carrusel de ofertas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

module.exports = router;
