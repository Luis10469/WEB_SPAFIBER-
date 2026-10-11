import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Mail, Send, ShieldCheck } from 'lucide-react';
import { companyData } from '../../data/company';
import { servicesData } from '../../data/services';
import { ContactFormData } from '../../types';
import { Button } from '../ui/Button';

interface ContactSectionProps {
  initialServiceId: string;
}

type FormFeedback = {
  type: 'success' | 'error' | 'info';
  message: string;
};

const emptyForm = (serviceId: string): ContactFormData => ({
  fullName: '',
  email: '',
  company: '',
  serviceId,
  message: '',
});

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const getConfiguredEndpoint = () => {
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT?.trim();
  if (!endpoint) return undefined;
  if (endpoint.startsWith('/') && !endpoint.startsWith('//') && !endpoint.includes('\\')) return endpoint;

  try {
    const parsed = new URL(endpoint);
    return parsed.protocol === 'https:' ? parsed.toString() : undefined;
  } catch {
    return undefined;
  }
};

const getConfiguredEmail = () => {
  const email = import.meta.env.VITE_CONTACT_EMAIL?.trim();
  return email && isValidEmail(email) ? email : undefined;
};

export const ContactSection: React.FC<ContactSectionProps> = ({ initialServiceId }) => {
  const [formData, setFormData] = useState<ContactFormData>(() => emptyForm(initialServiceId));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FormFeedback | null>(null);

  const endpoint = getConfiguredEndpoint();
  const contactEmail = getConfiguredEmail();
  const receptionConfigured = Boolean(endpoint || contactEmail);

  useEffect(() => {
    setFormData((current) => ({ ...current, serviceId: initialServiceId }));
  }, [initialServiceId]);

  const updateField = <Field extends keyof ContactFormData>(field: Field, value: ContactFormData[Field]) => {
    setFormData((current) => ({ ...current, [field]: value }));
    if (feedback) setFeedback(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    const request = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      company: formData.company.trim(),
      serviceId: formData.serviceId,
      message: formData.message.trim(),
    };

    if (!request.fullName || !request.email || !request.message) {
      setFeedback({ type: 'error', message: 'Completa tu nombre, correo y descripción del proyecto.' });
      return;
    }

    if (!isValidEmail(request.email)) {
      setFeedback({ type: 'error', message: 'Revisa el formato del correo electrónico.' });
      return;
    }

    if (request.message.length < 10 || request.message.length > 2000) {
      setFeedback({ type: 'error', message: 'La descripción debe tener entre 10 y 2.000 caracteres.' });
      return;
    }

    if (!endpoint && !contactEmail) {
      setFeedback({
        type: 'error',
        message:
          'No se envió ni guardó tu información. La recepción está pendiente: configura VITE_CONTACT_ENDPOINT o un correo verificado en VITE_CONTACT_EMAIL.',
      });
      return;
    }

    if (endpoint) {
      setIsSubmitting(true);
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'omit',
          body: JSON.stringify(request),
        });

        if (!response.ok) throw new Error('Contact endpoint rejected the request');

        setFeedback({
          type: 'success',
          message: 'El servicio de recepción configurado aceptó tu solicitud.',
        });
        setFormData(emptyForm(initialServiceId));
      } catch {
        setFeedback({
          type: 'error',
          message: 'No fue posible enviar la solicitud. Inténtalo de nuevo más tarde.',
        });
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    const subject = encodeURIComponent(`Solicitud de cotización — ${request.fullName}`);
    const selectedService = servicesData.find((service) => service.id === request.serviceId)?.title ?? 'Otro / consultoría';
    const body = encodeURIComponent(
      [
        `Nombre: ${request.fullName}`,
        `Correo: ${request.email}`,
        `Empresa: ${request.company || 'No indicada'}`,
        `Servicio: ${selectedService}`,
        '',
        'Descripción del proyecto:',
        request.message,
      ].join('\n'),
    );

    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    setFeedback({
      type: 'info',
      message: 'Se abrió tu aplicación de correo. Revisa y envía el mensaje; SPEFIBER aún no lo ha recibido.',
    });
  };

  const selectedServiceId = servicesData.some((service) => service.id === formData.serviceId)
    ? formData.serviceId
    : 'custom';

  return (
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
            Comparte el contexto de tu idea. Con esa información podremos entender mejor el alcance de la conversación.
          </p>
        </div>

        <div className="contact-layout">
          <aside className="contact-aside">
            <p className="contact-aside__kicker">Un primer paso, sin complicaciones</p>
            <h3>Empecemos por entender el reto.</h3>
            <p className="contact-aside__description">
              Describe tu proyecto con el nivel de detalle que tengas hoy. No hace falta definir la solución antes de conversar.
            </p>

            <ol className="contact-steps">
              <li><span>01</span><p>Cuéntanos la necesidad y el contexto.</p></li>
              <li><span>02</span><p>Revisaremos el tipo de solución que buscas.</p></li>
              <li><span>03</span><p>El siguiente paso dependerá del canal de recepción configurado.</p></li>
            </ol>

            <div className={`contact-channel${receptionConfigured ? ' contact-channel--ready' : ''}`}>
              {receptionConfigured ? <ShieldCheck size={17} aria-hidden="true" /> : <Mail size={17} aria-hidden="true" />}
              <span>
                <strong>{receptionConfigured ? 'Canal configurado' : 'Recepción pendiente de configuración'}</strong>
                <small>
                  {endpoint
                    ? 'Las solicitudes se enviarán al endpoint definido para este entorno.'
                    : contactEmail
                      ? 'El formulario prepara un correo; debes revisarlo y enviarlo desde tu aplicación.'
                      : 'Esta versión no envía ni almacena datos de contacto.'}
                </small>
              </span>
            </div>
          </aside>

          <form className="contact-form" onSubmit={handleSubmit} noValidate aria-describedby="contact-form-note">
            <div className="contact-form__heading">
              <div>
                <span className="contact-form__step">Hablemos</span>
                <h3>Detalles del proyecto</h3>
              </div>
              <span className="contact-form__required">* Obligatorio</span>
            </div>

            <div className="contact-form__grid">
              <div className="form-field">
                <label htmlFor="contact-name">Nombre completo <span aria-hidden="true">*</span></label>
                <input
                  id="contact-name"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  required
                  value={formData.fullName}
                  onChange={(event) => updateField('fullName', event.target.value)}
                  placeholder="Tu nombre"
                />
              </div>
              <div className="form-field">
                <label htmlFor="contact-email">Correo electrónico <span aria-hidden="true">*</span></label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  required
                  value={formData.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="nombre@empresa.com"
                />
              </div>
              <div className="form-field">
                <label htmlFor="contact-company">Empresa <span className="form-field__optional">Opcional</span></label>
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  maxLength={120}
                  value={formData.company}
                  onChange={(event) => updateField('company', event.target.value)}
                  placeholder="Nombre de la organización"
                />
              </div>
              <div className="form-field">
                <label htmlFor="contact-service">Tipo de servicio <span aria-hidden="true">*</span></label>
                <select
                  id="contact-service"
                  name="serviceId"
                  required
                  value={selectedServiceId}
                  onChange={(event) => updateField('serviceId', event.target.value)}
                >
                  <option value="custom">Otro / consultoría tecnológica</option>
                  {servicesData.map((service) => (
                    <option value={service.id} key={service.id}>{service.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-field form-field--full">
                <label htmlFor="contact-message">Descripción del proyecto <span aria-hidden="true">*</span></label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  minLength={10}
                  maxLength={2000}
                  required
                  value={formData.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  placeholder="¿Qué reto quieres resolver? ¿Qué resultado esperas?"
                />
                <span className="form-field__hint">No incluyas contraseñas ni información sensible.</span>
              </div>
            </div>

            {feedback && (
              <div
                className={`form-feedback form-feedback--${feedback.type}`}
                role={feedback.type === 'error' ? 'alert' : 'status'}
                aria-live={feedback.type === 'error' ? 'assertive' : 'polite'}
              >
                {feedback.type === 'success' ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertCircle size={18} aria-hidden="true" />}
                <p>{feedback.message}</p>
              </div>
            )}

            <p id="contact-form-note" className="contact-form__privacy">
              Los datos se transmiten únicamente al endpoint configurado o, si se habilitó un correo verificado, a tu aplicación de correo. Sin esa configuración no se envían ni almacenan.
              {companyData.legalLinks.privacy && <> Consulta la <a href={companyData.legalLinks.privacy}>política de privacidad</a>.</>}
            </p>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              icon={isSubmitting ? <span className="button-spinner" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
            >
              {isSubmitting ? 'Enviando solicitud…' : 'Enviar solicitud'}
            </Button>
            <p className="contact-form__footnote">
              <ArrowRight size={13} aria-hidden="true" /> El tiempo de respuesta depende del canal comercial habilitado.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
