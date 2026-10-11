# SPEFIBER S.A.S. — sitio web corporativo

Landing page responsive para SPEFIBER S.A.S., empresa de ingeniería de software, soluciones digitales e innovación tecnológica. El contenido y los recursos visuales se centran en software; no se ofrecen ni se representan servicios de Wi-Fi, fibra óptica o telecomunicaciones.

## Requisitos

- Node.js 20 o superior (el proyecto se validó con Node 22).
- npm.

## Ejecución local

```bash
npm ci
npm run dev
```

Vite escucha en `0.0.0.0:3000`. Para validar el build localmente:

```bash
npm run lint
npm test
npm run build
npm run preview
```

`npm run preview` sirve el build en el puerto 4173. No se configura ni ejecuta un despliegue de producción.

## Estructura

```text
src/
├── assets/                 # Recursos fuente y variantes WebP optimizadas
├── components/
│   ├── about/              # Empresa, metodología y principios
│   ├── contact/            # Formulario comercial y estados reales
│   ├── cta/                # Llamado a la acción
│   ├── hero/               # Propuesta principal e isotipo existente
│   ├── layout/             # Navegación responsive y footer
│   ├── modals/             # Detalle accesible de concepto de proyecto
│   ├── portfolio/          # Tarjetas de proyectos demostrativos
│   ├── services/           # Catálogo de seis servicios
│   ├── technologies/       # Tecnologías de referencia configurables
│   └── ui/                 # Primitivas reutilizables
├── data/                   # Datos de empresa, servicios, proyectos y stack
├── styles/index.css        # Tokens y estilos responsive
├── App.tsx                 # Composición de la landing page
└── main.tsx                # Entrada React
public/
├── _headers                # Ejemplo de cabeceras para hosting compatible
├── favicon.png             # Recorte del isotipo raster existente
├── hero_composition.webp   # Vista previa social
└── robots.txt
```

No se usa React Router: el sitio es una única página y su navegación funciona mediante anclas. Los componentes están separados por módulo; los datos editables viven en `src/data/`. Los estilos emplean tokens CSS para mantener la paleta, superficies, radios, sombras, ritmo, movimiento y puntos de quiebre en un solo sistema.

## Configuración comercial

Copia `.env.example` a `.env.local` y configura solo datos aprobados. `.env.local` está excluido de Git.

### Recepción de cotizaciones

El formulario **no simula envíos**. Por defecto informa que no se ha enviado ni almacenado nada.

Opción recomendada: configurar `VITE_CONTACT_ENDPOINT` con una ruta del mismo origen (por ejemplo, `/api/contact`) o URL HTTPS. La variable `VITE_*` es pública en el bundle: contiene únicamente una dirección de endpoint, nunca secretos. El servicio del servidor debe:

- validar tamaño y contenido de todos los campos;
- comprobar el origen permitido y limitar la tasa de peticiones;
- añadir protección anti-spam adecuada;
- manejar errores sin revelar datos internos;
- evitar registrar información personal innecesaria;
- cumplir los requisitos de tratamiento de datos aplicables.

Solo una respuesta HTTP exitosa del endpoint muestra confirmación de aceptación. Para endpoints HTTPS externos, configura CORS en el servidor y ajusta `connect-src` en `public/_headers` para permitir exactamente ese origen.

Como alternativa, `VITE_CONTACT_EMAIL` abre el cliente de correo del visitante con el mensaje preparado; el usuario todavía debe revisarlo y enviarlo. La página aclara que SPEFIBER no lo ha recibido hasta ese momento. No se incluye una dirección de correo inventada por defecto.

### Redes y enlaces legales

Configura `VITE_SOCIAL_LINKEDIN`, `VITE_SOCIAL_INSTAGRAM`, `VITE_SOCIAL_GITHUB` y `VITE_SOCIAL_YOUTUBE` solo con perfiles corporativos verificados. Las URLs externas no HTTPS se descartan. `VITE_PRIVACY_URL` y `VITE_TERMS_URL` aparecen únicamente cuando se proporcionan rutas locales o enlaces HTTPS reales; no se crean enlaces legales ficticios.

## Contenido editable

