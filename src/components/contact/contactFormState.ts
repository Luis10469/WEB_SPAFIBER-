import type { ContactDraft, ProjectReference } from '../../types';

export const createEmptyDraft = (serviceId: string, reference: ProjectReference | null = null): ContactDraft => ({
  fullName: '',
  email: '',
  company: '',
  serviceId,
  platform: '',
  objective: '',
  features: '',
  timeline: '',
  budget: 'undecided',
  message: '',
  referenceProjectId: reference?.id ?? '',
  referenceProjectTitle: reference?.title ?? '',
  consent: false,
  website: '',
});
