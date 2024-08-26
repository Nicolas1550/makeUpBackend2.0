const express = require('express');
const sgMail = require('@sendgrid/mail');

// Configura tu API Key de SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const router = express.Router();

// Ruta para enviar un correo electrónico
router.post('/', async (req, res) => {
    const { user_name, user_email, message } = req.body;

    const msg = {
        to: 'lnicolas62@yahoo.com', 
        from: 'luciuknicolas15@gmail.com', 
        subject: `Nuevo mensaje de ${user_name}`,
        text: message,
        html: `<strong>De:</strong> ${user_name} <br><strong>Email:</strong> ${user_email} <br><strong>Mensaje:</strong> ${message}`,
    };

    try {
        await sgMail.send(msg);
        res.status(200).json({ success: true, message: 'Correo enviado correctamente.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error al enviar el correo.' });
    }
});

module.exports = router;
