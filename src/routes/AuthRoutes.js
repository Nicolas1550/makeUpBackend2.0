const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken'); // Asegúrate de tener instalado este paquete
const router = express.Router();
const User = require('../models/User'); // Importa tu modelo de usuario
require('dotenv').config();


// Configuración de la Estrategia de Google
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://cbd2-179-62-88-219.ngrok-free.app/auth/google/callback",
    scope: ['profile', 'email']
},
    async function (accessToken, refreshToken, profile, done) {
        try {
            let user = await User.findOne({ googleId: profile.id }).exec();
            if (!user) {
                user = new User({
                    nombre: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id
                    // otros campos que quieras guardar
                });
                await user.save();
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }
));

// Rutas de autenticación de Google
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

// Rutas de autenticación de Google
router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }

        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET);
        console.log(`Token JWT creado: ${token}`); // Log aquí
        res.redirect(`http://localhost:3000/?token=${token}`);
    })(req, res, next);
});



module.exports = router;
