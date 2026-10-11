import React, { useEffect, useState } from 'react';
import { ArrowRight, Menu, X } from 'lucide-react';
import { companyData } from '../../data/company';
import { NavItem } from '../../types';
import navLogoImg from '../../assets/nav_logo_transparent.png';
import { Button } from '../ui/Button';

interface NavbarProps {
  onRequestQuote: () => void;
}

const navLinks: NavItem[] = [
  { label: 'Inicio', href: '#inicio', id: 'inicio' },
  { label: 'Servicios', href: '#servicios', id: 'servicios' },
  { label: 'Nosotros', href: '#nosotros', id: 'nosotros' },
  { label: 'Proyectos', href: '#proyectos', id: 'proyectos' },
  { label: 'Tecnologías', href: '#tecnologias', id: 'tecnologias' },
  { label: 'Contacto', href: '#contacto', id: 'contacto' },
];

export const Navbar: React.FC<NavbarProps> = ({ onRequestQuote }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 12);
    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((section): section is HTMLElement => section !== null);

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio);
        const current = visibleSections[0]?.target.id;
        if (current) setActiveSection(current);
      },
      { rootMargin: '-22% 0px -66% 0px', threshold: [0, 0.1, 0.4] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    const closeOnResize = () => {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closeOnResize);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closeOnResize);
    };
  }, [mobileMenuOpen]);

  const renderLinks = (mobile = false) =>
    navLinks.map((item) => {
      const isActive = activeSection === item.id;
      return (
        <a
          key={item.id}
          href={item.href}
          aria-current={isActive ? 'location' : undefined}
          onClick={() => mobile && setMobileMenuOpen(false)}
          className={`nav-link${isActive ? ' nav-link--active' : ''}${mobile ? ' nav-link--mobile' : ''}`}
        >
          {item.label}
        </a>
      );
    });

  const requestQuote = () => {
    setMobileMenuOpen(false);
    onRequestQuote();
  };

  return (
    <header className={`site-header${isScrolled ? ' site-header--scrolled' : ''}`}>
      <div className="site-header__inner">
        <a className="brand-link" href="#inicio" aria-label={`${companyData.legalName}, ir al inicio`}>
          <img
            src={navLogoImg}
            alt="SPEFIBER S.A.S."
            width="225"
            height="50"
            className="brand-link__logo"
          />
        </a>

        <nav className="desktop-navigation" aria-label="Navegación principal">
          {renderLinks()}
        </nav>

        <div className="site-header__actions">
          <Button
            asAnchor
            href="#contacto"
            onClick={requestQuote}
            size="sm"
            icon={<ArrowRight size={15} aria-hidden="true" />}
          >
            Solicitar cotización
          </Button>
          <button
            className="menu-toggle"
            type="button"
            aria-label={mobileMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        className={`mobile-navigation${mobileMenuOpen ? ' mobile-navigation--open' : ''}`}
        aria-label="Navegación móvil"
        aria-hidden={!mobileMenuOpen}
      >
        <div className="mobile-navigation__links">{renderLinks(true)}</div>
        <Button
          asAnchor
          href="#contacto"
          onClick={requestQuote}
          className="mobile-navigation__cta"
          icon={<ArrowRight size={16} aria-hidden="true" />}
        >
          Solicitar cotización
        </Button>
      </nav>
    </header>
  );
};
