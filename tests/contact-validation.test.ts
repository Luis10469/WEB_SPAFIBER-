import { describe, expect, it } from 'vitest';
import { parseContactRequest, type ContactRequest } from '../src/lib/contact/validation';

const validInput = (): Record<string, unknown> => ({
  fullName: 'Ana Pérez',
  email: 'ana@example.com',
  company: 'Empresa Demo',
  serviceId: 'web-dev',
  platform: 'web',
  objective: 'Centralizar las solicitudes internas en una sola plataforma.',
  features: 'Panel de seguimiento y notificaciones',
  timeline: '1-3-months',
  budget: 'undecided',
  message: 'Necesitamos una plataforma web para coordinar solicitudes internas.',
  referenceProjectId: '',
  referenceProjectTitle: '',
  consent: true,
  website: '',
  renderedAt: 1_700_000_000_000,
});

const expectErrors = (input: unknown, fields: string[]) => {
  const result = parseContactRequest(input);
  expect(result.ok).toBe(false);
  if (result.ok) return;
  expect(Object.keys(result.errors).sort()).toEqual([...fields].sort());
};

describe('parseContactRequest', () => {
  it('acepta una solicitud completa y devuelve datos normalizados', () => {
    const input = { ...validInput(), fullName: '  Ana Pérez  ', email: ' ana@example.com ' };
    const result = parseContactRequest(input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const data: ContactRequest = result.data;
    expect(data.fullName).toBe('Ana Pérez');
    expect(data.email).toBe('ana@example.com');
    expect(data.consent).toBe(true);
    expect(data.website).toBe('');
  });

  it('rechaza entradas que no son objetos JSON', () => {
    expect(parseContactRequest(null).ok).toBe(false);
    expect(parseContactRequest([]).ok).toBe(false);
    expect(parseContactRequest('texto').ok).toBe(false);
  });

  it('exige nombre con longitud válida y sin caracteres de control', () => {
    expectErrors({ ...validInput(), fullName: 'A' }, ['fullName']);
    expectErrors({ ...validInput(), fullName: 'Ana\u0000Pérez' }, ['fullName']);
    expectErrors({ ...validInput(), fullName: 'x'.repeat(101) }, ['fullName']);
  });

  it('valida el formato del correo y su longitud máxima', () => {
    expectErrors({ ...validInput(), email: 'correo-inválido' }, ['email']);
    expectErrors({ ...validInput(), email: `${'a'.repeat(250)}@x.co` }, ['email']);
  });

  it('valida servicio, plataforma, plazo y presupuesto contra listas cerradas', () => {
    expectErrors({ ...validInput(), serviceId: 'desconocido' }, ['serviceId']);
    expectErrors({ ...validInput(), platform: 'telecomunicaciones' }, ['platform']);
    expectErrors({ ...validInput(), timeline: 'mañana' }, ['timeline']);
    expectErrors({ ...validInput(), budget: '1000000' }, ['budget']);
  });

  it('aplica límites a objetivo, funcionalidades y descripción', () => {
    expectErrors({ ...validInput(), objective: 'corto' }, ['objective']);
    expectErrors({ ...validInput(), features: 'f'.repeat(801) }, ['features']);
    expectErrors({ ...validInput(), message: 'breve' }, ['message']);
    expectErrors({ ...validInput(), message: 'm'.repeat(2001) }, ['message']);
  });

  it('exige el consentimiento de tratamiento de datos', () => {
    expectErrors({ ...validInput(), consent: false }, ['consent']);
    expectErrors({ ...validInput(), consent: 'si' }, ['consent']);
  });

  it('marca como error el campo trampa anti-spam con un mensaje genérico', () => {
    const result = parseContactRequest({ ...validInput(), website: 'http://spam.example' });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.website).toBe('La solicitud no pudo procesarse.');
    expect(JSON.stringify(result.errors)).not.toContain('spam.example');
  });

  it('acepta un proyecto de referencia solo con identificador en minúsculas', () => {
    expect(parseContactRequest({ ...validInput(), referenceProjectId: 'ai-analytics-concept', referenceProjectTitle: 'Analítica' }).ok).toBe(true);
    expectErrors({ ...validInput(), referenceProjectId: '../../admin' }, ['referenceProjectId']);
  });

  it('requiere una marca de tiempo numérica para el control de tiempo de llenado', () => {
    expectErrors({ ...validInput(), renderedAt: 'ayer' }, ['renderedAt']);
  });
});
