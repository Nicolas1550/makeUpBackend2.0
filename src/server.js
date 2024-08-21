// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const passport = require('passport');
require('./passport-config');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
require('express-async-errors');

const { dbConnect, sequelize, Disponibilidad, Order } = require('./db');  // Asegúrate de importar Order
const userRoutes = require('./routes/UserRoutes');
const authRoutes = require('./routes/AuthRoutes');
const jwtRoutes = require('./routes/JwtRoutes');
const productRoutes = require('./routes/ProductRoutes');
const disponibilidadRoutes = require('./routes/DisponibilidadRoutes');
const services = require('./routes/ServicesRoutes');
const orderRoutes = require('./routes/OrderRoutes');  // Nueva ruta para órdenes
const emailRoutes = require('./routes/EmailRoutes');

dbConnect().catch(err => console.error('Error al conectar a MySQL:', err));

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));
app.use(morgan('tiny'));

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/api/auth', jwtRoutes);
app.use('/api/disponibilidades', disponibilidadRoutes);
app.use('/api/servicios', services);
app.use('/api/orders', orderRoutes);  // Nueva ruta para órdenes
app.use('/api/email', emailRoutes); // Nueva ruta para enviar correos

app.use(passport.initialize());

app.set('trust proxy', 1);
app.get('/', (req, res) => {
  res.send('Backend funcionando!');
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

const PORT = process.env.PORT || 3001;

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
});
