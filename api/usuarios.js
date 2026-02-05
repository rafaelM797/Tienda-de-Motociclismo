import mongoose from 'mongoose';
import User from '../backend/models/User.js';

const MONGO_URI = process.env.MONGO_URI;

export default async function handler(req, res) {
  try {
    // Depuración: mostrar el valor de la variable de entorno (solo en desarrollo)
    if (process.env.NODE_ENV !== 'production') {
      console.log('MONGO_URI:', MONGO_URI);
    }
    if (!MONGO_URI) {
      return res.status(500).json({ error: 'MONGO_URI no está definida en las variables de entorno.' });
    }
    // Depuración: estado de la conexión
    if (process.env.NODE_ENV !== 'production') {
      console.log('Estado conexión mongoose:', mongoose.connection.readyState);
    }
    if (!mongoose.connection.readyState) {
      try {
        await mongoose.connect(MONGO_URI);
        if (process.env.NODE_ENV !== 'production') {
          console.log('Conexión a MongoDB exitosa');
        }
      } catch (connErr) {
        return res.status(500).json({ error: 'Error al conectar a MongoDB', details: connErr.message });
      }
    }

    if (req.method === 'GET') {
      try {
        const usuarios = await User.find({});
        return res.status(200).json(usuarios);
      } catch (err) {
        return res.status(500).json({ error: 'Error al obtener usuarios', details: err.message });
      }
    }
    if (req.method === 'POST') {
      try {
        const { nombre, email, password, telefono, role } = req.body;
        const nuevoUsuario = new User({ nombre, email, password, telefono, role });
        await nuevoUsuario.save();
        return res.status(201).json(nuevoUsuario);
      } catch (err) {
        return res.status(500).json({ error: 'Error al crear usuario', details: err.message });
      }
    }
    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
}
