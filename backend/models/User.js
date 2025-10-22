import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telefono: { type: String },
  fechaRegistro: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;
