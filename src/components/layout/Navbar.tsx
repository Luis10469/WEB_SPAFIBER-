import React, { useState, useEffect } from 'react';
import { Search, Menu, X, ArrowRight } from 'lucide-react';
import navLogoImg from '../../assets/nav_logo.png';
import { Button } from '../ui/Button';

interface NavbarProps {
  onOpenContact: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact, onOpenSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  const navLinks = [
    { label: 'Inicio', href: '#inicio', id: 'inicio' },
    { label: 'Servicios', href: '#servicios', id: 'servicios' },
    { label: 'Nosotros', href: '#nosotros', id: 'nosotros' },
    { label: 'Proyectos', href: '#proyectos', id: 'proyectos' },
    { label: 'Contacto', href: '#contacto', id: 'contacto' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = ['inicio', 'servicios', 'nosotros', 'proyectos', 'contacto'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090711]/90 backdrop-blur-md border-b border-purple-900/30 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent border-b border-purple-900/15'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Corporativo */}
          <a
            href="#inicio"
            className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#B45CFF] rounded-lg transition-transform hover:scale-[1.02]"
            aria-label="SPEFIBER S.A.S. - Inicio"
          >
            <img
              src={navLogoImg}
              alt="SPEFIBER S.A.S."
              className="h-10 sm:h-11 w-auto object-contain filter drop-shadow-[0_0_15px_rgba(180,92,255,0.4)]"
            />
          </a>

          {/* Navegación Desktop */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-[#140D26]/70 border border-purple-500/20 backdrop-blur-lg px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(139,61,255,0.15)]"
          >
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                    isActive
                      ? 'text-white bg-[#8B3DFF]/30 shadow-[0_0_15px_rgba(180,92,255,0.5)] border border-purple-400/40'
                      : 'text-[#B5B0C2] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-[#B45CFF] rounded-full shadow-[0_0_8px_#B45CFF]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Acciones Rápidas Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Botón Búsqueda */}
            <button
              onClick={onOpenSearch}
              type="button"
              className="p-2.5 rounded-full text-[#B5B0C2] hover:text-white hover:bg-purple-950/40 border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#B45CFF]"
              aria-label="Buscar servicios o proyectos"
              title="Buscar (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* CTA Contacto */}
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenContact}
              icon={<ArrowRight className="w-3.5 h-3.5" />}
              iconPosition="right"
              className="border border-purple-400/30"
            >
              Contáctanos
            </Button>
          </div>

          {/* Botón Menú Móvil */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenSearch}
              type="button"
              className="p-2 rounded-full text-[#B5B0C2] hover:text-white border border-purple-500/20"
              aria-label="Buscar"
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2.5 rounded-lg text-[#C7C9D1] hover:text-white hover:bg-purple-950/40 border border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-[#B45CFF]"
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Cerrar menú principal' : 'Abrir menú principal'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D081D]/98 border-b border-purple-500/30 backdrop-blur-xl px-4 pt-3 pb-6 animate-fadeIn">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    isActive
                      ? 'text-white bg-purple-900/40 border-l-4 border-[#B45CFF] shadow-[0_0_15px_rgba(180,92,255,0.2)]'
                      : 'text-[#B5B0C2] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          <div className="mt-5 pt-4 border-t border-purple-900/40 flex flex-col gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="w-full justify-center"
            >
              Contáctanos ahora
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
