import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ProjectDetailModal } from '../src/components/modals/ProjectDetailModal';
import { projectsData } from '../src/data/projects';

const project = projectsData[0];

// Simula el comportamiento de App: onClose cambia en cada render del padre.
function Harness({ onQuote = vi.fn() }: { onQuote?: () => void }) {
  const [active, setActive] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setActive(true)}>Abrir proyecto</button>
      <span data-testid="render-count">{active ? 'open' : 'closed'}</span>
      <ProjectDetailModal
        project={active ? project : null}
        onClose={() => setActive(false)}
        onQuoteSimilar={() => onQuote()}
      />
    </>
  );
}

describe('ProjectDetailModal', () => {
  it('devuelve el foco al disparador al cerrar con Escape', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const trigger = screen.getByRole('button', { name: 'Abrir proyecto' });

    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cerrar detalles del proyecto' })).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('mantiene el foco dentro del diálogo al navegar con Tab', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('button', { name: 'Abrir proyecto' }));

    const dialog = screen.getByRole('dialog');
    for (let index = 0; index < 8; index += 1) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
    for (let index = 0; index < 8; index += 1) {
      await user.tab({ shift: true });
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it('no devuelve el foco a la tarjeta cuando se pasa a cotizar', async () => {
    const user = userEvent.setup();
    const onQuote = vi.fn();
    render(<Harness onQuote={onQuote} />);
    await user.click(screen.getByRole('button', { name: 'Abrir proyecto' }));

    await user.click(screen.getByRole('link', { name: 'Solicitar una solución similar' }));
    expect(onQuote).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Abrir proyecto' })).not.toHaveFocus();
  });
});
