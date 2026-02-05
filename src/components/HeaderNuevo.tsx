import React from 'react';
import { ShoppingCart, Menu, Search, User, Settings, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import type { UserData } from './AuthModal';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onAdminClick: () => void;
  currentUser: UserData | null;
  onUserClick: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  currentView?: string;
  onNavigate?: (view: string) => void;
  showFavorites?: boolean;
  onFavoritesClick?: () => void;
}

export function Header({ cartItemsCount, onCartClick, onAdminClick, currentUser, onUserClick, searchTerm, onSearchChange, currentView, onNavigate, showFavorites, onFavoritesClick }: HeaderProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">MotoGear</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button
              type="button"
              className={`bg-transparent border-none p-0 m-0 text-base font-normal focus:outline-none transition-colors ${currentView === 'home' ? 'text-red-600 font-semibold' : 'text-gray-900 hover:text-primary'}`}
              onClick={() => onNavigate && onNavigate('home')}
            >
              Inicio
            </button>
            <button
              type="button"
              className={`bg-transparent border-none p-0 m-0 text-base font-normal focus:outline-none transition-colors ${currentView === 'offers' ? 'text-red-600 font-semibold' : 'text-gray-900 hover:text-primary'}`}
              onClick={() => onNavigate && onNavigate('offers')}
            >
              Ofertas
            </button>
            <button
              type="button"
              className={`bg-transparent border-none p-0 m-0 text-base font-normal focus:outline-none transition-colors ${currentView === 'catalog' ? 'text-red-600 font-semibold' : 'text-gray-900 hover:text-primary'}`}
              onClick={() => onNavigate && onNavigate('catalog')}
            >
              Accesorios
            </button>
            <button
              type="button"
              className={`bg-transparent border-none p-0 m-0 text-base font-normal focus:outline-none transition-colors ${currentView === 'new' ? 'text-red-600 font-semibold' : 'text-gray-900 hover:text-primary'}`}
              onClick={() => onNavigate && onNavigate('new')}
            >
              Lo Nuevo
            </button>
          </nav>

          {/* Search */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar productos..."
                className="pl-10"
                value={searchTerm}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {showFavorites && (
              <Button variant="ghost" size="icon" onClick={onFavoritesClick} title="Favoritos">
                <Heart className={`h-5 w-5 ${currentView === 'favorites' ? 'text-red-600' : ''}`} />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onUserClick}
              className={currentUser ? 'bg-red-50 text-red-600' : ''}
              title={currentUser ? `${currentUser.name}` : 'Iniciar sesión'}
            >
              <User className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" onClick={onAdminClick} title="Panel de Administración">
              <Settings className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon" onClick={onCartClick} className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
