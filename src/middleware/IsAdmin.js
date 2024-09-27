function isAdmin(req, res, next) {
  // Verifica si el usuario autenticado existe

  if (!req.user) {
    console.error("Error: req.user no está definido");
    return res.status(401).json({ message: "Usuario no autenticado" });
  }


  // Verifica si rolesAssociation está definido
  if (!req.user.rolesAssociation) {
    console.error("Error: rolesAssociation no está definido para el usuario");
    return res.status(403).json({ message: "Acceso denegado. No se han encontrado roles asociados." });
  }

  // Verifica si el usuario tiene el rol de 'admin'
  if (req.user.rolesAssociation.some(role => role.nombre === 'admin')) {
    next(); // Permitir el acceso si es admin
  } else {
    res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
  }
}

module.exports = isAdmin;
