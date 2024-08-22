// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');  // Necesario para socket.io
const { Server } = require('socket.io');  // Importa socket.io
const passport = require('passport');
require('./passport-config');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
require('express-async-errors');

const { dbConnect, sequelize, Disponibilidad, Order } = require('./db');
const userRoutes = require('./routes/UserRoutes');
const authRoutes = require('./routes/AuthRoutes');
const jwtRoutes = require('./routes/JwtRoutes');
const productRoutes = require('./routes/ProductRoutes');
const disponibilidadRoutes = require('./routes/DisponibilidadRoutes');
const services = require('./routes/ServicesRoutes');
const emailRoutes = require('./routes/EmailRoutes');

dbConnect().catch(err => console.error('Error al conectar a MySQL:', err));

const app = express();
const server = http.createServer(app);  // Crear servidor HTTP para usar con socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
  },
});

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
app.use('/api/email', emailRoutes);

// Pasar io a las rutas de órdenes
const orderRoutes = require('./routes/OrderRoutes')(io); 
app.use('/api/orders', orderRoutes);

// Socket.io evento de conexión
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

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
  server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
});
