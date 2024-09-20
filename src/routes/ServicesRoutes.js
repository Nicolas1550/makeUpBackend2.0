const express = require('express');
const passport = require('passport');
const router = express.Router();
const { query } = require('../db'); // Conexión directa a la base de datos

// Recibe `io` para poder emitir eventos WebSocket
module.exports = (io) => {

  // Ruta para asignar un empleado a un servicio
  // Ruta para asignar un empleado a un servicio
  router.post('/assignToService', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { userId, serviceId } = req.body;

    console.log('Datos recibidos en el backend:', { userId, serviceId });

    try {
      // Verificar si el usuario tiene el rol de 'empleado'
      const empleadoQuery = `
      SELECT u.id, u.nombre, u.apellido, u.email
      FROM users u
      JOIN user_roles ur ON u.id = ur.UserId
      JOIN roles r ON ur.RoleId = r.id
      WHERE u.id = ? AND r.nombre = 'empleado'
    `;
      const empleado = await query(empleadoQuery, [userId]);

      if (!empleado.length) {
        return res.status(400).json({ message: 'Usuario no encontrado o no es un empleado.' });
      }

      // Verificar si el servicio existe
      const servicioQuery = `SELECT id, nombre FROM servicios WHERE id = ?`;
      const servicio = await query(servicioQuery, [serviceId]);

      if (!servicio.length) {
        return res.status(404).json({ message: 'Servicio no encontrado.' });
      }

      // Verificar si la relación ya existe en la tabla `userservices`
      const existingRelationQuery = `SELECT * FROM userservices WHERE userId = ? AND serviceId = ?`;
      const existingRelation = await query(existingRelationQuery, [userId, serviceId]);

      if (existingRelation.length) {
        return res.status(400).json({ message: 'El empleado ya está asignado a este servicio.' });
      }

      // Asignar el empleado al servicio en la tabla `userservices`
      const assignQuery = `INSERT INTO userservices (userId, serviceId, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())`;
      await query(assignQuery, [userId, serviceId]);

      // Enviar el usuario y servicio completos en lugar de solo los IDs
      const payload = { user: empleado[0], servicio: servicio[0] };
      console.log('Asignación exitosa:', payload);
      io.emit('empleadoAsignado', payload);
      res.json(payload);
    } catch (error) {
      console.error('Error asignando empleado al servicio:', error.message);
      res.status(500).json({ message: 'Error asignando empleado al servicio' });
    }
  });





  // Ruta para desasignar un empleado de un servicio
  router.post('/removeFromService', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { userId, serviceId } = req.body;

    console.log('Datos recibidos en el backend para desasignar:', { userId, serviceId });

    try {
      // Verificar si el usuario es un empleado
      const empleadoQuery = `
      SELECT u.id, u.nombre, u.apellido, u.email
      FROM users u
      JOIN user_roles ur ON u.id = ur.UserId
      JOIN roles r ON ur.RoleId = r.id
      WHERE u.id = ? AND r.nombre = 'empleado'
    `;
      const empleado = await query(empleadoQuery, [userId]);

      if (!empleado.length) {
        return res.status(400).json({ message: 'Usuario no encontrado o no es un empleado.' });
      }

      // Verificar si el servicio existe
      const servicioQuery = `SELECT id, nombre FROM servicios WHERE id = ?`;
      const servicio = await query(servicioQuery, [serviceId]);

      if (!servicio.length) {
        return res.status(404).json({ message: 'Servicio no encontrado.' });
      }

      // Remover la relación entre el usuario y el servicio en la tabla `userservices`
      const removeQuery = `DELETE FROM userservices WHERE userId = ? AND serviceId = ?`; // Cambiar ServicioId a serviceId
      await query(removeQuery, [userId, serviceId]);

      // Enviar los objetos completos del usuario y servicio en lugar de solo los IDs
      const payload = { user: empleado[0], servicio: servicio[0] };
      console.log('Desasignación exitosa:', payload);

      io.emit('empleadoDesasignado', payload);
      res.json(payload);  // Enviar los datos completos al frontend
    } catch (error) {
      console.error('Error desasignando empleado del servicio:', error.message);
      res.status(500).json({ message: 'Error desasignando empleado del servicio' });
    }
  });


  // Ruta para obtener todos los servicios
  router.get('/', async (req, res) => {
    try {
      const serviciosQuery = `SELECT * FROM servicios`;
      const servicios = await query(serviciosQuery);
      res.json(servicios);
    } catch (error) {
      console.error('Error fetching servicios:', error.message);
      res.status(500).json({ message: 'Error fetching servicios' });
    }
  });

  // Ruta para agregar un nuevo servicio
  router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { nombre, descripcion, precio } = req.body;

    if (!nombre || !precio) {
      return res.status(400).json({ message: 'Nombre y precio son obligatorios' });
    }

    try {
      const createServiceQuery = `INSERT INTO servicios (nombre, descripcion, precio) VALUES (?, ?, ?)`;
      const nuevoServicio = await query(createServiceQuery, [nombre, descripcion, precio]);
      res.status(201).json(nuevoServicio);
    } catch (error) {
      console.error('Error adding servicio:', error.message);
      res.status(400).json({ message: 'Error al agregar servicio', error: error.message });
    }
  });

// Ruta para obtener los usuarios asignados a un servicio específico
router.get('/services/:serviceId/users', async (req, res) => {
  const { serviceId } = req.params;

  try {
    // Verificar si el servicio existe
    const servicioQuery = `SELECT id FROM servicios WHERE id = ?`;
    const servicio = await query(servicioQuery, [serviceId]);

    if (!servicio.length) {
      return res.status(404).json({ message: 'Servicio no encontrado.' });
    }

    // Obtener los empleados asignados al servicio, incluyendo toda la información relevante del usuario
    const usersQuery = `
      SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, u.foto, GROUP_CONCAT(r.nombre) AS roles
      FROM users u
      JOIN userservices us ON u.id = us.userId  -- Cambiar ServicioId a serviceId
      JOIN user_roles ur ON u.id = ur.UserId
      JOIN roles r ON ur.RoleId = r.id
      WHERE us.serviceId = ? AND r.nombre = 'empleado'  -- Filtrar por el rol 'empleado'
      GROUP BY u.id
    `;

    const users = await query(usersQuery, [serviceId]);

    // Mapear la respuesta para incluir los roles como un array y devolver la información completa del usuario
    const result = users.map(user => ({
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      telefono: user.telefono,
      foto: user.foto,
      roles: user.roles ? user.roles.split(',') : []  // Convertir los roles en un array
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching service users:', error.message);
    res.status(500).json({ message: 'Error al obtener los usuarios del servicio' });
  }
});


  // Ruta para obtener un servicio por ID
  router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const servicioQuery = `SELECT * FROM servicios WHERE id = ?`;
      const servicio = await query(servicioQuery, [id]);

      if (!servicio.length) {
        return res.status(404).json({ message: 'Servicio no encontrado' });
      }

      res.json(servicio[0]);
    } catch (error) {
      console.error('Error fetching servicio:', error.message);
      res.status(500).json({ message: 'Error al obtener el servicio' });
    }
  });

  return router;
};
