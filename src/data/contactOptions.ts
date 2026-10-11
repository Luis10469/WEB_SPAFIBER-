// Opciones del formulario de cotización. Los rangos presupuestarios son
// ORIENTATIVOS y deben ser confirmados comercialmente antes de publicarlos
// (ver docs/AUDITORIA.md, pendientes). No constituyen una oferta ni un precio.

export const PLATFORM_OPTIONS = [
  { id: 'web', label: 'Web' },
  { id: 'ios', label: 'iOS' },
  { id: 'android', label: 'Android' },
  { id: 'multiplatform', label: 'Multiplataforma (iOS y Android)' },
  { id: 'backend', label: 'Backend / APIs' },
  { id: 'undecided', label: 'Aún no lo tengo definido' },
] as const;

export const TIMELINE_OPTIONS = [
  { id: 'under-1-month', label: 'Menos de 1 mes' },
  { id: '1-3-months', label: 'Entre 1 y 3 meses' },
  { id: '3-6-months', label: 'Entre 3 y 6 meses' },
  { id: 'over-6-months', label: 'Más de 6 meses' },
  { id: 'undecided', label: 'Por definir' },
] as const;

export const BUDGET_OPTIONS = [
  { id: 'undecided', label: 'Prefiero no indicarlo' },
  { id: 'up-to-5k', label: 'Hasta 5.000 USD (orientativo)' },
  { id: '5k-15k', label: 'De 5.000 a 15.000 USD (orientativo)' },
  { id: '15k-40k', label: 'De 15.000 a 40.000 USD (orientativo)' },
  { id: 'over-40k', label: 'Más de 40.000 USD (orientativo)' },
] as const;

export type PlatformId = (typeof PLATFORM_OPTIONS)[number]['id'];
export type TimelineId = (typeof TIMELINE_OPTIONS)[number]['id'];
export type BudgetId = (typeof BUDGET_OPTIONS)[number]['id'];
