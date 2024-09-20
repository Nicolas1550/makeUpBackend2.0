const express = require('express');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const { query } = require('../db'); // Usamos `query` para SQL puro
const upload = require('../middleware/uploadMiddleware');
const { MercadoPagoConfig, Preference } = require('mercadopago');

// Configurar Mercado Pago con tu token de acceso
const mercadoPagoConfig = new MercadoPagoConfig({
  accessToken: 'TEST-5877075944185984-091901-b0cdd98592dba39dff23408abc880e97-494022411'
});

// Crear la instancia de Preference
const preference = new Preference(mercadoPagoConfig);
const router = express.Router();

// Middleware de validación para la creación de una orden
const validateOrder = [
  body('total').isFloat({ gt: 0 }).withMessage('El total debe ser un número mayor que 0.'),
  body('phone_number').isString().isLength({ min: 10, max: 15 }).withMessage('El número de teléfono debe ser válido.'),
  body('shipping_method').isIn(['local_pickup', 'delivery']).withMessage('El método de envío no es válido.'),
  body('payment_method').isIn(['deposito', 'mercadopago']).withMessage('El método de pago no es válido.'),
  body('address')
    .if(body('shipping_method').equals('delivery'))
    .notEmpty().withMessage('La dirección es requerida cuando el método de envío es a domicilio.')
    .isString().withMessage('La dirección debe ser una cadena de texto válida.'),
  body('city')
    .if(body('shipping_method').equals('delivery'))
    .notEmpty().withMessage('La ciudad es requerida cuando el método de envío es a domicilio.')
    .isString().withMessage('La ciudad debe ser una cadena de texto válida.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Errores de validación:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware de validación para actualizar el estado de una orden
const validateStatus = [
  body('status')
    .isIn(['pendiente', 'aprobado', 'rechazado'])
    .withMessage('El estado de la orden no es válido.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Crear una nueva orden de compra con Mercado Pago
router.post('/mercadopago',
  passport.authenticate('jwt', { session: false }),
  validateOrder,
  async (req, res) => {
    try {
      const { phone_number, total, products, shipping_method, address, city, payment_method } = req.body;

      // Validar stock de productos y obtener detalles del producto
      const productDetails = [];
      for (const product of products) {
        const productQuery = 'SELECT * FROM products WHERE id = ?';
        const productRecord = (await query(productQuery, [product.id]))[0];

        if (!productRecord || productRecord.quantity < product.quantity) {
          return res.status(400).json({ error: `No hay suficiente stock para el producto ${productRecord?.name || product.id}` });
        }

        productDetails.push({
          id: productRecord.id,
          name: productRecord.name,
          price: productRecord.price,
          quantity: product.quantity,
        });
      }

      // Crear la preferencia de Mercado Pago
      const preferenceData = {
        items: productDetails.map(product => ({
          title: product.name,
          unit_price: parseFloat(product.price),
          quantity: product.quantity,
        })),
        payer: {
          email: req.user.email,
        },
        external_reference: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        back_urls: {
          success: `${req.protocol}://${req.get('host')}/api/productOrders/success`,
          failure: `${req.protocol}://${req.get('host')}/api/productOrders/failure`,
          pending: `${req.protocol}://${req.get('host')}/api/productOrders/pending`,
        },
        auto_return: 'approved',
      };

      const response = await preference.create({ body: preferenceData });

      if (!response || !response.body) {
        console.error('Error: La respuesta de Mercado Pago es indefinida o no es un objeto:', response);
        throw new Error('Respuesta inválida de Mercado Pago.');
      }

      const initPoint = response.body.init_point || response.body.sandbox_init_point;
      if (!initPoint) {
        console.error('Error: La respuesta de Mercado Pago no contiene un init_point:', response.body);
        throw new Error('La respuesta de Mercado Pago no contiene un init_point válido.');
      }

      // Enviar la URL de redirección al frontend
      return res.status(200).json({ init_point: initPoint });
    } catch (error) {
      console.error('Error al intentar crear la preferencia en Mercado Pago:', error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// Éxito de la orden
router.get('/success', async (req, res) => {
  const connection = await query.getConnection();
  try {
    const { external_reference } = req.query;

    // Obtener los datos originales de la orden
    const originalDataQuery = 'SELECT * FROM productorders WHERE external_reference = ?';
    const originalData = (await query(originalDataQuery, [external_reference]))[0];

    // Crear la orden de producto
    const insertOrderQuery = `
      INSERT INTO productorders (user_id, phone_number, total, shipping_method, payment_method, address, city, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, 'mercadopago', ?, ?, 'confirmed', NOW(), NOW())
    `;
    const result = await query(insertOrderQuery, [
      originalData.user_id,
      originalData.phone_number,
      originalData.total,
      originalData.shipping_method,
      originalData.address,
      originalData.city,
    ]);

    const newOrderId = result.insertId;

    // Insertar los productos asociados a la orden
    for (const product of originalData.products) {
      const insertProductOrderQuery = `
        INSERT INTO orderproducts (ProductOrderId, ProductId, quantity)
        VALUES (?, ?, ?)
      `;
      await query(insertProductOrderQuery, [newOrderId, product.id, product.quantity]);
    }

    // Actualizar el stock de los productos
    for (const product of originalData.products) {
      const updateStockQuery = 'UPDATE products SET quantity = quantity - ? WHERE id = ?';
      await query(updateStockQuery, [product.quantity, product.id]);
    }

    res.redirect('/order/success'); // Redirigir a una página de éxito
  } catch (error) {
    await connection.rollback();
    console.error('Error al crear la orden:', error);
    res.redirect('/order/failure'); // Redirigir a una página de fallo
  } finally {
    await connection.release();
  }
});



// Crear una nueva orden de compra con comprobante de depósito
router.post('/add',
  passport.authenticate('jwt', { session: false }),
  upload.single('payment_proof'),
  validateOrder,
  async (req, res) => {
    try {
      const { phone_number, total, products, shipping_method, address, city, payment_method } = req.body;
      const user_id = req.user.id;
      const payment_proof = req.file ? req.file.filename : null;

      // Iniciar una transacción
      await query('START TRANSACTION');

      // Validar stock de productos
      for (const product of products) {
        const [productRecord] = await query('SELECT * FROM products WHERE id = ? FOR UPDATE', [product.id]);
        if (!productRecord || productRecord.quantity < product.quantity) {
          await query('ROLLBACK');
          return res.status(400).json({ error: `No hay suficiente stock para el producto ${productRecord?.name || product.id}` });
        }
      }

      // Insertar la orden en la tabla productorders
      const [orderResult] = await query(
        `INSERT INTO productorders (user_id, phone_number, total, shipping_method, payment_method, payment_proof, address, city) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, phone_number, total, shipping_method, payment_method, payment_proof, address || null, city || null]
      );
      const orderId = orderResult.insertId;

      // Insertar los productos relacionados con la orden en la tabla orderproducts
      for (const product of products) {
        await query(
          'INSERT INTO orderproducts (ProductOrderId, ProductId, quantity) VALUES (?, ?, ?)',
          [orderId, product.id, product.quantity]
        );
        // Actualizar el stock de productos
        await query('UPDATE products SET quantity = quantity - ? WHERE id = ?', [product.quantity, product.id]);
      }

      // Confirmar la transacción
      await query('COMMIT');

      // Devolver los detalles necesarios al frontend
      res.status(201).json({
        message: 'Orden creada con éxito',
        order: {
          id: orderId,
          total,
        }
      });
    } catch (error) {
      await query('ROLLBACK');
      console.error('Error al crear la orden:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);

// Obtener todas las órdenes
// Obtener todas las órdenes
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.id;

    // Asegurarse de que `rolesAssociation` existe y sea un array
    const userIsAdmin = Array.isArray(req.user.rolesAssociation) && req.user.rolesAssociation.some(role => role.nombre === 'admin');

    const queryStr = userIsAdmin
      ? 'SELECT * FROM productorders'
      : 'SELECT * FROM productorders WHERE user_id = ?';

    const orders = userIsAdmin
      ? await query(queryStr)
      : await query(queryStr, [userId]);

    if (!orders.length) {
      return res.status(404).json({ message: 'No se encontraron órdenes.' });
    }

    // Enriquecer las órdenes con productos y usuarios asociados
    for (const order of orders) {
      const [products] = await query('SELECT p.id, p.name, p.price, op.quantity FROM products p JOIN orderproducts op ON p.id = op.ProductId WHERE op.ProductOrderId = ?', [order.id]);
      order.products = products;
    }

    // Añadir cabeceras para deshabilitar la caché
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

// Actualizar el estado de una orden
router.patch('/:id/status',
  passport.authenticate('jwt', { session: false }),
  validateStatus,
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Solo los administradores pueden cambiar el estado
    if (!req.user.rolesAssociation.some(role => role.nombre === 'admin')) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción.' });
    }

    try {
      const [order] = await query('SELECT * FROM productorders WHERE id = ?', [id]);
      if (!order) {
        return res.status(404).json({ message: 'Orden no encontrada.' });
      }

      await query('UPDATE productorders SET status = ? WHERE id = ?', [status, id]);
      res.status(200).json({ message: 'Estado de la orden actualizado con éxito.' });
    } catch (error) {
      console.error('Error al actualizar el estado de la orden:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
);

module.exports = router;
