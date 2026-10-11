import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Pencil, Send, X } from 'lucide-react';
import { BUDGET_OPTIONS, PLATFORM_OPTIONS, TIMELINE_OPTIONS } from '../../data/contactOptions';
import { servicesData } from '../../data/services';
import { companyData } from '../../data/company';
import { CONTACT_LIMITS, parseContactRequest, type ContactErrors, type ContactField } from '../../lib/contact/validation';
import { resolveContactEndpoint, submitContactRequest, type SubmitResult } from '../../lib/contact/submitContact';
import type { ContactDraft, ProjectReference } from '../../types';
import { Button } from '../ui/Button';
import { ContactReview } from './ContactReview';
import { createEmptyDraft } from './contactFormState';

interface ContactFormProps {
  initialServiceId: string;
  referenceProject: ProjectReference | null;
  onClearReferenceProject: () => void;
}

type Status =
  | { kind: 'idle' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

const FIELD_ORDER: ContactField[] = [
  'serviceId',
  'platform',
  'objective',
  'features',
  'timeline',
  'budget',
  'message',
  'fullName',
  'email',
  'company',
  'consent',
];

const KNOWN_FIELDS = new Set<string>(FIELD_ORDER);

const MESSAGES_BY_RESULT: Partial<Record<SubmitResult['status'], string>> = {
  'rate-limited': 'Recibimos demasiados intentos desde tu conexión. Espera unos minutos e inténtalo de nuevo. Tus datos siguen en el formulario.',
  timeout: 'La solicitud tardó demasiado. Revisa tu conexión e inténtalo de nuevo. Tus datos siguen en el formulario.',
  'network-error': 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo. Tus datos siguen en el formulario.',
  unavailable: 'Tu solicitud no pudo registrarse en este momento. Tus datos siguen en el formulario; inténtalo de nuevo más tarde.',
};

export const ContactForm: React.FC<ContactFormProps> = ({ initialServiceId, referenceProject, onClearReferenceProject }) => {
  const [draft, setDraft] = useState<ContactDraft>(() => createEmptyDraft(initialServiceId, referenceProject));
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [reviewing, setReviewing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Marca de tiempo del montaje: el servidor exige un tiempo mínimo de llenado (anti-bots).
  const [renderedAt] = useState(() => Date.now());

  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const inFlightRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setDraft((current) => ({ ...current, serviceId: initialServiceId }));
  }, [initialServiceId]);

  // Al elegir un proyecto de referencia, se añade el contexto y se lleva el foco al formulario.
  // No se sobrescribe ningún texto escrito por el visitante.
  useEffect(() => {
    setDraft((current) => ({
      ...current,
      referenceProjectId: referenceProject?.id ?? '',
      referenceProjectTitle: referenceProject?.title ?? '',
    }));
    if (referenceProject) {
      const objective = formRef.current?.elements.namedItem('objective');
      if (objective instanceof HTMLElement) objective.focus();
    }
  }, [referenceProject]);

  // Solo el éxito mueve el foco al mensaje; los errores enfocan el campo afectado.
  useEffect(() => {
    if (status.kind === 'success') statusRef.current?.focus();
  }, [status]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const updateField = <Field extends keyof ContactDraft>(field: Field, value: ContactDraft[Field]) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!(field in current)) return current;
      const next = { ...current };
      delete next[field as ContactField];
      return next;
    });
    setReviewing(false);
    if (status.kind === 'success') setStatus({ kind: 'idle' });
  };

  const focusField = (field: ContactField) => {
    const element = formRef.current?.elements.namedItem(field);
    if (element instanceof HTMLElement) element.focus();
  };

  const validate = (): ContactErrors | null => {
    const result = parseContactRequest({ ...draft, renderedAt });
    if (result.ok) return null;
    return result.errors;
  };

  const handleReview = () => {
    const found = validate();
    if (found) {
      setErrors(found);
      setStatus({ kind: 'error', message: 'Revisa los campos marcados antes de continuar.' });
      const firstInvalid = FIELD_ORDER.find((field) => field in found);
      if (firstInvalid) focusField(firstInvalid);
      return;
    }
    setErrors({});
    setStatus({ kind: 'idle' });
    setReviewing(true);
  };

  const handleSend = async () => {
    if (inFlightRef.current) return;
    const result = parseContactRequest({ ...draft, renderedAt });
    if (!result.ok) {
      setErrors(result.errors);
      setReviewing(false);
      setStatus({ kind: 'error', message: 'Revisa los campos marcados antes de continuar.' });
      return;
    }

    inFlightRef.current = true;
    setSubmitting(true);
    setStatus({ kind: 'idle' });
    const controller = new AbortController();
    abortRef.current = controller;

    const outcome = await submitContactRequest(result.data, {
      endpoint: resolveContactEndpoint(import.meta.env.VITE_CONTACT_ENDPOINT),
      signal: controller.signal,
    });

    inFlightRef.current = false;
    abortRef.current = null;
    setSubmitting(false);

    switch (outcome.status) {
      case 'accepted':
        setDraft(createEmptyDraft(initialServiceId));
        setErrors({});
        setReviewing(false);
        onClearReferenceProject();
        setStatus({ kind: 'success' });
        break;
      case 'invalid': {
        const serverFields: ContactErrors = {};
        for (const [key, value] of Object.entries(outcome.errors)) {
          if (KNOWN_FIELDS.has(key) && typeof value === 'string') serverFields[key as ContactField] = value;
        }
        setErrors(serverFields);
        setReviewing(false);
        setStatus({ kind: 'error', message: 'Revisa los campos marcados antes de continuar.' });
        break;
      }
      case 'cancelled':
        break;
      default:
        setStatus({
          kind: 'error',
          message: MESSAGES_BY_RESULT[outcome.status] ?? 'No fue posible enviar la solicitud. Inténtalo de nuevo.',
        });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    if (reviewing) void handleSend();
    else handleReview();
  };

  const fieldError = (field: ContactField) => errors[field];
  const describedBy = (field: ContactField, extra?: string) =>
    [fieldError(field) ? `${field}-error` : null, extra].filter(Boolean).join(' ') || undefined;

  const errorSummaryVisible = status.kind === 'error';
  const selectedServiceId = servicesData.some((service) => service.id === draft.serviceId) ? draft.serviceId : 'custom';

  return (
    <form
      ref={formRef}
      className="contact-form"
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="contact-form-title"
      aria-busy={submitting}
    >
      <div className="contact-form__heading">
        <div>
          <span className="contact-form__step">Solicitud de cotización</span>
          <h3 id="contact-form-title">Detalles del proyecto</h3>
        </div>
        <span className="contact-form__required">* Obligatorio</span>
      </div>

      {referenceProject && !reviewing && (
        <div className="reference-chip" role="group" aria-label="Proyecto de referencia">
          <span>
            <strong>Proyecto de referencia:</strong> {referenceProject.title}
          </span>
          <button type="button" className="reference-chip__remove" onClick={onClearReferenceProject}>
            <X size={14} aria-hidden="true" /> Quitar referencia
          </button>
        </div>
      )}

      {reviewing ? (
        <ContactReview draft={draft} />
      ) : (
        <>
          <fieldset className="contact-fieldset" disabled={submitting}>
            <legend>1. Proyecto</legend>
            <div className="contact-form__grid">
              <div className="form-field">
                <label htmlFor="contact-serviceId">Tipo de proyecto <span aria-hidden="true">*</span></label>
                <select
                  id="contact-serviceId"
                  name="serviceId"
                  required
                  value={selectedServiceId}
                  aria-invalid={Boolean(fieldError('serviceId'))}
                  aria-describedby={describedBy('serviceId')}
                  onChange={(event) => updateField('serviceId', event.target.value)}
                >
                  <option value="custom">Otro / consultoría tecnológica</option>
                  {servicesData.map((service) => (
                    <option value={service.id} key={service.id}>{service.title}</option>
                  ))}
                </select>
                {fieldError('serviceId') && <p id="serviceId-error" className="form-field__error">{fieldError('serviceId')}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="contact-platform">Plataforma solicitada <span aria-hidden="true">*</span></label>
                <select
                  id="contact-platform"
                  name="platform"
                  required
                  value={draft.platform}
                  aria-invalid={Boolean(fieldError('platform'))}
                  aria-describedby={describedBy('platform')}
                  onChange={(event) => updateField('platform', event.target.value)}
                >
                  <option value="">Selecciona una opción</option>
                  {PLATFORM_OPTIONS.map((option) => (
                    <option value={option.id} key={option.id}>{option.label}</option>
                  ))}
                </select>
                {fieldError('platform') && <p id="platform-error" className="form-field__error">{fieldError('platform')}</p>}
              </div>

              <div className="form-field form-field--full">
                <label htmlFor="contact-objective">Objetivo empresarial <span aria-hidden="true">*</span></label>
                <textarea
                  id="contact-objective"
                  name="objective"
                  rows={2}
                  maxLength={CONTACT_LIMITS.objective.max}
                  required
                  value={draft.objective}
                  aria-invalid={Boolean(fieldError('objective'))}
                  aria-describedby={describedBy('objective', 'contact-objective-hint')}
                  onChange={(event) => updateField('objective', event.target.value)}
                  placeholder="¿Qué resultado de negocio quieres lograr?"
                />
                <span id="contact-objective-hint" className="form-field__hint">Entre {CONTACT_LIMITS.objective.min} y {CONTACT_LIMITS.objective.max} caracteres.</span>
                {fieldError('objective') && <p id="objective-error" className="form-field__error">{fieldError('objective')}</p>}
              </div>

              <div className="form-field form-field--full">
                <label htmlFor="contact-features">Funcionalidades prioritarias <span className="form-field__optional">Opcional</span></label>
                <textarea
                  id="contact-features"
                  name="features"
                  rows={2}
                  maxLength={CONTACT_LIMITS.features.max}
                  value={draft.features}
                  aria-invalid={Boolean(fieldError('features'))}
                  aria-describedby={describedBy('features')}
                  onChange={(event) => updateField('features', event.target.value)}
                  placeholder="Por ejemplo: inicio de sesión, paneles, notificaciones, integración con…"
                />
                {fieldError('features') && <p id="features-error" className="form-field__error">{fieldError('features')}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="contact-timeline">Plazo deseado <span aria-hidden="true">*</span></label>
                <select
                  id="contact-timeline"
                  name="timeline"
                  required
                  value={draft.timeline}
                  aria-invalid={Boolean(fieldError('timeline'))}
                  aria-describedby={describedBy('timeline')}
                  onChange={(event) => updateField('timeline', event.target.value)}
                >
                  <option value="">Selecciona una opción</option>
                  {TIMELINE_OPTIONS.map((option) => (
                    <option value={option.id} key={option.id}>{option.label}</option>
                  ))}
                </select>
                {fieldError('timeline') && <p id="timeline-error" className="form-field__error">{fieldError('timeline')}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="contact-budget">Rango orientativo <span className="form-field__optional">Opcional</span></label>
                <select
                  id="contact-budget"
                  name="budget"
                  value={draft.budget}
                  aria-invalid={Boolean(fieldError('budget'))}
                  aria-describedby={describedBy('budget', 'contact-budget-hint')}
                  onChange={(event) => updateField('budget', event.target.value)}
                >
                  {BUDGET_OPTIONS.map((option) => (
                    <option value={option.id} key={option.id}>{option.label}</option>
                  ))}
                </select>
                <span id="contact-budget-hint" className="form-field__hint">Solo para orientar la propuesta; no es un compromiso.</span>
                {fieldError('budget') && <p id="budget-error" className="form-field__error">{fieldError('budget')}</p>}
              </div>

              <div className="form-field form-field--full">
                <label htmlFor="contact-message">Descripción del proyecto <span aria-hidden="true">*</span></label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  maxLength={CONTACT_LIMITS.message.max}
                  required
                  value={draft.message}
                  aria-invalid={Boolean(fieldError('message'))}
                  aria-describedby={describedBy('message', 'contact-message-hint')}
                  onChange={(event) => updateField('message', event.target.value)}
                  placeholder="Describe el contexto, los usuarios y lo que ya existe, si lo hay."
                />
                <span id="contact-message-hint" className="form-field__hint">No incluyas contraseñas ni datos sensibles.</span>
                {fieldError('message') && <p id="message-error" className="form-field__error">{fieldError('message')}</p>}
              </div>
            </div>
          </fieldset>

          <fieldset className="contact-fieldset" disabled={submitting}>
            <legend>2. Datos de contacto</legend>
            <div className="contact-form__grid">
              <div className="form-field">
                <label htmlFor="contact-fullName">Nombre completo <span aria-hidden="true">*</span></label>
                <input
                  id="contact-fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  maxLength={CONTACT_LIMITS.fullName.max}
                  required
                  value={draft.fullName}
                  aria-invalid={Boolean(fieldError('fullName'))}
                  aria-describedby={describedBy('fullName')}
                  onChange={(event) => updateField('fullName', event.target.value)}
                  placeholder="Tu nombre"
                />
                {fieldError('fullName') && <p id="fullName-error" className="form-field__error">{fieldError('fullName')}</p>}
              </div>

              <div className="form-field">
                <label htmlFor="contact-email">Correo electrónico <span aria-hidden="true">*</span></label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  maxLength={CONTACT_LIMITS.email.max}
                  required
                  value={draft.email}
                  aria-invalid={Boolean(fieldError('email'))}
                  aria-describedby={describedBy('email')}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="nombre@empresa.com"
                />
                {fieldError('email') && <p id="email-error" className="form-field__error">{fieldError('email')}</p>}
              </div>

              <div className="form-field form-field--full">
                <label htmlFor="contact-company">Empresa u organización <span className="form-field__optional">Opcional</span></label>
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  maxLength={CONTACT_LIMITS.company.max}
                  value={draft.company}
                  aria-invalid={Boolean(fieldError('company'))}
                  aria-describedby={describedBy('company')}
                  onChange={(event) => updateField('company', event.target.value)}
                  placeholder="Nombre de la organización"
                />
                {fieldError('company') && <p id="company-error" className="form-field__error">{fieldError('company')}</p>}
              </div>
            </div>

            <div className="form-consent">
              <input
                id="contact-consent"
                name="consent"
                type="checkbox"
                checked={draft.consent}
                required
                aria-invalid={Boolean(fieldError('consent'))}
                aria-describedby={describedBy('consent', 'contact-consent-text')}
                onChange={(event) => updateField('consent', event.target.checked)}
              />
              <label htmlFor="contact-consent" id="contact-consent-text">
                Acepto que SPEFIBER S.A.S. trate mis datos personales para responder a esta solicitud de cotización.
                {companyData.legalLinks.privacy && (
                  <>
                    {' '}Consulta la <a href={companyData.legalLinks.privacy}>política de privacidad</a>.
                  </>
                )}
              </label>
              {fieldError('consent') && <p id="consent-error" className="form-field__error">{fieldError('consent')}</p>}
            </div>
          </fieldset>
        </>
      )}

      {/* Campo trampa anti-spam: oculto para personas, no debe completarse. */}
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="contact-website">No completes este campo</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={draft.website}
          onChange={(event) => updateField('website', event.target.value)}
        />
      </div>

      <div ref={statusRef} tabIndex={-1} className="contact-form__status-region" aria-live="polite">
        {status.kind === 'success' && (
          <div className="form-feedback form-feedback--success" role="status">
            <CheckCircle2 size={18} aria-hidden="true" />
            <p>Recibimos tu solicitud. Te contactaremos al correo que indicaste.</p>
          </div>
        )}
        {errorSummaryVisible && (
          <div className="form-feedback form-feedback--error" role="alert">
            <AlertCircle size={18} aria-hidden="true" />
            <p>{status.message}</p>
          </div>
        )}
      </div>

      <div className="contact-form__actions">
        {reviewing ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={submitting}
              onClick={() => setReviewing(false)}
              icon={<Pencil size={16} aria-hidden="true" />}
            >
              Editar solicitud
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              icon={submitting ? <span className="button-spinner" aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
            >
              {submitting ? 'Enviando solicitud…' : 'Confirmar y enviar'}
            </Button>
          </>
        ) : (
          <Button
            type="submit"
            size="lg"
            disabled={submitting}
            icon={<ArrowRight size={16} aria-hidden="true" />}
          >
            Revisar solicitud
          </Button>
        )}
      </div>

      <p className="contact-form__privacy">
        Tus datos se usan únicamente para responder a tu solicitud. Las estimaciones y rangos son orientativos y no constituyen una oferta comercial definitiva.
      </p>
    </form>
  );
};
