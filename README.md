# SPEFIBER S.A.S. — Landing Page Corporativa (v1.0)

Landing page corporativa moderna, de alto rendimiento y diseño futurista desarrollada para **SPEFIBER S.A.S.**, empresa especializada en desarrollo de software, aplicaciones móviles, inteligencia artificial y automatización de procesos empresariales.

---

## 1. Identidad Corporativa & Paleta Visual

- **Razón Social:** SPEFIBER S.A.S.
- **Sector:** Desarrollo de software y soluciones tecnológicas.
- **Fondo Principal:** `#090711`
- **Fondo Secundario:** `#140D26`
- **Morado Corporativo:** `#8B3DFF`
- **Morado Luminoso:** `#B45CFF`
- **Plateado:** `#C7C9D1`
- **Texto Principal:** `#FFFFFF`
- **Texto Secundario:** `#B5B0C2`

> **Nota de Gobernanza:** SPEFIBER no es un proveedor de internet ni telecomunicaciones. Toda la comunicación y los componentes visuales reflejan estrictamente desarrollo de software de ingeniería avanzada.

---

## 2. Arquitectura del Proyecto

```text
Spefiber_landi/
├── public/                     # Assets públicos estáticos y favicon
│   └── logo_Spafiber.png
├── src/
│   ├── assets/                 # Logotipos y gráficos optimizados
│   │   ├── hero_composition.png
│   │   ├── nav_logo.png
│   │   ├── cta_skyline.png
│   │   └── projects/           # Thumbnails de casos de estudio
│   │       ├── project_1_erp.png
│   │       ├── project_2_mobile.png
│   │       ├── project_3_ai.png
│   │       └── project_4_ecommerce.png
│   ├── components/
│   │   ├── layout/             # Header / Navbar y Footer
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── hero/               # Hero section en 2 columnas
│   │   │   └── HeroSection.tsx
│   │   ├── services/           # Módulo de servicios y tarjetas interactivas
│   │   │   ├── ServicesSection.tsx
│   │   │   └── ServiceCard.tsx
│   │   ├── about/              # Sección ¿Por qué SPEFIBER S.A.S.?
│   │   │   └── AboutSection.tsx
│   │   ├── portfolio/          # Portafolio de proyectos destacados
│   │   │   ├── PortfolioSection.tsx
│   │   │   └── ProjectCard.tsx
│   │   ├── cta/                # Banner Call to Action panorámico
│   │   │   └── CTASection.tsx
│   │   ├── modals/             # Diálogos accesibles e interactivos
│   │   │   ├── ContactModal.tsx       # Solicitud de cotización
│   │   │   ├── ProjectDetailModal.tsx # Especificación técnica del proyecto
│   │   │   └── SearchModal.tsx        # Búsqueda instantánea (Ctrl+K)
│   │   └── ui/                 # Primitivas de UI accesibles
│   │       ├── Button.tsx
│   │       └── Badge.tsx
│   ├── data/                   # Datos desacoplados y configurables
│   │   ├── company.ts          # Datos corporativos y redes
│   │   ├── services.ts         # Catálogo de servicios
│   │   ├── about.ts            # Pilares y propuesta de valor
│   │   └── projects.ts         # Casos de estudio de referencia
│   ├── styles/
│   │   └── index.css           # Directivas Tailwind, glassmorphism y glows
│   ├── types/
│   │   └── index.ts            # Interfaces TypeScript
│   ├── App.tsx                 # Ensamble de la página y gestión de estado
│   ├── main.tsx                # Punto de entrada React 18
│   └── vite-env.d.ts
├── index.html                  # HTML5 semántico con Open Graph y SEO
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 3. Requisitos e Instalación

### Requisitos Previos
- **Node.js**: v18.0.0 o superior (verificado con v24.13.0).
- **npm**: v9.0.0 o superior.

### Instalación de Dependencias
```bash
npm install
```

---

## 4. Scripts Disponibles

- **Servidor de desarrollo local:**
  ```bash
  npm run dev
  ```
  Inicia el servidor en `http://localhost:3000` con hot reload instantáneo.

- **Compilación de producción:**
  ```bash
  npm run build
  ```
  Ejecuta verificación estricta de TypeScript (`tsc -b`) y minificación optimizada con Vite en `/dist`.

- **Previsualización de la compilación:**
  ```bash
  npm run preview
  ```
  Sirve los archivos compilados de producción localmente para pruebas de rendimiento.

---

## 5. Guía de Personalización y Configuración

Los datos de la empresa están completamente desacoplados del código visual en la carpeta `src/data/`:

1. **Datos de Contacto y Redes (`src/data/company.ts`)**:
   - `emailContact`: Dirección de correo corporativo para recibir solicitudes.
   - `socialLinks`: URLs de LinkedIn, Instagram, GitHub y YouTube.
   - `legalName`, `sector`, `tagline`, `heroDescription`.

2. **Servicios (`src/data/services.ts`)**:
   - Modifica o agrega servicios al catálogo con su título, descripción, icono y características.

3. **Proyectos del Portafolio (`src/data/projects.ts`)**:
   - Cada proyecto cuenta con la propiedad `isDemoReference: true` para identificar claramente los proyectos de referencia mientras se incorporan casos con aprobación explícita de clientes.

---

## 6. Reporte de Calidad y Validación (QA)

| Validación | Herramienta | Resultado |
|---|---|---|
| **Verificación de Tipos** | `tsc -b` | 0 errores. Tipado estricto verificado. |
| **Compilación de Producción** | `vite build` | Exitosa (`dist/` generado en 13.45s). |
| **Navegación por Anclas** | Header spy & Scroll | Desplazamiento suave a `#inicio`, `#servicios`, `#nosotros`, `#proyectos`, `#contacto`. |
| **Responsive Web Design** | Tailwind Breakpoints | Mobile (sm: 640px), Tablet (md: 768px), Laptop (lg: 1024px), Desktop (xl: 1280px). |
| **Accesibilidad** | WAI-ARIA | Modales con `role="dialog"`, `aria-modal="true"`, foco controlado y atajo `Esc`. |
| **Reducción de Movimiento** | Media query | Respeta `prefers-reduced-motion: reduce`. |
| **Comportamiento de CTA** | Modales activos | Todos los botones abren formularios funcionales con validación y respuesta de éxito. |

---

## 7. Propuestas de Mejora para Versión 2.0

1. **Integración con Servidor de Envío (Email API)**:
   - Conectar el formulario de cotización con un endpoint seguro (Resend, SendGrid o Cloudflare Worker) con validación de captcha y reintentos idempotentes.
2. **Blog Corporativo / Recursos Técnicos**:
   - Módulo de artículos sobre IA, arquitecturas web y casos de éxito en formato Markdown/MDX.
3. **Internacionalización (i18n)**:
   - Soporte multilingüe (Español / Inglés) para expansión internacional.
4. **Telemetría y Analítica de Conversión**:
   - Configuración de eventos de conversión (Google Analytics 4 / Plausible) sin cookies invasivas.
