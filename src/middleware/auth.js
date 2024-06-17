// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header not provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id); // Cambiado a findByPk
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = { id: user.id, role: user.role }; // Adjuntar usuario autenticado a la solicitud
        next();
    } catch (error) {
        console.error('Error authenticating user:', error.message);
        res.status(401).json({ message: 'Authentication failed' });
    }
};

module.exports = authenticate;
