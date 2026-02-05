import mongoose from 'mongoose';
import Product from './models/Product.js';

const MONGO_URI = 'mongodb://127.0.0.1:27017/tienda_motociclismo';

async function updateProducts() {
  await mongoose.connect(MONGO_URI);
  const productos = await Product.find();
  let actualizados = 0;

  for (const prod of productos) {
    let modificado = false;
    if (prod.costo === undefined) { prod.costo = 0; modificado = true; }
    if (prod.margen === undefined) { prod.margen = 0; modificado = true; }
    if (prod.SKU === undefined) { prod.SKU = ''; modificado = true; }
    if (prod.stock === undefined) { prod.stock = 0; modificado = true; }
    if (modificado) {
      await prod.save();
      actualizados++;
      console.log(`Producto actualizado: ${prod.nombre}`);
    }
  }
  console.log(`Total productos actualizados: ${actualizados}`);
  mongoose.disconnect();
}

updateProducts().catch(err => {
  console.error('Error actualizando productos:', err);
  mongoose.disconnect();
});
