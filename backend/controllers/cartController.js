// backend/controllers/cartController.js

import Cart from '../models/Cart.js';
// Importa el modelo de Producto si es necesario para verificar stock o datos, 
// aunque en este ejemplo solo usamos la referencia de Mongoose.

// =====================================================================
// 1. OBTENER EL CARRITO
// =====================================================================
export const getCart = async (req, res) => {
    try {
        // Asumimos que req.user.id es proporcionado por el middleware de autenticación (protect)
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        
        if (!cart) {
            // Si no hay un carrito, devolvemos uno vacío (o un 404, pero un 200 con vacío es común)
            return res.status(200).json({ user: req.user.id, items: [] });
        }
        
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =====================================================================
// 2. AGREGAR O ACTUALIZAR UN PRODUCTO
// =====================================================================
export const addItemToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    
    // Convertir quantity a número y asegurar que sea al menos 1
    const itemQuantity = Number(quantity) > 0 ? Number(quantity) : 1;
    
    try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            // Caso 1: El usuario no tiene carrito, lo creamos
            cart = new Cart({ 
                user: req.user.id, 
                items: [{ product: productId, quantity: itemQuantity }] 
            });
        } else {
            // Caso 2: El carrito existe
            const itemIndex = cart.items.findIndex(item => 
                item.product.toString() === productId
            );

            if (itemIndex > -1) {
                // Producto encontrado, actualizamos la cantidad
                cart.items[itemIndex].quantity += itemQuantity;
            } else {
                // Producto no encontrado, lo agregamos como nuevo
                cart.items.push({ product: productId, quantity: itemQuantity });
            }
        }
        
        await cart.save();
        // Devolvemos el carrito poblado para mostrar la información del producto
        const updatedCart = await cart.populate('items.product'); 
        
        res.status(201).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =====================================================================
// 3. ELIMINAR UN PRODUCTO
// =====================================================================
export const removeItemFromCart = async (req, res) => {
    // req.user.id viene del middleware de autenticación (protect)
    const userId = req.user.id; 
    // itemId es el ID del producto a eliminar, pasado como parámetro de URL
    const { itemId } = req.params; 

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado.' });
        }

        const initialLength = cart.items.length;
        
        // Usamos filter para crear un nuevo arreglo SÓLO con los ítems que NO coinciden con itemId
        cart.items = cart.items.filter(item => 
            item.product.toString() !== itemId
        );

        // Verificamos si la longitud cambió (si se eliminó algo)
        if (cart.items.length === initialLength) {
             return res.status(404).json({ message: 'Producto no encontrado en el carrito.' });
        }
        
        await cart.save();
        
        // Devolvemos el carrito actualizado
        const updatedCart = await cart.populate('items.product');

        res.status(200).json({ 
            message: 'Producto eliminado del carrito exitosamente.', 
            cart: updatedCart 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};