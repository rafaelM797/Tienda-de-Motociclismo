import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Registro de usuario
router.post('/register', async (req, res) => {
  try {
    // Log incoming body for debugging
    console.log('[auth] POST /register body:', req.body);
  const { nombre, email, password, telefono, role } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
  const nuevoUsuario = new User({ nombre, email, password: hashedPassword, telefono, role: role || 'user' });
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
// Login de usuario (devuelve también el rol)
router.post('/login', async (req, res) => {
  try {
    console.log('[auth] POST /login - Iniciando login...');
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log('[auth] Login - Campos faltantes');
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }
    
    console.log(`[auth] Buscando usuario: ${email}`);
    const startTime = Date.now();
    const usuario = await User.findOne({ email }).select('+password +role');
    const queryTime = Date.now() - startTime;
    console.log(`[auth] Búsqueda completada en ${queryTime}ms`);
    
    if (!usuario) {
      console.log(`[auth] Usuario no encontrado: ${email}`);
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }
    
    console.log('[auth] Comparando contraseñas...');
    const passwordOk = await bcrypt.compare(password, usuario.password);
    
    if (!passwordOk) {
      console.log('[auth] Contraseña incorrecta');
      return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
    }
    
    console.log(`[auth] Login exitoso para ${email}, rol: ${usuario.role}`);
    res.json({
      message: 'Login exitoso',
      usuario: {
        nombre: usuario.nombre,
        email: usuario.email,
        id: usuario._id,
        role: usuario.role || 'user'
      }
    });
  } catch (err) {
    console.error('[auth] Error en login:', err && err.message ? err.message : err);
    res.status(500).json({ error: 'Error al iniciar sesión', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
});

export default router;
