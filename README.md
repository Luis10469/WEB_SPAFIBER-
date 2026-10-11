# SPEFIBER S.A.S. — sitio web corporativo (v2)

Sitio corporativo de **SPEFIBER S.A.S.**, empresa de ingeniería de software y soluciones digitales: desarrollo web, aplicaciones móviles, inteligencia artificial, automatización, backend/APIs y software empresarial.

> SPEFIBER no es proveedor de Wi-Fi, fibra óptica ni telecomunicaciones. El contenido, las imágenes y el código de este repositorio se limitan a software y soluciones digitales.

Documentos relacionados:

- [`docs/AUDITORIA.md`](docs/AUDITORIA.md) — hallazgos, severidad, evidencia, resolución y resultados de validación.
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — despliegue, configuración de secretos, verificación de cabeceras y rollback.

## 1. Arquitectura

```text
Navegador (SPA React + Vite)            Servidor (Cloudflare Pages Functions)
─────────────────────────────           ─────────────────────────────────────
src/                                    functions/api/contact.ts   ← adaptador HTTP
 ├─ components/  (secciones y UI)       server/contact/
 ├─ data/        (contenido editable)     ├─ handler.ts   validación, origen, límites,
 ├─ lib/contact/                         │                antispam, webhook con timeout
 │   ├─ validation.ts  ← reglas únicas   └─ rateLimit.ts  límite por IP (ventana fija)
 │   └─ submitContact.ts ← cliente (timeout, cancelación)
 └─ styles/index.css (tokens y estados)  POST /api/contact → 202 solo si se entregó
```

- **Frontend**: una única página con anclas (sin router). Componentes funcionales tipados, sin estado global.
- **Validación compartida**: `src/lib/contact/validation.ts` se usa en el navegador (retroalimentación inmediata) y en el servidor (fuente de verdad). Ningún dato del cliente se confía sin validar.
- **Receptor**: `server/contact/handler.ts` usa APIs Web estándar (`Request`/`Response`); es portable a Cloudflare Pages, Netlify o Node 18+. La adaptación elegida es Cloudflare Pages Functions (ver `docs/DEPLOYMENT.md`).
- **Sin dependencias de runtime nuevas**: solo `react`, `react-dom` y `lucide-react`.

## 2. Tecnologías

| Área | Tecnología |
| --- | --- |
| UI | React 18, TypeScript (estricto) |
| Build | Vite 6, `tsc -b` |
| Estilos | CSS con tokens (variables) en `src/styles/index.css` |
| Iconos | lucide-react (tree-shaken) |
| Pruebas unitarias/integración | Vitest 5, Testing Library, jsdom |
| Pruebas E2E | Playwright (ejecutadas en CI) |
| Calidad | ESLint 10 + typescript-eslint, react-hooks |
| Receptor | Cloudflare Pages Functions (Web APIs estándar) |

## 3. Requisitos

- Node.js **22** (LTS; el proyecto se valida con Node 22.22). Mínimo práctico: Node 20.
- npm 10+.
- Para E2E: navegadores de Playwright (`npx playwright install chromium`).

## 4. Instalación y ejecución local

```bash
npm ci
npm run dev          # http://localhost:3000 (escucha en 0.0.0.0)
```

El formulario envía a `/api/contact`. En `npm run dev` ese endpoint **no existe** (solo lo sirve la plataforma de hosting), por lo que el envío mostrará el mensaje de «no pudo registrarse». Para probar el receptor, consulta la sección de pruebas (`tests/contact-api.test.ts`).

## 5. Variables de entorno

Copia `.env.example` a `.env.local` (excluido de Git) para desarrollo.

**Públicas** (`VITE_*`, se incluyen en el bundle; nunca poner secretos):

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `VITE_CONTACT_ENDPOINT` | No | Endpoint alternativo: ruta del mismo origen o URL HTTPS con CORS. Por defecto `/api/contact`. |
| `VITE_CONTACT_EMAIL` | No | Correo corporativo verificado que se muestra en el pie. |
| `VITE_SOCIAL_LINKEDIN` / `_INSTAGRAM` / `_GITHUB` / `_YOUTUBE` | No | Solo se muestran si son URLs HTTPS verificadas. |
| `VITE_PRIVACY_URL` / `VITE_TERMS_URL` | No | Enlaces legales publicados y aprobados. |

**Servidor** (solo en el panel del hosting; nunca en Git):

| Variable | Obligatoria | Uso |
| --- | --- | --- |
| `CONTACT_WEBHOOK_URL` | **Sí, para aceptar solicitudes** | URL HTTPS del sistema que recibe las solicitudes (CRM, helpdesk o automatización). Sin ella el receptor responde 503 y **no confirma** la recepción. |
| `CONTACT_WEBHOOK_TOKEN` | Recomendada | Token Bearer enviado al webhook. |
| `CONTACT_ALLOWED_ORIGINS` | No | Orígenes adicionales permitidos (p. ej. `https://www.dominio.tld`). |

## 6. Configuración comercial

