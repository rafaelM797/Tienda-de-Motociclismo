import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

import { Badge } from '../ui/badge';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Download, Calendar as CalendarIcon, Users, Package, DollarSign, ShoppingCart, FileText, Filter } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// Datos mock para reportes
const salesData = [
  { date: '2024-09-01', ventas: 45000, pedidos: 12, clientes: 8 },
  { date: '2024-09-02', ventas: 32000, pedidos: 8, clientes: 6 },
  { date: '2024-09-03', ventas: 78000, pedidos: 18, clientes: 15 },
  { date: '2024-09-04', ventas: 56000, pedidos: 14, clientes: 11 },
  { date: '2024-09-05', ventas: 89000, pedidos: 22, clientes: 18 },
  { date: '2024-09-06', ventas: 67000, pedidos: 16, clientes: 13 },
  { date: '2024-09-07', ventas: 94000, pedidos: 25, clientes: 20 },
  { date: '2024-09-08', ventas: 43000, pedidos: 11, clientes: 9 },
  { date: '2024-09-09', ventas: 71000, pedidos: 19, clientes: 16 },
  { date: '2024-09-10', ventas: 85000, pedidos: 21, clientes: 17 },
  { date: '2024-09-11', ventas: 62000, pedidos: 15, clientes: 12 },
  { date: '2024-09-12', ventas: 91000, pedidos: 24, clientes: 19 },
  { date: '2024-09-13', ventas: 55000, pedidos: 13, clientes: 10 },
  { date: '2024-09-14', ventas: 76000, pedidos: 17, clientes: 14 },
  { date: '2024-09-15', ventas: 68000, pedidos: 16, clientes: 13 }
];

const inventoryData = [
  { categoria: 'Cascos', stock: 45, vendidos: 23, valor: 1250000 },
  { categoria: 'Chaquetas', stock: 32, vendidos: 18, valor: 2100000 },
  { categoria: 'Botas', stock: 28, vendidos: 15, valor: 890000 },
  { categoria: 'Accesorios', stock: 67, vendidos: 34, valor: 450000 },
  { categoria: 'Repuestos', stock: 89, vendidos: 12, valor: 320000 }
];

const customerData = [
  { mes: 'Ene', nuevos: 45, recurrentes: 123, total: 168 },
  { mes: 'Feb', nuevos: 52, recurrentes: 134, total: 186 },
  { mes: 'Mar', nuevos: 48, recurrentes: 145, total: 193 },
  { mes: 'Abr', nuevos: 61, recurrentes: 156, total: 217 },
  { mes: 'May', nuevos: 55, recurrentes: 167, total: 222 },
  { mes: 'Jun', nuevos: 67, recurrentes: 178, total: 245 },
  { mes: 'Jul', nuevos: 59, recurrentes: 189, total: 248 },
  { mes: 'Ago', nuevos: 73, recurrentes: 201, total: 274 },
  { mes: 'Sep', nuevos: 68, recurrentes: 213, total: 281 }
];

const topProducts = [
  { nombre: 'Casco Integral Racing Pro', ventas: 89, ingresos: 7999110 },
  { nombre: 'Chaqueta de Cuero Premium', ventas: 67, ingresos: 10719330 },
  { nombre: 'Botas Touring Resistentes', ventas: 54, ingresos: 4319460 },
  { nombre: 'Guantes Deportivos', ventas: 78, ingresos: 2339220 },
  { nombre: 'Kit de Herramientas Básico', ventas: 34, ingresos: 1699660 }
];

const customerSegments = [
  { name: 'Nuevos', value: 35, color: '#dc2626' },
  { name: 'Recurrentes', value: 45, color: '#16a34a' },
  { name: 'VIP', value: 20, color: '#2563eb' }
];

const COLORS = ['#dc2626', '#16a34a', '#2563eb', '#ca8a04', '#9333ea'];

