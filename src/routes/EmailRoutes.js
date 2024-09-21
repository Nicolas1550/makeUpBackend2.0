const express = require('express');
const router = express.Router();
const sgMail = require('@sendgrid/mail');

// Configura la API Key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Ruta para enviar correos desde el formulario de contacto
router.post('/send-email', async (req, res) => {
  const { from_name, user_email, message } = req.body;

  // Email para el usuario que envió el mensaje
  const userMessage = {
    to: user_email,  // Correo del usuario que ingresó el mensaje
    from: 'luciuknicolas15@gmail.com',  // Cambia esto por tu correo de empresa o dominio verificado en SendGrid
    subject: 'Gracias por contactarnos',
    text: `Hola ${from_name},\n\nGracias por enviarnos tu mensaje. Nos pondremos en contacto contigo lo antes posible.\n\nMensaje recibido:\n${message}\n\nSaludos,\nEquipo de Tu Empresa`,
  };

  // Email para el CEO de la empresa
  const ceoMessage = {
    to: 'luciuknicolas15@gmail.com',  // Correo del CEO (hardcodeado)
    from: 'luciuknicolas15@gmail.com',  // Cambia esto por tu correo de empresa
    subject: 'Nuevo mensaje de contacto',
    text: `Has recibido un nuevo mensaje de ${from_name} (${user_email}).\n\nMensaje:\n${message}`,
  };

  try {
    // Enviar ambos correos
    await sgMail.send(userMessage);
    await sgMail.send(ceoMessage);

    // Enviar respuesta de éxito
    res.status(200).json({ message: '¡Correo enviado con éxito!' });
  } catch (error) {
    console.error('Error enviando el correo:', error);
    res.status(500).json({ message: 'Error enviando el correo.' });
  }
});

module.exports = router;
