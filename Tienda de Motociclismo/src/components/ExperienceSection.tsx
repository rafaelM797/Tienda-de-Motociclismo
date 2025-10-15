import { ImageWithFallback } from './figma/ImageWithFallback';

export function ExperienceSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            La Experiencia MotoGear
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Más de 10 años equipando motociclistas con productos de la más alta calidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Lifestyle & Adventure */}
          <div className="group">
            <div className="relative overflow-hidden rounded-lg mb-4 h-64">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758550713886-1ba2390293af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwYWR2ZW50dXJlJTIwbGlmZXN0eWxlJTIwaGVsbWV0fGVufDF8fHx8MTc1OTM1NjQ0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Aventura en motocicleta"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-2">Aventura Sin Límites</h3>
                <p className="text-sm">Equipamiento para cada travesía</p>
              </div>
            </div>
          </div>

          {/* Professional Workshop */}
          <div className="group">
            <div className="relative overflow-hidden rounded-lg mb-4 h-64">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1676018366904-c083ed678e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwc2hvcCUyMGdhcmFnZSUyMHdvcmtzaG9wfGVufDF8fHx8MTc1OTM1NjQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Taller profesional de motocicletas"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold mb-2">Experiencia Profesional</h3>
                <p className="text-sm">Selección experta de productos</p>
              </div>
            </div>
          </div>

          {/* Statistics & Trust */}
          <div className="group md:col-span-2 lg:col-span-1">
            <div className="bg-red-600 rounded-lg p-8 h-64 flex flex-col justify-center items-center text-center text-white">
              <div className="mb-6">
                <div className="text-4xl font-bold mb-2">15,000+</div>
                <div className="text-lg">Motociclistas Satisfechos</div>
              </div>
              <div className="grid grid-cols-2 gap-6 w-full">
                <div>
                  <div className="text-2xl font-bold mb-1">500+</div>
                  <div className="text-sm opacity-90">Productos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold mb-1">10+</div>
                  <div className="text-sm opacity-90">Años</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Calidad Garantizada</h3>
            <p className="text-gray-600">Productos certificados y probados por profesionales</p>
          </div>
          
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Envío Rápido</h3>
            <p className="text-gray-600">Entrega en 24-48 horas en toda Colombia</p>
          </div>
          
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75c0-1.069-.171-2.099-.487-3.068a3.745 3.745 0 01-1.043-2.455z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Soporte 24/7</h3>
            <p className="text-gray-600">Atención personalizada cuando la necesites</p>
          </div>
        </div>
      </div>
    </section>
  );
}