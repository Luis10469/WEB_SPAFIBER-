// Cliente de envío de solicitudes de cotización.
// Solo se considera recibida una solicitud cuando el servidor responde 202.
// Cualquier otro resultado se comunica como error, conservando los datos del formulario.

import type { ContactErrors, ContactRequest } from './validation';

export const DEFAULT_CONTACT_ENDPOINT = '/api/contact';
export const CONTACT_TIMEOUT_MS = 15_000;

export type SubmitResult =
  | { status: 'accepted' }
  | { status: 'invalid'; errors: ContactErrors }
  | { status: 'rate-limited'; retryAfterSeconds?: number }
  | { status: 'unavailable' }
  | { status: 'timeout' }
  | { status: 'network-error' }
  | { status: 'cancelled' };

export interface SubmitOptions {
  endpoint?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  signal?: AbortSignal;
}

/**
 * Acepta rutas del mismo origen o URLs HTTPS. Cualquier otro valor se descarta
 * y se usa el endpoint por defecto.
 */
export function resolveContactEndpoint(configured: string | undefined): string {
  const candidate = configured?.trim();
  if (!candidate) return DEFAULT_CONTACT_ENDPOINT;
  if (candidate.startsWith('/') && !candidate.startsWith('//') && !candidate.includes('\\')) return candidate;
  try {
    const parsed = new URL(candidate);
    return parsed.protocol === 'https:' ? parsed.toString() : DEFAULT_CONTACT_ENDPOINT;
  } catch {
    return DEFAULT_CONTACT_ENDPOINT;
  }
}

const readErrorFields = async (response: Response): Promise<ContactErrors | null> => {
  try {
    const body: unknown = await response.json();
    if (typeof body === 'object' && body !== null && 'fields' in body) {
      const fields = (body as { fields: unknown }).fields;
      if (typeof fields === 'object' && fields !== null) return fields as ContactErrors;
    }
    return {};
  } catch {
    return null;
  }
};

export async function submitContactRequest(
  payload: ContactRequest,
  options: SubmitOptions = {},
): Promise<SubmitResult> {
  const endpoint = options.endpoint ?? DEFAULT_CONTACT_ENDPOINT;
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? CONTACT_TIMEOUT_MS;

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const forwardAbort = () => controller.abort();
  options.signal?.addEventListener('abort', forwardAbort);

  try {
    const response = await fetchImpl(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'omit',
      cache: 'no-store',
      redirect: 'error',
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (response.status === 202) return { status: 'accepted' };

    if (response.status === 400) {
      const fields = await readErrorFields(response);
      return fields === null ? { status: 'unavailable' } : { status: 'invalid', errors: fields };
    }

    if (response.status === 429) {
      const retryAfter = Number(response.headers.get('Retry-After'));
      return Number.isFinite(retryAfter) && retryAfter > 0
        ? { status: 'rate-limited', retryAfterSeconds: retryAfter }
        : { status: 'rate-limited' };
    }

    return { status: 'unavailable' };
  } catch (error) {
    if (timedOut) return { status: 'timeout' };
    if (options.signal?.aborted) return { status: 'cancelled' };
    if (error instanceof DOMException && error.name === 'AbortError') return { status: 'timeout' };
    return { status: 'network-error' };
  } finally {
    clearTimeout(timer);
    options.signal?.removeEventListener('abort', forwardAbort);
  }
}
