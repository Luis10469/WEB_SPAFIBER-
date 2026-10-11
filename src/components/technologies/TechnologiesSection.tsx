import React from 'react';
import { Braces, Cpu, Database, Layers3, Workflow, type LucideIcon } from 'lucide-react';
import { technologiesData } from '../../data/technologies';
import { TechnologyItem } from '../../types';

const technologyIcons: Record<TechnologyItem['iconName'], LucideIcon> = {
  code: Braces,
  layers: Layers3,
  database: Database,
  cpu: Cpu,
  workflow: Workflow,
};

export const TechnologiesSection: React.FC = () => (
  <section id="tecnologias" className="section section--technologies" aria-labelledby="technologies-title">
    <div className="page-container technologies-layout">
      <div className="technologies-copy">
        <p className="eyebrow">Tecnologías</p>
        <h2 id="technologies-title" className="section-title">
          Las herramientas adecuadas para <span className="text-gradient">cada desafío.</span>
        </h2>
        <p className="section-intro">
          La arquitectura y las herramientas se seleccionan según los requisitos, el contexto y el
          mantenimiento esperado de cada producto.
        </p>
      </div>

      <div className="technology-grid" aria-label="Tecnologías">
        {technologiesData.map((technology) => {
          const Icon = technologyIcons[technology.iconName];
          return (
            <article className="technology-item" key={technology.name}>
              <span className="technology-item__icon"><Icon size={19} aria-hidden="true" /></span>
              <span className="technology-item__text">
                <strong>{technology.name}</strong>
                <span>{technology.category}</span>
              </span>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);
