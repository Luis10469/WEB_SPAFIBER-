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

export interface ContactFormData {
  fullName: string;
  email: string;
  company: string;
  serviceId: string;
  message: string;
}

export interface TechnologyItem {
  name: string;
  category: string;
  iconName: 'code' | 'layers' | 'database' | 'cpu' | 'workflow';
}
