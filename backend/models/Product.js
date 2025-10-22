import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  precio: { type: Number, required: true },
  categoria: String,
  imagen: String,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
