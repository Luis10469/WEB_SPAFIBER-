import { expect, test } from '@playwright/test';

test.describe('navegación general', () => {
  test('muestra el titular y las secciones principales', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Transformamos ideas en');
    await expect(page.locator('#servicios')).toBeVisible();
    await expect(page.locator('#contacto')).toBeAttached();
  });

  test('no muestra textos técnicos internos', async ({ page }) => {
    await page.goto('/');
    const text = (await page.locator('body').textContent()) ?? '';
    expect(text).not.toContain('VITE_');
    expect(text).not.toMatch(/editable/i);
  });
});

test.describe('formulario de cotización', () => {
  test('bloquea la revisión con campos vacíos y no llama a la API', async ({ page }) => {
    let apiCalls = 0;
    await page.route('**/api/contact', async (route) => {
      apiCalls += 1;
      await route.fulfill({ status: 202, body: '{}' });
    });
    await page.goto('/#contacto');
    await page.getByRole('button', { name: 'Revisar solicitud' }).click();
    await expect(page.getByRole('alert')).toContainText('Revisa los campos marcados');
    expect(apiCalls).toBe(0);
  });

  test('envía y confirma solo tras respuesta 202 del servidor', async ({ page }) => {
    let body: Record<string, unknown> | null = null;
    await page.route('**/api/contact', async (route) => {
      body = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({ status: 202, contentType: 'application/json', body: '{"ok":true}' });
    });
    await page.goto('/#contacto');
    await page.getByLabel(/Plataforma solicitada/).selectOption('web');
    await page.getByLabel(/Objetivo empresarial/).fill('Centralizar solicitudes internas en una plataforma.');
    await page.getByLabel(/Plazo deseado/).selectOption('1-3-months');
    await page.getByLabel(/Descripción del proyecto/).fill('Necesitamos una plataforma web para coordinar solicitudes.');
    await page.getByLabel(/Nombre completo/).fill('Ana Pérez');
    await page.getByLabel(/Correo electrónico/).fill('ana@example.com');
    await page.getByLabel(/Acepto que SPEFIBER/).check();
    await page.getByRole('button', { name: 'Revisar solicitud' }).click();
    await page.getByRole('button', { name: 'Confirmar y enviar' }).click();
    await expect(page.getByRole('status')).toContainText('Recibimos tu solicitud');
    expect(body).toMatchObject({ email: 'ana@example.com', platform: 'web', consent: true });
  });

  test('muestra error y conserva los datos ante fallo de red', async ({ page }) => {
    await page.route('**/api/contact', (route) => route.abort('internetdisconnected'));
    await page.goto('/#contacto');
    await page.getByLabel(/Plataforma solicitada/).selectOption('web');
    await page.getByLabel(/Objetivo empresarial/).fill('Centralizar solicitudes internas en una plataforma.');
    await page.getByLabel(/Plazo deseado/).selectOption('1-3-months');
    await page.getByLabel(/Descripción del proyecto/).fill('Necesitamos una plataforma web para coordinar solicitudes.');
    await page.getByLabel(/Nombre completo/).fill('Ana Pérez');
    await page.getByLabel(/Correo electrónico/).fill('ana@example.com');
    await page.getByLabel(/Acepto que SPEFIBER/).check();
    await page.getByRole('button', { name: 'Revisar solicitud' }).click();
    await page.getByRole('button', { name: 'Confirmar y enviar' }).click();
    await expect(page.getByRole('alert')).toContainText('No pudimos conectar');
    await expect(page.getByLabel(/Nombre completo/)).toHaveCount(0); // en revisión los campos no se muestran
    await page.getByRole('button', { name: 'Editar solicitud' }).click();
    await expect(page.getByLabel(/Nombre completo/)).toHaveValue('Ana Pérez');
  });
});

test.describe('modales y teclado', () => {
  test('abre el detalle de un concepto, mantiene el foco y lo cierra con Escape', async ({ page }) => {
    await page.goto('/#proyectos');
    const card = page.getByRole('button', { name: 'Ver detalles de Panel de gestión operativa' });
    await card.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cerrar detalles del proyecto' })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
    await expect(card).toBeFocused();
  });

  test('pasa un proyecto de referencia al formulario', async ({ page }) => {
    await page.goto('/#proyectos');
    await page.getByRole('button', { name: 'Ver detalles de Analítica asistida por IA' }).click();
    await page.getByRole('link', { name: 'Solicitar una solución similar' }).click();
    await expect(page.getByRole('group', { name: 'Proyecto de referencia' })).toContainText('Analítica asistida por IA');
  });
});
