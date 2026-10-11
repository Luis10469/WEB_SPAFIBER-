import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContactSection } from '../src/components/contact/ContactSection';

const fillRequiredFields = async () => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/Nombre completo/), 'Ana Pérez');
  await user.type(screen.getByLabelText(/Correo electrónico/), 'ana@example.com');
  await user.type(screen.getByLabelText(/Descripción del proyecto/), 'Necesito una plataforma web para coordinar solicitudes internas.');
  return user;
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('formulario de contacto', () => {
  it('no afirma un envío exitoso cuando no hay canal configurado', async () => {
    vi.stubEnv('VITE_CONTACT_ENDPOINT', '');
    vi.stubEnv('VITE_CONTACT_EMAIL', '');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    render(<ContactSection initialServiceId="custom" />);
    const user = await fillRequiredFields();
    await user.click(screen.getByRole('button', { name: 'Enviar solicitud' }));

    expect(screen.getByRole('alert')).toHaveTextContent('No se envió ni guardó tu información');
    expect(screen.queryByText('El servicio de recepción configurado aceptó tu solicitud.')).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('envía al endpoint configurado y muestra confirmación solo tras respuesta exitosa', async () => {
    vi.stubEnv('VITE_CONTACT_ENDPOINT', '/api/contact');
    vi.stubEnv('VITE_CONTACT_EMAIL', '');
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 202 });
    vi.stubGlobal('fetch', fetchMock);

    render(<ContactSection initialServiceId="web-dev" />);
    const user = await fillRequiredFields();
    await user.click(screen.getByRole('button', { name: 'Enviar solicitud' }));

    expect(await screen.findByRole('status')).toHaveTextContent('El servicio de recepción configurado aceptó tu solicitud.');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/contact', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }));
    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(String(options.body))).toMatchObject({
      fullName: 'Ana Pérez',
      email: 'ana@example.com',
      serviceId: 'web-dev',
    });
  });

  it('muestra un error y conserva los campos cuando falla el endpoint', async () => {
    vi.stubEnv('VITE_CONTACT_ENDPOINT', '/api/contact');
    vi.stubEnv('VITE_CONTACT_EMAIL', '');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));

    render(<ContactSection initialServiceId="custom" />);
    const user = await fillRequiredFields();
    await user.click(screen.getByRole('button', { name: 'Enviar solicitud' }));

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('No fue posible enviar la solicitud'));
    expect(screen.getByLabelText(/Nombre completo/)).toHaveValue('Ana Pérez');
  });

  it('valida el correo antes de transmitir información', async () => {
    vi.stubEnv('VITE_CONTACT_ENDPOINT', '/api/contact');
    vi.stubGlobal('fetch', vi.fn());

    render(<ContactSection initialServiceId="custom" />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText(/Nombre completo/), 'Ana Pérez');
    await user.type(screen.getByLabelText(/Correo electrónico/), 'correo-inválido');
    await user.type(screen.getByLabelText(/Descripción del proyecto/), 'Necesito una aplicación móvil para el equipo.');
    await user.click(screen.getByRole('button', { name: 'Enviar solicitud' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Revisa el formato del correo electrónico');
    expect(fetch).not.toHaveBeenCalled();
  });
});
