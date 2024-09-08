const express = require('express');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const { ProductOrder, Product, User, OrderProducts } = require('../models/associations');
const { sequelize } = require('../db');
const upload = require('../middleware/uploadMiddleware'); 
const { MercadoPagoConfig, Preference } = require('mercadopago');

// Configurar Mercado Pago con tu token de acceso
const mercadoPagoConfig = new MercadoPagoConfig({
  accessToken: 'TEST-3548564729229334-083118-709ecd2ee32c5dcbd24ba7260cedf546-218527457'
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
        const productRecord = await Product.findByPk(product.id);
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


      // Validar que response.body exista y tenga el init_point
      if (!response || typeof response !== 'object') {
        console.error('Error: La respuesta de Mercado Pago es indefinida o no es un objeto:', response);
        throw new Error('Respuesta indefinida o inválida.');
      }

      const responseBody = response.body || response;
      if (typeof responseBody !== 'object') {
        console.error('Error: El cuerpo de la respuesta de Mercado Pago es indefinido o no es un objeto:', responseBody);
        throw new Error('El cuerpo de la respuesta de Mercado Pago es inválido.');
      }

      const initPoint = responseBody.init_point || responseBody.sandbox_init_point;
      if (!initPoint) {
        console.error('Error: La respuesta de Mercado Pago no contiene un init_point:', responseBody);
        throw new Error('La respuesta de Mercado Pago no contiene un init_point válido.');
      }


      // Enviar la URL de redirección al frontend
      return res.status(200).json({ init_point: initPoint });
    } catch (error) {
      console.error('Error al intentar crear la preferencia en Mercado Pago:', error.message, '\nStack trace:', error.stack);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);



router.get('/success', async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { external_reference } = req.query;

   
    const originalData = await getOriginalDataByReference(external_reference);

    // Crear la orden solo si el pago fue exitoso
    const order = await ProductOrder.create({
      user_id: originalData.user_id,
      phone_number: originalData.phone_number,
      total: originalData.total,
      shipping_method: originalData.shipping_method,
      payment_method: 'mercadopago',
      address: originalData.address,
      city: originalData.city,
      status: 'confirmed',
    }, { transaction: t });

    // Relacionar la orden con los productos
    for (const product of originalData.products) {
      await OrderProducts.create({
        ProductOrderId: order.id,
        ProductId: product.id,
        quantity: product.quantity
      }, { transaction: t });
    }

    // Actualizar stock de productos
    for (const product of originalData.products) {
      const productRecord = await Product.findByPk(product.id, { transaction: t });
      await productRecord.update({ quantity: productRecord.quantity - product.quantity }, { transaction: t });
    }

    await t.commit();
    res.redirect('/order/success'); // Redirigir a una página de éxito en tu frontend
  } catch (error) {
    await t.rollback();
    console.error('Error al crear la orden:', error);
    res.redirect('/order/failure'); // Redirigir a una página de fallo en tu frontend
  }
});




// Crear una nueva orden de compra con comprobante de depósito
router.post('/add',
  passport.authenticate('jwt', { session: false }),
  upload.single('payment_proof'),
  validateOrder,
  async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const { phone_number, total, products, shipping_method, address, city, payment_method } = req.body;
      const user_id = req.user.id;
      const user_email = req.user.email; 
      const user_name = req.user.nombre; 



      // Validar stock de productos
      for (const product of products) {
        const productRecord = await Product.findByPk(product.id, { transaction: t });
        if (!productRecord || productRecord.quantity < product.quantity) {
          await t.rollback();
          return res.status(400).json({ error: `No hay suficiente stock para el producto ${productRecord?.name || product.id}` });
        }
      }

      // Crear la orden
      const orderData = {
        user_id,
        phone_number,
        total,
        shipping_method,
        payment_method,
        payment_proof: req.file ? req.file.filename : null,
        address: shipping_method === 'delivery' ? address : null,
        city: shipping_method === 'delivery' ? city : null
      };


      const order = await ProductOrder.create(orderData, { transaction: t });


      // Relacionar la orden con los productos
      for (const product of products) {
        await OrderProducts.create({
          ProductOrderId: order.id,
          ProductId: product.id,
          quantity: product.quantity
        }, { transaction: t });
      }

      await t.commit();

      // Devolver los detalles necesarios al frontend
      res.status(201).json({
        message: 'Orden creada con éxito',
        order: {
          id: order.id,
          user_email,
          user_name,
          total
        }
      });

    } catch (error) {
      await t.rollback();
      console.error('Error al crear la orden:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
);



router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    
    let orders;

    if (req.user.rolesAssociation.some(role => role.nombre === 'admin')) {
      orders = await ProductOrder.findAll({
        include: [
          {
            model: Product,
            as: 'orderProductsAssociation', 
            attributes: ['id', 'name', 'price'],
            through: { attributes: ['quantity'] }, 
          },
          {
            model: User,
            as: 'userOrderAssociation', 
            attributes: ['id', 'nombre', 'email'],
          },
        ],
      });
    } else {
      orders = await ProductOrder.findAll({
        where: {
          user_id: req.user.id
        },
        include: [
          {
            model: Product,
            as: 'orderProductsAssociation',
            attributes: ['id', 'name', 'price'],
            through: { attributes: ['quantity'] },
          },
          {
            model: User,
            as: 'userOrderAssociation',
            attributes: ['id', 'nombre', 'email'],
          },
        ],
      });
    }


    if (!orders.length) {
      return res.status(404).json({ message: 'No se encontraron órdenes.' });
    }

    // Verificar si los productos están correctamente relacionados
    orders.forEach(order => {
      order.orderProductsAssociation.forEach(product => {
      });
    });

    // Incluir el comprobante de pago en la respuesta
    const ordersWithProof = orders.map(order => ({
      ...order.get({ plain: true }),
      payment_proof_url: order.payment_proof ? `${req.protocol}://${req.get('host')}/uploads/images/${order.payment_proof}` : null
    }));


    res.status(200).json(ordersWithProof);
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
});



router.patch('/:id/status',
  passport.authenticate('jwt', { session: false }),
  validateStatus,
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Solo permite que los administradores cambien el estado
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción.' });
    }

    try {
      const order = await ProductOrder.findByPk(id);

      if (!order) {
        return res.status(404).json({ message: 'Orden no encontrada.' });
      }

      order.status = status;
      await order.save();

      res.status(200).json({ message: 'Estado de la orden actualizado con éxito.', order });
    } catch (error) {
      console.error('Error al actualizar el estado de la orden:', error);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  }
);

module.exports = router;
