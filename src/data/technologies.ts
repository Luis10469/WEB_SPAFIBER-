import { TechnologyItem } from '../types';

// Pendiente de confirmación por el propietario: validar experiencia real de cada tecnología
// antes de publicarla como capacidad de SPEFIBER (ver docs/AUDITORIA.md, SPF-014).
export const technologiesData: TechnologyItem[] = [
  { name: 'React', category: 'Interfaces', iconName: 'code' },
  { name: 'TypeScript', category: 'Interfaces', iconName: 'code' },
  { name: 'Vite', category: 'Entrega web', iconName: 'layers' },
  { name: 'Node.js', category: 'Servicios', iconName: 'workflow' },
  { name: 'Python', category: 'IA y datos', iconName: 'cpu' },
  { name: 'PostgreSQL', category: 'Datos', iconName: 'database' },
  { name: 'React Native', category: 'Aplicaciones móviles', iconName: 'layers' },
  { name: 'APIs REST', category: 'Integraciones', iconName: 'workflow' },
];
