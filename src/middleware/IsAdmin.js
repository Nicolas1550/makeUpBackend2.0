function isAdmin(req, res, next) {
  // Verifica si el usuario autenticado existe
  console.log("Middleware isAdmin: verificando si req.user está definido");

  if (!req.user) {
    console.error("Error: req.user no está definido");
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  console.log("Middleware isAdmin: req.user.rolesAssociation:", req.user.rolesAssociation);

  // Verifica si rolesAssociation está definido
  if (!req.user.rolesAssociation) {
    console.error("Error: rolesAssociation no está definido para el usuario");
    return res.status(403).json({ message: "Acceso denegado. No se han encontrado roles asociados." });
  }

  // Verifica si el usuario tiene el rol de 'admin'
  if (req.user.rolesAssociation.some(role => role.nombre === 'admin')) {
    console.log("Middleware isAdmin: el usuario es admin, permitiendo acceso");
    next(); // Permitir el acceso si es admin
  } else {
    console.log("Middleware isAdmin: el usuario no es admin, acceso denegado");
    res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
  }
}

module.exports = isAdmin;
