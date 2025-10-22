import React, { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';

const API_URL = 'http://localhost:4000';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para el formulario de nuevo producto
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    imagen: ''
  });
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje('');
    try {
      const res = await fetch(`${API_URL}/api/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nuevoProducto.nombre,
          descripcion: nuevoProducto.descripcion,
          precio: Number(nuevoProducto.precio),
          categoria: nuevoProducto.categoria,
          imagen: nuevoProducto.imagen
        })
      });
      if (!res.ok) throw new Error('Error al guardar producto');
      setMensaje('Producto guardado correctamente');
      setNuevoProducto({ nombre: '', descripcion: '', precio: '', categoria: '', imagen: '' });
      // Actualizar lista de productos
      const data = await res.json();
      setProducts((prev) => [...prev, data]);
    } catch (err) {
      setMensaje(err.message || 'Error desconocido');
    } finally {
      setGuardando(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/api/productos`);
        if (!res.ok) throw new Error('Error al obtener productos');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Catálogo de Productos</h1>
      <form className="mb-8 space-y-2" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold">Agregar nuevo producto</h2>
        <input name="nombre" value={nuevoProducto.nombre} onChange={handleChange} placeholder="Nombre" className="border p-2 w-full" required />
        <textarea name="descripcion" value={nuevoProducto.descripcion} onChange={handleChange} placeholder="Descripción" className="border p-2 w-full" />
        <input name="precio" value={nuevoProducto.precio} onChange={handleChange} placeholder="Precio" type="number" className="border p-2 w-full" required />
        <input name="categoria" value={nuevoProducto.categoria} onChange={handleChange} placeholder="Categoría" className="border p-2 w-full" />
        <input name="imagen" value={nuevoProducto.imagen} onChange={handleChange} placeholder="URL de imagen" className="border p-2 w-full" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar producto'}</button>
        {mensaje && <p className="mt-2 text-green-600">{mensaje}</p>}
      </form>
      {loading && <p>Cargando productos...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-4">
        {products.map((product) => (
          <div key={product._id || product.id} className="w-80">
              <ProductCard product={{
                id: product._id || product.id,
                name: product.nombre,
                price: product.precio,
                originalPrice: undefined,
                image: product.imagen.startsWith('http')
                  ? product.imagen
                  : `http://localhost:4000/images/${encodeURIComponent(product.imagen)}`,
                category: product.categoria,
                rating: 5,
                inStock: true
              }} onAddToCart={() => {}} />
          </div>
        ))}
      </div>
      {!loading && !error && products.length === 0 && <p>No hay productos disponibles.</p>}
    </div>
  );
};

export { ProductCatalog };
