// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { handleContactRequest, MIN_FORM_FILL_MS, type ContactEnv } from '../server/contact/handler';
import { createMemoryRateLimiter } from '../server/contact/rateLimit';

const ORIGIN = 'https://spefiber.example.test';
const NOW = 1_700_000_100_000;
const WEBHOOK = 'https://crm.example.test/hooks/contact';

const body = (overrides: Record<string, unknown> = {}) =>
  JSON.stringify({
    fullName: 'Ana Pérez',
    email: 'ana@example.com',
    company: '',
    serviceId: 'web-dev',
    platform: 'web',
    objective: 'Centralizar solicitudes internas en una sola plataforma.',
    features: '',
    timeline: 'undecided',
    budget: 'undecided',
    message: 'Necesitamos una plataforma web para coordinar solicitudes internas.',
    referenceProjectId: '',
    referenceProjectTitle: '',
    consent: true,
    website: '',
    renderedAt: NOW - MIN_FORM_FILL_MS - 1000,
    ...overrides,
  });

const buildRequest = (overrides: { method?: string; origin?: string | null; contentType?: string; body?: string; ip?: string } = {}) => {
  const headers = new Headers({ 'Content-Type': overrides.contentType ?? 'application/json' });
  if (overrides.origin !== null) headers.set('Origin', overrides.origin ?? ORIGIN);
  if (overrides.ip) headers.set('CF-Connecting-IP', overrides.ip);
  return new Request(`${ORIGIN}/api/contact`, {
    method: overrides.method ?? 'POST',
    headers,
    body: overrides.method === 'GET' ? undefined : overrides.body ?? body(),
  });
};

const env: ContactEnv = { CONTACT_WEBHOOK_URL: WEBHOOK, CONTACT_WEBHOOK_TOKEN: 'test-token-not-real' };

const deps = (fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 200 }))) => ({
  fetchImpl,
  now: () => NOW,
  rateLimiter: createMemoryRateLimiter({ limit: 100 }),
  log: vi.fn(),
});

describe('handleContactRequest', () => {
  it('reenvía la solicitud al webhook configurado y responde 202', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    const response = await handleContactRequest(buildRequest(), env, deps(fetchImpl));

    expect(response.status).toBe(202);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(WEBHOOK);
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer test-token-not-real');
    const sent = JSON.parse(String(init.body)) as { request: Record<string, unknown> };
    expect(sent.request).not.toHaveProperty('website');
    expect(sent.request).not.toHaveProperty('renderedAt');
    expect(sent.request.email).toBe('ana@example.com');
  });

  it('no confirma la recepción si el webhook no está configurado', async () => {
    const fetchImpl = vi.fn();
    const response = await handleContactRequest(buildRequest(), {}, deps(fetchImpl));
    expect(response.status).toBe(503);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('rechaza webhooks no HTTPS', async () => {
    const fetchImpl = vi.fn();
    const response = await handleContactRequest(buildRequest(), { CONTACT_WEBHOOK_URL: 'http://crm.example.test' }, deps(fetchImpl));
    expect(response.status).toBe(503);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('informa error si el webhook responde con fallo, sin confirmar recepción', async () => {
    const response = await handleContactRequest(buildRequest(), env, deps(vi.fn().mockResolvedValue(new Response(null, { status: 500 }))));
    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({ error: 'unavailable' });
  });

  it('devuelve 504 cuando el webhook supera el tiempo máximo', async () => {
    const fetchImpl = vi.fn((_url: string, init?: RequestInit) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
    }));
    const response = await handleContactRequest(buildRequest(), env, { ...deps(fetchImpl), deliveryTimeoutMs: 5 });
    expect(response.status).toBe(504);
  });

  it('rechaza métodos distintos de POST', async () => {
    const response = await handleContactRequest(buildRequest({ method: 'GET' }), env, deps());
    expect(response.status).toBe(405);
    expect(response.headers.get('Allow')).toBe('POST');
  });

  it('rechaza orígenes no permitidos y peticiones sin Origin', async () => {
    expect((await handleContactRequest(buildRequest({ origin: 'https://evil.example' }), env, deps())).status).toBe(403);
    expect((await handleContactRequest(buildRequest({ origin: null }), env, deps())).status).toBe(403);
  });

  it('admite orígenes adicionales configurados en el servidor', async () => {
    const extraEnv = { ...env, CONTACT_ALLOWED_ORIGINS: 'https://www.spefiber.example.test' };
    const response = await handleContactRequest(buildRequest({ origin: 'https://www.spefiber.example.test' }), extraEnv, deps());
    expect(response.status).toBe(202);
  });

  it('exige Content-Type JSON', async () => {
    const response = await handleContactRequest(buildRequest({ contentType: 'text/plain' }), env, deps());
    expect(response.status).toBe(415);
  });

  it('limita el tamaño del cuerpo', async () => {
    const huge = body({ message: 'm'.repeat(20_000) });
    const response = await handleContactRequest(buildRequest({ body: huge }), env, deps());
    expect(response.status).toBe(413);
  });

  it('responde 400 ante JSON inválido', async () => {
    const response = await handleContactRequest(buildRequest({ body: '{no-json' }), env, deps());
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'invalid-json' });
  });

  it('devuelve errores de validación por campo sin reflejar datos enviados', async () => {
    const response = await handleContactRequest(buildRequest({ body: body({ email: 'mal' }) }), env, deps());
    expect(response.status).toBe(400);
    const json = (await response.json()) as { error: string; fields: Record<string, string> };
    expect(json.error).toBe('validation');
    expect(json.fields.email).toBeDefined();
    expect(JSON.stringify(json)).not.toContain('mal');
  });

  it('bloquea envíos con el campo trampa completado', async () => {
    const fetchImpl = vi.fn();
    const response = await handleContactRequest(buildRequest({ body: body({ website: 'spam' }) }), env, deps(fetchImpl));
    expect(response.status).toBe(400);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('bloquea envíos demasiado rápidos para un ser humano', async () => {
    const fast = await handleContactRequest(buildRequest({ body: body({ renderedAt: NOW - 500 }) }), env, deps());
    expect(fast.status).toBe(400);
  });

  it('acepta formularios abiertos durante mucho tiempo (sin máximo de antigüedad)', async () => {
    const stale = await handleContactRequest(buildRequest({ body: body({ renderedAt: NOW - 3 * 24 * 60 * 60 * 1000 }) }), env, deps());
    expect(stale.status).toBe(202);
  });

  it('aplica límite de peticiones por IP con Retry-After', async () => {
    const limited = { ...deps(), rateLimiter: createMemoryRateLimiter({ limit: 2, windowMs: 60_000 }) };
    const first = await handleContactRequest(buildRequest({ ip: '203.0.113.9' }), env, limited);
    const second = await handleContactRequest(buildRequest({ ip: '203.0.113.9' }), env, limited);
    const third = await handleContactRequest(buildRequest({ ip: '203.0.113.9' }), env, limited);
    expect(first.status).toBe(202);
    expect(second.status).toBe(202);
    expect(third.status).toBe(429);
    expect(Number(third.headers.get('Retry-After'))).toBeGreaterThan(0);
  });
});

describe('createMemoryRateLimiter', () => {
  it('reinicia la ventana tras expirar', () => {
    const limiter = createMemoryRateLimiter({ limit: 1, windowMs: 1000 });
    expect(limiter.check('a', 0).allowed).toBe(true);
    expect(limiter.check('a', 500).allowed).toBe(false);
    expect(limiter.check('a', 1500).allowed).toBe(true);
    expect(limiter.check('b', 500).allowed).toBe(true);
  });
});
