import API_URL from './apiConfig';

export async function getUserFavorites(userId) {
  const res = await fetch(`${API_URL}/api/usuarios/${userId}/favoritos`);
  if (!res.ok) throw new Error('Error al obtener favoritos');
  return await res.json();
}

export async function toggleFavorite(userId, productId) {
  const res = await fetch(`${API_URL}/api/usuarios/${userId}/favoritos/${productId}`, { method: 'POST' });
  if (!res.ok) throw new Error('Error al actualizar favoritos');
  return await res.json();
}
