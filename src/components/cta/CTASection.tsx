import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import ctaSkylineImg from '../../assets/optimized/cta_skyline.webp';

export const CTASection: React.FC = () => (
  <section className="cta-section" aria-labelledby="cta-title">
    <div className="page-container">
      <div className="cta-panel">
        <img className="cta-panel__image" src={ctaSkylineImg} alt="" aria-hidden="true" loading="lazy" />
        <div className="cta-panel__shade" aria-hidden="true" />
        <div className="cta-panel__content">
          <div>
            <p className="eyebrow"><Sparkles size={15} aria-hidden="true" /> Una buena idea merece una gran ejecución</p>
            <h2 id="cta-title">Hagamos espacio para <span className="text-gradient">lo que sigue.</span></h2>
            <p>Conversemos sobre el reto que quieres resolver con tecnología.</p>
          </div>
          <Button asAnchor href="#contacto" size="lg" icon={<ArrowRight size={17} aria-hidden="true" />}>
            Hablemos de tu proyecto
          </Button>
        </div>
      </div>
    </div>
  </section>
);
