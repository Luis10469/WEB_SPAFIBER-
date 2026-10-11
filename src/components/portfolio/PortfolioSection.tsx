import React from 'react';
import { Info } from 'lucide-react';
import { projectsData } from '../../data/projects';
import { ProjectItem } from '../../types';
import { ProjectCard } from './ProjectCard';

interface PortfolioSectionProps {
  onSelectProject: (project: ProjectItem) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onSelectProject }) => (
  <section id="proyectos" className="section section--portfolio" aria-labelledby="portfolio-title">
    <div className="page-container">
      <div className="section-heading section-heading--split">
        <div>
          <p className="eyebrow">Ideas en construcción</p>
          <h2 id="portfolio-title" className="section-title">
            Exploraciones de <span className="text-gradient">producto digital.</span>
          </h2>
        </div>
        <p className="section-intro">
          Una muestra de distintos tipos de soluciones que podemos diseñar y desarrollar según cada reto.
        </p>
      </div>

      <div className="portfolio-notice" role="note">
        <Info size={17} aria-hidden="true" />
        <p>
          Los elementos de esta sección son <strong>conceptos demostrativos</strong>. No representan
          clientes, proyectos entregados ni resultados atribuidos a SPEFIBER.
        </p>
      </div>

      <div className="portfolio-grid">
        {projectsData.map((project) => (
          <ProjectCard key={project.id} project={project} onSelectProject={onSelectProject} />
        ))}
      </div>
    </div>
  </section>
);
