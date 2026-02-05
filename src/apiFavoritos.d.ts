// Declaraciones mínimas para apiFavoritos.js
export function getUserFavorites(userId: string): Promise<any[]>;
export function toggleFavorite(userId: string, productId: string): Promise<any[]>;
