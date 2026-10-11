import React from 'react';
import { BUDGET_OPTIONS, PLATFORM_OPTIONS, TIMELINE_OPTIONS } from '../../data/contactOptions';
import { servicesData } from '../../data/services';
import type { ContactDraft } from '../../types';

interface ContactReviewProps {
  draft: ContactDraft;
}

const labelFor = (options: readonly { id: string; label: string }[], id: string, fallback = 'No indicado') =>
  options.find((option) => option.id === id)?.label ?? fallback;

const serviceLabel = (serviceId: string) =>
  serviceId === 'custom'
    ? 'Otro / consultoría tecnológica'
    : servicesData.find((service) => service.id === serviceId)?.title ?? 'No indicado';

const valueOrDash = (value: string) => value.trim() || 'No indicado';

/** Resumen de la solicitud antes del envío. Los valores se muestran como texto plano. */
export const ContactReview: React.FC<ContactReviewProps> = ({ draft }) => {
  const rows: Array<{ label: string; value: string }> = [
    { label: 'Tipo de proyecto', value: serviceLabel(draft.serviceId) },
    { label: 'Plataforma', value: labelFor(PLATFORM_OPTIONS, draft.platform) },
    { label: 'Objetivo empresarial', value: valueOrDash(draft.objective) },
    { label: 'Funcionalidades prioritarias', value: valueOrDash(draft.features) },
    { label: 'Plazo deseado', value: labelFor(TIMELINE_OPTIONS, draft.timeline) },
    { label: 'Rango orientativo', value: labelFor(BUDGET_OPTIONS, draft.budget, 'Prefiero no indicarlo') },
    { label: 'Descripción', value: valueOrDash(draft.message) },
  ];
  if (draft.referenceProjectTitle) {
    rows.push({ label: 'Proyecto de referencia', value: draft.referenceProjectTitle });
  }
  rows.push(
    { label: 'Nombre', value: valueOrDash(draft.fullName) },
    { label: 'Correo', value: valueOrDash(draft.email) },
    { label: 'Organización', value: valueOrDash(draft.company) },
  );

  return (
    <section className="contact-review" aria-labelledby="contact-review-title">
      <h3 id="contact-review-title">Revisa tu solicitud</h3>
      <p className="contact-review__note">Confirma que la información es correcta antes de enviarla.</p>
      <dl className="contact-review__list">
        {rows.map((row) => (
          <div key={row.label} className="contact-review__row">
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
