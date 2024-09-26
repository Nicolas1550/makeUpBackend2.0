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
const fs = require('fs');
require('express-async-errors');

// Importar rutas
const authRoutes = require('./routes/AuthRoutes');
const jwtRoutes = require('./routes/JwtRoutes');
const productRoutes = require('./routes/ProductRoutes');
const servicesRoutes = require('./routes/ServicesRoutes');
const emailRoutes = require('./routes/EmailRoutes');
const orderRoutes = require('./routes/OrderRoutes');
const productOrderRoutes = require('./routes/ProductOrderRoutes');
const passwordResetRoutes = require('./routes/PasswordResetRoutes'); 
const coursesRoutes = require('./routes/CoursesRoutes');  

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'https://peluqueria-the-best.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
];

// Configurar WebSocket
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  },
});

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS bloqueado para la solicitud de origen: ${origin}`);
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());

const uploadDir = path.join(__dirname, 'uploads/images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(morgan('tiny'));

// Importar userRoutes y pasar el objeto io
const userRoutes = require('./routes/UserRoutes');

// Usar las rutas
app.use('/api/users', userRoutes(io));
app.use('/auth', authRoutes);
app.use('/api/jwt', jwtRoutes);
app.use('/api/servicios', servicesRoutes(io));
app.use('/api/email', emailRoutes);
app.use('/api/orders', orderRoutes(io));
app.use('/api/productOrders', productOrderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/password', passwordResetRoutes); 
app.use('/api/courses', coursesRoutes);  

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
