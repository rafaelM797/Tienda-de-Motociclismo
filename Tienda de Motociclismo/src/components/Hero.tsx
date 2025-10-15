import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroProps {
  onViewProducts: () => void;
  onViewOffers: () => void;
}

export function Hero({ onViewProducts, onViewOffers }: HeroProps) {
  return (
    <section className="relative bg-gray-900 overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1660022304136-c4cd41751ed0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwZ2VhciUyMGVxdWlwbWVudCUyMHByb2Zlc3Npb25hbCUyMHJhY2luZ3xlbnwxfHx8fDE3NTkzNTY0Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Equipamiento profesional para motociclistas"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Equípate para la Aventura
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Descubre la mejor selección de equipamiento para motociclistas. 
            Calidad, seguridad y estilo en cada producto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700"
              onClick={onViewProducts}
            >
              Ver Productos
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-gray-900"
              onClick={onViewOffers}
            >
              Ofertas Especiales
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}