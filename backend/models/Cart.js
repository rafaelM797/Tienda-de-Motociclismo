import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Asume que tienes un modelo 'Product'
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    }
});

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Asume que tienes un modelo 'User'
        required: true,
        unique: true // Cada usuario solo tiene un carrito
    },
    items: [CartItemSchema]
}, { timestamps: true });

export default mongoose.model('Cart', CartSchema);