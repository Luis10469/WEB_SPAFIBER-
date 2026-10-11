import { PillarItem } from '../types';

export const aboutData = {
  sectionTitle: 'Ingeniería con propósito. Tecnología con visión.',
  description:
    'SPEFIBER S.A.S. desarrolla soluciones de software para convertir retos empresariales en productos digitales claros, útiles y sostenibles. Cada proyecto parte de entender el problema y termina con una solución preparada para crecer.',
  vision:
    'Creemos en la tecnología como una herramienta para simplificar el trabajo, conectar sistemas y abrir nuevas posibilidades para las organizaciones.',
  methodology: [
    {
      number: '01',
      title: 'Entender',
      description: 'Aclaramos objetivos, usuarios, restricciones y alcance antes de elegir una solución.',
    },
    {
      number: '02',
      title: 'Diseñar',
      description: 'Definimos una experiencia y una arquitectura coherentes con las necesidades del proyecto.',
    },
    {
      number: '03',
      title: 'Construir y validar',
      description: 'Implementamos de forma iterativa, probamos los flujos clave y dejamos una base mantenible.',
    },
  ],
  pillars: [
    {
      id: 'innovation',
      title: 'Innovación',
      description: 'Elegimos tecnología por su utilidad, no por tendencia.',
      iconName: 'sparkles',
    },
    {
      id: 'quality',
      title: 'Ingeniería de calidad',
      description: 'Priorizamos claridad, pruebas y mantenimiento.',
      iconName: 'quality',
    },
    {
      id: 'security',
      title: 'Seguridad',
      description: 'Consideramos el manejo de datos desde el diseño.',
      iconName: 'shield',
    },
    {
      id: 'scalability',
      title: 'Escalabilidad',
      description: 'Pensamos en la evolución y el crecimiento del producto.',
      iconName: 'scale',
    },
    {
      id: 'commitment',
      title: 'Compromiso',
      description: 'Mantenemos comunicación clara durante el proyecto.',
      iconName: 'handshake',
    },
  ] as PillarItem[],
};
