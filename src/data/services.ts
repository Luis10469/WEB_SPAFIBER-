import { ServiceItem } from '../types';

export const servicesData: ServiceItem[] = [
  {
    id: 'web-dev',
    title: 'Desarrollo web',
    description: 'Productos web accesibles, rápidos y preparados para evolucionar con tu negocio.',
    iconName: 'code',
    features: ['Aplicaciones y plataformas web', 'Interfaces y paneles de gestión'],
  },
  {
    id: 'mobile-apps',
    title: 'Aplicaciones móviles',
    description: 'Experiencias móviles para conectar servicios, equipos y clientes.',
    iconName: 'smartphone',
    features: ['Aplicaciones iOS y Android', 'Integración con servicios existentes'],
  },
  {
    id: 'ai-solutions',
    title: 'Inteligencia artificial',
    description: 'Soluciones de IA diseñadas alrededor de necesidades y datos concretos.',
    iconName: 'brain',
    features: ['Asistentes y automatización inteligente', 'Análisis y procesamiento de información'],
  },
  {
    id: 'automation',
    title: 'Automatización empresarial',
    description: 'Flujos de trabajo que reducen tareas manuales y conectan procesos.',
    iconName: 'workflow',
    features: ['Automatización de procesos', 'Integración entre herramientas'],
  },
  {
    id: 'backend-apis',
    title: 'Backend & APIs',
    description: 'Servicios y APIs para integrar productos, datos y sistemas de forma segura.',
    iconName: 'plug',
    features: ['Diseño e implementación de APIs', 'Arquitectura e integración de sistemas'],
  },
  {
    id: 'enterprise-software',
    title: 'Software empresarial',
    description: 'Herramientas personalizadas para operaciones y necesidades de negocio.',
    iconName: 'building',
    features: ['Software a la medida', 'Modernización de soluciones existentes'],
  },
];
