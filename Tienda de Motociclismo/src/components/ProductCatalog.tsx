import { useState, useMemo } from 'react';
import { ProductCard, type Product } from './ProductCard';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Search, Filter, SortAsc } from 'lucide-react';

interface ProductCatalogProps {
  onAddToCart: (product: Product) => void;
  onBack: () => void;
  showOnlyOffers?: boolean;
}

// Catálogo completo de productos
const allProducts: Product[] = [
  // Cascos
  {
    id: 1,
    name: 'Casco Integral Racing Pro',
    price: 89990,
    originalPrice: 119990,
    image: 'https://images.unsplash.com/photo-1673526154034-1749d70dd472?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwaGVsbWV0JTIwcmFjaW5nfGVufDF8fHx8MTc1OTM0MDIzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Cascos',
    rating: 4.8,
    inStock: true
  },
  {
    id: 5,
    name: 'Casco Modular Adventure',
    price: 129990,
    image: 'https://images.unsplash.com/photo-1673526154034-1749d70dd472?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwaGVsbWV0JTIwcmFjaW5nfGVufDF8fHx8MTc1OTM0MDIzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Cascos',
    rating: 4.9,
    inStock: false
  },
  {
    id: 7,
    name: 'Casco Deportivo Carbon',
    price: 199990,
    originalPrice: 249990,
    image: 'https://images.unsplash.com/photo-1673526154034-1749d70dd472?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwaGVsbWV0JTIwcmFjaW5nfGVufDF8fHx8MTc1OTM0MDIzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Cascos',
    rating: 4.9,
    inStock: true
  },
  {
    id: 8,
    name: 'Casco Open Face Vintage',
    price: 69990,
    image: 'https://images.unsplash.com/photo-1673526154034-1749d70dd472?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwaGVsbWV0JTIwcmFjaW5nfGVufDF8fHx8MTc1OTM0MDIzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Cascos',
    rating: 4.5,
    inStock: true
  },

  // Chaquetas
  {
    id: 2,
    name: 'Chaqueta de Cuero Premium',
    price: 159990,
    originalPrice: 199990,
    image: 'https://images.unsplash.com/photo-1654720498638-46c8d93bc32d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwbGVhdGhlciUyMGphY2tldHxlbnwxfHx8fDE3NTkyNjcyMDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Chaquetas',
    rating: 4.6,
    inStock: true
  },
  {
    id: 6,
    name: 'Chaqueta Textil Ventilada',
    price: 99990,
    image: 'https://images.unsplash.com/photo-1654720498638-46c8d93bc32d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwbGVhdGhlciUyMGphY2tldHxlbnwxfHx8fDE3NTkyNjcyMDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Chaquetas',
    rating: 4.4,
    inStock: true
  },
  {
    id: 9,
    name: 'Chaqueta Touring Impermeable',
    price: 179990,
    image: 'https://images.unsplash.com/photo-1654720498638-46c8d93bc32d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwbGVhdGhlciUyMGphY2tldHxlbnwxfHx8fDE3NTkyNjcyMDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Chaquetas',
    rating: 4.7,
    inStock: true
  },
  {
    id: 10,
    name: 'Chaqueta Racing Aerodinámica',
    price: 249990,
    originalPrice: 299990,
    image: 'https://images.unsplash.com/photo-1654720498638-46c8d93bc32d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwbGVhdGhlciUyMGphY2tldHxlbnwxfHx8fDE3NTkyNjcyMDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Chaquetas',
    rating: 4.8,
    inStock: true
  },

  // Botas
  {
    id: 3,
    name: 'Botas Touring Resistentes',
    price: 79990,
    image: 'https://images.unsplash.com/photo-1758621516645-637a426889c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwYm9vdHMlMjBnZWFyfGVufDF8fHx8MTc1OTM0MDIzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Botas',
    rating: 4.5,
    inStock: true
  },
  {
    id: 11,
    name: 'Botas Racing Deportivas',
    price: 119990,
    originalPrice: 149990,
    image: 'https://images.unsplash.com/photo-1758621516645-637a426889c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwYm9vdHMlMjBnZWFyfGVufDF8fHx8MTc1OTM0MDIzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Botas',
    rating: 4.7,
    inStock: true
  },
  {
    id: 12,
    name: 'Botas Adventure Impermeables',
    price: 149990,
    image: 'https://images.unsplash.com/photo-1758621516645-637a426889c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwYm9vdHMlMjBnZWFyfGVufDF8fHx8MTc1OTM0MDIzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Botas',
    rating: 4.6,
    inStock: false
  },

  // Accesorios
  {
    id: 4,
    name: 'Guantes Deportivos',
    price: 29990,
    originalPrice: 39990,
    image: 'https://images.unsplash.com/photo-1719535218083-bd6f9c860229?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwZ2xvdmVzJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzU5MzQwMjM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Accesorios',
    rating: 4.7,
    inStock: true
  },
  {
    id: 13,
    name: 'Protecciones Completas',
    price: 89990,
    image: 'https://images.unsplash.com/photo-1719535218083-bd6f9c860229?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwZ2xvdmVzJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzU5MzQwMjM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Accesorios',
    rating: 4.8,
    inStock: true
  },
  {
    id: 14,
    name: 'Intercomunicador Bluetooth',
    price: 59990,
    originalPrice: 79990,
    image: 'https://images.unsplash.com/photo-1719535218083-bd6f9c860229?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwZ2xvdmVzJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzU5MzQwMjM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Accesorios',
    rating: 4.5,
    inStock: true
  },
  {
    id: 15,
    name: 'Gafas de Protección',
    price: 19990,
    image: 'https://images.unsplash.com/photo-1719535218083-bd6f9c860229?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwZ2xvdmVzJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzU5MzQwMjM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Accesorios',
    rating: 4.3,
    inStock: true
  },

  // Pantalones
  {
    id: 16,
    name: 'Pantalones Touring Resistentes',
    price: 109990,
    image: 'https://images.unsplash.com/photo-1654720498638-46c8d93bc32d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwbGVhdGhlciUyMGphY2tldHxlbnwxfHx8fDE3NTkyNjcyMDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Pantalones',
    rating: 4.6,
    inStock: true
  },
  {
    id: 17,
    name: 'Pantalones Cuero Racing',
    price: 179990,
    originalPrice: 219990,
    image: 'https://images.unsplash.com/photo-1654720498638-46c8d93bc32d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwbGVhdGhlciUyMGphY2tldHxlbnwxfHx8fDE3NTkyNjcyMDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Pantalones',
    rating: 4.8,
    inStock: true
  },
  {
    id: 18,
    name: 'Pantalones Textil Ventilados',
    price: 79990,
    image: 'https://images.unsplash.com/photo-1654720498638-46c8d93bc32d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwbGVhdGhlciUyMGphY2tldHxlbnwxfHx8fDE3NTkyNjcyMDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Pantalones',
    rating: 4.4,
    inStock: true
  }
];

