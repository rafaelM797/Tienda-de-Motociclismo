import mongoose from 'mongoose';
import Categoria from '../backend/models/Categorias.js';

const MONGO_URI = process.env.MONGO_URI;

export default async function handler(req, res) {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(MONGO_URI);
  }

  if (req.method === 'GET') {
    const categorias = await Categoria.find({});
    return res.status(200).json(categorias);
  }
  if (req.method === 'POST') {
    const { nombre } = req.body;
    const nuevaCategoria = new Categoria({ nombre });
    await nuevaCategoria.save();
    return res.status(201).json(nuevaCategoria);
  }
  return res.status(405).json({ error: 'Método no permitido' });
}
