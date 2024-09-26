const express = require('express');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const isAdmin = require('../middleware/IsAdmin');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();
const { query } = require('../db');  // Conexión a MySQL

// Middleware de validación para productos
const validateProduct = [
  body('name')
    .isString()
    .withMessage('El nombre debe ser una cadena de texto.')
    .notEmpty()
    .withMessage('El nombre es obligatorio.'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número mayor o igual a 0.')
    .notEmpty()
    .withMessage('El precio es obligatorio.'),

  body('quantity')
    .isInt({ min: 0 })
    .withMessage('La cantidad debe ser un número entero no negativo.')
    .notEmpty()
    .withMessage('La cantidad es obligatoria.'),

  body('brand')
    .isString()
    .withMessage('La marca debe ser una cadena de texto.')
    .notEmpty()
    .withMessage('La marca es obligatoria.'),

  body('color')
    .isString()
    .withMessage('El color debe ser una cadena de texto.')
    .notEmpty()
    .withMessage('El color es obligatorio.'),

  body('category')
    .isString()
    .withMessage('La categoría debe ser una cadena de texto.')
    .notEmpty()
    .withMessage('La categoría es obligatoria.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
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
      req.body.imageFileName = req.file.filename;
    }
    req.body.price = parseFloat(req.body.price); 
    req.body.quantity = parseInt(req.body.quantity, 10); 
    next();
  }, 
  validateProduct, 
  async (req, res) => {
    try {
      const { name, price, quantity, imageFileName, brand, color, category } = req.body;

      const productQuery = `
        INSERT INTO products (name, price, quantity, imageFileName, brand, color, category, createdAt, updatedAt) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      await query(productQuery, [name, price, quantity, imageFileName, brand, color, category]);

      res.status(201).json({ message: 'Producto agregado con éxito' });
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productsQuery = 'SELECT * FROM products';
    const products = await query(productsQuery);
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
  async (req, res, next) => {
    try {
      const productId = req.params.id;

      // Primero obtenemos el producto actual para mantener la imagen anterior si no se carga una nueva
      const currentProduct = (await query('SELECT * FROM products WHERE id = ?', [productId]))[0];

      if (!currentProduct) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      // Si se carga una nueva imagen, la usamos, si no, mantenemos la imagen anterior
      const imageFileName = req.file ? req.file.filename : currentProduct.imageFileName;

      req.body.imageFileName = imageFileName;
      req.body.price = parseFloat(req.body.price);
      req.body.quantity = parseInt(req.body.quantity, 10);

      next();
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }, 
  validateProduct, 
  async (req, res) => {
    try {
      // Asegúrate de incluir description en el cuerpo de la petición
      const { name, price, quantity, imageFileName, brand, color, category, description } = req.body; 
      const productId = req.params.id;

      // Incluye description en la consulta de actualización
      const updateProductQuery = `
        UPDATE products 
        SET name = ?, price = ?, quantity = ?, imageFileName = ?, brand = ?, color = ?, category = ?, description = ?, updatedAt = NOW() 
        WHERE id = ?
      `;
      const result = await query(updateProductQuery, [name, price, quantity, imageFileName, brand, color, category, description, productId]);

      if (result.affectedRows > 0) {
        const updatedProduct = await query('SELECT * FROM products WHERE id = ?', [productId]);
        res.status(200).json({ message: 'Producto actualizado con éxito', product: updatedProduct[0] });
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
      const productId = req.params.id;

      const deleteProductQuery = 'DELETE FROM products WHERE id = ?';
      const result = await query(deleteProductQuery, [productId]);

      if (result.affectedRows > 0) {
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

// Ruta para obtener productos destacados
router.get('/featured', async (req, res) => {
  try {
    const featuredProductsQuery = 'SELECT * FROM products WHERE isFeatured = true';
    const featuredProducts = await query(featuredProductsQuery);
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
      const productId = req.params.id;

      const updateFeaturedQuery = 'UPDATE products SET isFeatured = ?, updatedAt = NOW() WHERE id = ?';
      const result = await query(updateFeaturedQuery, [isFeatured, productId]);

      if (result.affectedRows > 0) {
        const updatedProduct = await query('SELECT * FROM products WHERE id = ?', [productId]);
        res.status(200).json({ message: 'Producto actualizado como destacado', product: updatedProduct[0] });
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
      const productId = req.params.id;

      const updateUnfeatureQuery = 'UPDATE products SET isFeatured = false, updatedAt = NOW() WHERE id = ?';
      const result = await query(updateUnfeatureQuery, [productId]);

      if (result.affectedRows > 0) {
        const updatedProduct = await query('SELECT * FROM products WHERE id = ?', [productId]);
        res.status(200).json({ message: 'Producto removido del carrusel de ofertas', product: updatedProduct[0] });
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

