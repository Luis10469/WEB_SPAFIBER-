import { ServiceItem } from '../types';

export const servicesData: ServiceItem[] = [
  {
    id: 'web-dev',
    title: 'Desarrollo Web',
    description: 'Sitios web y plataformas a medida, escalables y de alto rendimiento.',
    iconName: 'code',
    features: [
      'Arquitecturas modernas (React, Next.js, TypeScript)',
      'Plataformas SaaS y paneles de administración',
      'Optimización de rendimiento y Core Web Vitals',
      'Integración de APIs y microservicios',
    ],
  },
  {
    id: 'mobile-apps',
    title: 'Apps Móviles',
    description: 'Aplicaciones nativas y multiplataforma para iOS y Android.',
    iconName: 'smartphone',
    features: [
      'Desarrollo multiplataforma y nativo',
      'Experiencias de usuario fluidas (UI/UX móvil)',
      'Sincronización en tiempo real y offline-first',
      'Publicación y gestión en App Store y Google Play',
    ],
  },
  {
    id: 'ai-solutions',
    title: 'Inteligencia Artificial',
    description: 'Soluciones con IA para optimizar procesos y tomar mejores decisiones.',
    iconName: 'brain',
    features: [
      'Modelos de Machine Learning predictivos y analítica',
      'Integración de Modelos de Lenguaje (LLMs)',
      'Procesamiento inteligente de datos y visión por computador',
      'Automatización cognitiva para flujos empresariales',
    ],
  },
  {
    id: 'automation',
    title: 'Automatización',
    description: 'Automatizamos procesos para que tu negocio sea más eficiente.',
    iconName: 'cog',
    features: [
      'Orquestación de flujos de trabajo repetitivos',
      'Conexión e interoperabilidad entre sistemas dispares',
      'Reducción de costos operativos y margen de error',
      'Monitoreo y telemetría de tareas automatizadas',
    ],
  },
];
