import { CompanyInfo } from '../types';

const optionalEmail = (value: string | undefined) => {
  const email = value?.trim();
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined;
};

const optionalExternalUrl = (value: string | undefined) => {
  const candidate = value?.trim();
  if (!candidate) return undefined;
  try {
    const parsed = new URL(candidate);
    return parsed.protocol === 'https:' ? parsed.toString() : undefined;
  } catch {
    return undefined;
  }
};

const optionalLegalUrl = (value: string | undefined) => {
  const candidate = value?.trim();
  if (!candidate) return undefined;
  if (candidate.startsWith('/') && !candidate.startsWith('//') && !candidate.includes('\\')) return candidate;
  return optionalExternalUrl(candidate);
};

export const companyData: CompanyInfo = {
  legalName: 'SPEFIBER S.A.S.',
  shortName: 'SPEFIBER',
  sector: 'Ingeniería de software y soluciones digitales',
  tagline: 'TECNOLOGÍA QUE IMPULSA TU FUTURO',
  heroHeadline: 'Transformamos ideas en',
  heroHighlight: 'soluciones digitales.',
  heroDescription:
    'Desarrollamos software, aplicaciones y soluciones tecnológicas diseñadas para impulsar la innovación y el crecimiento empresarial.',
  // Los datos opcionales solo aparecen si SPEFIBER los configura con información verificada.
  contactEmail: optionalEmail(import.meta.env.VITE_CONTACT_EMAIL),
  socialLinks: {
    linkedin: optionalExternalUrl(import.meta.env.VITE_SOCIAL_LINKEDIN),
    instagram: optionalExternalUrl(import.meta.env.VITE_SOCIAL_INSTAGRAM),
    github: optionalExternalUrl(import.meta.env.VITE_SOCIAL_GITHUB),
    youtube: optionalExternalUrl(import.meta.env.VITE_SOCIAL_YOUTUBE),
  },
  legalLinks: {
    privacy: optionalLegalUrl(import.meta.env.VITE_PRIVACY_URL),
    terms: optionalLegalUrl(import.meta.env.VITE_TERMS_URL),
  },
};

export const heroHighlights = [
  {
    id: 'innovation',
    title: 'Innovación aplicada',
    description: 'Tecnología alineada con objetivos reales.',
    icon: 'sparkles',
  },
  {
    id: 'engineering',
    title: 'Ingeniería a medida',
    description: 'Soluciones pensadas para cada contexto.',
    icon: 'code',
  },
  {
    id: 'growth',
    title: 'Preparados para crecer',
    description: 'Arquitecturas con visión de largo plazo.',
    icon: 'layers',
  },
] as const;
