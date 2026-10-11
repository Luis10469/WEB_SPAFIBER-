import React from 'react';
import { Linkedin, Instagram, Github, Youtube, Shield, FileText } from 'lucide-react';
import navLogoImg from '../../assets/nav_logo.png';
import { companyData } from '../../data/company';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#06040C] border-t border-purple-900/30 text-[#B5B0C2] text-sm relative overflow-hidden">
      {/* Luz ambiental sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-purple-600/10 blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Columna 1: Identidad Corporativa */}
          <div className="md:col-span-2 space-y-4">
            <a href="#inicio" className="inline-block transition-transform hover:scale-[1.01]">
              <img
                src={navLogoImg}
                alt="SPEFIBER S.A.S."
                className="h-10 w-auto object-contain filter drop-shadow-[0_0_12px_rgba(180,92,255,0.35)]"
              />
            </a>
            <p className="text-sm text-[#C7C9D1]/80 max-w-md leading-relaxed">
              {companyData.legalName} — {companyData.sector}. Creamos plataformas web, soluciones móviles, inteligencia artificial y automatización de procesos diseñadas para escalar con máxima estabilidad.
            </p>
            <div className="pt-1 text-xs text-[#8B3DFF]">
              * SPEFIBER no es un proveedor de telecomunicaciones ni servicios de internet.
            </div>
          </div>

          {/* Columna 2: Navegación Rápida */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs tracking-wider uppercase">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#inicio" className="hover:text-white hover:underline transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-white hover:underline transition-colors">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#nosotros" className="hover:text-white hover:underline transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#proyectos" className="hover:text-white hover:underline transition-colors">
                  Proyectos Destacados
                </a>
              </li>
              <li>
                <a href="#contacto" className="hover:text-white hover:underline transition-colors">
                  Solicitar Cotización
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Conexión y Redes */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-xs tracking-wider uppercase">
              Comunidad & Redes
            </h4>
            <p className="text-xs text-[#B5B0C2] mb-3">
              Canales corporativos y repositorios oficiales:
            </p>
            <div className="flex items-center gap-3">
              {companyData.socialLinks.linkedin && (
                <a
                  href={companyData.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-purple-950/40 text-[#C7C9D1] hover:text-white hover:bg-purple-900/60 border border-purple-500/20 transition-all hover:scale-110"
                  aria-label="LinkedIn de SPEFIBER"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {companyData.socialLinks.instagram && (
                <a
                  href={companyData.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-purple-950/40 text-[#C7C9D1] hover:text-white hover:bg-purple-900/60 border border-purple-500/20 transition-all hover:scale-110"
                  aria-label="Instagram de SPEFIBER"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {companyData.socialLinks.github && (
                <a
                  href={companyData.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-purple-950/40 text-[#C7C9D1] hover:text-white hover:bg-purple-900/60 border border-purple-500/20 transition-all hover:scale-110"
                  aria-label="GitHub de SPEFIBER"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {companyData.socialLinks.youtube && (
                <a
                  href={companyData.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-purple-950/40 text-[#C7C9D1] hover:text-white hover:bg-purple-900/60 border border-purple-500/20 transition-all hover:scale-110"
                  aria-label="YouTube de SPEFIBER"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-purple-900/20 text-xs">
              <span className="text-white/60">Canal directo: </span>
              <a
                href={`mailto:${companyData.emailContact}`}
                className="text-[#B45CFF] hover:underline"
              >
                {companyData.emailContact}
              </a>
            </div>
          </div>

        </div>

        {/* Barra inferior de copyright */}
        <div className="pt-8 border-t border-purple-900/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B5B0C2]">
          <p>
            &copy; {currentYear} {companyData.legalName}. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <Shield className="w-3.5 h-3.5 text-[#8B3DFF]" />
              Seguridad & Privacidad
            </span>
            <span className="inline-flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
              <FileText className="w-3.5 h-3.5 text-[#8B3DFF]" />
              Términos de Servicio
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
