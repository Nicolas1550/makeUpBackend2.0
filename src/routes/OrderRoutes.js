// routes/OrderRoutes.js
const express = require('express');
const Order = require('../models/Order');
const Disponibilidad = require('../models/Disponibilidad');
const User = require('../models/User');
const authenticate = require('../middleware/auth');

module.exports = function (io) {
  const router = express.Router();

  // Ruta para crear una nueva orden
  router.post('/', authenticate, async (req, res) => {
    const { disponibilidad_id, total } = req.body;
    try {
      if (!disponibilidad_id || !total) {
        return res.status(400).json({ message: 'disponibilidad_id y total son requeridos' });
      }

      const disponibilidad = await Disponibilidad.findByPk(disponibilidad_id);
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
      console.log("Emitiendo evento 'orderCreated' con datos:", newOrder);
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
          { model: Disponibilidad, as: 'disponibilidad' },
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
          { model: Disponibilidad, as: 'disponibilidad' },
          { model: User, as: 'user', attributes: ['nombre', 'email'] }
        ]
      });

      console.log("Órdenes obtenidas para el usuario:", orders);
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

      console.log("Emitiendo evento 'orderUpdated' con datos:", order);
      io.emit('orderUpdated', order);

      res.json(order);
    } catch (error) {
      console.error('Error actualizando la orden:', error.message);
      res.status(400).json({ message: error.message });
    }
  });

  return router;
};
