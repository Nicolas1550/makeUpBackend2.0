const express = require('express');
const router = express.Router();
const passport = require('passport');
const { query } = require('../db'); // Conexión directa a la base de datos

module.exports = (io) => {
  // Ruta para obtener los roles de un usuario por ID
  router.get('/roles/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const userId = req.params.id;

      // Consulta SQL para obtener los roles del usuario
      const rolesQuery = `
        SELECT r.id, r.nombre
        FROM user_roles ur
        JOIN roles r ON ur.RoleId = r.id
        WHERE ur.UserId = ?
      `;

      const roles = await query(rolesQuery, [userId]);

      if (roles.length === 0) {
        return res.status(404).json({ message: 'Usuario no encontrado o sin roles asignados' });
      }

      res.json(roles);
    } catch (error) {
      console.error('Error fetching user roles:', error.message);
      res.status(500).json({ message: 'Error al obtener roles del usuario' });
    }
  });

  // Ruta para obtener los roles de todos los usuarios
  router.get('/roles', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const usersQuery = `
      SELECT u.id as userId, u.nombre, u.apellido, u.email, u.telefono, GROUP_CONCAT(r.nombre) AS roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.UserId
      LEFT JOIN roles r ON ur.RoleId = r.id
      GROUP BY u.id
    `;

      const usersWithRoles = await query(usersQuery);

      res.json(usersWithRoles.map(user => ({
        userId: user.userId,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        roles: user.roles ? user.roles.split(',') : []
      })));
    } catch (error) {
      console.error('Error fetching users roles:', error.message);
      res.status(500).json({ message: 'Error al obtener roles de los usuarios' });
    }
  });


  // Ruta para obtener todos los usuarios con sus roles
  // Ruta para obtener todos los usuarios con sus roles
  router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const usersQuery = `
      SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, GROUP_CONCAT(r.nombre) AS roles
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.UserId
      LEFT JOIN roles r ON ur.RoleId = r.id
      GROUP BY u.id
    `;

      const users = await query(usersQuery);

      res.json(users.map(user => ({
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        roles: user.roles ? user.roles.split(',') : []
      })));
    } catch (error) {
      console.error('Error fetching users:', error.message);
      res.status(500).json({ message: 'Error al obtener usuarios' });
    }
  });

  // Ruta para asignar roles a un usuario
  // Ruta para asignar roles a un usuario
  router.patch('/assignRoles/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { roles } = req.body;

    console.log('Roles recibidos:', roles);

    if (!roles || !Array.isArray(roles)) {
      return res.status(400).json({ message: 'Se deben proporcionar roles válidos' });
    }

    try {
      const userId = req.params.id;

      console.log('Asignando roles para el usuario con ID:', userId);

      // Eliminar roles actuales
      const deleteRolesQuery = `DELETE FROM user_roles WHERE UserId = ?`;
      await query(deleteRolesQuery, [userId]);
      console.log('Roles actuales eliminados para el usuario con ID:', userId);

      // Asegurarnos de que el array de roles se pase correctamente
      const rolesList = roles.join(', ');
      console.log('Lista de roles que se buscarán en la base de datos:', rolesList);

      // Verificar los roles en la base de datos
      const roleQuery = `SELECT id, nombre FROM roles WHERE nombre IN (${roles.map(() => '?').join(', ')})`;
      console.log('Consulta SQL que se ejecutará:', roleQuery);

      const rolesToAssign = await query(roleQuery, roles); // Pasar los roles directamente

      console.log('Roles encontrados en la base de datos:', rolesToAssign);

      // Si no encuentra roles, devolver error
      if (!rolesToAssign || rolesToAssign.length === 0) {
        return res.status(404).json({ message: 'Algunos o todos los roles no fueron encontrados' });
      }

      // Asignar nuevos roles
      const insertRolesQuery = `
      INSERT INTO user_roles (UserId, RoleId, createdAt, updatedAt) 
      VALUES ${rolesToAssign.map(() => '(?, ?, NOW(), NOW())').join(',')}
    `;
      const insertData = rolesToAssign.flatMap(role => [userId, role.id]);
      await query(insertRolesQuery, insertData);

      io.emit('userRolesUpdated', { userId, roles: rolesToAssign.map(role => role.nombre) });
      res.json({ message: 'Roles asignados con éxito' });
    } catch (error) {
      console.error('Error asignando roles:', error);
      res.status(500).json({ message: 'Error al asignar roles', error: error.message });
    }
  });


  // Ruta para remover el rol de "empleado" de un usuario
  router.patch('/removeRole/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const userId = parseInt(req.params.id, 10);

      // Verificar si el usuario tiene el rol de "empleado"
      const empleadoRoleQuery = `SELECT id FROM roles WHERE nombre = 'empleado'`;
      const [empleadoRole] = await query(empleadoRoleQuery);

      if (!empleadoRole) {
        return res.status(404).json({ message: 'Rol de empleado no encontrado' });
      }

      // Remover el rol de "empleado"
      const deleteRoleQuery = `DELETE FROM user_roles WHERE UserId = ? AND RoleId = ?`;
      await query(deleteRoleQuery, [userId, empleadoRole.id]);

      io.emit('userRoleUpdated', { userId });
      res.json({ message: 'Rol de empleado removido con éxito' });
    } catch (error) {
      console.error('Error removiendo el rol del usuario:', error.message);
      res.status(500).json({ message: 'Error al remover el rol del usuario', error: error.message });
    }
  });

  // Ruta para obtener empleados disponibles
  router.get('/empleados/disponibles/:serviceId', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
      const { serviceId } = req.params;

      // Obtener el rol de "empleado"
      const empleadoRoleQuery = `SELECT id FROM roles WHERE nombre = 'empleado'`;
      const [empleadoRole] = await query(empleadoRoleQuery);

      if (!empleadoRole) {
        return res.status(404).json({ message: 'Rol de empleado no encontrado' });
      }

      let empleadosDisponibles;
      if (serviceId === 'general') {
        // Obtener todos los empleados con el rol de "empleado"
        const empleadosQuery = `
          SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, u.foto
          FROM users u
          JOIN user_roles ur ON u.id = ur.UserId
          WHERE ur.RoleId = ?
        `;
        empleadosDisponibles = await query(empleadosQuery, [empleadoRole.id]);
      } else {
        // Obtener empleados que no estén asignados al servicio actual
        const empleadosQuery = `
          SELECT u.id, u.nombre, u.apellido, u.email, u.telefono, u.foto
          FROM users u
          JOIN user_roles ur ON u.id = ur.UserId
          LEFT JOIN userservices us ON u.id = us.UserId AND us.ServicioId = ?
          WHERE ur.RoleId = ? AND us.ServicioId IS NULL
        `;
        empleadosDisponibles = await query(empleadosQuery, [serviceId, empleadoRole.id]);
      }

      if (!empleadosDisponibles.length) {
        return res.status(200).json({ message: 'No hay empleados disponibles' });
      }

      // Enviar la lista de empleados disponibles con todos sus detalles
      res.json(empleadosDisponibles);
    } catch (error) {
      console.error('Error fetching available empleados:', error.message);
      res.status(500).json({ message: 'Error al obtener empleados disponibles' });
    }
  });


  return router;
};
