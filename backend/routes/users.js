import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';

const router = express.Router();

// Obtener todos los usuarios (para admin)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password').lean();
    res.json(users);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Obtener un usuario por ID
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId, '-password').lean();
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// Actualizar usuario
router.put('/:userId', async (req, res) => {
  try {
    const { nombre, email, telefono, role } = req.body;
    const updates = {};
    if (nombre) updates.nombre = nombre;
    if (email) updates.email = email;
    if (telefono) updates.telefono = telefono;
    if (role) updates.role = role;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password').lean();
    
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario
router.delete('/:userId', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// Obtener favoritos de un usuario
router.get('/:userId/favoritos', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('favoritos');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user.favoritos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener favoritos' });
  }
});

// Agregar o quitar un producto de favoritos
router.post('/:userId/favoritos/:productId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const prodId = req.params.productId;
    const idx = user.favoritos.findIndex(fav => fav.toString() === prodId);
    if (idx === -1) {
      user.favoritos.push(prodId);
    } else {
      user.favoritos.splice(idx, 1);
    }
    await user.save();
    const favoritos = await User.findById(user._id).populate('favoritos');
    res.json(favoritos.favoritos);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar favoritos' });
  }
});

export default router;
