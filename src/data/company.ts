import { CompanyInfo } from '../types';

export const companyData: CompanyInfo = {
  legalName: 'SPEFIBER S.A.S.',
  shortName: 'SPEFIBER',
  sector: 'Desarrollo de software y tecnología',
  tagline: 'TECNOLOGÍA QUE IMPULSA TU FUTURO',
  heroHeadline: 'Transformamos ideas en',
  heroHighlight: 'soluciones digitales',
  heroDescription:
    'Desarrollamos software a medida, aplicaciones móviles, plataformas web, soluciones de inteligencia artificial y automatización para llevar tu negocio al siguiente nivel.',
  emailContact: 'contacto@spefiber.com', // Configurable para producción
  socialLinks: {
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    github: 'https://github.com',
    youtube: 'https://youtube.com',
  },
};

export const heroStats = [
  {
    id: 'innovative',
    title: 'Soluciones innovadoras',
    subtitle: 'para un mundo en constante cambio',
    icon: 'zap',
  },
  {
    id: 'custom',
    title: 'Tecnología a tu medida',
    subtitle: 'desde startups hasta grandes empresas',
    icon: 'users',
  },
  {
    id: 'real-results',
    title: 'Resultados reales',
    subtitle: 'que impulsan tu crecimiento',
    icon: 'bar-chart-3',
  },
];
