import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategorySection } from './components/CategorySection';
import { ExperienceSection } from './components/ExperienceSection';
import { ProductCard, type Product } from './components/ProductCard';
import { ProductCatalog } from './components/ProductCatalog';
import { CartSidebar } from './components/CartSidebar';
import { CheckoutFlow } from './components/CheckoutFlow';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AuthModal, type UserData } from './components/AuthModal';
import { UserProfile } from './components/UserProfile';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { getUserFavorites, toggleFavorite } from './apiFavoritos';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { toast } from 'sonner';
import API_URL from './apiConfig';
import { SpeedInsights } from '@vercel/speed-insights/react';

interface CartItem extends Product {
  quantity: number;
}

// Estado para productos y búsqueda


function AppContent() {
  const { currentUser, setCurrentUser, logoutUser, products } = useAppContext();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]); // ids de productos favoritos

  // Cargar favoritos al iniciar sesión
  useEffect(() => {
    if (!currentUser) {
      setFavorites([]);
      return;
    }
    getUserFavorites(currentUser.id)
      .then(favs => setFavorites(favs.map((p: any) => p._id || p.id)))
      .catch(() => setFavorites([]));
  }, [currentUser]);

  const handleToggleFavorite = async (product: Product) => {
    if (!currentUser) {
      toast.error('Debes iniciar sesión para usar favoritos');
      return;
    }
    try {
      const nuevos = await toggleFavorite(currentUser.id, product.id);
      setFavorites(nuevos.map((p: any) => p._id || p.id));
      toast.success(nuevos.some((p: any) => (p._id || p.id) === product.id) ? 'Agregado a favoritos' : 'Eliminado de favoritos');
    } catch (err: any) {
      toast.error('Error al actualizar favoritos');
    }
  };
  // Filtrar productos según búsqueda
  const filteredProducts = products.filter((p: any) =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'offers' | 'new'>('home');
  const [pendingCheckout, setPendingCheckout] = useState(false);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    toast.success(`${product.name} agregado al carrito`);
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast.success('Producto eliminado del carrito');
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Tu carrito está vacío');
      return;
    }
    
    // Verificar si el usuario está logueado
    if (!currentUser) {
      toast.error('Debes iniciar sesión para proceder con la compra');
      setPendingCheckout(true);
      setIsCartOpen(false);
      setTimeout(() => {
        setIsAuthModalOpen(true);
      }, 100);
      return;
    }
    
    setIsCartOpen(false);
    setTimeout(() => {
      setIsCheckoutOpen(true);
    }, 100);
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    setIsCheckoutOpen(false);
  };

  const handleLogin = (user: UserData) => {
    setCurrentUser(user);
    toast.success(`¡Bienvenido, ${user.name}!`);
    setIsAuthModalOpen(false); // Cerrar modal tras login
    setCurrentView('home'); // Volver a la vista principal
    // Si había un checkout pendiente, proceder automáticamente
    if (pendingCheckout) {
      setPendingCheckout(false);
      setTimeout(() => {
        setIsCheckoutOpen(true);
        toast.success('Ahora puedes continuar con tu compra');
      }, 500);
    }
  };

  const handleLogout = () => {
    logoutUser();
  };

  const handleUserIconClick = () => {
    if (currentUser) {
      setIsUserProfileOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAdminClick = () => {
    setIsAdminLoginOpen(true);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminPanelOpen(true);
  };

  if (isAdminPanelOpen) {
    return <AdminPanel onClose = {() => setIsAdminPanelOpen(false)} />
  }

  const renderMainContent = () => {
    switch (currentView) {
      case 'catalog':
        return (
          <section className="p-8">
            <h1 className="text-2xl font-bold mb-4">Catálogo de Productos</h1>
            {/* Si quieres mostrar un loader, usa products.length === 0 */}
            {products.length === 0 && <p style={{color:'red',fontWeight:'bold'}}>No se encontraron productos. Verifica el backend o los datos.</p>}
            <div className="flex flex-wrap gap-4">
              {filteredProducts.length === 0 && products.length > 0 ? (
                <div className="w-full text-center text-gray-500">No hay productos que coincidan con la búsqueda.</div>
              ) : (
                filteredProducts.map((product) => (
                  <div key={product.id || Math.random()} className="w-80">
                    {product && product.name ? (
                      <ProductCard 
                        product={product} 
                        onAddToCart={addToCart}
                        onToggleFavorite={handleToggleFavorite}
                        isFavorite={favorites.includes(product.id?.toString())}
                      />
                    ) : (
                      <div className="p-4 border rounded bg-yellow-100 text-yellow-800">Producto inválido o incompleto</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        );
      case 'offers':
        return (
          <section className="p-8">
            <h1 className="text-2xl font-bold mb-4">Ofertas</h1>
            {products.length === 0 && <p>Cargando productos...</p>}
            <div className="flex flex-wrap gap-4">
              {filteredProducts
                .filter(p => p.originalPrice && p.originalPrice > p.price)
                .map((product) => (
                  <div key={product.id} className="w-80">
                    <ProductCard 
                      product={product} 
                      onAddToCart={addToCart}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={favorites.includes(product.id?.toString())}
                    />
                  </div>
                ))}
            </div>
            {products.length > 0 && filteredProducts.filter(p => p.originalPrice && p.originalPrice > p.price).length === 0 && <p>No hay ofertas disponibles.</p>}
          </section>
        );
      case 'home':
      default:
        return (
          <>
            <Hero onViewProducts={() => setCurrentView('catalog')} onViewOffers={() => setCurrentView('offers')} />
            <ExperienceSection />
            <CategorySection />
            {/* Productos Destacados */}
            <section className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <div className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    ⭐ Los Más Populares
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Productos Destacados
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Descubre nuestra selección de productos más populares con las mejores ofertas
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.slice(0, 6).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={favorites.includes(product.id?.toString())}
                    />
                  ))}
                </div>
                {/* Call to Action */}
                <div className="text-center mt-12">
                  <button 
                    onClick={() => setCurrentView('catalog')}
                    className="inline-flex items-center px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Ver Catálogo Completo
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </section>
            {/* Newsletter */}
            <section className="relative py-16 bg-gray-900 overflow-hidden">
              <div className="absolute inset-0">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1715327876958-011d71c0682d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwY29tbXVuaXR5JTIwcmlkZXJzJTIwZ3JvdXB8ZW58MXx8fHwxNzU5MzU2NTA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Comunidad de motociclistas"
                  className="w-full h-full object-cover opacity-20"
                />
              </div>
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 inline-block">
                  🚀 ¡Únete a la Comunidad!
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Mantente Informado
                </h2>
                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                  Suscríbete a nuestro newsletter y recibe ofertas exclusivas, tips de seguridad y las últimas novedades del mundo motociclista
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Tu email"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold">
                    Suscribirse
                  </button>
                </div>
                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-3xl mx-auto">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎁</div>
                    <div className="text-white font-semibold">Ofertas Exclusivas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🛡️</div>
                    <div className="text-white font-semibold">Tips de Seguridad</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-white font-semibold">Novedades First</div>
                  </div>
                </div>
              </div>
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        cartItemsCount={cartItemsCount}
        onCartClick={() => setIsCartOpen(true)}
        onAdminClick={handleAdminClick}
        currentUser={currentUser}
        onUserClick={handleUserIconClick}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view as any)}
      />
      <main>
        {renderMainContent()}
        {/* Barra de búsqueda visible en todas las vistas, incluida home */}
        {currentView === 'home' && (
          <div className="flex justify-center py-6 md:hidden">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="pl-10 pr-4 py-2 border rounded-md w-full"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 0 5 11a6 6 0 0 0 12 0Z" />
                </svg>
              </span>
            </div>
          </div>
        )}
      </main>
      {currentView === 'home' && <Footer />}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
        isUserLoggedIn={!!currentUser}
      />
      <CheckoutFlow
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderComplete={handleOrderComplete}
        currentUserId={currentUser?.id}
      />
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
      {currentUser && (
        <UserProfile
          isOpen={isUserProfileOpen}
          onClose={() => setIsUserProfileOpen(false)}
          user={currentUser}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <SpeedInsights />
    </AppProvider>
  );
}