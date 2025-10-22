import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { CreditCard, Building2, Smartphone, Shield } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  fee?: number;
}

interface CreditCardData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  holderName: string;
}

interface BankTransferData {
  bankName: string;
  accountNumber: string;
  rut: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'credit-card',
    name: 'Tarjeta de Crédito/Débito',
    description: 'Visa, Mastercard, American Express',
    icon: <CreditCard className="h-5 w-5" />
  },
  {
    id: 'bank-transfer',
    name: 'Transferencia Bancaria',
    description: 'Transferencia desde tu banco',
    icon: <Building2 className="h-5 w-5" />,
    fee: 0
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Paga con tu cuenta PayPal',
    icon: <Smartphone className="h-5 w-5" />,
    fee: 3500
  }
];

interface PaymentMethodsProps {
  totalAmount: number;
  onNext: (method: string, paymentData: any) => void;
  onBack: () => void;
}

export function PaymentMethods({ totalAmount, onNext, onBack }: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('credit-card');
  const [creditCardData, setCreditCardData] = useState<CreditCardData>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: ''
  });
  const [bankTransferData, setBankTransferData] = useState<BankTransferData>({
    bankName: '',
    accountNumber: '',
    rut: ''
  });

  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod);
  const finalAmount = totalAmount + (selectedPaymentMethod?.fee || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let paymentData;
    switch (selectedMethod) {
      case 'credit-card':
        paymentData = creditCardData;
        break;
      case 'bank-transfer':
        paymentData = bankTransferData;
        break;
      case 'paypal':
        paymentData = { email: 'usuario@paypal.com' };
        break;
      default:
        paymentData = {};
    }

    onNext(selectedMethod, paymentData);
  };

  const isFormValid = () => {
    switch (selectedMethod) {
      case 'credit-card':
        return creditCardData.cardNumber && creditCardData.expiryDate && 
               creditCardData.cvv && creditCardData.holderName;
      case 'bank-transfer':
        return bankTransferData.bankName && bankTransferData.accountNumber && 
               bankTransferData.rut;
      case 'paypal':
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Método de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <div className="flex-1 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {method.icon}
                      <div>
                        <label htmlFor={method.id} className="font-medium cursor-pointer">
                          {method.name}
                        </label>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                    {method.fee && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          +${method.fee.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalles de Pago</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {selectedMethod === 'credit-card' && (
              <>
                <div>
                  <Label htmlFor="cardNumber">Número de Tarjeta *</Label>
                  <Input
                    id="cardNumber"
                    value={creditCardData.cardNumber}
                    onChange={(e) => setCreditCardData(prev => ({ ...prev, cardNumber: e.target.value }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Fecha de Vencimiento *</Label>
                    <Input
                      id="expiryDate"
                      value={creditCardData.expiryDate}
                      onChange={(e) => setCreditCardData(prev => ({ ...prev, expiryDate: e.target.value }))}
                      placeholder="MM/AA"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      value={creditCardData.cvv}
                      onChange={(e) => setCreditCardData(prev => ({ ...prev, cvv: e.target.value }))}
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="holderName">Nombre del Titular *</Label>
                  <Input
                    id="holderName"
                    value={creditCardData.holderName}
                    onChange={(e) => setCreditCardData(prev => ({ ...prev, holderName: e.target.value }))}
                    placeholder="Juan Pérez"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <Shield className="h-4 w-4" />
                  <span>Tus datos están protegidos con encriptación SSL</span>
                </div>
              </>
            )}

            {selectedMethod === 'bank-transfer' && (
              <>
                <div>
                  <Label htmlFor="bankName">Banco *</Label>
                  <Input
                    id="bankName"
                    value={bankTransferData.bankName}
                    onChange={(e) => setBankTransferData(prev => ({ ...prev, bankName: e.target.value }))}
                    placeholder="Banco de Chile"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Número de Cuenta *</Label>
                  <Input
                    id="accountNumber"
                    value={bankTransferData.accountNumber}
                    onChange={(e) => setBankTransferData(prev => ({ ...prev, accountNumber: e.target.value }))}
                    placeholder="12345678901"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rut">RUT del Titular *</Label>
                  <Input
                    id="rut"
                    value={bankTransferData.rut}
                    onChange={(e) => setBankTransferData(prev => ({ ...prev, rut: e.target.value }))}
                    placeholder="12.345.678-9"
                    required
                  />
                </div>
                <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                  <p className="font-medium">Instrucciones:</p>
                  <p>Recibirás los datos bancarios para realizar la transferencia después de confirmar el pedido.</p>
                </div>
              </>
            )}

            {selectedMethod === 'paypal' && (
              <div className="bg-blue-50 p-4 rounded text-center">
                <Smartphone className="h-12 w-12 mx-auto text-blue-600 mb-2" />
                <p className="font-medium">PayPal</p>
                <p className="text-sm text-gray-600">
                  Serás redirigido a PayPal para completar el pago de forma segura.
                </p>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Total a Pagar:</span>
                <span className="text-xl font-bold">
                  ${finalAmount.toLocaleString()}
                </span>
              </div>
              {selectedPaymentMethod?.fee && (
                <p className="text-sm text-gray-600 mb-4">
                  Incluye comisión de ${selectedPaymentMethod.fee.toLocaleString()}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Volver
              </Button>
              <Button 
                type="submit"
                disabled={!isFormValid()}
                className="flex-1"
              >
                Revisar Pedido
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}