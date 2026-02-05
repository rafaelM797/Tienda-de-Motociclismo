import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Product.find();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});


// Crear un producto
router.post('/', async (req, res) => {
  try {
    const nuevoProducto = new Product(req.body);
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (err) {
    res.status(400).json({ error: 'Error al crear producto' });
  }
});

// Editar producto
router.put('/:id', async (req, res) => {
  try {
    console.log('PUT /api/productos/' + req.params.id, 'Body recibido:', req.body);
    const { nombre, descripcion, precio, categoria, imagen, enOferta, stock, stockMinimo, costo, margen, SKU } = req.body;
    if (!nombre || typeof nombre !== 'string') {
      console.error('Validación fallida: nombre inválido', nombre);
      return res.status(400).json({ error: 'El nombre del producto es requerido y debe ser texto.' });
    }
    if (descripcion !== undefined && typeof descripcion !== 'string') {
      console.error('Validación fallida: descripción inválida', descripcion);
      return res.status(400).json({ error: 'La descripción debe ser texto.' });
    }
    if (precio === undefined || typeof precio !== 'number' || precio < 0) {
      console.error('Validación fallida: precio inválido', precio);
      return res.status(400).json({ error: 'El precio es requerido, debe ser numérico y mayor o igual a 0.' });
    }
    if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
      console.error('Validación fallida: stock inválido', stock);
      return res.status(400).json({ error: 'El stock debe ser numérico y mayor o igual a 0.' });
    }
    if (stockMinimo !== undefined && (typeof stockMinimo !== 'number' || stockMinimo < 0)) {
      console.error('Validación fallida: stockMinimo inválido', stockMinimo);
      return res.status(400).json({ error: 'El stock mínimo debe ser numérico y mayor o igual a 0.' });
    }
    if (costo !== undefined && (typeof costo !== 'number' || costo < 0)) {
      console.error('Validación fallida: costo inválido', costo);
      return res.status(400).json({ error: 'El costo debe ser numérico y mayor o igual a 0.' });
    }
    if (margen !== undefined && (typeof margen !== 'number' || margen < 0)) {
      console.error('Validación fallida: margen inválido', margen);
      return res.status(400).json({ error: 'El margen debe ser numérico y mayor o igual a 0.' });
    }
    if (SKU !== undefined && typeof SKU !== 'string') {
      console.error('Validación fallida: SKU inválido', SKU);
      return res.status(400).json({ error: 'El SKU debe ser texto.' });
    }
    if (categoria !== undefined && typeof categoria !== 'string') {
      console.error('Validación fallida: categoría inválida', categoria);
      return res.status(400).json({ error: 'La categoría debe ser texto.' });
    }
    if (imagen !== undefined && typeof imagen !== 'string') {
      console.error('Validación fallida: imagen inválida', imagen);
      return res.status(400).json({ error: 'La imagen debe ser texto (URL).' });
    }
    if (enOferta !== undefined && typeof enOferta !== 'boolean') {
      console.error('Validación fallida: enOferta inválido', enOferta);
      return res.status(400).json({ error: 'El campo enOferta debe ser booleano.' });
    }
    try {
      const prod = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!prod) {
        console.error('Producto no encontrado para ID:', req.params.id);
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      console.log('Producto actualizado correctamente:', prod);
      res.json(prod);
    } catch (err) {
      console.error('Error al actualizar producto:', err);
      throw err;
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(400).json({ error: 'ID de producto inválido.' });
    } else {
      res.status(500).json({ error: 'Error al editar producto', detalle: err.message });
    }
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    const prod = await Product.findByIdAndDelete(req.params.id);
    if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

// Marcar/desmarcar producto como oferta
router.put('/:id/oferta', async (req, res) => {
  try {
    const { enOferta } = req.body;
    const prod = await Product.findByIdAndUpdate(req.params.id, { enOferta: !!enOferta }, { new: true });
    if (!prod) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(prod);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar oferta' });
  }
});

export default router;
