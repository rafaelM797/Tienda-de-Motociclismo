import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';

const MONGO_URI = 'mongodb://127.0.0.1:27017/tienda_motociclismo';

async function initializeDB() {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Conectado a MongoDB exitosamente');

    // Limpiar colecciones existentes
    console.log('🧹 Limpiando colecciones...');
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('✅ Colecciones limpiadas');

    // Crear usuarios de prueba
    console.log('👥 Creando usuarios de prueba...');
    const hashedPassword = await bcrypt.hash('123456', 10);

    const usuarios = await User.insertMany([
      {
        nombre: 'Rafa Admin',
        email: 'rafa@outlook.com',
        password: hashedPassword,
        telefono: '+57 300 1111111',
        role: 'admin',
        fechaRegistro: new Date(),
      },
      {
        nombre: 'Empleado Ejemplo',
        email: 'empleado@outlook.com',
        password: hashedPassword,
        telefono: '+57 310 2222222',
        role: 'empleado',
        fechaRegistro: new Date(),
      },
      {
        nombre: 'Cliente Ejemplo',
        email: 'cliente@outlook.com',
        password: hashedPassword,
        telefono: '+57 320 3333333',
        role: 'cliente',
        fechaRegistro: new Date(),
      },
    ]);
    console.log(`✅ ${usuarios.length} usuarios creados`);

    // Crear productos de prueba
    console.log('🛍️ Creando productos de prueba...');
    const productos = await Product.insertMany([
      {
        nombre: 'Casco Integral Black',
        precio: 89999,
        descripcion: 'Casco integral de seguridad con protección total',
        categoria: 'Cascos',
        imagen: '/images/casco-black.jpg',
        enOferta: false,
        stock: 10,
      },
      {
        nombre: 'Chaqueta Moto Cuero Premium',
        precio: 349999,
        descripcion: 'Chaqueta de cuero genuino con protectores',
        categoria: 'Chaquetas',
        imagen: '/images/chaqueta-cuero.jpg',
        enOferta: true,
        stock: 5,
      },
      {
        nombre: 'Guantes Racing XL',
        precio: 45999,
        descripcion: 'Guantes de carreras con refuerzo en palma',
        categoria: 'Accesorios',
        imagen: '/images/guantes-racing.jpg',
        enOferta: false,
        stock: 20,
      },
      {
        nombre: 'Pantalón Moto Reforzado',
        precio: 129999,
        descripcion: 'Pantalón con protectores en caderas y rodillas',
        categoria: 'Pantalones',
        imagen: '/images/pantalon-moto.jpg',
        enOferta: true,
        stock: 8,
      },
      {
        nombre: 'Botas Moto Seguridad',
        precio: 159999,
        descripcion: 'Botas con punta reforzada y protección de tobillo',
        categoria: 'Botas',
        imagen: '/images/botas-seguridad.jpg',
        enOferta: false,
        stock: 12,
      },
    ]);
    console.log(`✅ ${productos.length} productos creados`);

    console.log('\n📊 Resumen de inicialización:');
    console.log(`   - Usuarios: ${usuarios.length}`);
    console.log(`   - Productos: ${productos.length}`);
    console.log('\n🎉 Base de datos inicializada correctamente');
    console.log('\n📝 Credenciales de prueba:');
    console.log('   Admin: rafa@outlook.com / 123456');
    console.log('   Usuario 1: alexis@outlok.com / 123456');
    console.log('   Usuario 2: flaco@outlok.com / 123456');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error en inicialización:', err && err.message ? err.message : err);
    process.exit(1);
  }
}

initializeDB();
