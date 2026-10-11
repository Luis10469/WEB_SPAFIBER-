import React from 'react';
import { ArrowDownRight, ArrowRight, Code2, Layers3, Sparkles } from 'lucide-react';
import { companyData, heroHighlights } from '../../data/company';
import { Button } from '../ui/Button';
import heroGraphicImg from '../../assets/optimized/hero_composition.webp';

interface HeroSectionProps {
  onRequestQuote: () => void;
}

const highlightIcons = {
  sparkles: Sparkles,
  code: Code2,
  layers: Layers3,
} as const;

export const HeroSection: React.FC<HeroSectionProps> = ({ onRequestQuote }) => (
  <section id="inicio" className="hero-section" aria-labelledby="hero-title">
    <div className="hero-section__ambient hero-section__ambient--one" aria-hidden="true" />
    <div className="hero-section__ambient hero-section__ambient--two" aria-hidden="true" />
    <div className="hero-section__grid" aria-hidden="true" />

    <div className="page-container hero-section__content">
      <div className="hero-copy">
        <p className="eyebrow hero-copy__eyebrow">
          <span className="eyebrow__mark" aria-hidden="true" />
          {companyData.tagline}
        </p>

        <h1 id="hero-title" className="hero-title">
          {companyData.heroHeadline}{' '}
          <span className="text-gradient">{companyData.heroHighlight}</span>
        </h1>

        <p className="hero-copy__description">{companyData.heroDescription}</p>

        <div className="hero-copy__actions">
          <Button
            asAnchor
            href="#contacto"
            onClick={onRequestQuote}
            size="lg"
            icon={<ArrowRight size={17} aria-hidden="true" />}
          >
            Solicitar cotización
          </Button>
          <Button
            asAnchor
            href="#servicios"
            variant="secondary"
            size="lg"
            icon={<ArrowDownRight size={17} aria-hidden="true" />}
          >
            Explorar servicios
          </Button>
        </div>

        <ul className="hero-highlights" aria-label="Enfoque de SPEFIBER">
          {heroHighlights.map((item) => {
            const Icon = highlightIcons[item.icon];
            return (
              <li className="hero-highlight" key={item.id}>
                <span className="hero-highlight__icon">
                  <Icon size={17} aria-hidden="true" />
                </span>
                <span>
                  <strong>{item.title}</strong>
                  <span className="hero-highlight__description">{item.description}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="hero-art-wrap">
        <div className="hero-art-wrap__halo" aria-hidden="true" />
        <div className="hero-art-wrap__orbit hero-art-wrap__orbit--outer" aria-hidden="true" />
        <div className="hero-art-wrap__orbit hero-art-wrap__orbit--inner" aria-hidden="true" />
        <figure className="hero-art">
          <img
            src={heroGraphicImg}
            alt="Isotipo metálico tridimensional de SPEFIBER S.A.S. sobre una composición tecnológica violeta"
            width="615"
            height="324"
            loading="eager"
            decoding="async"
          />
          <figcaption className="hero-art__caption">
            <span className="hero-art__caption-mark" aria-hidden="true" />
            <span>Ingeniería de software · Soluciones digitales</span>
          </figcaption>
        </figure>
        <span className="hero-art__side-note" aria-hidden="true">IDEAS · CÓDIGO · EVOLUCIÓN</span>
      </div>
    </div>

    <a className="hero-scroll-cue" href="#servicios" aria-label="Desplazarse a servicios">
      <span>Descubrir</span>
      <ArrowDownRight size={15} aria-hidden="true" />
    </a>
  </section>
);
