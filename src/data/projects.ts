import { ProjectItem } from '../types';
import project1Img from '../assets/optimized/projects/project_1_erp.webp';
import project2Img from '../assets/optimized/projects/project_2_mobile.webp';
import project3Img from '../assets/optimized/projects/project_3_ai.webp';
import project4Img from '../assets/optimized/projects/project_4_ecommerce.webp';

// Conceptos visuales para mostrar formatos de solución. No son casos de clientes ni
// proyectos entregados por SPEFIBER. Sustituir por casos autorizados antes de publicar.
export const projectsData: ProjectItem[] = [
  {
    id: 'operations-dashboard-concept',
    title: 'Panel de gestión operativa',
    category: 'Plataforma web',
    tags: ['Web', 'Panel de gestión', 'Operaciones'],
    image: project1Img,
    summary: 'Concepto de interfaz para visualizar procesos e información de operación en un solo lugar.',
    fullDescription:
      'Ejemplo demostrativo de una plataforma para organizar tareas, consultar indicadores y centralizar información. El contenido y la imagen son ilustrativos; no representan una implementación o cliente real de SPEFIBER.',
    scenario: 'Escenario ilustrativo: gestión de operaciones',
    technologies: ['React', 'TypeScript', 'API REST'],
    status: 'Concepto demostrativo',
    isDemoReference: true,
  },
  {
    id: 'mobile-service-concept',
    title: 'Aplicación de servicios',
    category: 'Aplicación móvil',
    tags: ['Móvil', 'Autogestión', 'Integraciones'],
    image: project2Img,
    summary: 'Concepto de experiencia móvil para consultar y gestionar solicitudes de servicio.',
    fullDescription:
      'Ejemplo demostrativo de una experiencia móvil con flujos de solicitud, seguimiento y consulta. El contenido y la imagen son ilustrativos; no representan una aplicación publicada por SPEFIBER.',
    scenario: 'Escenario ilustrativo: autoservicio móvil',
    technologies: ['React Native', 'TypeScript', 'API REST'],
    status: 'Concepto demostrativo',
    isDemoReference: true,
  },
  {
    id: 'ai-analytics-concept',
    title: 'Analítica asistida por IA',
    category: 'Inteligencia artificial',
    tags: ['IA', 'Analítica', 'Datos'],
    image: project3Img,
    summary: 'Concepto de producto para explorar información y apoyar el análisis de datos.',
    fullDescription:
      'Ejemplo demostrativo de una interfaz de análisis que podría combinar visualización de datos y funciones de inteligencia artificial. El contenido es ilustrativo; no representa un sistema desplegado por SPEFIBER.',
    scenario: 'Escenario ilustrativo: análisis de información',
    technologies: ['Python', 'FastAPI', 'Modelos de IA'],
    status: 'Concepto demostrativo',
    isDemoReference: true,
  },
  {
    id: 'digital-commerce-concept',
    title: 'Comercio digital',
    category: 'Comercio electrónico',
    tags: ['Web', 'Comercio', 'Integraciones'],
    image: project4Img,
    summary: 'Concepto de tienda digital con catálogo e integración de servicios de compra.',
    fullDescription:
      'Ejemplo demostrativo de una experiencia de comercio digital. La captura, el contenido y el stack son referencias visuales, no un proyecto de cliente atribuido a SPEFIBER.',
    scenario: 'Escenario ilustrativo: comercio digital',
    technologies: ['TypeScript', 'Aplicación web', 'API de pagos'],
    status: 'Concepto demostrativo',
    isDemoReference: true,
  },
];
