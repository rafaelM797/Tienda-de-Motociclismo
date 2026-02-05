import mongoose from 'mongoose';
import User from '../backend/models/User.js';
import bcrypt from 'bcryptjs';

const MONGO_URI = process.env.MONGO_URI;

export default async function handler(req, res) {
  if (!mongoose.connection.readyState) {
    await mongoose.connect(MONGO_URI);
  }

  if (req.method === 'POST') {
    const { email, password } = req.body;
    const usuario = await User.findOne({ email });
    if (!usuario) return res.status(401).json({ error: 'Usuario no encontrado' });
    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido) return res.status(401).json({ error: 'Contraseña incorrecta' });
    return res.status(200).json({ mensaje: 'Login exitoso', usuario });
  }
  return res.status(405).json({ error: 'Método no permitido' });
}
