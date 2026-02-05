import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  telefono: { type: String },
  fechaRegistro: { type: Date, default: Date.now },
  role: { type: String, enum: ['admin', 'empleado', 'cliente'], default: 'cliente', index: true },
  favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

// Los índices se generan a partir de las opciones en los campos (unique/index)
// Evitamos duplicar la definición explícita de índices.

const User = mongoose.model('User', userSchema);

export default User;
