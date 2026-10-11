import { PillarItem } from '../types';

export const aboutData = {
  sectionTitle: '¿Por qué SPEFIBER S.A.S.?',
  description:
    'Somos un equipo apasionado por la tecnología, enfocado en crear soluciones que generen un impacto real en las personas y las empresas.',
  pillars: [
    {
      id: 'innovation',
      title: 'Innovación constante',
      description: 'Exploramos nuevas tecnologías para ofrecer soluciones de vanguardia.',
      iconName: 'lightbulb',
    },
    {
      id: 'quality',
      title: 'Calidad garantizada',
      description: 'Aplicamos las mejores prácticas en cada proyecto.',
      iconName: 'shield-check',
    },
    {
      id: 'scalability',
      title: 'Soluciones escalables',
      description: 'Desarrollamos pensando en tu crecimiento a largo plazo.',
      iconName: 'trending-up',
    },
  ] as PillarItem[],
};
