import React from 'react';
import { Lightbulb, ShieldCheck, TrendingUp } from 'lucide-react';
import { aboutData } from '../../data/about';

export const AboutSection: React.FC = () => {
  const renderPillarIcon = (iconName: string) => {
    const iconClass = 'w-6 h-6 text-[#B45CFF]';
    switch (iconName) {
      case 'lightbulb':
        return <Lightbulb className={iconClass} />;
      case 'shield-check':
        return <ShieldCheck className={iconClass} />;
      case 'trending-up':
        return <TrendingUp className={iconClass} />;
      default:
        return <Lightbulb className={iconClass} />;
    }
  };

  return (
    <section id="nosotros" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Columna Izquierda: Título con línea de acento y narrativa */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {aboutData.sectionTitle}
              </h2>
              <span className="h-0.5 w-12 bg-gradient-to-r from-[#B45CFF] to-transparent rounded-full shadow-[0_0_8px_#B45CFF]" />
            </div>

            <p className="text-base text-[#B5B0C2] leading-relaxed max-w-md">
              {aboutData.description}
            </p>
          </div>

          {/* Columna Derecha: 3 Pilares con íconos exactos */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {aboutData.pillars.map((pillar) => (
              <div
                key={pillar.id}
                className="group p-5 rounded-2xl bg-[#140D26]/60 backdrop-blur-md border border-purple-500/20 hover:border-purple-400/50 hover:shadow-[0_0_25px_rgba(180,92,255,0.18)] transition-all duration-300"
              >
                <div className="p-3 w-fit rounded-xl bg-purple-950/60 border border-purple-500/30 mb-4 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(139,61,255,0.2)]">
                  {renderPillarIcon(pillar.iconName)}
                </div>

                <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#D8B4FE] transition-colors">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#B5B0C2] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
