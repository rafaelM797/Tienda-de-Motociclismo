import mongoose from 'mongoose';

const MONGO_URI = 'mongodb://127.0.0.1:27017/tienda_motociclismo';

async function testConnection() {
  try {
    console.log('Intentando conectar a', MONGO_URI);
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Éxito: Se conectó a MongoDB');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Fallo en la conexión a MongoDB:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

testConnection();
