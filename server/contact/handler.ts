// Receptor de solicitudes de cotización. Usa APIs Web estándar (Request/Response),
// por lo que es portable entre Cloudflare Pages Functions, Netlify, Vercel Edge o Node 18+.
// Los secretos se leen solo del entorno del servidor y nunca se devuelven al cliente.

import { CONTACT_MAX_BODY_BYTES, parseContactRequest } from '../../src/lib/contact/validation';
import { createMemoryRateLimiter, type RateLimiter } from './rateLimit';

export interface ContactEnv {
  /** URL HTTPS del sistema que recibe las solicitudes (CRM, helpdesk o automatización). Secreto de servidor. */
  CONTACT_WEBHOOK_URL?: string;
  /** Token Bearer opcional para el webhook. Secreto de servidor. */
  CONTACT_WEBHOOK_TOKEN?: string;
  /** Orígenes adicionales permitidos, separados por comas (p. ej. https://www.ejemplo.com). */
  CONTACT_ALLOWED_ORIGINS?: string;
}

export interface ContactHandlerDeps {
  fetchImpl?: typeof fetch;
  rateLimiter?: RateLimiter;
  now?: () => number;
  deliveryTimeoutMs?: number;
  log?: (event: string, details?: Record<string, string | number>) => void;
}

export const MIN_FORM_FILL_MS = 2_000;
export const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;
export const DELIVERY_TIMEOUT_MS = 8_000;

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
};

const jsonResponse = (status: number, body: unknown, extraHeaders: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { ...JSON_HEADERS, ...extraHeaders } });

const defaultRateLimiter = createMemoryRateLimiter();

const allowedOriginsFor = (requestUrl: string, env: ContactEnv): string[] => {
  const own = new URL(requestUrl).origin;
  const extra = (env.CONTACT_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  return [own, ...extra];
};

const isHttpsUrl = (value: string | undefined): value is string => {
  if (!value) return false;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
};

// Solo se usa la IP que aporta la plataforma (Cloudflare). X-Forwarded-For se ignora
// porque el cliente puede falsificarlo para evadir el límite de peticiones.
const clientKey = (request: Request) => request.headers.get('CF-Connecting-IP') ?? 'anonymous';

export async function handleContactRequest(
  request: Request,
  env: ContactEnv,
  deps: ContactHandlerDeps = {},
): Promise<Response> {
  const fetchImpl = deps.fetchImpl ?? fetch;
  const rateLimiter = deps.rateLimiter ?? defaultRateLimiter;
  const now = deps.now ?? Date.now;
  const log = deps.log ?? (() => undefined);

  if (request.method !== 'POST') {
    return jsonResponse(405, { error: 'method-not-allowed' }, { Allow: 'POST' });
  }

  const origin = request.headers.get('Origin');
  if (!origin || !allowedOriginsFor(request.url, env).includes(origin)) {
    log('origin-rejected');
    return jsonResponse(403, { error: 'forbidden' });
  }

  const contentType = request.headers.get('Content-Type') ?? '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return jsonResponse(415, { error: 'unsupported-media-type' });
  }

  const limit = rateLimiter.check(clientKey(request), now());
  if (!limit.allowed) {
    log('rate-limited');
    return jsonResponse(429, { error: 'rate-limited' }, { 'Retry-After': String(limit.retryAfterSeconds) });
  }

  const declaredLength = Number(request.headers.get('Content-Length') ?? '0');
  if (declaredLength > CONTACT_MAX_BODY_BYTES) {
    return jsonResponse(413, { error: 'payload-too-large' });
  }

  const rawBody = await request.text();
  if (new TextEncoder().encode(rawBody).byteLength > CONTACT_MAX_BODY_BYTES) {
    return jsonResponse(413, { error: 'payload-too-large' });
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawBody);
  } catch {
    return jsonResponse(400, { error: 'invalid-json' });
  }

  const parsed = parseContactRequest(parsedJson);
  if (!parsed.ok) {
    return jsonResponse(400, { error: 'validation', fields: parsed.errors });
  }

  const elapsed = now() - parsed.data.renderedAt;
  if (elapsed < MIN_FORM_FILL_MS || elapsed > MAX_FORM_AGE_MS) {
    log('timing-rejected');
    return jsonResponse(400, {
      error: 'validation',
      fields: { renderedAt: 'La solicitud no pudo procesarse. Inténtalo de nuevo.' },
    });
  }

  if (!isHttpsUrl(env.CONTACT_WEBHOOK_URL)) {
    // Sin destino configurado NO se confirma la recepción.
    log('delivery-not-configured');
    return jsonResponse(503, { error: 'unavailable' });
  }

  // Solo se reenvían los campos de negocio; no se incluyen cabeceras ni IP.
  const { website: _honeypot, renderedAt: _renderedAt, ...business } = parsed.data;
  void _honeypot;
  void _renderedAt;

  const headers: Record<string, string> = { 'Content-Type': 'application/json', Accept: 'application/json' };
  if (env.CONTACT_WEBHOOK_TOKEN) headers.Authorization = `Bearer ${env.CONTACT_WEBHOOK_TOKEN}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), deps.deliveryTimeoutMs ?? DELIVERY_TIMEOUT_MS);
  try {
    const delivery = await fetchImpl(env.CONTACT_WEBHOOK_URL, {
      method: 'POST',
      headers,
      redirect: 'error',
      body: JSON.stringify({ source: 'spefiber-website', receivedAt: new Date(now()).toISOString(), request: business }),
      signal: controller.signal,
    });
    if (!delivery.ok) {
      log('delivery-failed', { status: delivery.status });
      return jsonResponse(502, { error: 'unavailable' });
    }
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === 'AbortError';
    log(timedOut ? 'delivery-timeout' : 'delivery-error');
    return jsonResponse(timedOut ? 504 : 502, { error: 'unavailable' });
  } finally {
    clearTimeout(timer);
  }

  return jsonResponse(202, { ok: true });
}
