export interface NavItem {
  label: string;
  href: string;
  id: string;
}

export type ServiceIconName =
  | 'code'
  | 'smartphone'
  | 'brain'
  | 'workflow'
  | 'plug'
  | 'building';

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: ServiceIconName;
  features: string[];
}

export type PillarIconName = 'sparkles' | 'quality' | 'shield' | 'scale' | 'handshake';

export interface PillarItem {
  id: string;
  title: string;
  description: string;
  iconName: PillarIconName;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  image: string;
  summary: string;
  fullDescription: string;
  scenario: string;
  technologies: string[];
  status: string;
  isDemoReference: boolean;
  demoUrl?: string;
}

export interface CompanyInfo {
  legalName: string;
  shortName: string;
  sector: string;
  tagline: string;
  heroHeadline: string;
  heroHighlight: string;
  heroDescription: string;
  contactEmail?: string;
  socialLinks: {
    linkedin?: string;
    instagram?: string;
    github?: string;
    youtube?: string;
  };
  legalLinks: {
    privacy?: string;
    terms?: string;
  };
}

/** Estado editable del formulario de cotización (valores tal como los escribe el visitante). */
export interface ContactDraft {
  fullName: string;
  email: string;
  company: string;
  serviceId: string;
  platform: string;
  objective: string;
  features: string;
  timeline: string;
  budget: string;
  message: string;
  referenceProjectId: string;
  referenceProjectTitle: string;
  consent: boolean;
  website: string;
}

/** Proyecto de referencia que el visitante quiere usar como punto de partida. */
export interface ProjectReference {
  id: string;
  title: string;
}

export interface TechnologyItem {
  name: string;
  category: string;
  iconName: 'code' | 'layers' | 'database' | 'cpu' | 'workflow';
}
