// Validación única de solicitudes de cotización.
// Se usa en el navegador (retroalimentación inmediata) y en el receptor del servidor
// (fuente de verdad). No depende del DOM ni de APIs de Node, para poder reutilizarse.

import { servicesData } from '../../data/services';
import {
  BUDGET_OPTIONS,
  PLATFORM_OPTIONS,
  TIMELINE_OPTIONS,
  type BudgetId,
  type PlatformId,
  type TimelineId,
} from '../../data/contactOptions';

export const CONTACT_LIMITS = {
  fullName: { min: 2, max: 100 },
  email: { max: 254 },
  company: { max: 120 },
  objective: { min: 10, max: 500 },
  features: { max: 800 },
  message: { min: 10, max: 2000 },
  referenceProjectId: { max: 80 },
  referenceProjectTitle: { max: 120 },
} as const;

/** Tamaño máximo del cuerpo JSON aceptado por el receptor (bytes). */
export const CONTACT_MAX_BODY_BYTES = 16 * 1024;

export interface ContactRequest {
  fullName: string;
  email: string;
  company: string;
  serviceId: string;
  platform: PlatformId;
  objective: string;
  features: string;
  timeline: TimelineId;
  budget: BudgetId;
  message: string;
  referenceProjectId: string;
  referenceProjectTitle: string;
  consent: true;
  /** Campo trampa para bots. Debe llegar vacío. */
  website: string;
  /** Marca de tiempo (ms epoch) de cuando se mostró el formulario. */
  renderedAt: number;
}

export type ContactField = keyof ContactRequest;

export type ContactErrors = Partial<Record<ContactField, string>>;

export type ContactParseResult =
  | { ok: true; data: ContactRequest }
  | { ok: false; errors: ContactErrors };

const CONTROL_CHARS = /[\u0000-\u001F\u007F]/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PROJECT_ID_PATTERN = /^[a-z0-9-]*$/;

const SERVICE_IDS = new Set<string>(['custom', ...servicesData.map((service) => service.id)]);

const isOneOf = <T extends readonly { id: string }[]>(options: T, value: string): value is T[number]['id'] =>
  options.some((option) => option.id === value);

const readString = (source: Record<string, unknown>, key: string): string => {
  const value = source[key];
  return typeof value === 'string' ? value.trim() : '';
};

const hasControlCharacters = (value: string) => CONTROL_CHARS.test(value);

/**
 * Valida y normaliza una solicitud de cotización de origen no confiable (JSON del cliente).
 * Devuelve errores por campo sin reflejar el valor recibido.
 */
export function parseContactRequest(input: unknown): ContactParseResult {
  const errors: ContactErrors = {};

  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return { ok: false, errors: { fullName: 'Solicitud no válida.' } };
  }
  const source = input as Record<string, unknown>;

  const fullName = readString(source, 'fullName');
  if (fullName.length < CONTACT_LIMITS.fullName.min || fullName.length > CONTACT_LIMITS.fullName.max || hasControlCharacters(fullName)) {
    errors.fullName = `Escribe tu nombre (entre ${CONTACT_LIMITS.fullName.min} y ${CONTACT_LIMITS.fullName.max} caracteres).`;
  }

  const email = readString(source, 'email');
  if (!email || email.length > CONTACT_LIMITS.email.max || !EMAIL_PATTERN.test(email) || hasControlCharacters(email)) {
    errors.email = 'Revisa el formato del correo electrónico.';
  }

  const company = readString(source, 'company');
  if (company.length > CONTACT_LIMITS.company.max || hasControlCharacters(company)) {
    errors.company = `La organización no puede superar ${CONTACT_LIMITS.company.max} caracteres.`;
  }

  const serviceId = readString(source, 'serviceId') || 'custom';
  if (!SERVICE_IDS.has(serviceId)) {
    errors.serviceId = 'Selecciona un tipo de proyecto de la lista.';
  }

  const platform = readString(source, 'platform');
  if (!isOneOf(PLATFORM_OPTIONS, platform)) {
    errors.platform = 'Selecciona la plataforma solicitada.';
  }

  const objective = readString(source, 'objective');
  if (objective.length < CONTACT_LIMITS.objective.min || objective.length > CONTACT_LIMITS.objective.max || hasControlCharacters(objective)) {
    errors.objective = `Describe el objetivo empresarial (entre ${CONTACT_LIMITS.objective.min} y ${CONTACT_LIMITS.objective.max} caracteres).`;
  }

  const features = readString(source, 'features');
  if (features.length > CONTACT_LIMITS.features.max || hasControlCharacters(features)) {
    errors.features = `Las funcionalidades no pueden superar ${CONTACT_LIMITS.features.max} caracteres.`;
  }

  const timeline = readString(source, 'timeline');
  if (!isOneOf(TIMELINE_OPTIONS, timeline)) {
    errors.timeline = 'Selecciona un plazo deseado.';
  }

  const budget = readString(source, 'budget') || 'undecided';
  if (!isOneOf(BUDGET_OPTIONS, budget)) {
    errors.budget = 'Selecciona un rango válido o deja la opción por defecto.';
  }

  const message = readString(source, 'message');
  if (message.length < CONTACT_LIMITS.message.min || message.length > CONTACT_LIMITS.message.max || hasControlCharacters(message)) {
    errors.message = `La descripción debe tener entre ${CONTACT_LIMITS.message.min} y ${CONTACT_LIMITS.message.max} caracteres.`;
  }

  const referenceProjectId = readString(source, 'referenceProjectId');
  if (referenceProjectId.length > CONTACT_LIMITS.referenceProjectId.max || !PROJECT_ID_PATTERN.test(referenceProjectId)) {
    errors.referenceProjectId = 'El proyecto de referencia no es válido.';
  }

  const referenceProjectTitle = readString(source, 'referenceProjectTitle');
  if (referenceProjectTitle.length > CONTACT_LIMITS.referenceProjectTitle.max || hasControlCharacters(referenceProjectTitle)) {
    errors.referenceProjectTitle = 'El título del proyecto de referencia no es válido.';
  }

  if (source.consent !== true) {
    errors.consent = 'Debes aceptar el tratamiento de tus datos para continuar.';
  }

  const website = readString(source, 'website');
  if (website) {
    // Mensaje genérico: no se revela el campo trampa.
    errors.website = 'La solicitud no pudo procesarse.';
  }

  const renderedAt = typeof source.renderedAt === 'number' && Number.isFinite(source.renderedAt) ? source.renderedAt : 0;
  if (!renderedAt) {
    errors.renderedAt = 'La solicitud no pudo procesarse.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      fullName,
      email,
      company,
      serviceId,
      platform: platform as PlatformId,
      objective,
      features,
      timeline: timeline as TimelineId,
      budget: budget as BudgetId,
      message,
      referenceProjectId,
      referenceProjectTitle,
      consent: true,
      website: '',
      renderedAt,
    },
  };
}
