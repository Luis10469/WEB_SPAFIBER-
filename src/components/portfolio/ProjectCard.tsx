import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProjectItem } from '../../types';

interface ProjectCardProps {
  project: ProjectItem;
  onSelectProject: (project: ProjectItem) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelectProject }) => {
  return (
    <div
      onClick={() => onSelectProject(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectProject(project);
        }
      }}
      className="group relative rounded-2xl overflow-hidden bg-[#140D26]/80 border border-purple-500/20 hover:border-purple-400/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(180,92,255,0.25)] hover:-translate-y-1 cursor-pointer flex flex-col focus:outline-none focus:ring-2 focus:ring-[#B45CFF]"
    >
      {/* Contenedor de la Imagen con zoom suave */}
      <div className="relative aspect-[16/10] overflow-hidden bg-black/40">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradiente oscuro inferior para fusionar con la barra de texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#140D26] via-transparent to-transparent opacity-80" />

        {/* Badge discreto de caso de referencia */}
        {project.isDemoReference && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-purple-500/30 text-[10px] text-[#D8B4FE]">
            <Sparkles className="w-2.5 h-2.5 text-[#B45CFF]" />
            <span>Referencia Técnica</span>
          </div>
        )}
      </div>

      {/* Barra de información inferior idéntica a la maqueta */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-[#0E091C]/90 backdrop-blur-md border-t border-purple-900/40">
        <div className="space-y-1 min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#D8B4FE] transition-colors truncate">
            {project.title}
          </h3>
          <p className="text-xs text-[#B5B0C2] truncate">
            {project.tags.join(' · ')}
          </p>
        </div>

        {/* Botón circular con flecha */}
        <div className="w-8 h-8 rounded-full bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-[#B5B0C2] group-hover:text-white group-hover:border-purple-400 group-hover:bg-[#8B3DFF] group-hover:shadow-[0_0_12px_#B45CFF] shrink-0 transition-all">
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
