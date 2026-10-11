export interface NavItem {
  label: string;
  href: string;
  isButton?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: 'code' | 'smartphone' | 'brain' | 'cog' | 'api' | 'cloud';
  features?: string[];
}

export interface PillarItem {
  id: string;
  title: string;
  description: string;
  iconName: 'lightbulb' | 'shield-check' | 'trending-up';
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  tags: string[];
  image: string;
  summary: string;
  fullDescription: string;
  clientType: string;
  technologies: string[];
  isDemoReference: boolean;
}

export interface CompanyInfo {
  legalName: string;
  shortName: string;
  sector: string;
  tagline: string;
  heroHeadline: string;
  heroHighlight: string;
  heroDescription: string;
  emailContact: string;
  phoneContact?: string;
  address?: string;
  socialLinks: {
    linkedin?: string;
    instagram?: string;
    github?: string;
    youtube?: string;
  };
}

export interface ContactFormData {
  fullName: string;
  email: string;
  company?: string;
  serviceId: string;
  message: string;
}
