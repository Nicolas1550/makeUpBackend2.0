const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Asegúrate de que la ruta sea correcta

// Ruta para obtener todos los usuarios (ya existente)
router.get('/', async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

// Ruta para crear un nuevo usuario
router.post('/', async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Ruta para actualizar el rol de un usuario
router.patch('/updateRole/:id', async (req, res) => {
    const { role } = req.body;
    if (!role) {
        return res.status(400).json({ message: "Role is required" });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;