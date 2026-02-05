import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  costo: { type: Number, default: 0 },
  margen: { type: Number, default: 0 },
  SKU: { type: String },
  categoria: { type: String },
  imagen: { type: String },
  enOferta: { type: Boolean, default: false },
  stock: { type: Number, default: 0 },
  stockMinimo: { type: Number, default: 0 },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
