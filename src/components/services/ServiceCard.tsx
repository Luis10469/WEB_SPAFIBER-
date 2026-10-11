import React from 'react';
import { Code, Smartphone, Brain, Cog, ArrowRight } from 'lucide-react';
import { ServiceItem } from '../../types';

interface ServiceCardProps {
  service: ServiceItem;
  onSelectService: (serviceId: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelectService }) => {
  const renderIcon = () => {
    const iconClass = 'w-7 h-7 text-[#B45CFF]';
    switch (service.iconName) {
      case 'code':
        return <Code className={iconClass} />;
      case 'smartphone':
        return <Smartphone className={iconClass} />;
      case 'brain':
        return <Brain className={iconClass} />;
      case 'cog':
        return <Cog className={iconClass} />;
      default:
        return <Code className={iconClass} />;
    }
  };

  return (
    <div
      onClick={() => onSelectService(service.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectService(service.id);
        }
      }}
      className="group relative rounded-2xl p-6 sm:p-7 bg-[#140D26]/70 backdrop-blur-xl border border-purple-500/20 hover:border-purple-400/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(180,92,255,0.22)] hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-[#B45CFF]"
    >
      {/* Luz interna en hover */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-600/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div>
        {/* Cabecera de la tarjeta: Ícono + Flecha de acción */}
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/30 group-hover:border-purple-400/50 group-hover:bg-purple-900/50 transition-all shadow-[0_0_15px_rgba(139,61,255,0.15)]">
            {renderIcon()}
          </div>
          <div className="w-9 h-9 rounded-full bg-purple-950/40 border border-purple-500/25 flex items-center justify-center text-[#B5B0C2] group-hover:text-white group-hover:border-purple-400 group-hover:bg-[#8B3DFF] group-hover:shadow-[0_0_15px_#B45CFF] transition-all">
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Título del servicio */}
        <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-[#D8B4FE] transition-colors">
          {service.title}
        </h3>

        {/* Descripción */}
        <p className="text-sm text-[#B5B0C2] leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* Características clave en hover sutil */}
      {service.features && (
        <div className="mt-5 pt-4 border-t border-purple-900/30 text-xs text-[#C7C9D1]/70 space-y-1">
          {service.features.slice(0, 2).map((feat, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#B45CFF]" />
              <span className="truncate">{feat}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
