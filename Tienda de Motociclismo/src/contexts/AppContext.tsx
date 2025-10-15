import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { UserData } from '../components/AuthModal';

export interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'Tarjeta de Crédito' | 'Tarjeta de Débito' | 'PSE' | 'Nequi' | 'Daviplata';
  name: string;
  lastFour?: string;
  expiryDate?: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  status: 'Procesando' | 'En tránsito' | 'Entregado' | 'Cancelado';
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  shipping: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    method: string;
    tracking?: string;
  };
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface RegisteredUser extends UserData {
  registeredDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'Activo' | 'Inactivo';
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  password?: string;
}

interface AppContextType {
  users: RegisteredUser[];
  orders: Order[];
  currentUser: UserData | null;
  addUser: (user: UserData, password: string) => void;
  addOrder: (order: Order) => void;
  updateUser: (userId: string, updates: Partial<RegisteredUser>) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  getUserOrders: (userId: string) => Order[];
  loginUser: (email: string, password: string) => UserData | null;
  logoutUser: () => void;
  addUserAddress: (userId: string, address: Omit<Address, 'id'>) => void;
  updateUserAddress: (userId: string, addressId: string, updates: Partial<Address>) => void;
  removeUserAddress: (userId: string, addressId: string) => void;
  addUserPaymentMethod: (userId: string, paymentMethod: Omit<PaymentMethod, 'id'>) => void;
  updateUserPaymentMethod: (userId: string, paymentMethodId: string, updates: Partial<PaymentMethod>) => void;
  removeUserPaymentMethod: (userId: string, paymentMethodId: string) => void;
  setCurrentUser: (user: UserData | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Datos mock iniciales
const initialUsers: RegisteredUser[] = [
  {
    id: '1',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@email.com',
    phone: '+57 300 1234567',
    registeredDate: '2024-01-15',
    totalOrders: 12,
    totalSpent: 1450000,
    status: 'Activo',
    password: 'password123',
    addresses: [
      {
        id: 'addr1',
        name: 'Casa',
        address: 'Calle 45 #23-12',
        city: 'Bogotá',
        state: 'Cundinamarca',
        zipCode: '110111',
        isDefault: true
      }
    ],
    paymentMethods: [
      {
        id: 'pm1',
        type: 'Tarjeta de Crédito',
        name: 'Visa **** 1234',
        lastFour: '1234',
        expiryDate: '12/25',
        isDefault: true
      }
    ]
  },
  {
    id: '2',
    name: 'Ana María López',
    email: 'ana.lopez@email.com',
    phone: '+57 310 9876543',
    registeredDate: '2024-02-20',
    totalOrders: 8,
    totalSpent: 980000,
    status: 'Activo',
    password: 'password123',
    addresses: [
      {
        id: 'addr2',
        name: 'Casa',
        address: 'Carrera 15 #80-45',
        city: 'Bogotá',
        state: 'Cundinamarca',
        zipCode: '110221',
        isDefault: true
      }
    ],
    paymentMethods: [
      {
        id: 'pm2',
        type: 'PSE',
        name: 'Bancolombia',
        isDefault: true
      }
    ]
  },
  {
    id: '3',
    name: 'Juan Pablo Martínez',
    email: 'juan.martinez@email.com',
    phone: '+57 320 5551234',
    registeredDate: '2024-03-10',
    totalOrders: 15,
    totalSpent: 2100000,
    status: 'Activo',
    password: 'password123',
    addresses: [],
    paymentMethods: []
  },
  {
    id: '4',
    name: 'María Fernanda Silva',
    email: 'maria.silva@email.com',
    phone: '+57 315 4445678',
    registeredDate: '2024-04-05',
    totalOrders: 5,
    totalSpent: 650000,
    status: 'Activo',
    password: 'password123',
    addresses: [],
    paymentMethods: []
  },
  {
    id: '5',
    name: 'Diego Alejandro Gómez',
    email: 'diego.gomez@email.com',
    phone: '+57 318 7778899',
    registeredDate: '2024-05-12',
    totalOrders: 3,
    totalSpent: 420000,
    status: 'Inactivo',
    password: 'password123',
    addresses: [],
    paymentMethods: []
  }
];

const initialOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    userId: '1',
    date: '2024-09-15',
    status: 'Entregado',
    total: 289980,
    items: [
      { name: 'Casco Integral Racing Pro', quantity: 1, price: 89990 },
      { name: 'Chaqueta de Cuero Premium', quantity: 1, price: 159990 },
      { name: 'Guantes Deportivos', quantity: 1, price: 29990 }
    ],
    shipping: {
      address: 'Calle 45 #23-12',
      city: 'Bogotá',
      state: 'Cundinamarca',
      zipCode: '110111',
      method: 'Envío Express',
      tracking: 'TRK123456789'
    },
    paymentMethod: 'Tarjeta de Crédito',
    customerName: 'Carlos Rodríguez',
    customerEmail: 'carlos.rodriguez@email.com',
    customerPhone: '+57 300 1234567'
  },
  {
    id: 'ORD-2024-002',
    userId: '2',
    date: '2024-09-18',
    status: 'En tránsito',
    total: 79990,
    items: [
      { name: 'Botas Touring Resistentes', quantity: 1, price: 79990 }
    ],
    shipping: {
      address: 'Carrera 15 #80-45',
      city: 'Bogotá',
      state: 'Cundinamarca',
      zipCode: '110221',
      method: 'Envío Estándar',
      tracking: 'TRK987654321'
    },
    paymentMethod: 'PSE',
    customerName: 'Ana María López',
    customerEmail: 'ana.lopez@email.com',
    customerPhone: '+57 310 9876543'
  }
];

