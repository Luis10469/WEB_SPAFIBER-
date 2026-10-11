import { useCallback, useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { ServicesSection } from './components/services/ServicesSection';
import { AboutSection } from './components/about/AboutSection';
import { PortfolioSection } from './components/portfolio/PortfolioSection';
import { TechnologiesSection } from './components/technologies/TechnologiesSection';
import { CTASection } from './components/cta/CTASection';
import { ContactSection } from './components/contact/ContactSection';
import { Footer } from './components/layout/Footer';
import { ProjectDetailModal } from './components/modals/ProjectDetailModal';
import { ProjectItem } from './types';

export function App() {
  const [selectedServiceId, setSelectedServiceId] = useState('custom');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  const handleRequestQuote = useCallback((serviceId = 'custom') => {
    setSelectedServiceId(serviceId);
  }, []);

  const handleQuoteSimilar = useCallback(() => {
    setSelectedServiceId('custom');
  }, []);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Saltar al contenido principal</a>
      <Navbar onRequestQuote={() => handleRequestQuote()} />

      <main id="main-content">
        <HeroSection onRequestQuote={() => handleRequestQuote()} />
        <ServicesSection onSelectService={handleRequestQuote} />
        <AboutSection />
        <PortfolioSection onSelectProject={setActiveProject} />
        <TechnologiesSection />
        <CTASection />
        <ContactSection initialServiceId={selectedServiceId} />
      </main>

      <Footer />
      <ProjectDetailModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
        onQuoteSimilar={handleQuoteSimilar}
      />
    </div>
  );
}

export default App;
