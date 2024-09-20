function isAdmin(req, res, next) {
    // Log de depuración para ver si rolesAssociation se asigna correctamente
    console.log("Roles del usuario autenticado:", req.user.rolesAssociation);
  
    // Verifica si el usuario tiene el rol de 'admin'
    if (req.user && req.user.rolesAssociation && req.user.rolesAssociation.some(role => role.nombre === 'admin')) {
      next(); // Permitir el acceso si es admin
    } else {
      res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' }); // Acceso denegado si no es admin
    }
  }
  
  module.exports = isAdmin;
  