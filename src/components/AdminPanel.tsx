import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { ArrowLeft, LogOut } from 'lucide-react';
import { OrderManagement } from './admin/OrderManagement';
import { UserManagement } from './admin/UserManagement';
import { ContentManagement } from './admin/ContentManagement';
import { PromotionManagement } from './admin/PromotionManagement';
import { InventoryManagement } from './admin/InventoryManagement';
import { ReportsManagement } from './admin/ReportsManagement';
import { toast } from 'sonner@2.0.3';

interface AdminPanelProps {
  onClose: () => void;
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState('orders');

  const handleLogout = () => {
    toast.success('Sesión de administrador cerrada');
    onClose();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Volver a la tienda</span>
              </Button>
              <div className="h-6 border-l border-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">
                Panel de Administración - MotoGear
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Administrador
              </span>
              <div className="h-8 w-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">AD</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white border border-gray-200">
            <TabsTrigger value="orders" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="inventory" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
              Inventarios
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
              Reportes
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
              Contenido
            </TabsTrigger>
            <TabsTrigger value="promotions" className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
              Promociones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManagement />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="content">
            <ContentManagement />
          </TabsContent>

          <TabsContent value="promotions">
            <PromotionManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}