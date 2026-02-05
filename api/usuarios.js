import mongoose from 'mongoose';
import User from '../backend/models/User.js';

const MONGO_URI = process.env.MONGO_URI;

export default async function handler(req, res) {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(MONGO_URI);
  }

  if (req.method === 'GET') {
    const usuarios = await User.find({});
    return res.status(200).json(usuarios);
  }
  if (req.method === 'POST') {
    const { nombre, email, password, telefono, role } = req.body;
    const nuevoUsuario = new User({ nombre, email, password, telefono, role });
    await nuevoUsuario.save();
    return res.status(201).json(nuevoUsuario);
  }
  return res.status(405).json({ error: 'Método no permitido' });
}
