import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { ProjectItem } from '../../types';

interface ProjectCardProps {
  project: ProjectItem;
  onSelectProject: (project: ProjectItem) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelectProject }) => (
  <article className="project-card">
    <button
      className="project-card__button"
      type="button"
      onClick={() => onSelectProject(project)}
      aria-label={`Ver detalles de ${project.title}`}
      aria-haspopup="dialog"
    >
      <span className="project-card__image-wrap">
        <img
          src={project.image}
          alt=""
          width="270"
          height="96"
          loading="lazy"
          decoding="async"
          className="project-card__image"
        />
        <span className="project-card__status">
          <Sparkles size={13} aria-hidden="true" />
          {project.status}
        </span>
      </span>
      <span className="project-card__body">
        <span className="project-card__category">{project.category}</span>
        <span className="project-card__title">{project.title}</span>
        <span className="project-card__summary">{project.summary}</span>
        <span className="project-card__action">
          Ver concepto <ArrowUpRight size={16} aria-hidden="true" />
        </span>
      </span>
    </button>
  </article>
);
