import { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import API_URL from '../../apiConfig';
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
import { toast } from 'sonner';

interface Product {
  _id?: string;
  id?: number;
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
  // status: 'active' | 'inactive';
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
  _id?: string;
  id?: string | number;
  nombre?: string;
  name?: string;
  descripcion?: string;
  description?: string;
  createdAt?: string;
}

export function InventoryManagement() {
  // Usar productos del contexto global
  const { products } = useAppContext() as { products: any[] };
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAppContext();
  // Ajusta el tipo de currentUser para que tenga 'role', si no existe, revisa la definición de UserData
  const isAdmin = (currentUser as any)?.role === 'admin';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
        try {
          const [prodRes, catRes] = await Promise.all([
            fetch(`${API_URL}/api/productos`),
            fetch(`${API_URL}/api/categorias`)
          ]);
          if (!prodRes.ok) throw new Error('Error al cargar productos');
          if (!catRes.ok) throw new Error('Error al cargar categorías');
          const productos = await prodRes.json();
          const categorias = await catRes.json();
          // productos ya se actualizan por el contexto
          setCategories(categorias);
        } catch (err: any) {
          setError(err.message || 'Error desconocido');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);
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

  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (selectedProduct) {
      // Editar producto existente en el backend
      try {
        const res = await fetch(`${API_URL}/api/productos/${selectedProduct._id || selectedProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('Error al actualizar producto:', errorData);
          throw new Error(errorData.error || 'Error al actualizar producto');
        }
        const actualizado = await res.json();
        toast.success('Producto actualizado correctamente');
        setIsProductDialogOpen(false);
        setSelectedProduct(null);
      } catch (err: any) {
        toast.error(err.message || 'Error al actualizar producto');
      }
    } else {
      // Crear nuevo producto en el backend
      try {
        // Adaptar los campos al modelo del backend
        const backendProduct = {
          nombre: productData.name,
          descripcion: productData.description,
          precio: productData.price,
          categoria: productData.category,
          imagen: productData.image,
          enOferta: false
        };
        const res = await fetch(`${API_URL}/api/productos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(backendProduct)
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('Error al crear producto:', errorData);
          throw new Error(errorData.error || 'Error al crear producto');
        }
        const nuevo = await res.json();
        toast.success('Producto creado correctamente');
        setIsProductDialogOpen(false);
        setSelectedProduct(null);
      } catch (err: any) {
        toast.error(err.message || 'Error al crear producto');
      }
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const res = await fetch(`${API_URL}/api/productos/${productId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Error al eliminar producto');
  // productos ya se actualizan por el contexto
      toast.success('Producto eliminado correctamente');
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar producto');
    }
  };

  const handleSaveCategory = async (categoryData: Partial<Category>) => {
    if (selectedCategoryEdit) {
      // Editar categoría existente en el backend
      try {
        const categoryId = selectedCategoryEdit._id || selectedCategoryEdit.id;
        const res = await fetch(`${API_URL}/api/categorias/${categoryId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: categoryData.nombre || categoryData.name,
            descripcion: categoryData.descripcion || categoryData.description
          })
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('Error al actualizar categoría:', errorData);
          throw new Error(errorData.error || 'Error al actualizar categoría');
        }
        const actualizada = await res.json();
        setCategories(prev => prev.map(c => 
          (c._id === actualizada._id || c.id === actualizada.id) ? actualizada : c
        ));
        toast.success('Categoría actualizada correctamente');
      } catch (err: any) {
        toast.error(err.message || 'Error al actualizar categoría');
        return;
      }
    } else {
      // Crear nueva categoría en el backend
      try {
        const res = await fetch(`${API_URL}/api/categorias`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: categoryData.nombre || categoryData.name,
            descripcion: categoryData.descripcion || categoryData.description
          })
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error('Error al crear categoría:', errorData);
          throw new Error(errorData.error || 'Error al crear categoría');
        }
        const nueva = await res.json();
        setCategories(prev => [...prev, nueva]);
        toast.success('Categoría creada correctamente');
      } catch (err: any) {
        toast.error(err.message || 'Error al crear categoría');
        return;
      }
    }
    setIsCategoryDialogOpen(false);
    setSelectedCategoryEdit(null);
  };

  const handleDeleteCategory = async (categoryId: string | number) => {
    try {
      const res = await fetch(`${API_URL}/api/categorias/${categoryId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Error al eliminar categoría');
      setCategories(prev => prev.filter(c => c.id !== categoryId && c._id !== categoryId));
      toast.success('Categoría eliminada correctamente');
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar categoría');
    }
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
                  {categories.map(category => (
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
                categories={categories}
                onSave={handleSaveProduct}
              />
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onEdit={(product) => {
                  setSelectedProduct(product);
                  setIsProductDialogOpen(true);
                }}
                onDelete={(id) => handleDeleteProduct(String(product._id ?? product.id))}
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
                {categories.map((category) => {
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
                  <AlertDialogAction onClick={() => onDelete(Number(product.id))}>
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
            {/* Aquí podrías mostrar información adicional del producto si tu modelo real la tiene */}
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
  onDelete: (id: string | number) => void;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{category.nombre || category.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{category.descripcion || category.description}</p>
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
                  // Si tu modelo real tiene lógica para deshabilitar, agrégala aquí
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
                  <AlertDialogAction onClick={() => onDelete(category._id || category.id)}>
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {/* Aquí podrías mostrar información adicional de la categoría si tu modelo real la tiene */}
            {/* Aquí podrías mostrar información adicional si tu modelo real la tiene */}
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
              onValueChange={(value: string) => setFormData(prev => ({ ...prev, category: value }))}
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
          {/* Si tu modelo real tiene estado, agrégalo aquí */}
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
    nombre: '',
    descripcion: ''
  });

  // Inicializar formulario cuando se abre
  useEffect(() => {
    if (category) {
      setFormData({
        nombre: category.nombre || category.name || '',
        descripcion: category.descripcion || category.description || ''
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: ''
      });
    }
  }, [category]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre) {
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
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            placeholder="Nombre de la categoría"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            value={formData.descripcion}
            onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
            placeholder="Descripción de la categoría"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Estado</Label>
          <Select 
            // value={formData.status}
            // onValueChange={(value: 'active' | 'inactive') => setFormData(prev => ({ ...prev, status: value }))}
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