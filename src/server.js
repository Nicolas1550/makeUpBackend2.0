const express = require('express');
const cors = require('cors');
require('dotenv').config();

const passport = require('passport');
require('./passport-config');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const dbConnect = require('./db');
const userRoutes = require('./routes/UserRoutes');
const authRoutes = require('./routes/AuthRoutes');
const jwtRoutes = require('./routes/JwtRoutes');
const productRoutes = require('./routes/productRoutes');

dbConnect().catch(err => console.error('Error al conectar a MongoDB:', err));

const app = express();
const path = require('path');

// Ajusta CORS para producción, permitiendo solo dominios conocidos o configurando según el entorno
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

// Servir archivos estáticos desde el directorio 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(helmet()); // Seguridad básica
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limita cada IP a 100 solicitudes por ventana de tiempo
}));

app.use(morgan('tiny')); // Logging de solicitudes HTTP

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/api/auth', jwtRoutes);

app.get('/', (req, res) => {
  res.send('Backend funcionando!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
