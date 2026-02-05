import { createContext, useContext, useState, ReactNode, useEffect, Dispatch, SetStateAction } from 'react';
import API_URL from '../apiConfig';

export interface RegisteredUser {
  id: string;
  _id?: string;
  nombre?: string;
  name?: string;
  email: string;
  telefono?: string;
  phone?: string;
  role?: 'user' | 'admin';
  status?: string;
  totalSpent?: number;
}

interface AppContextType {
  users: RegisteredUser[];
  products: any[];
  currentUser: RegisteredUser | null;
  addUser: () => void;
  loginUser: (user: RegisteredUser) => void;
  logoutUser: () => void;
  setCurrentUser: Dispatch<SetStateAction<RegisteredUser | null>>;
  updateUser: (userId: string, updates: any) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateProduct: (productId: string, updates: any) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  refreshProducts: () => Promise<void>;
  refreshUsers: () => Promise<void>;
  getUserOrders: (userId: any) => any[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);

  // Cargar sesión desde localStorage al montar
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
    
    // Cargar productos y usuarios al iniciar
    refreshProducts();
    refreshUsers();
  }, []);

  // Guardar usuario actual en localStorage cuando cambia
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Cargar productos desde el backend
  const refreshProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/productos`);
      const data = await res.json();
      const adaptados = (Array.isArray(data) ? data : []).map((p: any) => {
        let imageUrl = '';
        if (p.imagen) {
          if (p.imagen.startsWith('http')) {
            imageUrl = p.imagen;
          } else if (p.imagen.startsWith('/')) {
            imageUrl = `${API_URL}${p.imagen}`;
          } else {
            imageUrl = `${API_URL}/images/${encodeURIComponent(p.imagen)}`;
          }
        } else if (p.image) {
          if (p.image.startsWith('http')) {
            imageUrl = p.image;
          } else if (p.image.startsWith('/')) {
            imageUrl = `${API_URL}${p.image}`;
          } else {
            imageUrl = `${API_URL}/images/${encodeURIComponent(p.image)}`;
          }
        }
        return {
          _id: p._id || p.id,
          id: p._id || p.id,
          name: p.nombre || p.name || '',
          price: p.precio || p.price || 0,
          originalPrice: p.precioOriginal || p.originalPrice || p.precio || p.price || 0,
          image: imageUrl,
          category: p.categoria || p.category || '',
          rating: p.rating || 5,
          inStock: (typeof p.stock === 'number' ? p.stock > 0 : true),
          description: p.descripcion || p.description || '',
          cost: p.costo || p.cost || 0,
          sku: p.sku || '',
          stock: p.stock || 0,
          minStock: p.minStock || 0,
          variants: p.variantes || p.variants || [],
          createdAt: p.createdAt || '',
        };
      });
      setProducts(adaptados);
    } catch (err) {
      console.error('Error cargando productos:', err);
      setProducts([]);
    }
  };

  // Cargar usuarios desde el backend
  const refreshUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/usuarios`);
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error cargando usuarios:', err);
    }
  };

  // Actualizar usuario en el backend
  const updateUser = async (userId: string, updates: any) => {
    try {
      const res = await fetch(`${API_URL}/api/usuarios/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const actualizado = await res.json();
        setUsers(prev => prev.map(u => u.id === actualizado.id || u._id === actualizado._id ? actualizado : u));
        // Si es el usuario actual, actualizar
        if (currentUser && (currentUser.id === userId || currentUser._id === userId)) {
          setCurrentUser({ ...currentUser, ...actualizado });
        }
      }
    } catch (err) {
      console.error('Error actualizando usuario:', err);
      throw err;
    }
  };

  // Eliminar usuario del backend
  const deleteUser = async (userId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/usuarios/${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId && u._id !== userId));
      }
    } catch (err) {
      console.error('Error eliminando usuario:', err);
      throw err;
    }
  };

  // Actualizar producto en el backend
  const updateProduct = async (productId: string, updates: any) => {
    try {
      const res = await fetch(`${API_URL}/api/productos/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        await refreshProducts(); // Recargar productos para sincronizar
      }
    } catch (err) {
      console.error('Error actualizando producto:', err);
      throw err;
    }
  };

  // Eliminar producto del backend
  const deleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/productos/${productId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== productId && p._id !== productId));
      }
    } catch (err) {
      console.error('Error eliminando producto:', err);
      throw err;
    }
  };

  // Métodos de login/logout
  const loginUser = (user: RegisteredUser) => {
    setCurrentUser(user);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addUser = () => {
    refreshUsers();
  };

  // Mock: función para obtener pedidos de usuario
  const getUserOrders = (userId: any) => {
    return [];
  };

  return (
    <AppContext.Provider value={{
      users,
      products,
      currentUser,
      addUser,
      loginUser,
      logoutUser,
      setCurrentUser,
      updateUser,
      deleteUser,
      updateProduct,
      deleteProduct,
      refreshProducts,
      refreshUsers,
      getUserOrders
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}