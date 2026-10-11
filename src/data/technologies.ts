import { TechnologyItem } from '../types';

// Catálogo de referencia editable. Confirmar tecnologías y experiencia disponibles
// con el equipo antes de presentarlo como un inventario corporativo definitivo.
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
