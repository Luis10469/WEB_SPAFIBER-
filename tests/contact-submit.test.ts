import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_CONTACT_ENDPOINT, resolveContactEndpoint, submitContactRequest } from '../src/lib/contact/submitContact';
import type { ContactRequest } from '../src/lib/contact/validation';

const payload: ContactRequest = {
  fullName: 'Ana Pérez',
  email: 'ana@example.com',
  company: '',
  serviceId: 'custom',
  platform: 'web',
  objective: 'Centralizar solicitudes internas en una sola plataforma.',
  features: '',
  timeline: 'undecided',
  budget: 'undecided',
  message: 'Necesitamos una plataforma web para coordinar solicitudes.',
  referenceProjectId: '',
  referenceProjectTitle: '',
  consent: true,
  website: '',
  renderedAt: 1,
};

const jsonResponse = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers });

describe('resolveContactEndpoint', () => {
  it('usa el endpoint por defecto cuando no hay configuración', () => {
    expect(resolveContactEndpoint(undefined)).toBe(DEFAULT_CONTACT_ENDPOINT);
    expect(resolveContactEndpoint('  ')).toBe(DEFAULT_CONTACT_ENDPOINT);
  });

  it('acepta rutas del mismo origen y URLs HTTPS, descartando el resto', () => {
    expect(resolveContactEndpoint('/api/contact')).toBe('/api/contact');
    expect(resolveContactEndpoint('https://forms.example.com/contact')).toBe('https://forms.example.com/contact');
    expect(resolveContactEndpoint('http://insegura.example.com')).toBe(DEFAULT_CONTACT_ENDPOINT);
    expect(resolveContactEndpoint('//otro-origen.example.com')).toBe(DEFAULT_CONTACT_ENDPOINT);
    expect(resolveContactEndpoint('no es una url')).toBe(DEFAULT_CONTACT_ENDPOINT);
  });
});

describe('submitContactRequest', () => {
  it('solo informa aceptación ante una respuesta 202', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    await expect(submitContactRequest(payload, { fetchImpl })).resolves.toEqual({ status: 'accepted' });
    expect(fetchImpl).toHaveBeenCalledWith('/api/contact', expect.objectContaining({
      method: 'POST',
      credentials: 'omit',
      redirect: 'error',
    }));
  });

  it('no considera aceptada una respuesta 200 sin confirmación explícita', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response('ok', { status: 200 }));
    await expect(submitContactRequest(payload, { fetchImpl })).resolves.toEqual({ status: 'unavailable' });
  });

  it('devuelve los errores de validación del servidor por campo', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(400, { error: 'validation', fields: { email: 'Revisa el correo' } }));
    await expect(submitContactRequest(payload, { fetchImpl })).resolves.toEqual({
      status: 'invalid',
      errors: { email: 'Revisa el correo' },
    });
  });

  it('informa límite de peticiones y el tiempo de espera indicado', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(429, { error: 'rate-limited' }, { 'Retry-After': '120' }));
    await expect(submitContactRequest(payload, { fetchImpl })).resolves.toEqual({ status: 'rate-limited', retryAfterSeconds: 120 });
  });

  it('trata 5xx como servicio no disponible', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(jsonResponse(503, { error: 'unavailable' }));
    await expect(submitContactRequest(payload, { fetchImpl })).resolves.toEqual({ status: 'unavailable' });
  });

  it('aborta la solicitud al superar el tiempo máximo', async () => {
    const fetchImpl = vi.fn((_url: string, init?: RequestInit) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
    }));
    await expect(submitContactRequest(payload, { fetchImpl, timeoutMs: 10 })).resolves.toEqual({ status: 'timeout' });
  });

  it('informa error de red sin afirmar envío', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(submitContactRequest(payload, { fetchImpl })).resolves.toEqual({ status: 'network-error' });
  });

  it('permite cancelar la solicitud (p. ej. al desmontar el formulario)', async () => {
    const controller = new AbortController();
    const fetchImpl = vi.fn((_url: string, init?: RequestInit) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')));
    }));
    const pending = submitContactRequest(payload, { fetchImpl, signal: controller.signal, timeoutMs: 5000 });
    controller.abort();
    await expect(pending).resolves.toEqual({ status: 'cancelled' });
  });
});
