import React from 'react';
import { servicesData } from '../../data/services';
import { ServiceCard } from './ServiceCard';

interface ServicesSectionProps {
  onSelectService: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  return (
    <section id="servicios" className="py-20 relative">
      {/* Luz ambiental sutil */}
      <div className="absolute top-1/2 left-10 w-72 h-72 bg-purple-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabecera de la sección: 2 columnas en Desktop como en el boceto */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-[#B45CFF] uppercase mb-2 block">
              Nuestros Servicios
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Soluciones tecnológicas para hacer crecer{' '}
              <span className="text-[#B45CFF] drop-shadow-[0_0_15px_rgba(180,92,255,0.4)]">
                tu negocio
              </span>
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#B5B0C2] max-w-md lg:text-right leading-relaxed">
            Combinamos estrategia, tecnología y creatividad para desarrollar soluciones digitales que generan valor real.
          </p>
        </div>

        {/* Grilla de 4 tarjetas de servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelectService={onSelectService}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
