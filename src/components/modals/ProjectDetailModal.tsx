import React, { useEffect, useRef } from 'react';
import { ArrowRight, ArrowUpRight, Check, Layers, Sparkles, Tag, X } from 'lucide-react';
import { ProjectItem } from '../../types';
import { Button } from '../ui/Button';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onQuoteSimilar: (projectTitle: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onQuoteSimilar,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;
      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusableElements?.length) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="dialog-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="project-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
        tabIndex={-1}
      >
        <button
          ref={closeButtonRef}
          className="project-dialog__close"
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalles del proyecto"
        >
          <X size={19} aria-hidden="true" />
        </button>

        <div className="project-dialog__image-wrap">
          <img src={project.image} alt="" width="270" height="96" />
          <span className="project-dialog__status"><Sparkles size={14} aria-hidden="true" /> {project.status}</span>
        </div>

        <div className="project-dialog__content">
          <p className="project-dialog__category"><Tag size={14} aria-hidden="true" /> {project.category}</p>
          <h2 id="project-dialog-title">{project.title}</h2>
          <p className="project-dialog__description">{project.fullDescription}</p>

          <div className="project-dialog__scenario">
            <span>Escenario</span>
            <strong>{project.scenario}</strong>
          </div>

          <div className="project-dialog__technologies">
            <h3><Layers size={15} aria-hidden="true" /> Tecnologías de referencia</h3>
            <ul>
              {project.technologies.map((technology) => (
                <li key={technology}><Check size={13} aria-hidden="true" /> {technology}</li>
              ))}
            </ul>
          </div>

          <div className="project-dialog__actions">
            <Button
              asAnchor
              href="#contacto"
              onClick={() => {
                onClose();
                onQuoteSimilar(project.title);
              }}
              icon={<ArrowRight size={16} aria-hidden="true" />}
            >
              Conversar sobre una solución similar
            </Button>
            {project.demoUrl && (
              <a className="text-link" href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                Abrir demostración <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
