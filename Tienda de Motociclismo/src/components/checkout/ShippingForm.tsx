import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Badge } from '../ui/badge';
import { Truck, Clock, Zap, MapPin } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';

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
  icon: React.ReactNode;
}

const shippingOptions: ShippingOption[] = [
  {
    id: 'standard',
    name: 'Envío Estándar',
    description: 'Entrega en días hábiles',
    price: 15000,
    estimatedDays: '5-7 días',
    icon: <Truck className="h-5 w-5" />
  },
  {
    id: 'express',
    name: 'Envío Express',
    description: 'Entrega rápida',
    price: 25000,
    estimatedDays: '2-3 días',
    icon: <Clock className="h-5 w-5" />
  },
  {
    id: 'overnight',
    name: 'Envío Urgente',
    description: 'Entrega al día siguiente',
    price: 45000,
    estimatedDays: '1 día',
    icon: <Zap className="h-5 w-5" />
  }
];

interface ShippingFormProps {
  onNext: (data: ShippingData, shippingOption: ShippingOption) => void;
  onBack: () => void;
  currentUserId?: string;
}

export function ShippingForm({ onNext, onBack }: ShippingFormProps) {
  const { currentUser } = useAppContext();
  
  // Pre-llenar datos del usuario logueado
  const getInitialFormData = (): ShippingData => {
    if (currentUser) {
      const nameParts = currentUser.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      return {
        firstName,
        lastName,
        email: currentUser.email,
        phone: currentUser.phone,
        address: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Chile'
      };
    }
    
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Chile'
    };
  };

  const [formData, setFormData] = useState<ShippingData>(getInitialFormData());

  const [selectedShipping, setSelectedShipping] = useState<string>('standard');
  const [isCalculating, setIsCalculating] = useState(false);
  const [showShippingOptions, setShowShippingOptions] = useState(false);

  // Actualizar formulario cuando cambie el usuario
  useEffect(() => {
    setFormData(getInitialFormData());
  }, [currentUser]);

  const handleInputChange = (field: keyof ShippingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateShipping = () => {
    setIsCalculating(true);
    // Simular cálculo de envío
    setTimeout(() => {
      setIsCalculating(false);
      setShowShippingOptions(true);
    }, 1500);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const selectedOption = shippingOptions.find(option => option.id === selectedShipping);
    if (selectedOption && isFormValid) {
      onNext(formData, selectedOption);
    }
  };

  const isFormValid = formData.firstName && formData.lastName && formData.email && 
                     formData.address && formData.city && formData.postalCode;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información de Envío</CardTitle>
          {currentUser && (
            <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
              ✓ Se han cargado automáticamente tus datos de perfil. Solo necesitas completar la información de dirección.
              <br />
              <span className="text-xs text-green-500 mt-1 block">
                Si necesitas actualizar tu información personal, puedes hacerlo desde tu perfil de usuario.
              </span>
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">
                  Nombre * {currentUser && <span className="text-green-600 text-xs">(desde tu perfil)</span>}
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Tu nombre"
                  required
                  readOnly={!!currentUser}
                  className={currentUser ? 'bg-gray-50 cursor-default' : ''}
                />
              </div>
              <div>
                <Label htmlFor="lastName">
                  Apellido * {currentUser && <span className="text-green-600 text-xs">(desde tu perfil)</span>}
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Tu apellido"
                  required
                  readOnly={!!currentUser}
                  className={currentUser ? 'bg-gray-50 cursor-default' : ''}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">
                  Email * {currentUser && <span className="text-green-600 text-xs">(desde tu perfil)</span>}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="tu@email.com"
                  required
                  readOnly={!!currentUser}
                  className={currentUser ? 'bg-gray-50 cursor-default' : ''}
                />
              </div>
              <div>
                <Label htmlFor="phone">
                  Teléfono {currentUser && <span className="text-green-600 text-xs">(desde tu perfil)</span>}
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+56 9 1234 5678"
                  readOnly={!!currentUser}
                  className={currentUser ? 'bg-gray-50 cursor-default' : ''}
                />
              </div>
            </div>

            {currentUser && (
              <div className="border-t pt-4 mt-6">
                <h4 className="font-medium text-gray-900 mb-4">Información de Entrega</h4>
              </div>
            )}

            <div>
              <Label htmlFor="address">Dirección *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Calle, número, departamento"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Santiago"
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">Región</Label>
                <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar región" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metropolitana">Región Metropolitana</SelectItem>
                    <SelectItem value="valparaiso">Valparaíso</SelectItem>
                    <SelectItem value="biobio">Bío Bío</SelectItem>
                    <SelectItem value="antofagasta">Antofagasta</SelectItem>
                    <SelectItem value="araucania">La Araucanía</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="postalCode">Código Postal *</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  placeholder="1234567"
                  required
                />
              </div>
            </div>

            {!showShippingOptions && (
              <Button
                type="button"
                onClick={calculateShipping}
                disabled={!isFormValid || isCalculating}
                className="w-full"
              >
                {isCalculating ? 'Calculando envío...' : 
                 currentUser ? 'Calcular Costos de Envío' : 'Calcular Costos de Envío'}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {showShippingOptions && (
        <Card>
          <CardHeader>
            <CardTitle>Opciones de Envío</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
              <div className="space-y-3">
                {shippingOptions.map((option) => (
                  <div key={option.id} className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {option.icon}
                        <div>
                          <label htmlFor={option.id} className="font-medium cursor-pointer">
                            {option.name}
                          </label>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${option.price.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{option.estimatedDays}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>

            <div className="flex gap-4 mt-6">
              <Button 
                type="button"
                variant="outline" 
                onClick={onBack} 
                className="flex-1"
              >
                Volver
              </Button>
              <Button 
                type="button"
                onClick={() => handleSubmit()}
                disabled={!isFormValid}
                className="flex-1"
              >
                Continuar al Pago
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}