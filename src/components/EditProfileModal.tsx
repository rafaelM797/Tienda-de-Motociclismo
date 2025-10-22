import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { User, Phone, Mail, MapPin, CreditCard, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useAppContext, type Address, type PaymentMethod } from '../contexts/AppContext';
import type { UserData } from './AuthModal';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserData;
}

export function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
  const { 
    updateUser, 
    addUserAddress, 
    updateUserAddress, 
    removeUserAddress,
    addUserPaymentMethod,
    updateUserPaymentMethod,
    removeUserPaymentMethod,
    users 
  } = useAppContext();
  
  const fullUser = users.find(u => u.id === user.id);
  
  // Estados para edición de perfil
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profilePhone, setProfilePhone] = useState(user.phone);
  
  // Estados para nueva dirección
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });
  
  // Estados para nuevo método de pago
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [newPayment, setNewPayment] = useState({
    type: 'Tarjeta de Crédito' as PaymentMethod['type'],
    name: '',
    lastFour: '',
    expiryDate: '',
    isDefault: false
  });

  const handleSaveProfile = () => {
    if (!profileName || !profileEmail || !profilePhone) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    updateUser(user.id, {
      name: profileName,
      email: profileEmail,
      phone: profilePhone
    });

    toast.success('Perfil actualizado correctamente');
  };

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.address || !newAddress.city || !newAddress.state || !newAddress.zipCode) {
      toast.error('Por favor completa todos los campos de la dirección');
      return;
    }

    addUserAddress(user.id, newAddress);
    setNewAddress({
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      isDefault: false
    });
    setShowAddressForm(false);
    toast.success('Dirección agregada correctamente');
  };

  const handleRemoveAddress = (addressId: string) => {
    removeUserAddress(user.id, addressId);
    toast.success('Dirección eliminada');
  };

  const handleSetDefaultAddress = (addressId: string) => {
    updateUserAddress(user.id, addressId, { isDefault: true });
    toast.success('Dirección predeterminada actualizada');
  };

  const handleAddPaymentMethod = () => {
    if (!newPayment.name) {
      toast.error('Por favor completa el nombre del método de pago');
      return;
    }

    if (newPayment.type === 'Tarjeta de Crédito' || newPayment.type === 'Tarjeta de Débito') {
      if (!newPayment.lastFour || !newPayment.expiryDate) {
        toast.error('Por favor completa todos los campos de la tarjeta');
        return;
      }
    }

    addUserPaymentMethod(user.id, newPayment);
    setNewPayment({
      type: 'Tarjeta de Crédito',
      name: '',
      lastFour: '',
      expiryDate: '',
      isDefault: false
    });
    setShowPaymentForm(false);
    toast.success('Método de pago agregado correctamente');
  };

  const handleRemovePaymentMethod = (paymentMethodId: string) => {
    removeUserPaymentMethod(user.id, paymentMethodId);
    toast.success('Método de pago eliminado');
  };

  const handleSetDefaultPaymentMethod = (paymentMethodId: string) => {
    updateUserPaymentMethod(user.id, paymentMethodId, { isDefault: true });
    toast.success('Método de pago predeterminado actualizado');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Información Personal</TabsTrigger>
            <TabsTrigger value="addresses">Direcciones</TabsTrigger>
            <TabsTrigger value="payments">Métodos de Pago</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="profile-name">Nombre Completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="profile-name"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="profile-phone">Teléfono</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="profile-phone"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="profile-email">Correo Electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="profile-email"
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleSaveProfile} className="w-full bg-red-600 hover:bg-red-700">
                  Guardar Cambios
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Direcciones de Envío</h3>
              <Button 
                onClick={() => setShowAddressForm(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Dirección
              </Button>
            </div>

            {showAddressForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Nueva Dirección</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Nombre (ej: Casa, Oficina)"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      placeholder="Código Postal"
                      value={newAddress.zipCode}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                    />
                    <Input
                      placeholder="Dirección completa"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, address: e.target.value }))}
                      className="md:col-span-2"
                    />
                    <Input
                      placeholder="Ciudad"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                    />
                    <Input
                      placeholder="Estado/Departamento"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="default-address"
                      checked={newAddress.isDefault}
                      onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                    />
                    <Label htmlFor="default-address">Establecer como dirección predeterminada</Label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddAddress} className="bg-red-600 hover:bg-red-700">
                      Guardar Dirección
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddressForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {fullUser?.addresses.map((address) => (
                <Card key={address.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{address.name}</h4>
                          {address.isDefault && (
                            <Badge variant="secondary">Predeterminada</Badge>
                          )}
                        </div>
                        <p className="text-gray-600">{address.address}</p>
                        <p className="text-gray-600">{address.city}, {address.state}</p>
                        <p className="text-gray-600">{address.zipCode}</p>
                      </div>
                      <div className="flex gap-2">
                        {!address.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefaultAddress(address.id)}
                          >
                            Predeterminada
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveAddress(address.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {(!fullUser?.addresses || fullUser.addresses.length === 0) && !showAddressForm && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-medium text-gray-900 mb-2">No tienes direcciones guardadas</h3>
                      <p className="text-gray-600 mb-4">Agrega una dirección para facilitar tus compras</p>
                      <Button 
                        onClick={() => setShowAddressForm(true)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Agregar Primera Dirección
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Métodos de Pago</h3>
              <Button 
                onClick={() => setShowPaymentForm(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Método de Pago
              </Button>
            </div>

            {showPaymentForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Nuevo Método de Pago</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tipo de Método de Pago</Label>
                    <Select 
                      value={newPayment.type} 
                      onValueChange={(value: PaymentMethod['type']) => setNewPayment(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tarjeta de Crédito">Tarjeta de Crédito</SelectItem>
                        <SelectItem value="Tarjeta de Débito">Tarjeta de Débito</SelectItem>
                        <SelectItem value="PSE">PSE</SelectItem>
                        <SelectItem value="Nequi">Nequi</SelectItem>
                        <SelectItem value="Daviplata">Daviplata</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Input
                    placeholder="Nombre del método (ej: Visa Principal, Bancolombia)"
                    value={newPayment.name}
                    onChange={(e) => setNewPayment(prev => ({ ...prev, name: e.target.value }))}
                  />

                  {(newPayment.type === 'Tarjeta de Crédito' || newPayment.type === 'Tarjeta de Débito') && (
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Últimos 4 dígitos"
                        maxLength={4}
                        value={newPayment.lastFour}
                        onChange={(e) => setNewPayment(prev => ({ ...prev, lastFour: e.target.value }))}
                      />
                      <Input
                        placeholder="MM/AA"
                        maxLength={5}
                        value={newPayment.expiryDate}
                        onChange={(e) => setNewPayment(prev => ({ ...prev, expiryDate: e.target.value }))}
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="default-payment"
                      checked={newPayment.isDefault}
                      onChange={(e) => setNewPayment(prev => ({ ...prev, isDefault: e.target.checked }))}
                    />
                    <Label htmlFor="default-payment">Establecer como método predeterminado</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleAddPaymentMethod} className="bg-red-600 hover:bg-red-700">
                      Guardar Método de Pago
                    </Button>
                    <Button variant="outline" onClick={() => setShowPaymentForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              {fullUser?.paymentMethods.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{payment.name}</h4>
                            {payment.isDefault && (
                              <Badge variant="secondary">Predeterminado</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{payment.type}</p>
                          {payment.lastFour && (
                            <p className="text-sm text-gray-600">**** **** **** {payment.lastFour}</p>
                          )}
                          {payment.expiryDate && (
                            <p className="text-sm text-gray-600">Vence: {payment.expiryDate}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!payment.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefaultPaymentMethod(payment.id)}
                          >
                            Predeterminado
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemovePaymentMethod(payment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {(!fullUser?.paymentMethods || fullUser.paymentMethods.length === 0) && !showPaymentForm && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="font-medium text-gray-900 mb-2">No tienes métodos de pago guardados</h3>
                      <p className="text-gray-600 mb-4">Agrega un método de pago para checkout más rápido</p>
                      <Button 
                        onClick={() => setShowPaymentForm(true)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Agregar Primer Método de Pago
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}