import mongoose from 'mongoose';

// Usa la variable de entorno MONGO_URI si está definida, si no usa localhost
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tienda_motociclismo';

async function testConnection() {
  try {
    console.log('Intentando conectar a:', MONGO_URI);
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('Éxito: se conectó a MongoDB');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Fallo en la conexión a MongoDB:');
    if (err && err.message) console.error(err.message);
    else console.error(err);
    process.exit(1);
  }
}

testConnection();
