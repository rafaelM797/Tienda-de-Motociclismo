import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { User, Package, MapPin, CreditCard, ShoppingBag, LogOut, Eye, Download, Edit } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import type { UserData } from './AuthModal';
import { useAppContext } from '../contexts/AppContext';
import { EditProfileModal } from './EditProfileModal';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
  onLogout: () => void;
}

export function UserProfile({ isOpen, onClose, user, onLogout }: UserProfileProps) {
  const { getUserOrders, users } = useAppContext();
  const [activeTab, setActiveTab] = useState('orders');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Obtener pedidos del usuario
  const userOrders = getUserOrders(user.id);
  
  // Obtener datos completos del usuario
  const fullUser = users.find(u => u.id === user.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entregado':
        return 'bg-green-100 text-green-800';
      case 'En tránsito':
        return 'bg-blue-100 text-blue-800';
      case 'Procesando':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogout = () => {
    onLogout();
    onClose();
    toast.success('Sesión cerrada correctamente');
  };

  const totalSpent = fullUser?.totalSpent || 0;
  const totalOrders = fullUser?.totalOrders || 0;
  const completedOrders = userOrders.filter(order => order.status === 'Entregado').length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mi Cuenta</DialogTitle>
          <DialogDescription>
            Gestiona tu información personal, revisa tus pedidos y actualiza tus preferencias
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bienvenido</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Pedidos</p>
                  <p className="font-medium">{totalOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gasto Total</p>
                  <p className="font-medium">${totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Mis Pedidos</TabsTrigger>
            <TabsTrigger value="profile">Mi Perfil</TabsTrigger>
            <TabsTrigger value="addresses">Direcciones</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            {userOrders.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-900 mb-2">No tienes pedidos aún</h3>
                    <p className="text-gray-600">Comienza a comprar para ver tu historial aquí</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Pedido {order.id}</CardTitle>
                        <p className="text-sm text-gray-600">
                          {new Date(order.date).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                          </div>
                          <p className="font-medium">${item.price.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Total</span>
                      <span className="font-bold text-lg">${order.total.toLocaleString()}</span>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium">Dirección de Envío</p>
                          <p className="text-sm text-gray-600">{order.shipping.address}</p>
                          <p className="text-sm text-gray-600">{order.shipping.city}, {order.shipping.state}</p>
                          <p className="text-sm text-gray-600">{order.shipping.zipCode}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Package className="h-4 w-4 text-gray-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium">Método de Envío</p>
                          <p className="text-sm text-gray-600">{order.shipping.method}</p>
                        </div>
                      </div>
                      {order.shipping.tracking && (
                        <div className="flex items-start space-x-2">
                          <Eye className="h-4 w-4 text-gray-600 mt-1" />
                          <div>
                            <p className="text-sm font-medium">Número de Seguimiento</p>
                            <p className="text-sm text-gray-600 font-mono">{order.shipping.tracking}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Descargar Factura
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
                    <p className="mt-1 text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                    <p className="mt-1 text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Teléfono</label>
                    <p className="mt-1 text-gray-900">{user.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Miembro desde</label>
                    <p className="mt-1 text-gray-900">
                      {fullUser ? new Date(fullUser.registeredDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Estadísticas de Compra</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Pedidos Completados</p>
                      <p className="text-2xl font-bold text-gray-900">{completedOrders}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Gasto Total</p>
                      <p className="text-2xl font-bold text-gray-900">${totalSpent.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar Información Personal
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seguridad</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Cambiar Contraseña
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Gestionar Métodos de Pago
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Direcciones de Envío</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fullUser?.addresses && fullUser.addresses.length > 0 ? (
                  <>
                    {fullUser.addresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{address.name}</h4>
                            {address.isDefault && (
                              <Badge variant="secondary" className="mt-1">Predeterminada</Badge>
                            )}
                          </div>
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-gray-700">{address.address}</p>
                        <p className="text-gray-700">{address.city}, {address.state}</p>
                        <p className="text-gray-700">Colombia - {address.zipCode}</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-medium text-gray-900 mb-2">No tienes direcciones guardadas</h3>
                    <p className="text-gray-600">Agrega direcciones desde tu perfil para facilitar tus compras</p>
                  </div>
                )}

                <Button 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Gestionar Direcciones
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Modal de edición de perfil */}
        <EditProfileModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={user}
        />
      </DialogContent>
    </Dialog>
  );
}