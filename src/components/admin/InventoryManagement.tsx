import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Plus, Edit, Trash2, Package, AlertTriangle, CheckCircle, Search, Filter } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  sku: string;
  stock: number;
  minStock: number;
  variants: ProductVariant[];
  image: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface ProductVariant {
  id: number;
  name: string;
  value: string;
  stock: number;
  price?: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
  productCount: number;
  status: 'active' | 'inactive';
}

// Mock data
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Casco Integral Racing Pro',
    description: 'Casco integral de alta gama para motociclismo deportivo',
    category: 'Cascos',
    price: 89990,
    cost: 45000,
    sku: 'CAS-RCG-001',
    stock: 15,
    minStock: 5,
    variants: [
      { id: 1, name: 'Talla', value: 'S', stock: 3 },
      { id: 2, name: 'Talla', value: 'M', stock: 8 },
      { id: 3, name: 'Talla', value: 'L', stock: 4 },
      { id: 4, name: 'Color', value: 'Negro', stock: 10 },
      { id: 5, name: 'Color', value: 'Rojo', stock: 5 }
    ],
    image: 'https://images.unsplash.com/photo-1673526154034-1749d70dd472?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwaGVsbWV0JTIwcmFjaW5nfGVufDF8fHx8MTc1OTM0MDIzNHww&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'active',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Chaqueta de Cuero Premium',
    description: 'Chaqueta de cuero genuino con protecciones',
    category: 'Chaquetas',
    price: 159990,
    cost: 80000,
    sku: 'CHQ-CUE-002',
    stock: 3,
    minStock: 5,
    variants: [
      { id: 6, name: 'Talla', value: 'M', stock: 1 },
      { id: 7, name: 'Talla', value: 'L', stock: 2 },
      { id: 8, name: 'Color', value: 'Negro', stock: 3 }
    ],
    image: 'https://images.unsplash.com/photo-1654720498638-46c8d93bc32d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwbGVhdGhlciUyMGphY2tldHxlbnwxfHx8fDE3NTkyNjcyMDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'active',
    createdAt: '2024-01-10'
  },
  {
    id: 3,
    name: 'Botas Touring Resistentes',
    description: 'Botas impermeables para touring de larga distancia',
    category: 'Botas',
    price: 79990,
    cost: 40000,
    sku: 'BOT-TUR-003',
    stock: 8,
    minStock: 3,
    variants: [
      { id: 9, name: 'Talla', value: '40', stock: 2 },
      { id: 10, name: 'Talla', value: '42', stock: 3 },
      { id: 11, name: 'Talla', value: '44', stock: 3 }
    ],
    image: 'https://images.unsplash.com/photo-1758621516645-637a426889c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwYm9vdHMlMjBnZWFyfGVufDF8fHx8MTc1OTM0MDIzNXww&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'active',
    createdAt: '2024-01-08'
  },
  {
    id: 4,
    name: 'Guantes Deportivos',
    description: 'Guantes con protecciones de nudillos y palma reforzada',
    category: 'Accesorios',
    price: 29990,
    cost: 15000,
    sku: 'GUA-DEP-004',
    stock: 2,
    minStock: 5,
    variants: [
      { id: 12, name: 'Talla', value: 'S', stock: 0 },
      { id: 13, name: 'Talla', value: 'M', stock: 1 },
      { id: 14, name: 'Talla', value: 'L', stock: 1 }
    ],
    image: 'https://images.unsplash.com/photo-1719535218083-bd6f9c860229?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwZ2xvdmVzJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNTkzNDAyMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'active',
    createdAt: '2024-01-05'
  },
  {
    id: 5,
    name: 'Kit de Herramientas Básico',
    description: 'Kit completo de herramientas para mantenimiento básico',
    category: 'Accesorios',
    price: 49990,
    cost: 25000,
    sku: 'KIT-HER-005',
    stock: 12,
    minStock: 8,
    variants: [],
    image: 'https://images.unsplash.com/photo-1636761358757-0a616eb9e17e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwdG9vbHMlMjB3b3Jrc2hvcHxlbnwxfHx8fDE3NTkzNDM5MTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'active',
    createdAt: '2024-01-03'
  },
  {
    id: 6,
    name: 'Casco Modular Adventure',
    description: 'Casco modular para aventura con visera solar',
    category: 'Cascos',
    price: 129990,
    cost: 65000,
    sku: 'CAS-ADV-006',
    stock: 0,
    minStock: 3,
    variants: [
      { id: 15, name: 'Talla', value: 'M', stock: 0 },
      { id: 16, name: 'Talla', value: 'L', stock: 0 }
    ],
    image: 'https://images.unsplash.com/photo-1673526154034-1749d70dd472?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwaGVsbWV0JTIwcmFjaW5nfGVufDF8fHx8MTc1OTM0MDIzNHww&ixlib=rb-4.1.0&q=80&w=1080',
    status: 'inactive',
    createdAt: '2023-12-20'
  }
];

