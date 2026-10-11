import React from 'react';
import { ArrowUpRight, Github, Instagram, Linkedin, Youtube } from 'lucide-react';
import { companyData } from '../../data/company';
import navLogoImg from '../../assets/nav_logo_transparent.png';

const socialItems = [
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { key: 'instagram', label: 'Instagram', icon: Instagram },
  { key: 'github', label: 'GitHub', icon: Github },
  { key: 'youtube', label: 'YouTube', icon: Youtube },
] as const;

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const configuredSocials = socialItems.flatMap((item) => {
    const href = companyData.socialLinks[item.key];
    return href ? [{ ...item, href }] : [];
  });

  return (
    <footer className="site-footer">
      <div className="page-container">
        <div className="footer-main">
          <div className="footer-brand">
            <a href="#inicio" aria-label={`${companyData.legalName}, volver al inicio`}>
              <img src={navLogoImg} alt="SPEFIBER S.A.S." width="225" height="50" loading="lazy" />
            </a>
            <p>
              Ingeniería de software, aplicaciones y soluciones digitales para convertir ideas en herramientas útiles.
            </p>
            <span className="footer-brand__sector">{companyData.sector}</span>
          </div>

          <div className="footer-column">
            <h2>Explorar</h2>
            <a href="#servicios">Servicios</a>
            <a href="#nosotros">Nosotros</a>
            <a href="#proyectos">Proyectos</a>
            <a href="#tecnologias">Tecnologías</a>
          </div>

          <div className="footer-column">
            <h2>Contacto</h2>
            <a href="#contacto">Solicitar cotización <ArrowUpRight size={14} aria-hidden="true" /></a>
            {companyData.contactEmail && (
              <a href={`mailto:${companyData.contactEmail}`}>{companyData.contactEmail}</a>
            )}
            {companyData.legalLinks.privacy && <a href={companyData.legalLinks.privacy}>Privacidad</a>}
            {companyData.legalLinks.terms && <a href={companyData.legalLinks.terms}>Términos de servicio</a>}
          </div>

          {configuredSocials.length > 0 && (
            <div className="footer-socials">
              <h2>Redes verificadas</h2>
              <div className="footer-socials__links">
                {configuredSocials.map(({ key, label, icon: Icon, href }) => (
                  <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                    <Icon size={17} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="footer-bottom">
          <p>© {year} {companyData.legalName}. Todos los derechos reservados.</p>
          <a href="#inicio">Volver al inicio <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
      </div>
    </footer>
  );
};
