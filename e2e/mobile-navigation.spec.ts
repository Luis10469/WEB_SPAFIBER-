import { expect, test } from '@playwright/test';

test.describe('menú móvil', () => {
  test.skip(({ isMobile }) => !isMobile, 'Solo aplica a resoluciones móviles');

  test('abre, navega y cierra con Escape devolviendo el foco', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Abrir menú principal' });
    await toggle.click();
    const nav = page.getByRole('navigation', { name: 'Navegación móvil' });
    await expect(nav).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(nav).toBeHidden();
    await expect(page.getByRole('button', { name: 'Abrir menú principal' })).toBeFocused();
  });

  test('no hay desbordamiento horizontal', async ({ page }) => {
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