// Funciones auxiliares para localStorage
const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const loadFromLocalStorage = (key: string, defaultValue: any) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<RegisteredUser[]>(() => 
    loadFromLocalStorage('motogear_users', initialUsers)
  );
  const [orders, setOrders] = useState<Order[]>(() => 
    loadFromLocalStorage('motogear_orders', initialOrders)
  );
  const [currentUser, setCurrentUserState] = useState<UserData | null>(() => 
    loadFromLocalStorage('motogear_current_user', null)
  );

  // Guardar datos cuando cambien
  useEffect(() => {
    saveToLocalStorage('motogear_users', users);
  }, [users]);

  useEffect(() => {
    saveToLocalStorage('motogear_orders', orders);
  }, [orders]);

  useEffect(() => {
    saveToLocalStorage('motogear_current_user', currentUser);
  }, [currentUser]);

  const addUser = (user: UserData, password: string) => {
    const newUser: RegisteredUser = {
      ...user,
      registeredDate: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      totalSpent: 0,
      status: 'Activo',
      password,
      addresses: [],
      paymentMethods: []
    };
    
    setUsers(prev => {
      const updated = [...prev, newUser];
      // Guardar inmediatamente en localStorage para asegurar persistencia
      try {
        localStorage.setItem('motogear_users', JSON.stringify(updated));
        console.log('Usuario registrado y guardado en localStorage:', newUser.email);
      } catch (error) {
        console.error('Error guardando usuario en localStorage:', error);
      }
      return updated;
    });
  };

  const addOrder = (order: Order) => {
    setOrders(prev => {
      const updated = [...prev, order];
      return updated;
    });
    
    // Actualizar estadísticas del usuario
    setUsers(prev => {
      const updated = prev.map(user => {
        if (user.id === order.userId) {
          return {
            ...user,
            totalOrders: user.totalOrders + 1,
            totalSpent: user.totalSpent + order.total
          };
        }
        return user;
      });
      return updated;
    });
  };

  const updateUser = (userId: string, updates: Partial<RegisteredUser>) => {
    setUsers(prev => {
      const updated = prev.map(user => 
        user.id === userId ? { ...user, ...updates } : user
      );
      return updated;
    });
    
    // Si se está actualizando el usuario actual, actualizar también currentUser
    if (currentUser && currentUser.id === userId) {
      const updatedUser = users.find(u => u.id === userId);
      if (updatedUser) {
        setCurrentUserState({
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone
        });
      }
    }
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(prev => {
      const updated = prev.map(order => 
        order.id === orderId ? { ...order, ...updates } : order
      );
      return updated;
    });
  };

  const getUserOrders = (userId: string) => {
    return orders.filter(order => order.userId === userId);
  };

  const loginUser = (email: string, password: string): UserData | null => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      const userData: UserData = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      };
      setCurrentUserState(userData);
      return userData;
    }
    return null;
  };

  const logoutUser = () => {
    setCurrentUserState(null);
  };

  const setCurrentUser = (user: UserData | null) => {
    setCurrentUserState(user);
  };

  // Funciones para gestión de direcciones
  const addUserAddress = (userId: string, address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: Date.now().toString()
    };
    
    setUsers(prev => {
      const updated = prev.map(user => {
        if (user.id === userId) {
          const addresses = address.isDefault 
            ? [newAddress, ...user.addresses.map(a => ({ ...a, isDefault: false }))]
            : [...user.addresses, newAddress];
          return { ...user, addresses };
        }
        return user;
      });
      return updated;
    });
  };

  const updateUserAddress = (userId: string, addressId: string, updates: Partial<Address>) => {
    setUsers(prev => {
      const updated = prev.map(user => {
        if (user.id === userId) {
          let addresses = user.addresses.map(addr => 
            addr.id === addressId ? { ...addr, ...updates } : addr
          );
          
          // Si se está marcando como predeterminada, desmarcar las demás
          if (updates.isDefault) {
            addresses = addresses.map(addr => 
              addr.id === addressId ? addr : { ...addr, isDefault: false }
            );
          }
          
          return { ...user, addresses };
        }
        return user;
      });
      return updated;
    });
  };

  const removeUserAddress = (userId: string, addressId: string) => {
    setUsers(prev => {
      const updated = prev.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            addresses: user.addresses.filter(addr => addr.id !== addressId)
          };
        }
        return user;
      });
      return updated;
    });
  };

  // Funciones para gestión de métodos de pago
  const addUserPaymentMethod = (userId: string, paymentMethod: Omit<PaymentMethod, 'id'>) => {
    const newPaymentMethod: PaymentMethod = {
      ...paymentMethod,
      id: Date.now().toString()
    };
    
    setUsers(prev => {
      const updated = prev.map(user => {
        if (user.id === userId) {
          const paymentMethods = paymentMethod.isDefault 
            ? [newPaymentMethod, ...user.paymentMethods.map(pm => ({ ...pm, isDefault: false }))]
            : [...user.paymentMethods, newPaymentMethod];
          return { ...user, paymentMethods };
        }
        return user;
      });
      return updated;
    });
  };

  const updateUserPaymentMethod = (userId: string, paymentMethodId: string, updates: Partial<PaymentMethod>) => {
    setUsers(prev => {
      const updated = prev.map(user => {
        if (user.id === userId) {
          let paymentMethods = user.paymentMethods.map(pm => 
            pm.id === paymentMethodId ? { ...pm, ...updates } : pm
          );
          
          // Si se está marcando como predeterminado, desmarcar los demás
          if (updates.isDefault) {
            paymentMethods = paymentMethods.map(pm => 
              pm.id === paymentMethodId ? pm : { ...pm, isDefault: false }
            );
          }
          
          return { ...user, paymentMethods };
        }
        return user;
      });
      return updated;
    });
  };

  const removeUserPaymentMethod = (userId: string, paymentMethodId: string) => {
    setUsers(prev => {
      const updated = prev.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            paymentMethods: user.paymentMethods.filter(pm => pm.id !== paymentMethodId)
          };
        }
        return user;
      });
      return updated;
    });
  };

  return (
    <AppContext.Provider value={{
      users,
      orders,
      currentUser,
      addUser,
      addOrder,
      updateUser,
      updateOrder,
      getUserOrders,
      loginUser,
      logoutUser,
      addUserAddress,
      updateUserAddress,
      removeUserAddress,
      addUserPaymentMethod,
      updateUserPaymentMethod,
      removeUserPaymentMethod,
      setCurrentUser
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