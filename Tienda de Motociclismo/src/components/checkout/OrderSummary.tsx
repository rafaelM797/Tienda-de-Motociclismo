import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { CheckCircle, Truck, CreditCard, MapPin, Clock } from 'lucide-react';
import type { Product } from '../ProductCard';

interface CartItem extends Product {
  quantity: number;
}

interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

interface OrderSummaryProps {
  items: CartItem[];
  shippingData: ShippingData;
  shippingOption: ShippingOption;
  paymentMethod: string;
  paymentFee: number;
  onConfirm: () => void;
  onBack: () => void;
}

export function OrderSummary({ 
  items, 
  shippingData, 
  shippingOption, 
  paymentMethod, 
  paymentFee,
  onConfirm, 
  onBack 
}: OrderSummaryProps) {
  if (!items || items.length === 0) return null;
  if (!shippingData || !shippingOption) return null;
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal + shippingOption.price + paymentFee;

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'credit-card':
        return 'Tarjeta de Crédito/Débito';
      case 'bank-transfer':
        return 'Transferencia Bancaria';
      case 'paypal':
        return 'PayPal';
      default:
        return method;
    }
  };

  return (
    <div className="space-y-6">
      {/* Productos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Resumen del Pedido</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                  <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${item.price.toLocaleString()} c/u
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Información de Envío */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>Dirección de Envío</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="font-medium">
              {shippingData.firstName} {shippingData.lastName}
            </p>
            <p className="text-gray-600">{shippingData.address}</p>
            <p className="text-gray-600">
              {shippingData.city}, {shippingData.state} {shippingData.postalCode}
            </p>
            <p className="text-gray-600">{shippingData.country}</p>
            {shippingData.phone && (
              <p className="text-gray-600">Tel: {shippingData.phone}</p>
            )}
            <p className="text-gray-600">Email: {shippingData.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Método de Envío */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5 text-orange-600" />
            <span>Método de Envío</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{shippingOption.name}</p>
              <p className="text-sm text-gray-600 flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>Entrega estimada: {shippingOption.estimatedDays}</span>
              </p>
            </div>
            <p className="font-semibold">
              ${shippingOption.price.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Método de Pago */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            <span>Método de Pago</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="font-medium">{getPaymentMethodName(paymentMethod)}</p>
            {paymentFee > 0 && (
              <p className="text-sm text-gray-600">
                Comisión: ${paymentFee.toLocaleString()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Total */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal productos:</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Envío ({shippingOption.name}):</span>
              <span>${shippingOption.price.toLocaleString()}</span>
            </div>
            {paymentFee > 0 && (
              <div className="flex justify-between">
                <span>Comisión de pago:</span>
                <span>${paymentFee.toLocaleString()}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Términos y Condiciones */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              Al confirmar tu pedido, aceptas nuestros{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Términos y Condiciones
              </a>{' '}
              y{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Política de Privacidad
              </a>.
            </p>
            <p>
              Recibirás un email de confirmación con los detalles de tu pedido y el 
              número de seguimiento una vez que se procese el pago.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Botones */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Modificar Pago
        </Button>
        <Button onClick={onConfirm} className="flex-1 bg-green-600 hover:bg-green-700">
          Confirmar Pedido
        </Button>
      </div>
    </div>
  );
}