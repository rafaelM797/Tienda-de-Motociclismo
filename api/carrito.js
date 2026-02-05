import mongoose from 'mongoose';
import Cart from '../backend/models/Cart.js';

const MONGO_URI = process.env.MONGO_URI;

export default async function handler(req, res) {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(MONGO_URI);
  }

  if (req.method === 'GET') {
    const carritos = await Cart.find({});
    return res.status(200).json(carritos);
  }
  // Aquí puedes agregar lógica para POST, PUT, DELETE según tu modelo
  return res.status(405).json({ error: 'Método no permitido' });
}
