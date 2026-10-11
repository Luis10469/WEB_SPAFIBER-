import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContactSection } from '../src/components/contact/ContactSection';

const fillRequiredFields = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.selectOptions(screen.getByLabelText(/Plataforma solicitada/), 'web');
  await user.type(screen.getByLabelText(/Objetivo empresarial/), 'Centralizar solicitudes internas en una plataforma.');
  await user.selectOptions(screen.getByLabelText(/Plazo deseado/), '1-3-months');
  await user.type(screen.getByLabelText(/Descripción del proyecto/), 'Necesitamos una plataforma web para coordinar solicitudes.');
  await user.type(screen.getByLabelText(/Nombre completo/), 'Ana Pérez');
  await user.type(screen.getByLabelText(/Correo electrónico/), 'ana@example.com');
  await user.click(screen.getByLabelText(/Acepto que SPEFIBER/));
};

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('formulario de cotización', () => {
  it('no envía nada si faltan campos obligatorios y señala cada campo', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(<ContactSection initialServiceId="custom" />);

    await user.click(screen.getByRole('button', { name: 'Revisar solicitud' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Revisa los campos marcados');
    const name = screen.getByLabelText(/Nombre completo/);
    expect(name).toHaveAttribute('aria-invalid', 'true');
    expect(name).toHaveAccessibleDescription(/Escribe tu nombre/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('muestra un resumen de revisión y envía solo tras confirmar', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(<ContactSection initialServiceId="web-dev" />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Revisar solicitud' }));

    const review = screen.getByRole('heading', { name: 'Revisa tu solicitud' }).closest('section') as HTMLElement;
    expect(within(review).getByText('Ana Pérez')).toBeInTheDocument();
    expect(within(review).getByText('ana@example.com')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Confirmar y enviar' }));

    expect(await screen.findByRole('status')).toHaveTextContent('Recibimos tu solicitud');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/contact');
    expect(options.method).toBe('POST');
    expect(JSON.parse(String(options.body))).toMatchObject({
      fullName: 'Ana Pérez',
      email: 'ana@example.com',
      serviceId: 'web-dev',
      platform: 'web',
      timeline: '1-3-months',
      consent: true,
    });
    expect(screen.getByLabelText(/Nombre completo/)).toHaveValue('');
  });

  it('conserva todos los datos cuando el servidor no puede registrar la solicitud', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(503, { error: 'unavailable' })));
    const user = userEvent.setup();
    render(<ContactSection initialServiceId="custom" />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Revisar solicitud' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar y enviar' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('no pudo registrarse');
    expect(alert.textContent).not.toMatch(/recibimos|aceptó|enviado correctamente/i);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirmar y enviar' })).toBeEnabled();
  });

  it('informa de un error de red sin mostrar confirmación', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    const user = userEvent.setup();
    render(<ContactSection initialServiceId="custom" />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Revisar solicitud' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar y enviar' }));

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('No pudimos conectar con el servidor'));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('impide envíos duplicados mientras la solicitud está en curso', async () => {
    let resolveRequest: (response: Response) => void = () => undefined;
    const fetchMock = vi.fn(() => new Promise<Response>((resolve) => { resolveRequest = resolve; }));
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(<ContactSection initialServiceId="custom" />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Revisar solicitud' }));
    const confirm = screen.getByRole('button', { name: 'Confirmar y enviar' });
    await user.click(confirm);

    expect(screen.getByRole('button', { name: 'Enviando solicitud…' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: 'Enviando solicitud…' }));
    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveRequest(new Response(null, { status: 202 }));
    expect(await screen.findByRole('status')).toHaveTextContent('Recibimos tu solicitud');
  });

  it('permite volver a editar desde la revisión sin perder datos', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(<ContactSection initialServiceId="custom" />);

    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Revisar solicitud' }));
    await user.click(screen.getByRole('button', { name: 'Editar solicitud' }));

    expect(screen.getByLabelText(/Nombre completo/)).toHaveValue('Ana Pérez');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('valida el formato del correo antes de transmitir información', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(<ContactSection initialServiceId="custom" />);

    await fillRequiredFields(user);
    await user.clear(screen.getByLabelText(/Correo electrónico/));
    await user.type(screen.getByLabelText(/Correo electrónico/), 'correo-invalido');
    await user.click(screen.getByRole('button', { name: 'Revisar solicitud' }));

    expect(screen.getByLabelText(/Correo electrónico/)).toHaveAccessibleDescription(/Revisa el formato del correo/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('exige el consentimiento de tratamiento de datos', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    render(<ContactSection initialServiceId="custom" />);

    await fillRequiredFields(user);
    await user.click(screen.getByLabelText(/Acepto que SPEFIBER/));
    await user.click(screen.getByRole('button', { name: 'Revisar solicitud' }));

    expect(screen.getByLabelText(/Acepto que SPEFIBER/)).toHaveAttribute('aria-invalid', 'true');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('muestra el proyecto de referencia sin sustituir el texto ya escrito', async () => {
    const user = userEvent.setup();
    const reference = { id: 'ai-analytics-concept', title: 'Analítica asistida por IA' };
    const { rerender } = render(<ContactSection initialServiceId="custom" referenceProject={null} />);

    await user.type(screen.getByLabelText(/Descripción del proyecto/), 'Texto que ya escribí.');
    rerender(<ContactSection initialServiceId="custom" referenceProject={reference} />);

    expect(screen.getByRole('group', { name: 'Proyecto de referencia' })).toHaveTextContent('Analítica asistida por IA');
    expect(screen.getByLabelText(/Descripción del proyecto/)).toHaveValue('Texto que ya escribí.');
    expect(screen.getByLabelText(/Objetivo empresarial/)).toHaveFocus();
  });

  it('incluye el proyecto de referencia en la solicitud y permite quitarlo', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));
    vi.stubGlobal('fetch', fetchMock);
    const onClear = vi.fn();
    const user = userEvent.setup();
    const reference = { id: 'ai-analytics-concept', title: 'Analítica asistida por IA' };
    render(<ContactSection initialServiceId="custom" referenceProject={reference} onClearReferenceProject={onClear} />);

    await user.click(screen.getByRole('button', { name: 'Quitar referencia' }));
    expect(onClear).toHaveBeenCalledTimes(1);

    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Revisar solicitud' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar y enviar' }));
    await screen.findByRole('status');

    const body = JSON.parse(String((fetchMock.mock.calls[0] as [string, RequestInit])[1].body));
    expect(body).toMatchObject({ referenceProjectId: 'ai-analytics-concept', referenceProjectTitle: 'Analítica asistida por IA' });
  });

  it('no expone variables de configuración ni textos de desarrollo en la interfaz', () => {
    render(<ContactSection initialServiceId="custom" />);
    const text = document.body.textContent ?? '';
    expect(text).not.toMatch(/VITE_/);
    expect(text).not.toMatch(/editable/i);
    expect(text).not.toMatch(/Stack de referencia/i);
  });
});
