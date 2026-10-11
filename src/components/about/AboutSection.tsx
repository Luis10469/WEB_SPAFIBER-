import React from 'react';
import {
  CheckCircle2,
  Handshake,
  Scale,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { aboutData } from '../../data/about';
import { PillarItem } from '../../types';

const pillarIcons: Record<PillarItem['iconName'], LucideIcon> = {
  sparkles: Sparkles,
  quality: CheckCircle2,
  shield: ShieldCheck,
  scale: Scale,
  handshake: Handshake,
};

export const AboutSection: React.FC = () => (
  <section id="nosotros" className="section section--about" aria-labelledby="about-title">
    <div className="page-container">
      <div className="about-intro">
        <div className="about-intro__copy">
          <p className="eyebrow">Sobre SPEFIBER</p>
          <h2 id="about-title" className="section-title">
            {aboutData.sectionTitle}
          </h2>
          <p className="about-intro__description">{aboutData.description}</p>
        </div>
        <aside className="vision-card" aria-label="Nuestra visión tecnológica">
          <span className="vision-card__label">Nuestra visión</span>
          <p>{aboutData.vision}</p>
          <span className="vision-card__mark" aria-hidden="true">S</span>
        </aside>
      </div>

      <div className="about-method">
        <div className="about-method__heading">
          <p className="eyebrow">Cómo abordamos un proyecto</p>
          <h3>De una necesidad a una solución clara.</h3>
          <p>Un proceso colaborativo, adaptable al alcance y al contexto de cada iniciativa.</p>
        </div>
        <ol className="method-steps">
          {aboutData.methodology.map((step) => (
            <li key={step.number} className="method-step">
              <span className="method-step__number">{step.number}</span>
              <div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="pillars-heading">
        <span className="eyebrow">Principios de trabajo</span>
        <span className="pillars-heading__line" aria-hidden="true" />
      </div>
      <div className="pillars-grid">
        {aboutData.pillars.map((pillar) => {
          const Icon = pillarIcons[pillar.iconName];
          return (
            <article className="pillar-card" key={pillar.id}>
              <span className="pillar-card__icon"><Icon size={19} aria-hidden="true" /></span>
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);
