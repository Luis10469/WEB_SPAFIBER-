import React from 'react';
import { ArrowRight, Play, Zap, Users, BarChart3 } from 'lucide-react';
import { companyData } from '../../data/company';
import { Button } from '../ui/Button';
import heroGraphicImg from '../../assets/hero_composition.png';

interface HeroSectionProps {
  onOpenQuote: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenQuote }) => {
  return (
    <section
      id="inicio"
      className="relative min-h-[92vh] flex items-center pt-24 pb-16 overflow-hidden"
    >
      {/* Luces de fondo y atmósfera cyberpunk sutil */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8B3DFF]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[550px] h-[550px] bg-[#B45CFF]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#8B3DFF_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Composición en 2 columnas Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center pt-4 lg:pt-8">
          
          {/* Columna Izquierda: Mensaje Central & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Overline / Categoría */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-semibold tracking-wider text-[#C7C9D1] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B45CFF] animate-ping" />
              <span>{companyData.tagline}</span>
            </div>

            {/* Título Principal de Alto Impacto */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-white">
              <span>{companyData.heroHeadline} </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B45CFF] via-[#D8B4FE] to-[#8B3DFF] drop-shadow-[0_0_25px_rgba(180,92,255,0.4)]">
                {companyData.heroHighlight}
              </span>
            </h1>

            {/* Descripción Técnica Corporativa */}
            <p className="text-base sm:text-lg text-[#B5B0C2] leading-relaxed max-w-xl font-normal">
              {companyData.heroDescription}
            </p>

            {/* Botones de Acción Inmediata */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={onOpenQuote}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                className="font-semibold"
              >
                Solicitar cotización
              </Button>

              <Button
                variant="secondary"
                size="lg"
                asAnchor
                href="#servicios"
                icon={<Play className="w-3.5 h-3.5 fill-current text-[#B45CFF]" />}
                iconPosition="left"
              >
                Ver servicios
              </Button>
            </div>

            {/* Minitarjetas / Indicadores de Confianza */}
            <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-purple-900/30">
              
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/30 text-[#B45CFF] shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-white">Soluciones innovadoras</h2>
                  <p className="text-[11px] text-[#B5B0C2] leading-tight mt-0.5">
                    para un mundo en constante cambio
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/30 text-[#B45CFF] shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-white">Tecnología a tu medida</h2>
                  <p className="text-[11px] text-[#B5B0C2] leading-tight mt-0.5">
                    desde startups hasta grandes empresas
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/30 text-[#B45CFF] shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-white">Resultados reales</h2>
                  <p className="text-[11px] text-[#B5B0C2] leading-tight mt-0.5">
                    que impulsan tu crecimiento
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* Columna Derecha: Composición Tecnológica 3D & Arte Aprobado */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            <div className="relative w-full max-w-lg lg:max-w-none group">
              {/* Resplandor violeta concéntrico */}
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/30 to-[#8B3DFF]/30 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              
              {/* Imagen compuesta fiel al boceto con animación sutil de flotación */}
              <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 bg-[#140D26]/40 backdrop-blur-sm shadow-[0_0_50px_rgba(139,61,255,0.25)]">
                <img
                  src={heroGraphicImg}
                  alt="SPEFIBER S.A.S. - Emblema Tecnológico e Inteligencia Artificial"
                  className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-700 select-none pointer-events-none"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>

              {/* Badges laterales de identidad (IDEAS / TECNOLOGÍA / PERSONAS / RESULTADOS) */}
              <div className="hidden xl:flex absolute -right-6 top-1/2 -translate-y-1/2 flex-col gap-2 text-[10px] tracking-widest text-[#C7C9D1]/70 uppercase font-semibold">
                <span className="hover:text-white transition-colors">IDEAS</span>
                <span className="hover:text-white transition-colors">TECNOLOGÍA</span>
                <span className="hover:text-white transition-colors">PERSONAS</span>
                <span className="hover:text-white transition-colors">RESULTADOS</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
