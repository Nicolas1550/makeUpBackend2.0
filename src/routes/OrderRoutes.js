// routes/OrderRoutes.js
const express = require('express');
const Order = require('../models/Order');
const Disponibilidad = require('../models/Disponibilidad');
const User = require('../models/User');
const router = express.Router();
const authenticate = require('../middleware/auth');

// Ruta para obtener todas las órdenes
router.post('/', authenticate, async (req, res) => {
  const { disponibilidad_id, total } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: 'Usuario no autenticado' });
  }

  try {
    // Validar disponibilidad y crear la orden
    const disponibilidad = await Disponibilidad.findByPk(disponibilidad_id);
    if (!disponibilidad || !disponibilidad.disponible) {
      return res.status(400).json({ message: 'Disponibilidad no válida o no disponible' });
    }

    const newOrder = await Order.create({
      user_id: req.user.id,
      disponibilidad_id,
      total,
      status: 'pendiente',
    });

    // Marcar la disponibilidad como no disponible
    disponibilidad.disponible = false;
    await disponibilidad.save();

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creando la orden:', error.message);
    res.status(500).json({ message: 'Error creando la orden' });
  }
});
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
      user_id: req.user.id, // Usar el id del usuario autenticado
      disponibilidad_id,
      total,
      status: 'pendiente'
    });

    // Marcar la disponibilidad como no disponible
    disponibilidad.disponible = false;
    await disponibilidad.save();

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(400).json({ message: error.message });
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
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;