- **Formulario de cotización** (`src/components/contact/ContactForm.tsx`): tipo de proyecto, plataforma, objetivo, funcionalidades prioritarias, plazo, rango orientativo opcional, descripción y datos de contacto. Incluye revisión previa y consentimiento.
- **Rangos presupuestarios** (`src/data/contactOptions.ts`): son **placeholders orientativos** en USD que deben confirmarse comercialmente antes de publicarse. No constituyen precios ni ofertas.
- **Servicios** (`src/data/services.ts`), **proyectos** (`src/data/projects.ts`, marcados como conceptos demostrativos), **tecnologías** (`src/data/technologies.ts`, pendiente de confirmación) y **datos de empresa** (`src/data/company.ts`).
- Para publicar un caso real: añadir una entrada en `projects.ts` con `isDemoReference: false`, un `status` veraz y capturas autorizadas. El modal ya soporta descripción, objetivo (`scenario`), tecnologías, estado y demostración (`demoUrl`).

## 7. Pruebas y validación

```bash
npm run lint         # ESLint
npm run typecheck    # TypeScript: src, server y functions
npm test             # Vitest (unitarias, integración de componentes y del receptor)
npm run build        # typecheck + build de producción
npm audit --audit-level=moderate
npm run test:e2e     # Playwright (requiere navegadores instalados)
```

Cobertura actual:

- **Validación** (`tests/contact-validation.test.ts`): límites, formatos, listas cerradas, consentimiento, campo trampa.
- **Cliente de envío** (`tests/contact-submit.test.ts`): solo 202 confirma; timeout, cancelación, red, 429, 5xx.
- **Receptor** (`tests/contact-api.test.ts`): método, origen, Content-Type, tamaño, JSON, tiempo mínimo de llenado, rate limit, webhook no configurado, fallo y timeout del webhook.
- **Componentes** (`tests/contact.test.tsx`, `tests/modal.test.tsx`, `tests/navigation.test.tsx`, `tests/app.test.tsx`): revisión, errores por campo, doble envío, pérdida de datos, foco en modales y menú, proyecto de referencia.
- **SEO e identidad** (`tests/seo-and-identity.test.ts`).
- **E2E** (`e2e/`): navegación, formulario (incluido error de red), modal con teclado y menú móvil en resolución móvil.

Las pruebas E2E se ejecutan en el job `e2e` de GitHub Actions. Para ejecutarlas localmente con un Chromium ya instalado, define `PLAYWRIGHT_CHROMIUM_PATH=/ruta/a/chromium` antes de `npm run test:e2e`. Estado de ejecución: `docs/AUDITORIA.md` §7.

## 8. Seguridad

- Secretos únicamente en el servidor (variables del hosting); el bundle solo contiene variables `VITE_` públicas.
- Receptor: origen obligatorio y coincidente, `Content-Type` JSON, máximo 16 KB, validación completa server-side, honeypot, tiempo mínimo de llenado (2 s), rate limit por IP (5 solicitudes / 10 min), `redirect: 'error'`, timeout de 8 s hacia el webhook, respuestas genéricas sin eco de datos.
- Cabeceras en `public/_headers`: CSP estricta (`script-src 'self'`, `connect-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`), `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`, COOP/CORP.
- Sin `dangerouslySetInnerHTML` ni `innerHTML`. Enlaces externos con `rel="noopener noreferrer"`.
- Limitaciones y pendientes: ver `docs/AUDITORIA.md` §5.

## 9. Accesibilidad

Objetivo de referencia: **WCAG 2.2 AA**. Implementado: enlace de salto, foco visible, cierre con Escape, foco atrapado y restaurado en el modal, retorno de foco en el menú móvil, errores asociados a campos (`aria-invalid`, `aria-describedby`), etiquetas visibles, `prefers-reduced-motion`. **No se afirma conformidad**: no se ha realizado una auditoría con lectores de pantalla ni medición de contraste automatizada en navegador.

## 10. Despliegue

Ver [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md): hosting recomendado, variables, verificación de cabeceras, CI y procedimiento de rollback. **No se ha desplegado ningún entorno de producción** desde este repositorio.

## 11. Consideraciones legales pendientes

Antes de recopilar datos de visitantes en producción, el propietario debe:

1. Publicar la **política de privacidad** y enlazarla con `VITE_PRIVACY_URL` (la casilla de consentimiento la referencia).
2. Definir el **responsable del tratamiento**, la finalidad, el plazo de conservación y los medios para ejercer derechos (en el marco aplicable, p. ej. Ley 1581 de 2012 de Colombia). *Pendiente de revisión jurídica.*
3. Confirmar los **términos de servicio** (`VITE_TERMS_URL`) y las condiciones de los rangos orientativos.
4. Confirmar los **datos de identidad** (dirección, NIT, representante) si se publican.

## 12. Mantenimiento

- Mantener `npm audit` en verde; actualizar dependencias por lotes y verificar con `npm test` y `npm run build`.
- Nuevas tecnologías, casos o certificaciones solo se publican con evidencia verificada.
- Antes de cambiar el receptor, actualizar `server/contact/handler.ts`, sus pruebas y `docs/DEPLOYMENT.md`.

## Estructura

```text
.github/workflows/ci.yml     CI en Pull Requests (lint, typecheck, test, build, audit, E2E)
docs/                        Auditoría y guía de despliegue
e2e/                         Pruebas Playwright
functions/api/contact.ts     Adaptador del receptor (Cloudflare Pages Functions)
public/_headers              Cabeceras de seguridad y caché
server/contact/              Lógica del receptor y límite de peticiones
src/                         Aplicación React
tests/                       Pruebas unitarias e integración (Vitest)
```
