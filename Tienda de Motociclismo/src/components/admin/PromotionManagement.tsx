import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Plus, Edit, Trash2, Percent, Gift, Calendar, Users } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  code: string;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  status: 'active' | 'inactive' | 'expired';
  categories: string[];
  minAmount: number;
}

const mockPromotions: Promotion[] = [
  {
    id: 'PROMO-001',
    name: 'Descuento de Temporada',
    description: 'Descuento especial en cascos y chaquetas',
    type: 'percentage',
    value: 20,
    code: 'TEMPORADA20',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    usageLimit: 100,
    usedCount: 45,
    status: 'active',
    categories: ['Cascos', 'Chaquetas'],
    minAmount: 50000
  },
  {
    id: 'PROMO-002',
    name: 'Envío Gratis',
    description: 'Envío gratuito en compras superiores a $100.000',
    type: 'free_shipping',
    value: 0,
    code: 'ENVIOGRATIS',
    startDate: '2024-01-15',
    endDate: '2024-12-31',
    usageLimit: 500,
    usedCount: 123,
    status: 'active',
    categories: [],
    minAmount: 100000
  },
  {
    id: 'PROMO-003',
    name: 'Descuento Fijo Accesorios',
    description: 'Descuento de $15.000 en accesorios',
    type: 'fixed',
    value: 15000,
    code: 'ACCESORIOS15',
    startDate: '2023-12-01',
    endDate: '2024-01-15',
    usageLimit: 50,
    usedCount: 50,
    status: 'expired',
    categories: ['Accesorios'],
    minAmount: 30000
  },
  {
    id: 'PROMO-004',
    name: 'Black Friday',
    description: 'Mega descuento Black Friday',
    type: 'percentage',
    value: 35,
    code: 'BLACKFRIDAY35',
    startDate: '2024-11-29',
    endDate: '2024-11-30',
    usageLimit: 200,
    usedCount: 0,
    status: 'inactive',
    categories: [],
    minAmount: 75000
  }
];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  expired: 'bg-red-100 text-red-800'
};

const typeIcons = {
  percentage: <Percent className="h-4 w-4" />,
  fixed: <Gift className="h-4 w-4" />,
  free_shipping: <Calendar className="h-4 w-4" />
};

const typeLabels = {
  percentage: 'Porcentaje',
  fixed: 'Monto Fijo',
  free_shipping: 'Envío Gratis'
};

const statusLabels = {
  active: 'Activa',
  inactive: 'Inactiva',
  expired: 'Expirada'
};

