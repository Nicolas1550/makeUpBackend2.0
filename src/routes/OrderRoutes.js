const express = require('express');
const { query } = require('../db'); // Usamos query para consultas SQL directas
const authenticate = require('../middleware/auth');
const isAdmin = require('../middleware/IsAdmin');

module.exports = function (io) {
  const router = express.Router();

  // Ruta para obtener todas las órdenes para el administrador, ordenadas por fecha de creación
  router.get('/admin/orders', authenticate, isAdmin, async (req, res) => {
    try {
      const orders = await query(`
        SELECT o.*, u.nombre AS user_name, u.email AS user_email, d.fecha AS disponibilidad_fecha, s.nombre AS servicio_nombre
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN disponibilidades d ON o.disponibilidad_id = d.id
        JOIN servicios s ON d.servicio_id = s.id
        ORDER BY o.createdAt ASC
      `);

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
      const [order] = await query(`
        SELECT * FROM orders WHERE id = ?
      `, [req.params.id]);

      if (!order) {
        return res.status(404).json({ message: 'Orden no encontrada' });
      }

      await query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);

      const [updatedOrder] = await query(`
        SELECT o.*, u.nombre AS user_name, u.email AS user_email, d.fecha AS disponibilidad_fecha, s.nombre AS servicio_nombre
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN disponibilidades d ON o.disponibilidad_id = d.id
        JOIN servicios s ON d.servicio_id = s.id
        WHERE o.id = ?
      `, [req.params.id]);

      io.emit('orderUpdated', updatedOrder);

      res.json(updatedOrder);
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

      const [disponibilidad] = await query(`
        SELECT d.*, s.nombre AS servicio_nombre 
        FROM disponibilidades d
        JOIN servicios s ON d.servicio_id = s.id
        WHERE d.id = ? AND d.disponible = 1
      `, [disponibilidad_id]);

      if (!disponibilidad) {
        return res.status(400).json({ message: 'Disponibilidad no válida o no disponible' });
      }

      const newOrder = await query(`
        INSERT INTO orders (user_id, disponibilidad_id, total, status) VALUES (?, ?, ?, 'pendiente')
      `, [req.user.id, disponibilidad_id, total]);

      await query('UPDATE disponibilidades SET disponible = 0 WHERE id = ?', [disponibilidad_id]);

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
      const [order] = await query(`
        SELECT o.*, u.nombre AS user_name, u.email AS user_email, d.fecha AS disponibilidad_fecha, s.nombre AS servicio_nombre
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN disponibilidades d ON o.disponibilidad_id = d.id
        JOIN servicios s ON d.servicio_id = s.id
        WHERE o.id = ?
      `, [req.params.id]);

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
      const orders = await query(`
        SELECT o.*, u.nombre AS user_name, u.email AS user_email, d.fecha AS disponibilidad_fecha, s.nombre AS servicio_nombre
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN disponibilidades d ON o.disponibilidad_id = d.id
        JOIN servicios s ON d.servicio_id = s.id
        WHERE o.user_id = ?
      `, [req.user.id]);

      res.json(orders);
    } catch (error) {
      console.error('Error obteniendo las órdenes:', error.message);
      res.status(500).json({ message: 'Error obteniendo las órdenes' });
    }
  });

  // Ruta para actualizar el estado de una orden
  router.put('/:id', authenticate, async (req, res) => {
    const { status } = req.body;
    try {
      const [order] = await query('SELECT * FROM orders WHERE id = ?', [req.params.id]);

      if (!order) {
        return res.status(404).json({ message: 'Orden no encontrada' });
      }

      await query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);

      const [updatedOrder] = await query('SELECT * FROM orders WHERE id = ?', [req.params.id]);

      io.emit('orderUpdated', updatedOrder);

      res.json(updatedOrder);
    } catch (error) {
      console.error('Error actualizando la orden:', error.message);
      res.status(500).json({ message: 'Error al actualizar la orden' });
    }
  });

  return router;
};
