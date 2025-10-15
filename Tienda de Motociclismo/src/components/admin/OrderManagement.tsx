import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Eye, Filter, Search, Download } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  items: number;
  paymentMethod: string;
  address: string;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    customer: 'Carlos Rodriguez',
    email: 'carlos@email.com',
    total: 189980,
    status: 'processing',
    date: '2024-01-15',
    items: 2,
    paymentMethod: 'Tarjeta de Crédito',
    address: 'Av. Providencia 1234, Santiago'
  },
  {
    id: 'ORD-2024-002',
    customer: 'Maria González',
    email: 'maria@email.com',
    total: 89990,
    status: 'shipped',
    date: '2024-01-14',
    items: 1,
    paymentMethod: 'PayPal',
    address: 'Los Leones 567, Las Condes'
  },
  {
    id: 'ORD-2024-003',
    customer: 'Pedro Silva',
    email: 'pedro@email.com',
    total: 259970,
    status: 'delivered',
    date: '2024-01-13',
    items: 3,
    paymentMethod: 'Transferencia',
    address: 'Santa Rosa 890, Ñuñoa'
  },
  {
    id: 'ORD-2024-004',
    customer: 'Ana Martínez',
    email: 'ana@email.com',
    total: 129990,
    status: 'pending',
    date: '2024-01-12',
    items: 1,
    paymentMethod: 'Tarjeta de Débito',
    address: 'Manuel Montt 345, Providencia'
  },
  {
    id: 'ORD-2024-005',
    customer: 'Luis Herrera',
    email: 'luis@email.com',
    total: 79990,
    status: 'cancelled',
    date: '2024-01-11',
    items: 1,
    paymentMethod: 'Tarjeta de Crédito',
    address: 'Irarrázaval 1200, Ñuñoa'
  }
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusLabels = {
  pending: 'Pendiente',
  processing: 'Procesando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado'
};

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast.success(`Estado del pedido ${orderId} actualizado a ${statusLabels[newStatus]}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Pedidos
            </CardTitle>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pedidos Pendientes
            </CardTitle>
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'pending').length}
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              En Proceso
            </CardTitle>
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'processing').length}
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Ingresos del Mes
            </CardTitle>
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(orders.reduce((sum, order) => sum + order.total, 0))}
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Pedidos</CardTitle>
          <CardDescription>
            Administra y actualiza el estado de los pedidos de la tienda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por cliente, email o ID de pedido..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="processing">Procesando</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="delivered">Entregado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Exportar</span>
            </Button>
          </div>

          {/* Orders Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell>{formatPrice(order.total)}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detalles del Pedido {order.id}</DialogTitle>
                              <DialogDescription>
                                Información completa del pedido
                              </DialogDescription>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Cliente</label>
                                    <p>{selectedOrder.customer}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Email</label>
                                    <p>{selectedOrder.email}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Método de Pago</label>
                                    <p>{selectedOrder.paymentMethod}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-600">Total</label>
                                    <p className="font-semibold">{formatPrice(selectedOrder.total)}</p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Dirección de Envío</label>
                                  <p>{selectedOrder.address}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-600">Estado del Pedido</label>
                                  <div className="mt-2">
                                    <Select
                                      value={selectedOrder.status}
                                      onValueChange={(value) => updateOrderStatus(selectedOrder.id, value as Order['status'])}
                                    >
                                      <SelectTrigger className="w-48">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="pending">Pendiente</SelectItem>
                                        <SelectItem value="processing">Procesando</SelectItem>
                                        <SelectItem value="shipped">Enviado</SelectItem>
                                        <SelectItem value="delivered">Entregado</SelectItem>
                                        <SelectItem value="cancelled">Cancelado</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value as Order['status'])}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendiente</SelectItem>
                            <SelectItem value="processing">Procesando</SelectItem>
                            <SelectItem value="shipped">Enviado</SelectItem>
                            <SelectItem value="delivered">Entregado</SelectItem>
                            <SelectItem value="cancelled">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}