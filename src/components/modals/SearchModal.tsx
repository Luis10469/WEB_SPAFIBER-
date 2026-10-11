import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Code, Smartphone, Brain, Cog, FolderGit2, ArrowRight } from 'lucide-react';
import { servicesData } from '../../data/services';
import { projectsData } from '../../data/projects';
import { ProjectItem } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: ProjectItem) => void;
  onSelectService: (serviceId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onSelectService,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const normalizedQuery = query.toLowerCase().trim();

  const filteredServices = servicesData.filter(
    (s) =>
      s.title.toLowerCase().includes(normalizedQuery) ||
      s.description.toLowerCase().includes(normalizedQuery) ||
      s.features?.some((f) => f.toLowerCase().includes(normalizedQuery))
  );

  const filteredProjects = projectsData.filter(
    (p) =>
      p.title.toLowerCase().includes(normalizedQuery) ||
      p.tags.some((t) => t.toLowerCase().includes(normalizedQuery)) ||
      p.technologies.some((t) => t.toLowerCase().includes(normalizedQuery))
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6 bg-black/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      <div className="relative w-full max-w-xl bg-[#140D26] border border-purple-500/30 rounded-2xl shadow-[0_0_50px_rgba(139,61,255,0.4)] overflow-hidden">
        
        {/* Barra de entrada de búsqueda */}
        <div className="flex items-center px-4 py-3.5 border-b border-purple-900/40 gap-3">
          <Search className="w-5 h-5 text-[#B45CFF] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            id="search-modal-title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar servicios, tecnologías (ej. IA, Web, React)..."
            className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-white/40"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#B5B0C2] hover:text-white"
            aria-label="Cerrar búsqueda"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resultados */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          
          {/* Categoría Servicios */}
          <div>
            <h4 className="text-xs font-semibold text-[#B45CFF] uppercase tracking-wider mb-2">
              Servicios ({filteredServices.length})
            </h4>
            {filteredServices.length === 0 ? (
              <p className="text-xs text-[#B5B0C2] italic">No se encontraron servicios.</p>
            ) : (
              <div className="space-y-1.5">
                {filteredServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => {
                      onClose();
                      onSelectService(service.id);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-950/40 text-left transition-colors border border-transparent hover:border-purple-500/20 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-purple-900/40 text-[#B45CFF]">
                        {service.iconName === 'code' && <Code className="w-4 h-4" />}
                        {service.iconName === 'smartphone' && <Smartphone className="w-4 h-4" />}
                        {service.iconName === 'brain' && <Brain className="w-4 h-4" />}
                        {service.iconName === 'cog' && <Cog className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-white group-hover:text-[#D8B4FE]">
                          {service.title}
                        </span>
                        <p className="text-xs text-[#B5B0C2] line-clamp-1">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#B5B0C2] group-hover:text-white group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Categoría Proyectos */}
          <div className="pt-2 border-t border-purple-900/30">
            <h4 className="text-xs font-semibold text-[#B45CFF] uppercase tracking-wider mb-2">
              Proyectos Destacados ({filteredProjects.length})
            </h4>
            {filteredProjects.length === 0 ? (
              <p className="text-xs text-[#B5B0C2] italic">No se encontraron proyectos.</p>
            ) : (
              <div className="space-y-1.5">
                {filteredProjects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      onClose();
                      onSelectProject(project);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-950/40 text-left transition-colors border border-transparent hover:border-purple-500/20 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-purple-900/40 text-[#B45CFF]">
                        <FolderGit2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-white group-hover:text-[#D8B4FE]">
                          {project.title}
                        </span>
                        <p className="text-xs text-[#B5B0C2]">
                          {project.tags.join(' · ')}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#B5B0C2] group-hover:text-white group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer atajos */}
        <div className="px-4 py-2.5 bg-[#090711] border-t border-purple-900/40 flex items-center justify-between text-[11px] text-[#B5B0C2]">
          <span>Tip: Presiona <kbd className="px-1.5 py-0.5 rounded bg-purple-950 border border-purple-500/30 text-white">Esc</kbd> para cerrar</span>
          <span>SPEFIBER S.A.S.</span>
        </div>

      </div>
    </div>
  );
};
