// middleware/isAdmin.js

function isAdmin(req, res, next) {
    console.log("Verificando rol de usuario:", req.user);
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }
}

module.exports = isAdmin;
