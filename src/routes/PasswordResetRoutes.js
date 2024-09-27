const express = require('express');
const crypto = require('crypto'); 
const sgMail = require('@sendgrid/mail'); 
const { query } = require('../db'); 
const bcrypt = require('bcrypt');

const router = express.Router();

// Configurar SendGrid con la API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Ruta para solicitar restablecimiento de contraseña
router.post('/request-reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Verificar si el correo existe en la base de datos
    const user = await query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (user.length === 0) {
      return res.status(404).json({ message: 'El correo no está registrado.' });
    }

    // Generar token y su fecha de expiración
    const token = crypto.randomBytes(32).toString('hex');
    const expirationTime = new Date(Date.now() + 3600000); // 1 hora a partir de ahora

    // Guardar token y fecha de expiración en la base de datos
    await query(
      'UPDATE users SET reset_token = ?, reset_token_expiration = ? WHERE email = ?',
      [token, expirationTime, email]
    );

    // Enviar correo con el enlace para restablecer la contraseña
    const resetUrl = `https://make-up2-0.vercel.app/reset-password/${token}`; // Ahora el token está en la URL dinámica

    const msg = {
      to: email,
      from: 'luciuknicolas15@gmail.com', // Correo verificado en SendGrid
      subject: 'Restablecimiento de contraseña',
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetUrl}`,
    };

    await sgMail.send(msg);
    
    return res.status(200).json({ message: 'Correo de restablecimiento enviado.' });
  } catch (error) {
    console.error('Error al solicitar restablecimiento de contraseña:', error);
    return res.status(500).json({ message: 'Error al solicitar restablecimiento de contraseña.' });
  }
});

// Ruta para confirmar el restablecimiento de la contraseña
router.post('/reset-password', async (req, res) => {
  const { token, email, newPassword } = req.body;

  try {
    // Verificar que el token sea válido y que no esté expirado
    const user = await query(
      'SELECT * FROM users WHERE email = ? AND reset_token = ? AND reset_token_expiration > NOW()',
      [email, token]
    );

    if (user.length === 0) {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }

    // Encriptar la nueva contraseña usando bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña en la base de datos y eliminar el token
    await query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE email = ?',
      [hashedPassword, email]
    );

    return res.status(200).json({ message: 'Contraseña restablecida correctamente.' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    return res.status(500).json({ message: 'Error al restablecer la contraseña.' });
  }
});

module.exports = router;
