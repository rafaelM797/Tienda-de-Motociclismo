import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = 'mongodb://127.0.0.1:27017/tienda_motociclismo';



import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import productsRouter from './routes/products.js';
import authRouter from './routes/auth.js';


app.use(cors());
app.use(express.json());
app.use('/api/productos', productsRouter);
app.use('/api/auth', authRouter);

// Servir archivos estáticos de la carpeta public/images
app.use('/images', express.static(path.resolve(__dirname, '..', 'public', 'images')));

// Opciones modernas y tiempos para diagnosticar mejor problemas de conexión
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // tiempo para seleccionar servidor
  socketTimeoutMS: 45000,
  // no usar las opciones obsoletas que muestran advertencias
};

async function connectWithRetry(retries = 3) {
  try {
    await mongoose.connect(MONGO_URI, mongooseOptions);
    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error('Error de conexión a MongoDB:', err && err.message ? err.message : err);
    if (retries > 0) {
      console.log(`Reintentando conexión en 2s... (intentos restantes: ${retries})`);
      setTimeout(() => connectWithRetry(retries - 1), 2000);
    } else {
      console.error('No se pudo conectar a MongoDB después de varios intentos.');
    }
  }
}

// Listeners para eventos de mongoose (útiles en desarrollo)
mongoose.connection.on('connected', () => console.log('Mongoose conectado ->', MONGO_URI));
mongoose.connection.on('error', (err) => console.error('Mongoose error:', err));
mongoose.connection.on('disconnected', () => console.warn('Mongoose desconectado'));

connectWithRetry();

app.get('/', (req, res) => {
  res.send('Backend de Tienda de Motociclismo funcionando');
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
