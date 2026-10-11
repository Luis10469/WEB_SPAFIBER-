import { useState, useCallback } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { ServicesSection } from './components/services/ServicesSection';
import { AboutSection } from './components/about/AboutSection';
import { PortfolioSection } from './components/portfolio/PortfolioSection';
import { CTASection } from './components/cta/CTASection';
import { Footer } from './components/layout/Footer';
import { ContactModal } from './components/modals/ContactModal';
import { ProjectDetailModal } from './components/modals/ProjectDetailModal';
import { SearchModal } from './components/modals/SearchModal';
import { ProjectItem } from './types';

export function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState('web-dev');
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectItem | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleOpenContact = useCallback((serviceId: string = 'web-dev') => {
    setSelectedServiceId(serviceId);
    setIsContactOpen(true);
  }, []);

  const handleSelectService = useCallback((serviceId: string) => {
    setSelectedServiceId(serviceId);
    setIsContactOpen(true);
  }, []);

  const handleSelectProject = useCallback((project: ProjectItem) => {
    setActiveProjectModal(project);
  }, []);

  const handleQuoteSimilar = useCallback((_projectTitle: string) => {
    setSelectedServiceId('custom');
    setIsContactOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#090711] text-[#FFFFFF] relative selection:bg-[#8B3DFF] selection:text-white flex flex-col font-sans">
      {/* Barra de Navegación */}
      <Navbar
        onOpenContact={() => handleOpenContact('web-dev')}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Contenido Principal con Semántica HTML */}
      <main className="flex-grow">
        {/* Módulo 2: Hero Section */}
        <HeroSection onOpenQuote={() => handleOpenContact('web-dev')} />

        {/* Módulo 3: Servicios */}
        <ServicesSection onSelectService={handleSelectService} />

        {/* Módulo 4: Sobre la Empresa */}
        <AboutSection />

        {/* Módulo 5: Portafolio */}
        <PortfolioSection
          onSelectProject={handleSelectProject}
          onOpenAllProjects={() => {
            const el = document.getElementById('proyectos');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Módulo 6: Call To Action */}
        <CTASection onOpenContact={() => handleOpenContact('custom')} />
      </main>

      {/* Módulo 7: Footer */}
      <Footer />

      {/* Modales y Capas Interactivas */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialServiceId={selectedServiceId}
      />

      <ProjectDetailModal
        project={activeProjectModal}
        onClose={() => setActiveProjectModal(null)}
        onQuoteSimilar={handleQuoteSimilar}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProject={handleSelectProject}
        onSelectService={handleSelectService}
      />
    </div>
  );
}

export default App;
