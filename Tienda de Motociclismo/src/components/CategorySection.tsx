import { ImageWithFallback } from './figma/ImageWithFallback';

interface Category {
  id: number;
  name: string;
  image: string;
  description: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Cascos',
    image: 'https://images.unsplash.com/photo-1673526154034-1749d70dd472?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwaGVsbWV0JTIwcmFjaW5nfGVufDF8fHx8MTc1OTM0MDIzNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Protección y estilo para tu cabeza'
  },
  {
    id: 2,
    name: 'Chaquetas',
    image: 'https://images.unsplash.com/photo-1654720498638-46c8d93bc32d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwbGVhdGhlciUyMGphY2tldHxlbnwxfHx8fDE3NTkyNjcyMDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Chaquetas de cuero y textiles'
  },
  {
    id: 3,
    name: 'Botas',
    image: 'https://images.unsplash.com/photo-1758621516645-637a426889c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwYm9vdHMlMjBnZWFyfGVufDF8fHx8MTc1OTM0MDIzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Calzado resistente y cómodo'
  },
  {
    id: 4,
    name: 'Accesorios',
    image: 'https://images.unsplash.com/photo-1719535218083-bd6f9c860229?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwZ2xvdmVzJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzU5MzQwMjM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    description: 'Guantes, protecciones y más'
  }
];

export function CategorySection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Explora Nuestras Categorías
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encuentra exactamente lo que necesitas para tu próxima aventura en moto
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}