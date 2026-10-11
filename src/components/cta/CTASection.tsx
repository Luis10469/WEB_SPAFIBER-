import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import ctaSkylineImg from '../../assets/cta_skyline.png';

interface CTASectionProps {
  onOpenContact: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onOpenContact }) => {
  return (
    <section id="contacto" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner CTA principal idéntico al boceto */}
        <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-[#120B22] shadow-[0_0_50px_rgba(139,61,255,0.25)] p-8 sm:p-12 lg:p-14">
          
          {/* Fondo panorámico de luces y ciudad cyberpunk */}
          <div className="absolute inset-0 z-0">
            <img
              src={ctaSkylineImg}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center opacity-40 mix-blend-screen pointer-events-none select-none"
            />
            {/* Overlay degradado para asegurar contraste y legibilidad absoluta */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E081D] via-[#120B22]/90 to-transparent" />
          </div>

          {/* Contenido en primer plano */}
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Construyamos{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B45CFF] to-[#D8B4FE] drop-shadow-[0_0_20px_rgba(180,92,255,0.5)]">
                  tu próximo proyecto
                </span>
              </h2>
              <p className="text-sm sm:text-base text-[#C7C9D1] leading-relaxed">
                Cuéntanos tu idea y hagámosla realidad. Estamos listos para ser tu aliado tecnológico.
              </p>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                onClick={onOpenContact}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                className="w-full sm:w-auto font-semibold px-9 py-4 shadow-[0_0_25px_rgba(180,92,255,0.55)] border border-purple-400/40 text-base"
              >
                Contáctanos ahora
              </Button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
