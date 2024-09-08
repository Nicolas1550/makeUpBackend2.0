function isAdmin(req, res, next) {

    // Verifica si el usuario tiene la propiedad rolesAssociation
    if (req.user && req.user.rolesAssociation && req.user.rolesAssociation.some(role => role.nombre === 'admin')) {
        next(); 
    } else {
        res.status(403).send({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }
}

module.exports = isAdmin;
