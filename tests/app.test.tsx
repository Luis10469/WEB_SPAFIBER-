import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from '../src/App';

describe('landing SPEFIBER', () => {
  it('presenta los módulos acordados con ejemplos claramente identificados', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Transformamos ideas en soluciones digitales.');
    expect(screen.getByRole('heading', { name: /Tecnología pensada para resolver/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Ingeniería con propósito/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Exploraciones de producto digital/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Las herramientas adecuadas/ })).toBeInTheDocument();
    expect(screen.getByText(/No representan clientes, proyectos entregados ni resultados atribuidos a SPEFIBER/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Desarrollo web' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Backend & APIs' })).toBeInTheDocument();
  });

  it('preselecciona el servicio desde su tarjeta y abre/cierra el detalle de un concepto', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole('link', { name: 'Consultar este servicio' })[0]);
    expect(screen.getByLabelText(/Tipo de servicio/)).toHaveValue('web-dev');

    await user.click(screen.getByRole('button', { name: 'Ver detalles de Panel de gestión operativa' }));
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('heading', { name: 'Panel de gestión operativa' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