export function PromotionManagement() {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [newPromotion, setNewPromotion] = useState<Omit<Promotion, 'id' | 'usedCount'>>({
    name: '',
    description: '',
    type: 'percentage',
    value: 0,
    code: '',
    startDate: '',
    endDate: '',
    usageLimit: 100,
    status: 'inactive',
    categories: [],
    minAmount: 0
  });

  const createPromotion = () => {
    const promotion: Promotion = {
      ...newPromotion,
      id: `PROMO-${String(promotions.length + 1).padStart(3, '0')}`,
      usedCount: 0
    };
    
    setPromotions(prev => [...prev, promotion]);
    setIsCreateDialogOpen(false);
    setNewPromotion({
      name: '',
      description: '',
      type: 'percentage',
      value: 0,
      code: '',
      startDate: '',
      endDate: '',
      usageLimit: 100,
      status: 'inactive',
      categories: [],
      minAmount: 0
    });
    toast.success('Promoción creada correctamente');
  };

  const updatePromotion = () => {
    if (!editingPromotion) return;
    
    setPromotions(prev => prev.map(promo => 
      promo.id === editingPromotion.id ? editingPromotion : promo
    ));
    setIsEditDialogOpen(false);
    setEditingPromotion(null);
    toast.success('Promoción actualizada correctamente');
  };

  const deletePromotion = (promotionId: string) => {
    setPromotions(prev => prev.filter(promo => promo.id !== promotionId));
    toast.success('Promoción eliminada correctamente');
  };

  const togglePromotionStatus = (promotionId: string) => {
    setPromotions(prev => prev.map(promo => 
      promo.id === promotionId 
        ? { ...promo, status: promo.status === 'active' ? 'inactive' : 'active' as Promotion['status'] }
        : promo
    ));
    toast.success('Estado de la promoción actualizado');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const formatValue = (promotion: Promotion) => {
    switch (promotion.type) {
      case 'percentage':
        return `${promotion.value}%`;
      case 'fixed':
        return formatPrice(promotion.value);
      case 'free_shipping':
        return 'Envío Gratis';
      default:
        return promotion.value.toString();
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Promociones
            </CardTitle>
            <div className="text-2xl font-bold">{promotions.length}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Promociones Activas
            </CardTitle>
            <div className="text-2xl font-bold text-green-600">
              {promotions.filter(p => p.status === 'active').length}
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Usos Totales
            </CardTitle>
            <div className="text-2xl font-bold text-blue-600">
              {promotions.reduce((sum, p) => sum + p.usedCount, 0)}
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Promociones Expiradas
            </CardTitle>
            <div className="text-2xl font-bold text-red-600">
              {promotions.filter(p => p.status === 'expired').length}
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Promotions Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Gift className="h-5 w-5" />
                <span>Gestión de Promociones</span>
              </CardTitle>
              <CardDescription>
                Crea y administra cupones de descuento y promociones especiales
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Promoción
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Promoción</DialogTitle>
                  <DialogDescription>
                    Define los parámetros de la nueva promoción
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="promo-name">Nombre</Label>
                    <Input
                      id="promo-name"
                      value={newPromotion.name}
                      onChange={(e) => setNewPromotion({...newPromotion, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="promo-code">Código</Label>
                    <Input
                      id="promo-code"
                      value={newPromotion.code}
                      onChange={(e) => setNewPromotion({...newPromotion, code: e.target.value.toUpperCase()})}
                      placeholder="DESCUENTO20"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="promo-description">Descripción</Label>
                    <Textarea
                      id="promo-description"
                      value={newPromotion.description}
                      onChange={(e) => setNewPromotion({...newPromotion, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="promo-type">Tipo de Descuento</Label>
                    <Select
                      value={newPromotion.type}
                      onValueChange={(value) => setNewPromotion({...newPromotion, type: value as Promotion['type']})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Porcentaje</SelectItem>
                        <SelectItem value="fixed">Monto Fijo</SelectItem>
                        <SelectItem value="free_shipping">Envío Gratis</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="promo-value">Valor</Label>
                    <Input
                      id="promo-value"
                      type="number"
                      value={newPromotion.value}
                      onChange={(e) => setNewPromotion({...newPromotion, value: Number(e.target.value)})}
                      placeholder={newPromotion.type === 'percentage' ? '20' : '15000'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="promo-start">Fecha Inicio</Label>
                    <Input
                      id="promo-start"
                      type="date"
                      value={newPromotion.startDate}
                      onChange={(e) => setNewPromotion({...newPromotion, startDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="promo-end">Fecha Fin</Label>
                    <Input
                      id="promo-end"
                      type="date"
                      value={newPromotion.endDate}
                      onChange={(e) => setNewPromotion({...newPromotion, endDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="promo-limit">Límite de Usos</Label>
                    <Input
                      id="promo-limit"
                      type="number"
                      value={newPromotion.usageLimit}
                      onChange={(e) => setNewPromotion({...newPromotion, usageLimit: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="promo-min">Monto Mínimo</Label>
                    <Input
                      id="promo-min"
                      type="number"
                      value={newPromotion.minAmount}
                      onChange={(e) => setNewPromotion({...newPromotion, minAmount: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={createPromotion}>
                    Crear Promoción
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Promoción</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Vigencia</TableHead>
                  <TableHead>Usos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{promotion.name}</div>
                        <div className="text-sm text-gray-500">{promotion.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {promotion.code}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {typeIcons[promotion.type]}
                        <span>{typeLabels[promotion.type]}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatValue(promotion)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{promotion.startDate}</div>
                        <div className="text-gray-500">hasta {promotion.endDate}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{promotion.usedCount} / {promotion.usageLimit}</div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ width: `${(promotion.usedCount / promotion.usageLimit) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[promotion.status]}>
                        {statusLabels[promotion.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPromotion(promotion);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant={promotion.status === 'active' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => togglePromotionStatus(promotion.id)}
                          disabled={promotion.status === 'expired'}
                        >
                          {promotion.status === 'active' ? 'Desactivar' : 'Activar'}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. La promoción "{promotion.name}" será eliminada permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deletePromotion(promotion.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Promotion Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Promoción</DialogTitle>
            <DialogDescription>
              Modifica los parámetros de la promoción
            </DialogDescription>
          </DialogHeader>
          {editingPromotion && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  value={editingPromotion.name}
                  onChange={(e) => setEditingPromotion({...editingPromotion, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-code">Código</Label>
                <Input
                  id="edit-code"
                  value={editingPromotion.code}
                  onChange={(e) => setEditingPromotion({...editingPromotion, code: e.target.value.toUpperCase()})}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  value={editingPromotion.description}
                  onChange={(e) => setEditingPromotion({...editingPromotion, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-type">Tipo de Descuento</Label>
                <Select
                  value={editingPromotion.type}
                  onValueChange={(value) => setEditingPromotion({...editingPromotion, type: value as Promotion['type']})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Porcentaje</SelectItem>
                    <SelectItem value="fixed">Monto Fijo</SelectItem>
                    <SelectItem value="free_shipping">Envío Gratis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-value">Valor</Label>
                <Input
                  id="edit-value"
                  type="number"
                  value={editingPromotion.value}
                  onChange={(e) => setEditingPromotion({...editingPromotion, value: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="edit-start">Fecha Inicio</Label>
                <Input
                  id="edit-start"
                  type="date"
                  value={editingPromotion.startDate}
                  onChange={(e) => setEditingPromotion({...editingPromotion, startDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-end">Fecha Fin</Label>
                <Input
                  id="edit-end"
                  type="date"
                  value={editingPromotion.endDate}
                  onChange={(e) => setEditingPromotion({...editingPromotion, endDate: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit-limit">Límite de Usos</Label>
                <Input
                  id="edit-limit"
                  type="number"
                  value={editingPromotion.usageLimit}
                  onChange={(e) => setEditingPromotion({...editingPromotion, usageLimit: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="edit-min">Monto Mínimo</Label>
                <Input
                  id="edit-min"
                  type="number"
                  value={editingPromotion.minAmount}
                  onChange={(e) => setEditingPromotion({...editingPromotion, minAmount: Number(e.target.value)})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={updatePromotion}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}