const mockCategories: Category[] = [
  { id: 1, name: 'Cascos', description: 'Cascos para motociclismo', productCount: 2, status: 'active' },
  { id: 2, name: 'Chaquetas', description: 'Chaquetas y protecciones', productCount: 1, status: 'active' },
  { id: 3, name: 'Botas', description: 'Calzado para motociclismo', productCount: 1, status: 'active' },
  { id: 4, name: 'Accesorios', description: 'Guantes y accesorios varios', productCount: 2, status: 'active' },
  { id: 5, name: 'Repuestos', description: 'Repuestos y herramientas', productCount: 0, status: 'inactive' }
];

export function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategoryEdit, setSelectedCategoryEdit] = useState<Category | null>(null);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  // Filtros para productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Productos con stock bajo
  const lowStockProducts = products.filter(product => product.stock <= product.minStock);

  const handleSaveProduct = (productData: Partial<Product>) => {
    if (selectedProduct) {
      // Editar producto existente
      setProducts(prev => prev.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, ...productData }
          : p
      ));
      toast.success('Producto actualizado correctamente');
    } else {
      // Crear nuevo producto
      const newProduct: Product = {
        id: Date.now(),
        ...productData as Product,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setProducts(prev => [...prev, newProduct]);
      toast.success('Producto creado correctamente');
    }
    setIsProductDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast.success('Producto eliminado correctamente');
  };

  const handleSaveCategory = (categoryData: Partial<Category>) => {
    if (selectedCategoryEdit) {
      // Editar categoría existente
      setCategories(prev => prev.map(c => 
        c.id === selectedCategoryEdit.id 
          ? { ...c, ...categoryData }
          : c
      ));
      toast.success('Categoría actualizada correctamente');
    } else {
      // Crear nueva categoría
      const newCategory: Category = {
        id: Date.now(),
        productCount: 0,
        ...categoryData as Category
      };
      setCategories(prev => [...prev, newCategory]);
      toast.success('Categoría creada correctamente');
    }
    setIsCategoryDialogOpen(false);
    setSelectedCategoryEdit(null);
  };

  const handleDeleteCategory = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (category && category.productCount > 0) {
      toast.error('No se puede eliminar una categoría con productos asociados');
      return;
    }
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    toast.success('Categoría eliminada correctamente');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Inventarios</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
          <TabsTrigger value="products" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
            Productos
          </TabsTrigger>
          <TabsTrigger value="stock" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
            Control de Stock
          </TabsTrigger>
          <TabsTrigger value="categories" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
            Categorías
          </TabsTrigger>
        </TabsList>

        {/* Tab Productos */}
        <TabsContent value="products" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.filter(c => c.status === 'active').map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setSelectedProduct(null)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Producto
                </Button>
              </DialogTrigger>
              <ProductDialog 
                product={selectedProduct}
                categories={categories.filter(c => c.status === 'active')}
                onSave={handleSaveProduct}
              />
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={(product) => {
                  setSelectedProduct(product);
                  setIsProductDialogOpen(true);
                }}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        </TabsContent>

        {/* Tab Control de Stock */}
        <TabsContent value="stock" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products.length}</div>
                <p className="text-xs text-muted-foreground">
                  +2 nuevos este mes
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{lowStockProducts.length}</div>
                <p className="text-xs text-muted-foreground">
                  Requieren atención
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Inventario</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${products.reduce((sum, p) => sum + (p.cost * p.stock), 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Costo total
                </p>
              </CardContent>
            </Card>
          </div>

          {lowStockProducts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Productos con Stock Bajo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowStockProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-yellow-800">
                          Stock: {product.stock} / Mínimo: {product.minStock}
                        </div>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Stock Bajo
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Resumen de Stock por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.filter(c => c.status === 'active').map((category) => {
                  const categoryProducts = products.filter(p => p.category === category.name);
                  const totalStock = categoryProducts.reduce((sum, p) => sum + p.stock, 0);
                  const lowStockCount = categoryProducts.filter(p => p.stock <= p.minStock).length;
                  
                  return (
                    <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{category.name}</h4>
                        <p className="text-sm text-gray-500">{categoryProducts.length} productos</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">Stock Total: {totalStock}</div>
                        {lowStockCount > 0 && (
                          <div className="text-sm text-yellow-600">
                            {lowStockCount} con stock bajo
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Categorías */}
        <TabsContent value="categories" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {categories.length} categorías en total
            </div>
            <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={() => setSelectedCategoryEdit(null)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Categoría
                </Button>
              </DialogTrigger>
              <CategoryDialog 
                category={selectedCategoryEdit}
                onSave={handleSaveCategory}
              />
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={(category) => {
                  setSelectedCategoryEdit(category);
                  setIsCategoryDialogOpen(true);
                }}
                onDelete={handleDeleteCategory}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente ProductCard
function ProductCard({ product, onEdit, onDelete }: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}) {
  const isLowStock = product.stock <= product.minStock;
  const profit = product.price - product.cost;
  const profitMargin = ((profit / product.price) * 100).toFixed(1);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(product)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. El producto será eliminado permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(product.id)}>
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-500">SKU: {product.sku}</p>
          <div className="flex items-center justify-between">
            <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
              {product.status === 'active' ? 'Activo' : 'Inactivo'}
            </Badge>
            <Badge variant={isLowStock ? 'destructive' : 'secondary'}>
              Stock: {product.stock}
            </Badge>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">Precio:</span>
              <span className="font-medium">${product.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Costo:</span>
              <span>${product.cost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Margen:</span>
              <span className="text-green-600">{profitMargin}%</span>
            </div>
          </div>
          {product.variants.length > 0 && (
            <div className="text-xs text-gray-500">
              {product.variants.length} variantes
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Componente CategoryCard
function CategoryCard({ category, onEdit, onDelete }: {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{category.description}</p>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(category)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 hover:text-red-700"
                  disabled={category.productCount > 0}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. La categoría será eliminada permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(category.id)}>
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant={category.status === 'active' ? 'default' : 'secondary'}>
              {category.status === 'active' ? 'Activa' : 'Inactiva'}
            </Badge>
            <span className="text-sm text-gray-500">
              {category.productCount} productos
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente ProductDialog
function ProductDialog({ product, categories, onSave }: {
  product: Product | null;
  categories: Category[];
  onSave: (product: Partial<Product>) => void;
}) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    category: '',
    price: 0,
    cost: 0,
    sku: '',
    stock: 0,
    minStock: 0,
    image: '',
    status: 'active',
    variants: []
  });

  // Inicializar formulario cuando se abre
  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        description: '',
        category: '',
        price: 0,
        cost: 0,
        sku: '',
        stock: 0,
        minStock: 0,
        image: '',
        status: 'active',
        variants: []
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.sku) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }
    onSave(formData);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {product ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nombre del producto"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
              placeholder="Código SKU"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descripción del producto"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categoría *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: 'active' | 'inactive') => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Precio de Venta</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cost">Costo</Label>
            <Input
              id="cost"
              type="number"
              value={formData.cost}
              onChange={(e) => setFormData(prev => ({ ...prev, cost: Number(e.target.value) }))}
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="stock">Stock Actual</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minStock">Stock Mínimo</Label>
            <Input
              id="minStock"
              type="number"
              value={formData.minStock}
              onChange={(e) => setFormData(prev => ({ ...prev, minStock: Number(e.target.value) }))}
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">URL de Imagen</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
            placeholder="https://..."
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" className="bg-red-600 hover:bg-red-700">
            {product ? 'Actualizar' : 'Crear'} Producto
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

// Componente CategoryDialog
function CategoryDialog({ category, onSave }: {
  category: Category | null;
  onSave: (category: Partial<Category>) => void;
}) {
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    description: '',
    status: 'active'
  });

  // Inicializar formulario cuando se abre
  useEffect(() => {
    if (category) {
      setFormData(category);
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'active'
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Por favor ingresa el nombre de la categoría');
      return;
    }
    onSave(formData);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {category ? 'Editar Categoría' : 'Nueva Categoría'}
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Nombre de la categoría"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descripción de la categoría"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value: 'active' | 'inactive') => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Activa</SelectItem>
              <SelectItem value="inactive">Inactiva</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" className="bg-red-600 hover:bg-red-700">
            {category ? 'Actualizar' : 'Crear'} Categoría
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}