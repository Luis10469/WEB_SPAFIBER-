import React from 'react';
import { ArrowRight } from 'lucide-react';
import { projectsData } from '../../data/projects';
import { ProjectItem } from '../../types';
import { ProjectCard } from './ProjectCard';

interface PortfolioSectionProps {
  onSelectProject: (project: ProjectItem) => void;
  onOpenAllProjects: () => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  onSelectProject,
  onOpenAllProjects,
}) => {
  return (
    <section id="proyectos" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Cabecera de la sección */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Proyectos destacados
              </h2>
              <span className="h-0.5 w-10 bg-[#B45CFF] rounded-full shadow-[0_0_8px_#B45CFF]" />
            </div>
            <p className="text-sm text-[#B5B0C2]">
              Conoce algunos de los proyectos en los que hemos trabajado.
            </p>
          </div>

          <button
            onClick={onOpenAllProjects}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#B45CFF] hover:text-[#D8B4FE] group transition-colors self-start sm:self-auto cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#B45CFF] rounded-lg px-2 py-1"
          >
            <span>Ver todos los proyectos</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Grilla de 4 Proyectos Destacados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {projectsData.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelectProject={onSelectProject}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
