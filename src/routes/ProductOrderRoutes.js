const express = require('express');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const { query, pool } = require('../db'); // Usamos `query` para SQL puro
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
// Middleware de validación para la creación de una orden
const validateOrder = [
  body('total')
    .isFloat({ min: 0 }) // Cambiar de `gt: 0` a `min: 0` para permitir valores igual a 0
    .withMessage('El total debe ser un número mayor o igual que 0.'),
  body('phone_number')
    .isString()
    .isLength({ min: 10, max: 15 })
    .withMessage('El número de teléfono debe ser válido.'),
  body('shipping_method')
    .isIn(['local_pickup', 'delivery'])
    .withMessage('El método de envío no es válido.'),
  body('payment_method')
    .isIn(['deposito', 'mercadopago'])
    .withMessage('El método de pago no es válido.'),
  body('address')
    .if(body('shipping_method').equals('delivery'))
    .notEmpty()
    .withMessage('La dirección es requerida cuando el método de envío es a domicilio.')
    .isString()
    .withMessage('La dirección debe ser una cadena de texto válida.'),
  body('city')
    .if(body('shipping_method').equals('delivery'))
    .notEmpty()
    .withMessage('La ciudad es requerida cuando el método de envío es a domicilio.')
    .isString()
    .withMessage('La ciudad debe ser una cadena de texto válida.'),
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
// Crear una nueva orden de compra con Mercado Pago
router.post('/mercadopago',
  passport.authenticate('jwt', { session: false }),
  validateOrder,
  async (req, res) => {
    try {
      let { phone_number, total, products, shipping_method, address, city } = req.body;

      // Verificación condicional para envío a domicilio
      if (shipping_method === 'delivery') {
        if (!address || !city) {
          return res.status(400).json({ error: 'Debe proporcionar dirección y ciudad para el envío a domicilio.' });
        }
      } else if (shipping_method === 'local_pickup') {
        // Si es retiro en local, reasignar address y city a null
        address = null;
        city = null;
      } else {
        return res.status(400).json({ error: 'Método de envío no válido.' });
      }

      // Validar stock de productos antes de crear la preferencia
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
        metadata: {
          user_id: req.user.id, // Agrega el user_id aquí
          phone_number, // Se incluye el número de teléfono en los metadatos
          total,       // Se incluye el total en los metadatos
          products,    // Se incluyen los productos para recuperarlos en el webhook
          shipping_method,
          address,
          city,
        },
        back_urls: {
          success: `${req.protocol}://${req.get('host')}/api/productOrders/success`,
          failure: `${req.protocol}://${req.get('host')}/api/productOrders/failure`,
          pending: `${req.protocol}://${req.get('host')}/api/productOrders/pending`,
        },
        auto_return: 'approved',
        notification_url: `${req.protocol}://${req.get('host')}/api/productOrders/webhook`,
      };

      console.log('Creando preferencia en Mercado Pago...');
      const response = await preference.create({ body: preferenceData });

      // Ahora accedemos directamente a response.init_point y response.sandbox_init_point
      const initPoint = response.init_point || response.sandbox_init_point;
      if (!initPoint) {
        console.error('La respuesta de Mercado Pago no contiene un init_point válido:', response);
        throw new Error('La respuesta de Mercado Pago no contiene un init_point válido.');
      }

      // Enviar la URL de redirección al frontend
      console.log('Enviando URL de redirección a Mercado Pago:', initPoint);
      return res.status(200).json({ init_point: initPoint });

    } catch (error) {
      console.error('Error al intentar crear la preferencia en Mercado Pago:', error.message);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);



// Éxito de la orden
// Webhook para recibir notificaciones de Mercado Pago
// Webhook para recibir notificaciones de Mercado Pago
// Webhook para recibir notificaciones de Mercado Pago
// Webhook para recibir notificaciones de Mercado Pago
// Webhook para recibir notificaciones de Mercado Pago
router.post('/webhook', async (req, res) => {
  try {
    // Verificar si `type` y `id` vienen en la query string
    const type = req.body.type || req.query.topic;
    const paymentId = req.body.data?.id || req.query.id;

    if (type === 'payment' && paymentId) {
      // Obtener detalles del pago desde Mercado Pago usando la configuración `mercadoPagoConfig`
      const paymentInfo = await preference.payment.findById(paymentId);  // Asegúrate de que preference está bien instanciado

      // Verificar si el pago fue aprobado
      if (paymentInfo.body.status === 'approved') {
        const externalReference = paymentInfo.body.external_reference;
        const metadata = paymentInfo.body.metadata;

        // Verificar si los metadatos son correctos
        if (!metadata || !metadata.products || !metadata.total || !metadata.phone_number || !metadata.user_id) {
          console.error('Metadatos faltantes o incorrectos en la respuesta de Mercado Pago:', metadata);
          return res.status(400).json({ error: 'Metadatos faltantes en la respuesta de Mercado Pago' });
        }

        // Extraer los datos necesarios de los metadatos
        const { user_id, phone_number, total, products, shipping_method, address, city } = metadata;

        // Conectar a la base de datos y empezar una transacción
        const connection = await pool.getConnection();
        await connection.query('START TRANSACTION');

        try {
          // Crear la orden en la base de datos con el `user_id` recuperado de los metadatos
          const [orderResult] = await connection.query(
            `INSERT INTO productorders (user_id, phone_number, total, shipping_method, payment_method, address, city, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, 'aprobado')`,
            [user_id, phone_number, total, shipping_method, 'mercadopago', address || null, city || null]
          );

          const orderId = orderResult.insertId;
          const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

          // Insertar los productos asociados a la orden
          for (const product of products) {
            await connection.query(
              'INSERT INTO orderproducts (ProductOrderId, ProductId, quantity, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
              [orderId, product.id, product.quantity, now, now]
            );
            // Actualizar el stock de productos
            await connection.query('UPDATE products SET quantity = quantity - ? WHERE id = ?', [product.quantity, product.id]);
          }

          // Confirmar la transacción
          await connection.query('COMMIT');
          console.log('Orden creada exitosamente después de la aprobación de Mercado Pago.');
          res.status(201).json({ message: 'Orden creada con éxito' });
        } catch (error) {
          await connection.query('ROLLBACK');
          console.error('Error al crear la orden después de la aprobación de Mercado Pago:', error);
          res.status(500).json({ error: 'Error al crear la orden' });
        } finally {
          connection.release();
        }
      } else {
        console.log(`El pago con ID ${paymentId} no fue aprobado. Estado: ${paymentInfo.body.status}`);
        res.status(200).json({ message: `El pago no fue aprobado. Estado: ${paymentInfo.body.status}` });
      }
    } else {
      console.log(`Tipo de notificación no manejado: ${type}`);
      res.status(200).json({ message: 'Notificación recibida con éxito, pero no se manejó ningún pago.' });
    }
  } catch (error) {
    console.error('Error en el webhook de Mercado Pago:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});




// Crear una nueva orden de compra con comprobante de depósito

// Importa la función getConnection desde db.js




// Crear una nueva orden de compra con comprobante de depósito
router.post('/add',
  passport.authenticate('jwt', { session: false }),
  upload.single('payment_proof'),
  validateOrder,
  async (req, res) => {
    const connection = await pool.getConnection(); // Obtener una conexión específica para la transacción
    try {
      const { phone_number, total, products, shipping_method, address, city, payment_method } = req.body;
      const user_id = req.user.id;
      const payment_proof = req.file ? req.file.filename : null;

      // Iniciar una transacción usando `query`
      await connection.query('START TRANSACTION');

      // Validar stock de productos
      for (const product of products) {
        const [productRecord] = await connection.query('SELECT * FROM products WHERE id = ? FOR UPDATE', [product.id]);
        if (!productRecord || productRecord.quantity < product.quantity) {
          await connection.query('ROLLBACK');
          return res.status(400).json({ error: `No hay suficiente stock para el producto ${productRecord?.name || product.id}` });
        }
      }

      // Insertar la orden en la tabla productorders
      const [orderResult] = await connection.query(
        `INSERT INTO productorders (user_id, phone_number, total, shipping_method, payment_method, payment_proof, address, city) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [user_id, phone_number, total, shipping_method, payment_method, payment_proof, address || null, city || null]
      );
      const orderId = orderResult.insertId;

      // Insertar los productos relacionados con la orden en la tabla orderproducts
      const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // Generar la fecha actual
      for (const product of products) {
        await connection.query(
          'INSERT INTO orderproducts (ProductOrderId, ProductId, quantity, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
          [orderId, product.id, product.quantity, now, now]
        );
        // Actualizar el stock de productos
        await connection.query('UPDATE products SET quantity = quantity - ? WHERE id = ?', [product.quantity, product.id]);
      }

      // Confirmar la transacción
      await connection.query('COMMIT');

      // Devolver los detalles necesarios al frontend
      res.status(201).json({
        message: 'Orden creada con éxito',
        order: {
          id: orderId,
          total,
        }
      });
    } catch (error) {
      await connection.query('ROLLBACK'); // Si hay un error, hacer rollback de la transacción
      console.error('Error al crear la orden:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
      connection.release(); // Liberar la conexión
    }
  }
);



// Obtener todas las órdenes
// Obtener todas las órdenes
// Obtener todas las órdenes
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userId = req.user.id;
    const userRoles = req.user.rolesAssociation || [];

    console.log(`ID del usuario: ${userId}`);
    console.log(`Roles del usuario:`, userRoles);

    // Verifica si el usuario tiene el rol de administrador
    const userIsAdmin = Array.isArray(userRoles) && userRoles.some(role => role.nombre === 'admin');
    console.log(`¿El usuario es administrador? ${userIsAdmin}`);

    // Modificamos la consulta para obtener los detalles del usuario
    const queryStr = userIsAdmin
      ? `SELECT po.*, u.nombre as user_name, u.email as user_email 
         FROM productorders po
         JOIN users u ON po.user_id = u.id`
      : `SELECT po.*, u.nombre as user_name, u.email as user_email 
         FROM productorders po
         JOIN users u ON po.user_id = u.id 
         WHERE po.user_id = ?`;

    // Ejecutar la consulta para obtener las órdenes
    const orders = userIsAdmin
      ? await query(queryStr)
      : await query(queryStr, [userId]);

    console.log(`Órdenes obtenidas:`, orders);

    if (!orders || orders.length === 0) {
      console.log('No se encontraron órdenes.');
      return res.status(404).json({ message: 'No se encontraron órdenes.' });
    }

    // Enriquecer las órdenes con los productos asociados
    for (const order of orders) {
      const products = await query(`
        SELECT p.id, p.name, p.price, op.quantity
        FROM products p
        JOIN orderproducts op ON p.id = op.ProductId
        WHERE op.ProductOrderId = ?
      `, [order.id]);

      console.log(`Productos para la orden ${order.id}:`, products);
      order.products = products || [];
    }

    // Añadir información del usuario y el comprobante de pago en la respuesta final
    const enrichedOrders = orders.map(order => ({
      ...order,
      user: {
        id: order.user_id,
        nombre: order.user_name,
        email: order.user_email
      },
      // Asegúrate de incluir el campo payment_proof con la ruta correcta
      payment_proof: order.payment_proof ? `/uploads/${order.payment_proof}` : null
    }));

    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');

    console.log(`Enviando órdenes al cliente.`);
    res.status(200).json(enrichedOrders);
  } catch (error) {
    console.error('Error al obtener las órdenes:', error.message);
    res.status(500).json({ message: 'Error interno del servidor.', error: error.message });
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
      // Obtener la orden antes de actualizar para validar si existe
      const [order] = await query('SELECT * FROM productorders WHERE id = ?', [id]);
      if (!order) {
        return res.status(404).json({ message: 'Orden no encontrada.' });
      }

      // Actualizar el estado
      await query('UPDATE productorders SET status = ? WHERE id = ?', [status, id]);

      // Obtener la orden actualizada
      const [updatedOrder] = await query('SELECT * FROM productorders WHERE id = ?', [id]);

      // Obtener el usuario asociado
      const [user] = await query('SELECT id, nombre, email FROM users WHERE id = ?', [updatedOrder.user_id]);

      // Obtener los productos asociados a la orden
      const products = await query(`
        SELECT p.id, p.name, p.price, op.quantity
        FROM products p
        JOIN orderproducts op ON p.id = op.ProductId
        WHERE op.ProductOrderId = ?
      `, [updatedOrder.id]);

      // Adjuntar el usuario y los productos a la orden actualizada
      updatedOrder.user = user || null;
      updatedOrder.products = products || [];

      // Retornar la orden completa con el usuario y productos asociados
      res.status(200).json({ order: updatedOrder });
    } catch (error) {
      console.error('Error al actualizar el estado de la orden:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
);



module.exports = router;
