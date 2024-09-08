const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Servicio = require('../models/Services'); 
const passport = require('passport');
const Role = require('../models/Role');

module.exports = (io) => {
  // Ruta para obtener todos los usuarios
  router.get('/roles/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [{
          model: Role,
          attributes: ['id', 'nombre'], 
          through: { attributes: [] }, 
        }],
      });

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      res.json(user.Roles); 
    } catch (error) {
      console.error('Error fetching user roles:', error.message);
      res.status(500).json({ message: 'Error fetching user roles' });
    }
  });

// Ruta para obtener los roles de todos los usuarios
router.get('/roles', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Role,
        as: 'rolesAssociation',  
        attributes: ['id', 'nombre'], 
        through: { attributes: [] }, 
      }],
    });

    // Mapea los usuarios con sus roles
    const usersWithRoles = users.map(user => ({
      userId: user.id,
      roles: user.rolesAssociation ? user.rolesAssociation.map(role => role.nombre) : []
    }));

    res.json(usersWithRoles);
  } catch (error) {
    console.error('Error fetching users roles:', error.message);
    res.status(500).json({ message: 'Error fetching users roles' });
  }
});

// Ruta para obtener todos los usuarios con sus roles
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Role,
        as: 'rolesAssociation',  
        attributes: ['id', 'nombre'], 
        through: { attributes: [] }, 
      }],
    });

    console.log("Usuarios obtenidos con sus roles:", users.map(user => ({
      nombre: user.nombre,
      roles: user.rolesAssociation ? user.rolesAssociation.map(role => role.nombre) : [] 
    })));

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users' });
  }
});


// Ruta para asignar el rol de empleado a un usuario
router.patch('/assignRoles/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const { roles } = req.body;

  if (!roles || !Array.isArray(roles)) {
    return res.status(400).json({ message: 'Se deben proporcionar roles válidos' });
  }

  try {
    const user = await User.findByPk(req.params.id, {
      include: [{
        model: Role,
        as: 'rolesAssociation', 
        attributes: ['id', 'nombre'],
        through: { attributes: [] },
      }],
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }


    const rolesArray = await Role.findAll({ where: { nombre: roles } });

    if (rolesArray.length === 0) {
      return res.status(404).json({ message: 'Roles no encontrados' });
    }

    // Asignar roles al usuario usando el alias correcto 'rolesAssociation'
    await user['setRolesAssociation'](rolesArray);  

    // Volver a consultar el usuario con los roles actualizados
    const updatedUser = await User.findByPk(req.params.id, {
      include: [{
        model: Role,
        as: 'rolesAssociation', 
        attributes: ['id', 'nombre'],
        through: { attributes: [] },
      }],
      raw: false, // Asegurarse de que las asociaciones funcionen correctamente
    });

    if (!updatedUser || !updatedUser.rolesAssociation || updatedUser.rolesAssociation.length === 0) {
      return res.status(500).json({ message: 'No se pudieron recuperar los roles asignados' });
    }


    io.emit('userRolesUpdated', updatedUser);
    res.json(updatedUser); // Devolver el usuario con los roles actualizados
  } catch (error) {
    console.error('Error asignando roles:', error);
    res.status(500).json({ message: 'Error al asignar roles', error: error.message });
  }
});

 // Ruta para desasignar el rol de empleado de un usuario
router.patch('/removeRole/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    // Log para ver los datos del usuario autenticado

    // Convertir el ID a entero para asegurar una comparación correcta
    const userIdFromParams = parseInt(req.params.id, 10);
    const userIdFromReq = parseInt(req.user.id, 10);

    // Log para ver el ID de los parámetros y del usuario autenticado

    // Verificar si el usuario autenticado NO es administrador y NO es el propio usuario
    if (!req.user.rolesAssociation.some(role => role.nombre === 'admin') && userIdFromReq !== userIdFromParams) {
      return res.status(403).json({ message: 'Acceso denegado: solo los administradores o el propio usuario pueden desasignar roles.' });
    }

    // Buscar el usuario que se va a modificar
    const userToUpdate = await User.findByPk(userIdFromParams, {
      include: [{
        model: Role,
        as: 'rolesAssociation',  
        attributes: ['id', 'nombre'],
        through: { attributes: [] }, 
      }]
    });

    if (!userToUpdate) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }


    // Verificar si el usuario tiene el rol "empleado"
    const empleadoRole = await Role.findOne({ where: { nombre: 'empleado' } });
    if (!empleadoRole) {
      return res.status(404).json({ message: 'Rol de empleado no encontrado' });
    }

    // Remover el rol "empleado" del usuario usando el alias correcto para la asociación
    await userToUpdate['removeRolesAssociation'](empleadoRole);  

    // Emitir evento WebSocket si la operación fue exitosa
    io.emit('userRoleUpdated', userToUpdate);
    res.json({ message: 'Rol empleado removido exitosamente' });
  } catch (error) {
    console.error('Error al remover el rol del usuario:', error.message);
    res.status(500).json({ message: 'Error al remover el rol del usuario', error: error.message });
  }
});

  
router.get('/empleados/disponibles/:serviceId', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { serviceId } = req.params;


    // Obtener el rol de "empleado"
    const empleadoRole = await Role.findOne({ where: { nombre: 'empleado' } });
    if (!empleadoRole) {
      return res.status(404).json({ message: 'Rol de empleado no encontrado' });
    }


    let empleadosDisponibles;

    if (serviceId === 'general') {
      // Devolver todos los empleados con rol de "empleado"
      empleadosDisponibles = await User.findAll({
        include: [
          {
            model: Role,
            as: 'rolesAssociation', 
            where: { id: empleadoRole.id }, 
            attributes: ['id', 'nombre'],
            through: { attributes: [] }, 
          },
        ],
      });
    } else {
      // Verificar si el servicio existe
      const servicio = await Servicio.findByPk(serviceId);
      if (!servicio) {
        return res.status(404).json({ message: `Servicio con ID ${serviceId} no encontrado` });
      }


      // Obtener empleados que no están asignados al servicio actual
      empleadosDisponibles = await User.findAll({
        include: [
          {
            model: Role,
            as: 'rolesAssociation', 
            where: { id: empleadoRole.id }, 
            attributes: ['id', 'nombre'],
            through: { attributes: [] }, 
          },
          {
            model: Servicio,
            as: 'userServicesAssociation', 
            attributes: ['id'],
            through: { attributes: [] }, 
            required: false,
            where: {
              id: { [Op.ne]: serviceId }, 
            },
          },
        ],
      });
    }

    if (!empleadosDisponibles || empleadosDisponibles.length === 0) {
      return res.status(200).json({ message: 'No hay empleados disponibles' });
    }

    res.json(empleadosDisponibles); 
  } catch (error) {
    console.error('Error fetching available empleados:', error.message);
    res.status(500).json({ message: 'Error fetching available empleados' });
  }
});

  


  return router;
};
