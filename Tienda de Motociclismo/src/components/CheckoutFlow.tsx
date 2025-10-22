import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { ShippingForm } from './checkout/ShippingForm';
import { PaymentMethods } from './checkout/PaymentMethods';
import { OrderSummary } from './checkout/OrderSummary';
import { OrderConfirmation } from './checkout/OrderConfirmation';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import type { Product } from './ProductCard';
import { useAppContext } from '../contexts/AppContext';

interface CartItem extends Product {
  quantity: number;
}

interface CheckoutFlowProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderComplete: () => void;
  currentUserId?: string;
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

type CheckoutStep = 'shipping' | 'payment' | 'summary' | 'confirmation';

export function CheckoutFlow({ isOpen, onClose, items, onOrderComplete, currentUserId }: CheckoutFlowProps) {
  const { addOrder, users, currentUser } = useAppContext();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [shippingOption, setShippingOption] = useState<ShippingOption | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [paymentData, setPaymentData] = useState<any>(null);
  const [orderNumber, setOrderNumber] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      // Reset scroll when opening
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const steps = [
    { id: 'shipping', name: 'Envío', completed: shippingData !== null },
    { id: 'payment', name: 'Pago', completed: paymentMethod !== '' },
    { id: 'summary', name: 'Resumen', completed: false },
    { id: 'confirmation', name: 'Confirmación', completed: false }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  if (!isOpen) return null;

  const handleShippingNext = (data: ShippingData, option: ShippingOption) => {
    setShippingData(data);
    setShippingOption(option);
    setCurrentStep('payment');
  };

  const handlePaymentNext = (method: string, data: any) => {
    setPaymentMethod(method);
    setPaymentData(data);
    setCurrentStep('summary');
  };

  const handleOrderConfirm = () => {
    if (!shippingData || !shippingOption) return;
    
    // Generar número de orden y tracking
    const newOrderNumber = 'ORD-2024-' + Date.now().toString().slice(-6);
    const trackingNumber = 'TRK' + Date.now().toString().slice(-9);
    setOrderNumber(newOrderNumber);
    
    // Crear el pedido en el contexto si hay un usuario
    if (currentUserId && shippingData && shippingOption) {
      const newOrder = {
        id: newOrderNumber,
        userId: currentUserId,
        date: new Date().toISOString().split('T')[0],
        status: 'Procesando' as const,
        total: totalAmount,
        items: items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        shipping: {
          address: `${shippingData.address}`,
          city: shippingData.city,
          state: shippingData.state,
          zipCode: shippingData.postalCode,
          method: shippingOption.name,
          tracking: trackingNumber
        },
        paymentMethod: paymentMethod === 'card' ? 'Tarjeta de Crédito' : 
                       paymentMethod === 'pse' ? 'PSE' : 
                       paymentMethod === 'paypal' ? 'PayPal' : 'Otro',
        customerName: `${shippingData.firstName} ${shippingData.lastName}`,
        customerEmail: shippingData.email,
        customerPhone: shippingData.phone
      };
      
      addOrder(newOrder);
    }
    
    // Simular delay de procesamiento
    setTimeout(() => {
      setCurrentStep('confirmation');
      toast.success('¡Pedido confirmado exitosamente!');
    }, 1500);
  };

  const handleContinueShopping = () => {
    onOrderComplete();
    onClose();
    // Reset del flujo
    setCurrentStep('shipping');
    setShippingData(null);
    setShippingOption(null);
    setPaymentMethod('');
    setPaymentData(null);
    setOrderNumber('');
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const paymentFee = paymentMethod === 'paypal' ? 3500 : 0;
  const totalAmount = subtotal + (shippingOption?.price || 0) + paymentFee;

  const getEstimatedDelivery = () => {
    if (!shippingOption) return '';
    const days = parseInt(shippingOption.estimatedDays.split('-')[1] || shippingOption.estimatedDays.split(' ')[0]);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + days);
    return deliveryDate.toLocaleDateString('es-CL', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Checkout Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden pointer-events-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex-1">
              <h2 className="text-2xl font-bold">Checkout</h2>
              {currentStep !== 'confirmation' && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    {steps.map((step, index) => (
                      <span 
                        key={step.id}
                        className={`${index <= currentStepIndex ? 'text-blue-600 font-medium' : ''}`}
                      >
                        {step.name}
                      </span>
                    ))}
                  </div>
                  {/* Simple progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
            <div className="p-6">
              {currentStep === 'shipping' && (
                <ShippingForm
                  onNext={handleShippingNext}
                  onBack={onClose}
                />
              )}

              {currentStep === 'payment' && (
                <PaymentMethods
                  totalAmount={subtotal + (shippingOption?.price || 0)}
                  onNext={handlePaymentNext}
                  onBack={() => setCurrentStep('shipping')}
                />
              )}

              {currentStep === 'summary' && shippingData && shippingOption && (
                <OrderSummary
                  items={items}
                  shippingData={shippingData}
                  shippingOption={shippingOption}
                  paymentMethod={paymentMethod}
                  paymentFee={paymentFee}
                  onConfirm={handleOrderConfirm}
                  onBack={() => setCurrentStep('payment')}
                />
              )}

              {currentStep === 'confirmation' && shippingData && (
                <OrderConfirmation
                  orderNumber={orderNumber}
                  estimatedDelivery={getEstimatedDelivery()}
                  email={shippingData.email}
                  onContinueShopping={handleContinueShopping}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}