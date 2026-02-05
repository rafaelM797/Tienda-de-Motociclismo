import mongoose from 'mongoose';
import Product from './models/Product.js';

const MONGO_URI = 'mongodb://127.0.0.1:27017/tienda_motociclismo';

const mapping = [
  { nameContains: 'Casco', imagen: '/images/casco1.jpg' },
  { nameContains: 'Chaqueta', imagen: '/images/proteccion corporal.jpg' },
  { nameContains: 'Guantes', imagen: '/images/kit manillas azul.jpg' },
  { nameContains: 'Pantal', imagen: '/images/portaplacas rojo.jpg' },
  { nameContains: 'Botas', imagen: '/images/botas.jpg' },
];

async function run() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Conectado a MongoDB');

    const products = await Product.find();
    console.log(`Encontrados ${products.length} productos`);

    for (const p of products) {
      const lower = (p.nombre || p.name || '').toLowerCase();
      let newImg = null;
      for (const m of mapping) {
        if (lower.includes(m.nameContains.toLowerCase())) {
          newImg = m.imagen;
          break;
        }
      }
      if (!newImg) {
        // fallback: use first image from dist
        newImg = '/images/casco1.jpg';
      }
      p.imagen = newImg;
      await p.save();
      console.log(`Producto '${p.nombre || p.name}' -> imagen set a ${newImg}`);
    }

    await mongoose.disconnect();
    console.log('Hecho');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();