export function ReportsManagement() {
  const [activeTab, setActiveTab] = useState('sales');
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const handleExportData = (reportType: string) => {
    // Simulación de exportación
    const data = {
      sales: salesData,
      inventory: inventoryData,
      customers: customerData,
      products: topProducts
    };

    const csvContent = convertToCSV(data[reportType as keyof typeof data]);
    const today = new Date().toISOString().split('T')[0];
    downloadCSV(csvContent, `reporte_${reportType}_${today}.csv`);
    toast.success(`Reporte de ${reportType} exportado correctamente`);
  };

  const convertToCSV = (data: any[]) => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Cálculos para métricas
  const totalSales = salesData.reduce((sum, day) => sum + day.ventas, 0);
  const totalOrders = salesData.reduce((sum, day) => sum + day.pedidos, 0);
  const totalCustomers = salesData.reduce((sum, day) => sum + day.clientes, 0);
  const avgOrderValue = totalSales / totalOrders;

  const currentMonthSales = totalSales;
  const previousMonthSales = currentMonthSales * 0.85; // Simulado
  const salesGrowth = calculateGrowth(currentMonthSales, previousMonthSales);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reportes y Análisis</h2>
          <p className="text-gray-600">Análisis detallado del desempeño del negocio</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
              <SelectItem value="1y">Último año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Métricas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {salesGrowth > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
              )}
              <span className={salesGrowth > 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(salesGrowth).toFixed(1)}%
              </span>
              <span className="ml-1">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600">12.5%</span>
              <span className="ml-1">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Únicos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600">8.2%</span>
              <span className="ml-1">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgOrderValue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
              <span className="text-red-600">2.1%</span>
              <span className="ml-1">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
          <TabsTrigger value="sales" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
            Ventas
          </TabsTrigger>
          <TabsTrigger value="inventory" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
            Inventarios
          </TabsTrigger>
          <TabsTrigger value="customers" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
            Clientes
          </TabsTrigger>
          <TabsTrigger value="exports" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
            Exportar
          </TabsTrigger>
        </TabsList>

        {/* Reporte de Ventas */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolución de Ventas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                    />
                    <YAxis tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toLocaleString()}`, 'Ventas']}
                      labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="ventas" 
                      stroke="#dc2626" 
                      fill="#dc2626" 
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pedidos vs Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES')}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="pedidos" 
                      stroke="#2563eb" 
                      name="Pedidos"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="clientes" 
                      stroke="#16a34a" 
                      name="Clientes"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Productos Más Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.nombre} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{product.nombre}</h4>
                        <p className="text-sm text-gray-500">{product.ventas} unidades vendidas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        ${product.ingresos.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Ingresos</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reporte de Inventarios */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={inventoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="categoria" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="stock" fill="#2563eb" name="Stock Actual" />
                    <Bar dataKey="vendidos" fill="#dc2626" name="Vendidos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Valor del Inventario</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={inventoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ categoria, value }) => `${categoria}: $${(value/1000).toFixed(0)}k`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="valor"
                    >
                      {inventoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Análisis de Rotación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventoryData.map((item) => {
                  const rotacion = item.vendidos / item.stock;
                  const estado = rotacion > 0.5 ? 'Alta' : rotacion > 0.3 ? 'Media' : 'Baja';
                  const colorEstado = rotacion > 0.5 ? 'bg-green-100 text-green-800' : 
                                    rotacion > 0.3 ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-red-100 text-red-800';
                  
                  return (
                    <div key={item.categoria} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{item.categoria}</h4>
                          <p className="text-sm text-gray-500">
                            {item.vendidos} vendidos de {item.stock} en stock
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={colorEstado}>
                          Rotación {estado}
                        </Badge>
                        <div className="text-right">
                          <div className="font-medium">{(rotacion * 100).toFixed(1)}%</div>
                          <div className="text-sm text-gray-500">Rotación</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reporte de Clientes */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Crecimiento de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={customerData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="nuevos" 
                      stackId="1"
                      stroke="#dc2626" 
                      fill="#dc2626"
                      name="Nuevos"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="recurrentes" 
                      stackId="1"
                      stroke="#16a34a" 
                      fill="#16a34a"
                      name="Recurrentes"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segmentación de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={customerSegments}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Nuevos Clientes</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">68</div>
                <p className="text-sm text-gray-600">Este mes</p>
                <div className="flex items-center justify-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+15% vs mes anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Retención</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
                <p className="text-sm text-gray-600">Tasa de retención</p>
                <div className="flex items-center justify-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+3% vs mes anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Valor Promedio</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">$89k</div>
                <p className="text-sm text-gray-600">Por cliente</p>
                <div className="flex items-center justify-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-600">+7% vs mes anterior</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Exportación de Datos */}
        <TabsContent value="exports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Exportar Reportes</CardTitle>
                <p className="text-sm text-gray-600">
                  Descarga los datos en formato CSV para análisis externo
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => handleExportData('sales')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Datos de Ventas
                </Button>
                
                <Button 
                  onClick={() => handleExportData('inventory')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Datos de Inventario
                </Button>
                
                <Button 
                  onClick={() => handleExportData('customers')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Datos de Clientes
                </Button>
                
                <Button 
                  onClick={() => handleExportData('products')}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Productos Top
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reportes Programados</CardTitle>
                <p className="text-sm text-gray-600">
                  Configura reportes automáticos por email
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Reporte Semanal de Ventas</div>
                      <div className="text-sm text-gray-500">Cada lunes a las 9:00 AM</div>
                    </div>
                    <Badge variant="secondary">Activo</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Inventario Mensual</div>
                      <div className="text-sm text-gray-500">Primer día del mes</div>
                    </div>
                    <Badge variant="secondary">Activo</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Análisis de Clientes</div>
                      <div className="text-sm text-gray-500">Cada 15 días</div>
                    </div>
                    <Badge>Inactivo</Badge>
                  </div>
                </div>
                
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Configurar Nuevo Reporte
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Historial de Exportaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { tipo: 'Ventas', fecha: '2024-10-01 14:30', archivo: 'reporte_ventas_2024-10-01.csv', size: '2.4 MB' },
                  { tipo: 'Inventario', fecha: '2024-09-30 09:15', archivo: 'reporte_inventario_2024-09-30.csv', size: '1.8 MB' },
                  { tipo: 'Clientes', fecha: '2024-09-29 16:45', archivo: 'reporte_clientes_2024-09-29.csv', size: '3.2 MB' },
                  { tipo: 'Productos', fecha: '2024-09-28 11:20', archivo: 'reporte_productos_2024-09-28.csv', size: '1.1 MB' }
                ].map((export_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-gray-400" />
                      <div>
                        <div className="font-medium">{export_.archivo}</div>
                        <div className="text-sm text-gray-500">
                          {export_.tipo} • {export_.fecha} • {export_.size}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}