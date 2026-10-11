import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { servicesData } from '../../data/services';
import { ServiceCard } from './ServiceCard';

interface ServicesSectionProps {
  onSelectService: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => (
  <section id="servicios" className="section section--services" aria-labelledby="services-title">
    <div className="page-container">
      <div className="section-heading section-heading--split">
        <div>
          <p className="eyebrow">Lo que hacemos</p>
          <h2 id="services-title" className="section-title">
            Tecnología pensada para <span className="text-gradient">resolver.</span>
          </h2>
        </div>
        <p className="section-intro">
          Unimos diseño, ingeniería y criterio de producto para desarrollar soluciones digitales
          que responden a necesidades concretas.
        </p>
      </div>

      <div className="services-grid">
        {servicesData.map((service) => (
          <ServiceCard key={service.id} service={service} onSelectService={onSelectService} />
        ))}
      </div>

      <a className="section-bottom-link" href="#contacto">
        ¿Tienes un reto específico? Cuéntanos sobre él
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </div>
  </section>
);
