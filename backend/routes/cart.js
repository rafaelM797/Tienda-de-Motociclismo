import express from 'express';
import { getCart, addItemToCart } from '../controllers/cartController.js';
// Importa el middleware de autenticación que ya usas, por ejemplo:
import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// Middleware: Las rutas del carrito generalmente requieren que el usuario esté autenticado.
// Usaremos la ruta '/api/carrito' que definiste en index.js

// GET /api/carrito -> Obtener el carrito completo del usuario
router.get('/', protect, getCart);

// POST /api/carrito -> Agregar un producto al carrito
router.post('/', protect, addItemToCart);

export default router;