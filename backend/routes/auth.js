import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    // Log incoming body for debugging
    console.log('[auth] POST /register body:', req.body);
    const { nombre, email, password, telefono } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new User({ nombre, email, password: hashedPassword, telefono });
    await nuevoUsuario.save();
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    // Log full error for debugging
    console.error('[auth] Error en /register:', err && err.stack ? err.stack : err);
    // En entorno de desarrollo devolvemos el mensaje para depurar (puedes quitar details en producción)
    res.status(500).json({ error: 'Error en el registro', details: err && err.message ? err.message : String(err) });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }
    const passwordOk = await bcrypt.compare(password, usuario.password);
    if (!passwordOk) {
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }
    res.json({ message: 'Login exitoso', usuario: { nombre: usuario.nombre, email: usuario.email, id: usuario._id } });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

export default router;