- `src/data/services.ts`: los seis servicios, descripciones e iconos.
- `src/data/about.ts`: relato, visión, metodología y pilares.
- `src/data/projects.ts`: nombres, escenarios, descripciones y stacks de los conceptos.
- `src/data/technologies.ts`: inventario de referencia.
- `src/data/company.ts`: identidad de marca y valores opcionales desde variables de entorno.

El portafolio actual está expresamente marcado como **conceptos demostrativos**: no atribuye clientes, trabajo entregado ni resultados a SPEFIBER. Sustituirlos por casos aprobados y capturas de alta resolución antes de publicar un portafolio real. La sección de tecnologías también se identifica como referencia editable y debe validarse con el equipo.

## Identidad visual

La navegación y el pie usan el lockup raster disponible y el hero incorpora la composición metálica existente con la S tridimensional. Se conserva su proporción y no se reemplaza por una letra genérica. El isotipo entregado no es un SVG vectorial; para producción conviene solicitar el arte oficial vectorial, con transparencia, versiones claras/oscuras y variantes de uso pequeño. Las imágenes de proyectos actuales son muestras de baja resolución, no capturas de trabajos aprobados.

## SEO, accesibilidad y seguridad

- HTML en español, título, descripción, Open Graph, Twitter Card, `robots.txt` y favicon.
- No se fija un dominio canónico ni se crea `sitemap.xml` hasta confirmar el dominio oficial. Antes de publicar, convertir la imagen social y los metadatos relativos a URLs absolutas y generar el sitemap del dominio real.
- Navegación por anclas, enlace para saltar al contenido, foco visible, controles con nombre accesible, menú móvil con Escape, diálogo de proyecto con cierre por Escape y gestión básica del foco.
- La animación se limita a transiciones cortas y el CSS respeta `prefers-reduced-motion`.
- `public/_headers` ofrece CSP y cabeceras de seguridad como base para hosting que soporte el formato `_headers`. Revísalo para el proveedor final, especialmente `connect-src` si el endpoint no es del mismo origen.
- No se cargan fuentes de terceros, no hay credenciales ni datos personales de ejemplo y no se persiste el contenido del formulario en el navegador.

## QA ejecutado

| Verificación | Resultado |
|---|---|
| `npm run build` (TypeScript estricto + Vite) | Correcto |
| `npm run lint` (ESLint) | Correcto, sin errores ni advertencias |
| `npm test` (Vitest + Testing Library) | 5 pruebas aprobadas: envío sin configuración, endpoint exitoso, endpoint fallido, validación de email y menú responsive/teclado |
| `npm audit --audit-level=moderate` | 0 vulnerabilidades reportadas |
| `git diff --check` | Correcto |
| Smoke test del servidor Vite y recursos públicos | HTTP 200 para HTML, favicon y arte social |

La matriz de diseño contempla 320, 375, 768, 1024 y 1440 px; no se ejecutó una sesión automatizada de navegador real, ni una auditoría axe/WCAG, ni mediciones de Core Web Vitals. Por eso no se afirma conformidad WCAG 2.2 AA ni resultados LCP/INP/CLS: deben verificarse en los navegadores y el hosting finales.

El build produce aproximadamente 193 kB de JavaScript (60 kB gzip), 43 kB de CSS (9.5 kB gzip) y recursos WebP optimizados para el hero, CTA y tarjetas. Son tamaños de artefacto, no mediciones de rendimiento de usuario real.

## Siguiente iteración antes de producción

1. Recibir y validar el SVG oficial del isotipo y los logos corporativos.
2. Confirmar dominio, correo, redes, enlaces legales y política de privacidad.
3. Conectar y probar un endpoint real con controles server-side; probar también errores, rate limiting y protección anti-spam.
4. Sustituir conceptos y recursos de ejemplo por proyectos/capturas aprobados.
5. Confirmar la lista de tecnologías con SPEFIBER.
6. Ejecutar pruebas E2E con Playwright, auditoría automatizada de accesibilidad y Lighthouse/CWV en los breakpoints y navegadores objetivo.
7. Ajustar metadatos, sitemap, robots y cabeceras al proveedor de despliegue elegido.

## Deploy

El repositorio queda preparado para generar estáticos con `npm run build`; los archivos resultantes quedan en `dist/`. No se ha desplegado ni modificado infraestructura de producción. Verifica las variables, CSP, políticas de datos y URLs de SEO antes de publicar.
