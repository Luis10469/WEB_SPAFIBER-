import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Navbar } from '../src/components/layout/Navbar';

describe('navegación responsive', () => {
  it('muestra las secciones principales y abre/cierra el menú móvil con teclado', async () => {
    const user = userEvent.setup();
    render(<Navbar onRequestQuote={vi.fn()} />);

    expect(screen.getByRole('navigation', { name: 'Navegación principal' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Tecnologías' })).toHaveAttribute('href', '#tecnologias');

    await user.click(screen.getByRole('button', { name: 'Abrir menú principal' }));
    const mobileNav = screen.getByRole('navigation', { name: 'Navegación móvil' });
    expect(mobileNav).toBeVisible();
    expect(within(mobileNav).getByRole('link', { name: 'Contacto' })).toHaveAttribute('href', '#contacto');

    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Abrir menú principal' })).toHaveAttribute('aria-expanded', 'false');
  });
});
