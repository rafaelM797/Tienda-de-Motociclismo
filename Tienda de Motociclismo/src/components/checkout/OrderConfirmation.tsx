import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CheckCircle, Download, Mail, Truck, Calendar } from 'lucide-react';

interface OrderConfirmationProps {
  orderNumber: string;
  estimatedDelivery: string;
  email: string;
  onContinueShopping: () => void;
}

export function OrderConfirmation({ 
  orderNumber, 
  estimatedDelivery, 
  email, 
  onContinueShopping 
}: OrderConfirmationProps) {
  const handleDownloadInvoice = () => {
    // Simular descarga de factura
    console.log('Descargando factura...');
  };

  const handleSendEmail = () => {
    // Simular envío de email
    console.log('Enviando confirmación por email...');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="text-center border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-900">
                ¡Pedido Confirmado!
              </h1>
              <p className="text-green-700 mt-2">
                Tu pedido ha sido procesado exitosamente
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Número de Pedido</p>
                <p className="font-mono text-lg font-semibold">#{orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <Badge className="bg-blue-100 text-blue-800">
                  Procesando
                </Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Entrega Estimada</p>
                  <p className="font-semibold">{estimatedDelivery}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Confirmación enviada a</p>
                  <p className="font-semibold">{email}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5" />
            <span>Próximos Pasos</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-medium">Procesamiento del Pedido</p>
                <p className="text-sm text-gray-600">
                  Estamos preparando tu pedido para el envío. Te notificaremos cuando esté listo.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-medium">Envío</p>
                <p className="text-sm text-gray-600">
                  Recibirás el código de seguimiento por email cuando el pedido sea despachado.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm font-bold">
                3
              </div>
              <div>
                <p className="font-medium">Entrega</p>
                <p className="text-sm text-gray-600">
                  Tu pedido llegará a la dirección especificada en la fecha estimada.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <h3 className="font-semibold">¿Necesitas Ayuda?</h3>
            <p className="text-sm text-gray-600">
              Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos:
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center text-sm">
              <span>📧 support@motogear.com</span>
              <span className="hidden sm:inline">|</span>
              <span>📞 +56 9 1234 5678</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="outline" 
          onClick={handleDownloadInvoice}
          className="flex-1 flex items-center justify-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Descargar Factura</span>
        </Button>
        <Button 
          variant="outline" 
          onClick={handleSendEmail}
          className="flex-1 flex items-center justify-center space-x-2"
        >
          <Mail className="h-4 w-4" />
          <span>Reenviar Email</span>
        </Button>
      </div>

      <Button 
        onClick={onContinueShopping}
        className="w-full"
        size="lg"
      >
        Continuar Comprando
      </Button>
    </div>
  );
}