import React from 'react';
import {
  ArrowUpRight,
  BrainCircuit,
  Building2,
  Check,
  Code2,
  PlugZap,
  Smartphone,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import { ServiceItem } from '../../types';

interface ServiceCardProps {
  service: ServiceItem;
  onSelectService: (serviceId: string) => void;
}

const serviceIcons: Record<ServiceItem['iconName'], LucideIcon> = {
  code: Code2,
  smartphone: Smartphone,
  brain: BrainCircuit,
  workflow: Workflow,
  plug: PlugZap,
  building: Building2,
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelectService }) => {
  const Icon = serviceIcons[service.iconName];

  return (
    <article className="service-card">
      <div className="service-card__topline">
        <span className="service-card__icon">
          <Icon size={22} strokeWidth={1.7} aria-hidden="true" />
        </span>
        <span className="service-card__mark" aria-hidden="true">S.</span>
      </div>
      <h3 className="service-card__title">{service.title}</h3>
      <p className="service-card__description">{service.description}</p>
      <ul className="service-card__features">
        {service.features.map((feature) => (
          <li key={feature}>
            <Check size={14} aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <a
        className="text-link service-card__link"
        href="#contacto"
        onClick={() => onSelectService(service.id)}
      >
        Consultar este servicio
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </article>
  );
};
