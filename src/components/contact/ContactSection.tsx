import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import type { ProjectReference } from '../../types';
import { ContactForm } from './ContactForm';

interface ContactSectionProps {
  initialServiceId: string;
  referenceProject?: ProjectReference | null;
  onClearReferenceProject?: () => void;
}

const noop = () => undefined;

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialServiceId,
  referenceProject = null,
  onClearReferenceProject = noop,
}) => (
  <section id="contacto" className="section section--contact" aria-labelledby="contact-title">
    <div className="page-container">
      <div className="section-heading section-heading--contact">
        <div>
          <p className="eyebrow">Contacto</p>
          <h2 id="contact-title" className="section-title">
            Cuéntanos qué quieres <span className="text-gradient">hacer posible.</span>
          </h2>
        </div>
        <p className="section-intro">
          Describe tu idea con el detalle que tengas hoy. Con esa información preparamos una primera conversación sobre alcance, plazos y enfoque técnico.
        </p>
      </div>

      <div className="contact-layout">
        <aside className="contact-aside" aria-label="Proceso de solicitud">
          <p className="contact-aside__kicker">Un primer paso, sin complicaciones</p>
          <h3>Empecemos por entender el reto.</h3>
          <p className="contact-aside__description">
            No hace falta definir la solución antes de conversar. Completa lo que sepas y omite lo demás.
          </p>

          <ol className="contact-steps">
            <li><span>01</span><p>Cuéntanos la necesidad, el objetivo y el contexto.</p></li>
            <li><span>02</span><p>Revisa el resumen antes de enviarlo.</p></li>
            <li><span>03</span><p>Te responderemos al correo que indiques.</p></li>
          </ol>

          <div className="contact-channel">
            <Sparkles size={17} aria-hidden="true" />
            <span>
              <strong>Estimaciones orientativas</strong>
              <small>Los rangos y plazos que indiques sirven para orientar la propuesta. No son un compromiso comercial.</small>
            </span>
          </div>
          <p className="contact-aside__check">
            <CheckCircle2 size={15} aria-hidden="true" /> Tus datos se usan solo para responder tu solicitud.
          </p>
        </aside>

        <ContactForm
          initialServiceId={initialServiceId}
          referenceProject={referenceProject}
          onClearReferenceProject={onClearReferenceProject}
        />
      </div>
    </div>
  </section>
);
