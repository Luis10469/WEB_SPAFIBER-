import { ProjectItem } from '../types';
import project1Img from '../assets/projects/project_1_erp.png';
import project2Img from '../assets/projects/project_2_mobile.png';
import project3Img from '../assets/projects/project_3_ai.png';
import project4Img from '../assets/projects/project_4_ecommerce.png';

export const projectsData: ProjectItem[] = [
  {
    id: 'sistema-gestion',
    title: 'Sistema de Gestión Empresarial',
    category: 'Plataforma Corporativa',
    tags: ['Web', 'Dashboard', 'Automatización'],
    image: project1Img,
    summary: 'Plataforma centralizada con dashboards analíticos en tiempo real, control de inventario y flujos automatizados.',
    fullDescription: 'Arquitectura web orientada a la centralización de operaciones empresariales. Integra módulos de facturación, métricas analíticas avanzadas, control de acceso basado en roles (RBAC) y canalización de reportes automatizados en segundo plano.',
    clientType: 'Sector Logístico & Operaciones',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    isDemoReference: true,
  },
  {
    id: 'app-servicios',
    title: 'App de Servicios',
    category: 'Aplicación Móvil',
    tags: ['iOS', 'Android', 'Backend'],
    image: project2Img,
    summary: 'Aplicación móvil de alto desempeño para solicitud, seguimiento y pago seguro de servicios corporativos.',
    fullDescription: 'Solución móvil nativa y multiplataforma orientada a la autogestión de usuarios y prestadores de servicios. Incluye geolocalización en tiempo real, notificaciones push transaccionales, modo oscuro nativo y comunicación cifrada de extremo a extremo.',
    clientType: 'Servicios Corporativos & On-Demand',
    technologies: ['React Native', 'TypeScript', 'GraphQL', 'Firebase', 'Redis'],
    isDemoReference: true,
  },
  {
    id: 'analisis-ia',
    title: 'Plataforma de Análisis con IA',
    category: 'Inteligencia Artificial',
    tags: ['Inteligencia Artificial', 'Big Data'],
    image: project3Img,
    summary: 'Solución de analítica predictiva asistida por modelos de lenguaje e inteligencia artificial sobre grandes volúmenes de datos.',
    fullDescription: 'Entorno de análisis e inteligencia de negocios que incorpora procesamiento de lenguaje natural y modelos predictivos para proyectar tendencias, detectar anomalías operativas y generar resúmenes ejecutivos automatizados.',
    clientType: 'Finanzas & Analítica de Datos',
    technologies: ['Python', 'FastAPI', 'PyTorch', 'Vector DB', 'Next.js'],
    isDemoReference: true,
  },
  {
    id: 'ecommerce-personalizado',
    title: 'E-commerce Personalizado',
    category: 'Comercio Electrónico',
    tags: ['Web', 'Pagos', 'Integraciones'],
    image: project4Img,
    summary: 'Plataforma de comercio electrónico con arquitectura headless, checkout ultrarrápido e integraciones bancarias.',
    fullDescription: 'Tienda digital de alto tráfico diseñada con estándares modernos de conversión, catálogo dinámico sincronizado, pasarelas de pago seguras y arquitectura orientada a la resiliencia en picos de alta demanda.',
    clientType: 'Retail & Comercio Digital',
    technologies: ['Next.js', 'TypeScript', 'Stripe', 'Tailwind CSS', 'Docker'],
    isDemoReference: true,
  },
];
