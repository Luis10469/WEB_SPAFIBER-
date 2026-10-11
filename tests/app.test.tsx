import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from '../src/App';

describe('landing SPEFIBER', () => {
  it('no muestra variables de configuración ni textos de desarrollo al visitante', () => {
    render(<App />);
    const text = document.body.textContent ?? '';
    expect(text).not.toMatch(/VITE_/);
    expect(text).not.toMatch(/editable/i);
    expect(text).not.toMatch(/Stack de referencia/i);
  });

  it('presenta los módulos acordados con ejemplos claramente identificados', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Transformamos ideas en soluciones digitales.');
    expect(screen.getByRole('heading', { name: /Tecnología pensada para resolver/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Ingeniería con propósito/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Exploraciones de producto digital/ })).toBeInTheDocument();
    expect(screen.getByText(/No representan clientes, proyectos entregados ni resultados atribuidos a SPEFIBER/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Desarrollo web' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Backend & APIs' })).toBeInTheDocument();
  });

  it('preselecciona el servicio desde su tarjeta y abre/cierra el detalle de un concepto', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getAllByRole('link', { name: 'Consultar este servicio' })[0]);
    expect(screen.getByLabelText(/Tipo de proyecto/)).toHaveValue('web-dev');

    await user.click(screen.getByRole('button', { name: 'Ver detalles de Panel de gestión operativa' }));
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('heading', { name: 'Panel de gestión operativa' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('transfiere el proyecto de referencia al formulario al solicitar una solución similar', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: 'Ver detalles de Analítica asistida por IA' }));
    await user.click(screen.getByRole('link', { name: 'Solicitar una solución similar' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const reference = screen.getByRole('group', { name: 'Proyecto de referencia' });
    expect(within(reference).getByText(/Analítica asistida por IA/)).toBeInTheDocument();

    await user.click(within(reference).getByRole('button', { name: 'Quitar referencia' }));
    expect(screen.queryByRole('group', { name: 'Proyecto de referencia' })).not.toBeInTheDocument();
  });
});
