
import express from 'express';
import Category from '../models/Categorias.js';

const router = express.Router();

// GET /api/categorias - Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const categorias = await Category.find().sort({ nombre: 1 });
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// POST /api/categorias - Crear nueva categoría
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre de la categoría es requerido' });
    }
    const nueva = new Category({ nombre, descripcion });
    await nueva.save();
    res.status(201).json(nueva);
  } catch (err) {
    if (err.code === 11000) {
      // Violación de unique constraint
      res.status(400).json({ error: 'La categoría ya existe' });
    } else {
      res.status(500).json({ error: 'Error al crear categoría' });
    }
  }
});

// PUT /api/categorias/:id - Actualizar categoría
router.put('/:id', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const actualizada = await Category.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion },
      { new: true }
    );
    if (!actualizada) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(actualizada);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar categoría' });
  }
});

// DELETE /api/categorias/:id - Eliminar categoría
router.delete('/:id', async (req, res) => {
  try {
    const eliminada = await Category.findByIdAndDelete(req.params.id);
    if (!eliminada) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json({ message: 'Categoría eliminada', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar categoría' });
  }
});

export default router;
