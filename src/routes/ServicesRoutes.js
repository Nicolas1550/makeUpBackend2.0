const express = require('express');
const Servicio = require('../models/Services');
const User = require('../models/User');
const Role = require('../models/Role'); 
const passport = require('passport');
const router = express.Router();

// Recibe `io` para poder emitir eventos WebSocket
module.exports = (io) => {

  // **Nuevo**: Ruta para asignar un empleado a un servicio
  router.post('/assignToService', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { userId, serviceId } = req.body;
  
    try {
  
      // Verificar si el usuario tiene el rol de 'empleado'
      const user = await User.findByPk(userId, {
        include: [{
          model: Role,
          as: 'rolesAssociation', 
          where: { nombre: 'empleado' }
        }],
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Usuario no encontrado o no es un empleado.' });
      }
  
      // Verificar si el servicio existe
      const servicio = await Servicio.findByPk(serviceId);
      if (!servicio) {
        return res.status(404).json({ message: 'Servicio no encontrado.' });
      }
  
      // Asignar el empleado al servicio usando el alias correcto para la relación
      await servicio.addServiceUsersAssociation(user); 
  
      // Emitir evento WebSocket para notificar a los clientes
      const payload = { user, servicio };
  
      io.emit('empleadoAsignado', payload);
  
      res.json({ user, servicio });
    } catch (error) {
      console.error('Error asignando empleado al servicio:', error.message);
      res.status(500).json({ message: 'Error asignando empleado al servicio' });
    }
  });
  
  
 
  // **Nuevo**: Ruta para desasignar un empleado de un servicio
  router.post('/removeFromService', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { userId, serviceId } = req.body;

    try {

      // Encontrar el usuario con su rol de empleado
      const user = await User.findByPk(userId, {
        include: [{ model: Role, as: 'rolesAssociation', where: { nombre: 'empleado' } }],
      });

      if (!user) {
        return res.status(400).json({ message: 'Usuario no encontrado o no es un empleado.' });
      }

      // Encontrar el servicio
      const servicio = await Servicio.findByPk(serviceId);
      if (!servicio) {
        return res.status(404).json({ message: 'Servicio no encontrado.' });
      }

      // Usar el método correcto que corresponde al alias `userServicesAssociation`
      await user.removeUserServicesAssociation(servicio); 

      // Verificar el payload antes de emitir el evento
      const payload = { user, servicio };

      // Emitir evento WebSocket para notificar a los clientes
      io.emit('empleadoDesasignado', payload);

      res.json({ user, servicio });
    } catch (error) {
      console.error('Error desasignando empleado del servicio:', error.message);
      res.status(500).json({ message: 'Error desasignando empleado del servicio' });
    }
  });


  // Ruta para obtener todos los servicios
  router.get('/', async (req, res) => {
    try {
      const servicios = await Servicio.findAll();
      res.json(servicios);
    } catch (error) {
      console.error('Error fetching servicios:', error.message);
      res.status(500).json({ message: 'Error fetching servicios' });
    }
  });

  // Ruta para agregar un nuevo servicio (solo para administradores)
  router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { nombre, descripcion, precio } = req.body;
    try {
      if (!nombre || !precio) {
        return res.status(400).json({ message: 'Nombre y precio son obligatorios' });
      }

      const nuevoServicio = await Servicio.create({ nombre, descripcion, precio });
      res.status(201).json(nuevoServicio);
    } catch (error) {
      console.error('Error adding servicio:', error.message);
      res.status(400).json({ message: error.message });
    }
  });

  // Ruta para obtener los usuarios asignados a un servicio específico
  router.get('/services/:serviceId/users', async (req, res) => {
    const { serviceId } = req.params;
  
    try {
      const servicio = await Servicio.findByPk(serviceId);
  
      if (!servicio) {
        return res.status(404).json({ message: `Servicio con ID ${serviceId} no encontrado` });
      }
  
  
      // Usa el alias correcto 'serviceUsersAssociation' para obtener los usuarios relacionados
      const users = await servicio.getServiceUsersAssociation({ 
        include: [{
          model: Role,
          as: 'rolesAssociation',  
          where: { nombre: 'empleado' },
        }],
        through: { attributes: [] },
      });
  
      return res.status(200).json(users || []);
    } catch (error) {
      console.error(`Error fetching service users for service ID ${serviceId}:`, error.message);
      return res.status(500).json({ message: 'Error al obtener los usuarios del servicio' });
    }
  });
  

  // Ruta para obtener un servicio específico por su ID
  router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const servicio = await Servicio.findByPk(id);
      if (!servicio) {
        return res.status(404).json({ message: 'Servicio no encontrado' });
      }
      res.json(servicio);
    } catch (error) {
      console.error('Error fetching servicio:', error.message);
      res.status(500).json({ message: 'Error al obtener el servicio' });
    }
  });

  return router;
};