const categories = ['Todos', 'Cascos', 'Chaquetas', 'Botas', 'Accesorios', 'Pantalones'];
const sortOptions = [
  { value: 'name', label: 'Nombre' },
  { value: 'price-low', label: 'Precio: Menor a Mayor' },
  { value: 'price-high', label: 'Precio: Mayor a Menor' },
  { value: 'rating', label: 'Mejor Valorados' }
];

export function ProductCatalog({ onAddToCart, onBack, showOnlyOffers = false }: ProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('name');
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts;

    // Filtrar solo ofertas si se especifica
    if (showOnlyOffers) {
      filtered = filtered.filter(product => product.originalPrice);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filtrar por stock
    if (showOnlyInStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy, showOnlyInStock, showOnlyOffers]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="outline" onClick={onBack} className="mb-4">
              ← Volver al Inicio
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {showOnlyOffers ? 'Ofertas Especiales' : 'Catálogo de Productos'}
            </h1>
            <p className="text-gray-600 mt-2">
              {filteredAndSortedProducts.length} productos encontrados
            </p>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Categoría */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Ordenar */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Solo en stock */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="inStock"
                checked={showOnlyInStock}
                onChange={(e) => setShowOnlyInStock(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="inStock" className="text-sm text-gray-700">
                Solo en stock
              </label>
            </div>
          </div>
        </div>

        {/* Grid de productos */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        )}

        {/* Estadísticas por categoría */}
        <div className="mt-16 bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Productos por Categoría
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.slice(1).map(category => {
              const count = allProducts.filter(p => p.category === category).length;
              return (
                <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{count}</div>
                  <div className="text-sm text-gray-600">{category}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}