const express = require('express');
const Order = require('../models/Order');
const Disponibilidad = require('../models/Disponibilidad');
const Servicio = require('../models/Services');
const User = require('../models/User');
const authenticate = require('../middleware/auth');
const isAdmin = require('../middleware/IsAdmin');

module.exports = function (io) {
  const router = express.Router();

  // Ruta para obtener todas las órdenes para el administrador, ordenadas por fecha de creación
  router.get('/admin/orders', authenticate, isAdmin, async (req, res) => {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: Disponibilidad,
            as: 'disponibilidad',
            include: [{ model: Servicio, as: 'servicio' }]
          },
          {
            model: User,
            as: 'user',
            attributes: ['nombre', 'email']
          }
        ],
        order: [['createdAt', 'ASC']]
      });

      res.json(orders);
    } catch (error) {
      console.error('Error obteniendo todas las órdenes:', error.message);
      res.status(500).json({ message: 'Error obteniendo todas las órdenes' });
    }
  });

  // Ruta para actualizar el estado de una orden (disponible para el administrador)
  router.put('/admin/orders/:id', authenticate, isAdmin, async (req, res) => {
    const { status } = req.body;
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) {
        console.log(`Orden con ID ${req.params.id} no encontrada`);
        return res.status(404).json({ message: 'Orden no encontrada' });
      }
  
      order.status = status;
      await order.save();
  
      // Log para emitir el evento WebSocket
      console.log(`Emitir evento orderUpdated para orden ${order.id} con estado ${status}`);
      io.emit('orderUpdated', order);
  
      res.json(order);
    } catch (error) {
      console.error('Error actualizando el estado de la orden:', error.message);
      res.status(500).json({ message: 'Error actualizando el estado de la orden' });
    }
  });
  // Ruta para crear una nueva orden
  router.post('/', authenticate, async (req, res) => {
    const { disponibilidad_id, total } = req.body;
    try {
      if (!disponibilidad_id || !total) {
        return res.status(400).json({ message: 'disponibilidad_id y total son requeridos' });
      }

      const disponibilidad = await Disponibilidad.findByPk(disponibilidad_id, {
        include: [{ model: Servicio, as: 'servicio' }]  
      });
      if (!disponibilidad || !disponibilidad.disponible) {
        return res.status(400).json({ message: 'Disponibilidad no válida o no disponible' });
      }

      const newOrder = await Order.create({
        user_id: req.user.id,
        disponibilidad_id,
        total,
        status: 'pendiente'
      });

      // Marcar la disponibilidad como no disponible
      disponibilidad.disponible = false;
      await disponibilidad.save();

      // Emitir el evento de nueva orden creada al cliente usando el mismo nombre que en el cliente
      io.emit('orderCreated', newOrder);

      res.status(201).json(newOrder);
    } catch (error) {
      console.error('Error creando la orden:', error.message);
      res.status(500).json({ message: 'Error creando la orden' });
    }
  });

  // Nueva ruta para obtener una orden por ID
  router.get('/:id', authenticate, async (req, res) => {
    try {
      const order = await Order.findByPk(req.params.id, {
        include: [
          { model: Disponibilidad, as: 'disponibilidad', include: [{ model: Servicio, as: 'servicio' }] },
          { model: User, as: 'user', attributes: ['nombre', 'email'] }
        ]
      });

      if (!order) {
        return res.status(404).json({ message: 'Orden no encontrada' });
      }

      res.json(order);
    } catch (error) {
      console.error('Error obteniendo la orden:', error.message);
      res.status(500).json({ message: 'Error obteniendo la orden' });
    }
  });

  // Ruta para obtener las órdenes del usuario autenticado
  router.get('/', authenticate, async (req, res) => {
    try {
      const orders = await Order.findAll({
        where: { user_id: req.user.id },
        include: [
          { model: Disponibilidad, as: 'disponibilidad', include: [{ model: Servicio, as: 'servicio' }] },
          { model: User, as: 'user', attributes: ['nombre', 'email'] }
        ]
      });

      res.json(orders);
    } catch (error) {
      console.error('Error obteniendo las órdenes:', error.message);
      res.status(500).json({ message: 'Error obteniendo las órdenes' });
    }
  });

  // Ruta para actualizar el estado de una orden
  router.put('/:id', async (req, res) => {
    const { status } = req.body;
    try {
      const order = await Order.findByPk(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Orden no encontrada' });
      }

      order.status = status;
      await order.save();

      io.emit('orderUpdated', order);

      res.json(order);
    } catch (error) {
      console.error('Error actualizando la orden:', error.message);
      res.status(400).json({ message: error.message });
    }
  });

  return router;
};
