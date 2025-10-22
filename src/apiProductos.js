import API_URL from './apiConfig';

export async function obtenerProductos() {
  const res = await fetch(`${API_URL}/api/productos`);
  if (!res.ok) throw new Error('Error al obtener productos');
  return res.json();
}
