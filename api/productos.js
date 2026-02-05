import mongoose from 'mongoose';
import Product from '../backend/models/Product.js';

const MONGO_URI = process.env.MONGO_URI;

export default async function handler(req, res) {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(MONGO_URI);
  }

  if (req.method === 'GET') {
    const productos = await Product.find({});
    return res.status(200).json(productos);
  }
  if (req.method === 'POST') {
    const { nombre, precio, descripcion, imagen } = req.body;
    const nuevoProducto = new Product({ nombre, precio, descripcion, imagen });
    await nuevoProducto.save();
    return res.status(201).json(nuevoProducto);
  }
  return res.status(405).json({ error: 'Método no permitido' });
}
