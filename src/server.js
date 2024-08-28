const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const passport = require('passport');
require('./passport-config');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
require('express-async-errors');

const { dbConnect, sequelize } = require('./db');
const userRoutes = require('./routes/UserRoutes');
const authRoutes = require('./routes/AuthRoutes');
const jwtRoutes = require('./routes/JwtRoutes');
const productRoutes = require('./routes/ProductRoutes');
const disponibilidadRoutes = require('./routes/DisponibilidadRoutes');
const servicesRoutes = require('./routes/ServicesRoutes');
const emailRoutes = require('./routes/EmailRoutes');
const orderRoutes = require('./routes/OrderRoutes');

// Conexión a la base de datos
dbConnect().catch(err => console.error('Error al conectar a MySQL:', err));

const app = express();
const server = http.createServer(app);

// Definir los orígenes permitidos (producción y desarrollo)
const allowedOrigins = [
  'https://peluqueria-the-best.vercel.app',
  'http://localhost:3000'
];

// Configurar Socket.io con CORS permitiendo múltiples orígenes
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT'],
    credentials: true,
  },
});

// Configuración de CORS para Express permitiendo múltiples orígenes
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 solicitudes por ventana por IP
}));
app.use(morgan('tiny'));

// Rutas
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/api/auth', jwtRoutes);
app.use('/api/disponibilidades', disponibilidadRoutes);
app.use('/api/servicios', servicesRoutes);
app.use('/api/email', emailRoutes);

// Asegúrate de que `io` esté inicializado antes de pasarla a `orderRoutes`
app.use('/api/orders', orderRoutes(io));

// Socket.io eventos
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

app.set('trust proxy', 1); // Habilitar proxy si estás detrás de un proxy como Nginx o Heroku

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

