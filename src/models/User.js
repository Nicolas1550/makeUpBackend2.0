// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: String,
    email: String,
    googleId: String,
    role: { type: String, default: 'user' }, // 'admin' para los administradores
});

module.exports = mongoose.model('User', userSchema);
