# Auditoría técnica — SPEFIBER S.A.S. Sitio corporativo

Estado del documento: **en curso** (registro inicial y seguimiento de resoluciones).

- Rama de trabajo: `arena/de47b50a-web-spafiber` (creada desde `main` en `8b7eb12cef57125fd0c35bdd562111458f41d146`).
- Escala de severidad: CRÍTICO / ALTO / MEDIO / BAJO (según el brief de auditoría).
- Estados: **Resuelto**, **Parcial** (corregido en código, pendiente de una dependencia externa), **Pendiente** (requiere decisión o información del propietario), **Verificado sin hallazgo**.

## 1. Línea base (ejecutada el 2026-10-11, Node 22.22.3, npm 10.9.8)

| Comando | Resultado antes de cambios |
| --- | --- |
| `npm ci` | OK — 249 paquetes instalados, `found 0 vulnerabilities` |
| `npm run lint` | OK — sin errores ni advertencias |
| `npm test` | OK — 3 archivos, 7 pruebas aprobadas |
| `npm run build` | OK — `tsc -b` + `vite build`, JS 193,37 kB (gzip 59,71 kB) |
| `npm audit --audit-level=moderate` | OK — `found 0 vulnerabilities` |

Estado Git inicial: árbol de trabajo limpio; HEAD `8b7eb12` igual a `main`; el remoto tiene además `arena/d2cef6fd-web-spafiber` (PR #1 ya fusionado en `main`).

## 2. Matriz de hallazgos

| ID | Severidad | Archivo / ubicación | Evidencia verificable | Causa raíz | Impacto | Corrección | Prueba de regresión | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SPF-001 | ALTO | `src/components/contact/ContactSection.tsx` (líneas de envío) y ausencia de `functions/` o `api/` | El repositorio no contiene ningún receptor; el `fetch` solo apunta a `VITE_CONTACT_ENDPOINT` externo | Integración de cliente sin backend | Las cotizaciones no tienen un destino verificable por defecto | Receptor serverless (`functions/api/contact.ts`) con validación, límites, antispam, rate limiting y entrega por webhook configurado en servidor | `tests/contact-api.test.ts` | Parcial — código listo; falta hosting, webhook y secretos |
| SPF-002 | ALTO | `ContactSection.tsx` (`handleSubmit`) | La única validación está en el navegador; no hay límites de tamaño, honeypot ni límite de peticiones | Validación solo cliente | Abuso y spam sin barrera del lado del servidor | Validación compartida cliente/servidor (`src/lib/contact/validation.ts`) y reglas en el receptor | `tests/contact-validation.test.ts`, `tests/contact-api.test.ts` | Resuelto en código (rate limit por instancia; ver pendientes) |
| SPF-003 | MEDIO | `ContactSection.tsx` (rama `mailto:`) | `VITE_CONTACT_EMAIL` queda en el bundle y el flujo abre el cliente de correo sin confirmar recepción | Alternativa de canal sin control | Exposición de dirección y flujo no verificable | Se elimina el `mailto:` como canal implícito; la recepción solo se confirma con respuesta 202 del servidor | `tests/contact-form.test.tsx` | Resuelto |
| SPF-004 | MEDIO | `ContactSection.tsx` (mensaje de error y panel de canal), `TechnologiesSection.tsx` (`technologies-note`) | Texto visible: "configura VITE_CONTACT_ENDPOINT…" y "Stack de referencia editable…" | Textos de desarrollo copiados a la UI | Filtra detalles internos y transmite inmadurez | Copy corporativo y mensajes comprensibles | `tests/contact-form.test.tsx` (busca ausencia de `VITE_` y "editable") | Resuelto |
| SPF-005 | ALTO | `src/App.tsx` (`handleQuoteSimilar`) y `ProjectDetailModal.tsx` | `onQuoteSimilar(project.title)` se invoca, pero `App` lo ignora (`useCallback(() => setSelectedServiceId('custom'))`) | Callback sin parámetros | El formulario no conserva el proyecto de referencia | Estado `referenceProject` en `App` y chip en el formulario; no se sobrescribe texto escrito | `tests/app.test.tsx` (flujo completo) | Resuelto |
| SPF-006 | MEDIO | `src/App.tsx` (`onClose={() => setActiveProject(null)}`) y `ProjectDetailModal.tsx` (`useEffect` con `onClose` en dependencias) | El efecto se re-ejecuta en cada render del padre: vuelve a capturar el foco y cambia el elemento restaurado | Dependencia inestable | Restauración de foco incorrecta al re-renderizar | `onClose` estabilizado con `useCallback` y referencia mutable en el modal | `tests/modal.test.tsx` | Resuelto |
| SPF-007 | MEDIO | `src/components/layout/Navbar.tsx` | Al cerrar con Escape no se devuelve el foco al botón de menú; al abrir no se mueve el foco al menú | Gestión de foco incompleta | Usuarios de teclado pierden su posición | Foco al primer enlace al abrir; retorno al botón al cerrar | `tests/navigation.test.tsx` | Resuelto |
| SPF-008 | MEDIO | `src/components/contact/ContactSection.tsx` | Formulario sin `aria-invalid` ni `aria-describedby` por campo; el error es un bloque general | Semántica de errores incompleta | Lectores de pantalla no asocian el error al campo | Errores por campo asociados; el mensaje general recibe foco | `tests/contact-form.test.tsx` | Resuelto |
| SPF-009 | MEDIO | `ContactSection.tsx` | Sin `timeout`; `fetch` puede quedar pendiente indefinidamente; sin protección frente a doble envío más allá del botón | Falta de `AbortController` y guardas | Estado de carga infinito y riesgo de duplicados | Timeout de 15 s, guarda `inFlight`, `AbortController` al desmontar | `tests/contact-submit.test.ts` | Resuelto |
| SPF-010 | ALTO | Raíz del repositorio | No existe `.github/workflows` | CI no implementado | Sin validación automática en PRs | Workflow `ci.yml` (lint, typecheck, tests, build, audit) | Ejecución del workflow en PR (pendiente de GitHub Actions) | Parcial — validado localmente, no ejecutado en GitHub aún |
| SPF-011 | MEDIO | `index.html` | `og:image` y `twitter:image` usan rutas relativas (`/hero_composition.webp`); sin `canonical`, `sitemap.xml` ni JSON-LD | Metadatos incompletos; falta dominio confirmado | Vista previa social poco fiable y SEO técnico incompleto | JSON-LD Organization con datos verificados (nombre, sector); URLs absolutas pendientes de dominio | Revisión de `index.html` en `tests/seo.test.ts` | Parcial — pendiente de dominio |
| SPF-012 | MEDIO | `public/_headers` | Archivo en formato Netlify/Cloudflare Pages; no hay evidencia de que el hosting lo aplique | Hosting no confirmado | CSP y cabeceras podrían no estar activas | Documentado y verificable tras despliegue (`docs/DEPLOYMENT.md`); CSP ajustado a `connect-src 'self'` | Comprobación manual con `curl -I` en el despliegue | Pendiente — verificación tras despliegue |
| SPF-013 | MEDIO | `ContactSection.tsx` | No hay consentimiento explícito de tratamiento de datos; el enlace a privacidad solo aparece si se configura | Requisito legal no implementado | Riesgo de cumplimiento al recopilar datos personales | Casilla de consentimiento obligatoria; el servidor la exige | `tests/contact-validation.test.ts` | Parcial — texto legal pendiente de revisión jurídica |
| SPF-014 | MEDIO | `src/data/technologies.ts`, `TechnologiesSection.tsx` | Lista de tecnologías presentada como inventario corporativo sin verificación | Afirmación no verificada | Riesgo de declarar capacidades no confirmadas | Encabezado y texto reformulados como enfoque; lista pendiente de confirmación del propietario | Revisión de copy | Parcial — confirmar lista |
| SPF-015 | BAJO | `src/components/hero/HeroSection.tsx` | Imagen LCP sin `fetchpriority="high"` | Atributo omitido | Posible retraso del LCP | Añadido `fetchpriority="high"` | Revisión de marcado | Resuelto |
| SPF-016 | BAJO | `src/assets/*.png`, `logo_Spafiber.png`, `BOSETO_LADING.png` | Varios PNG grandes (1,7–2 MB) no referenciados desde el código | Activos no optimizados o de origen | Peso del repositorio; no afecta a la carga porque no se importan | No eliminados: son fuentes de identidad visual que requieren confirmación del propietario | Búsqueda de referencias (`grep`) | Pendiente — decisión del propietario |
| SPF-017 | MEDIO | `tests/` | No hay pruebas E2E; `tsconfig` no tipa `tests/` ni `functions/` | Cobertura incompleta | Regresiones no detectadas en flujos reales | Pruebas unitarias/integración ampliadas; typecheck de `functions/` | `npm run typecheck` | Parcial — E2E pendiente de navegadores |
| SPF-018 | BAJO | `ContactSection.tsx` | Decisión de tiempo de respuesta ("depende del canal") sin compromiso definido | Contenido pendiente | Expectativa ambigua | Texto neutral; SLA pendiente de decisión comercial | — | Pendiente — decisión comercial |

### Verificado sin hallazgo

- `npm audit --audit-level=moderate`: 0 vulnerabilidades (línea base y tras cambios; ver §5).
- Ausencia de secretos en el repositorio: `.env` excluido en `.gitignore`; `.env.example` solo contiene variables vacías.
- Ausencia de `dangerouslySetInnerHTML` y de `innerHTML` en `src/`.
- `prefers-reduced-motion` y `scroll-behavior` ya tratados en `src/styles/index.css`.
- Menú móvil cerrado: `visibility: hidden` evita foco en enlaces ocultos.
- Enlaces `target="_blank"` con `rel="noopener noreferrer"`.
- Redes sociales: solo se muestran si se configuran URLs HTTPS verificadas.
