import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { ContactFormData } from '../../types';
import { servicesData } from '../../data/services';
import { companyData } from '../../data/company';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceId?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  initialServiceId = 'web-dev',
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    company: '',
    serviceId: initialServiceId,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (initialServiceId) {
      setFormData((prev) => ({ ...prev, serviceId: initialServiceId }));
    }
  }, [initialServiceId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Por favor completa todos los campos requeridos (*).');
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Por favor ingresa un correo electrónico válido.');
      return;
    }

    setIsSubmitting(true);

    // Simulación de envío de cotización / integración con API
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 700);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      fullName: '',
      email: '',
      company: '',
      serviceId: initialServiceId,
      message: '',
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div className="relative w-full max-w-lg bg-[#140D26] border border-purple-500/30 rounded-3xl shadow-[0_0_50px_rgba(139,61,255,0.35)] p-6 sm:p-8 overflow-hidden">
        
        {/* Luz decorativa */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#B45CFF]/15 rounded-full blur-[70px] pointer-events-none" />

        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 p-2 rounded-full text-[#B5B0C2] hover:text-white hover:bg-purple-900/40 border border-purple-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-[#B45CFF]"
          aria-label="Cerrar ventana de contacto"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-purple-900/40 border border-purple-400 flex items-center justify-center text-[#B45CFF] shadow-[0_0_20px_#B45CFF]">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-white">¡Solicitud recibida con éxito!</h3>
            <p className="text-sm text-[#B5B0C2] leading-relaxed max-w-sm mx-auto">
              Gracias por comunicarte con <strong className="text-white">{companyData.legalName}</strong>. Nuestro equipo de ingeniería analizará tu requerimiento y te contactará en breve a <span className="text-[#B45CFF]">{formData.email}</span>.
            </p>
            <div className="pt-4">
              <Button variant="primary" onClick={handleReset} className="w-full justify-center">
                Aceptar
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold tracking-widest text-[#B45CFF] uppercase block mb-1">
                SPEFIBER S.A.S. — Contacto Directo
              </span>
              <h3 id="contact-modal-title" className="text-2xl font-extrabold text-white tracking-tight">
                Solicitar Cotización de Proyecto
              </h3>
              <p className="text-xs text-[#B5B0C2] mt-1">
                Cuéntanos sobre tu visión y diseñaremos la arquitectura adecuada para tu negocio.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-[#C7C9D1] mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ej. Ing. Carlos Mendoza"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0E091C] border border-purple-500/30 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#B45CFF] focus:ring-1 focus:ring-[#B45CFF] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#C7C9D1] mb-1">
                    Correo corporativo *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="carlos@empresa.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0E091C] border border-purple-500/30 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#B45CFF] focus:ring-1 focus:ring-[#B45CFF] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#C7C9D1] mb-1">
                    Empresa / Organización
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Nombre de empresa"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0E091C] border border-purple-500/30 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#B45CFF] focus:ring-1 focus:ring-[#B45CFF] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C7C9D1] mb-1">
                  Servicio de interés *
                </label>
                <select
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0E091C] border border-purple-500/30 text-white text-sm focus:outline-none focus:border-[#B45CFF] focus:ring-1 focus:ring-[#B45CFF] transition-all"
                >
                  {servicesData.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#140D26] text-white">
                      {s.title}
                    </option>
                  ))}
                  <option value="custom" className="bg-[#140D26] text-white">
                    Consultoría Tecnológica Integral
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C7C9D1] mb-1">
                  Descripción o alcance del proyecto *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe los objetivos, requerimientos técnicos o plazos de tu proyecto..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0E091C] border border-purple-500/30 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#B45CFF] focus:ring-1 focus:ring-[#B45CFF] transition-all resize-none"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
                  icon={<Send className="w-4 h-4" />}
                  iconPosition="right"
                  className="w-full justify-center"
                >
                  {isSubmitting ? 'Enviando requerimiento...' : 'Enviar solicitud de cotización'}
                </Button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
