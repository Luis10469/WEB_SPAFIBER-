import React, { useEffect } from 'react';
import { X, Sparkles, Check, ArrowRight, Layers, Tag } from 'lucide-react';
import { ProjectItem } from '../../types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onQuoteSimilar: (projectTitle: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onQuoteSimilar,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && project) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#140D26] border border-purple-500/30 rounded-3xl shadow-[0_0_60px_rgba(139,61,255,0.4)] p-6 sm:p-8">
        
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 z-20 p-2 rounded-full text-[#B5B0C2] hover:text-white hover:bg-purple-900/40 border border-purple-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-[#B45CFF]"
          aria-label="Cerrar detalles del proyecto"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Imagen del Proyecto */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-purple-500/25 mb-6">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140D26] via-transparent to-transparent opacity-90" />
          
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-950/80 backdrop-blur-md text-[#D8B4FE] border border-purple-500/30">
              {project.category}
            </span>

            {project.isDemoReference && (
              <Badge variant="demo">
                <Sparkles className="w-3 h-3 mr-1" />
                Caso de Estudio de Referencia
              </Badge>
            )}
          </div>
        </div>

        {/* Título y Resumen */}
        <div className="space-y-4">
          <div>
            <h3 id="project-modal-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {project.title}
            </h3>
            <p className="text-xs text-[#B45CFF] font-semibold mt-1 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              {project.tags.join(' • ')}
            </p>
          </div>

          <p className="text-sm text-[#C7C9D1] leading-relaxed">
            {project.fullDescription}
          </p>

          {/* Sector de Aplicación */}
          <div className="p-4 rounded-xl bg-[#0E091C] border border-purple-500/20 text-xs">
            <span className="text-[#B5B0C2] font-medium">Sector objetivo: </span>
            <span className="text-white font-semibold">{project.clientType}</span>
          </div>

          {/* Stack Tecnológico */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-2.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#B45CFF]" />
              Stack Tecnológico Empleado
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, idx) => (
                <Badge key={idx} variant="purple">
                  <Check className="w-3 h-3 mr-1 text-[#B45CFF]" />
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Acciones */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                onClose();
                onQuoteSimilar(project.title);
              }}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="w-full sm:w-auto"
            >
              Cotizar un proyecto similar
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cerrar
            </Button>
          </div>

        </div>

      </div>
    </div>
  );
};
