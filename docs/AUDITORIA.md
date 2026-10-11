# Auditoría técnica — SPEFIBER S.A.S. Sitio corporativo (V2)

- Rama de trabajo: `arena/de47b50a-web-spafiber` (creada desde `main` en `8b7eb12cef57125fd0c35bdd562111458f41d146`).
- Fecha de la auditoría y verificación: 2026-10-11.
- Entorno: Node 22.22.3, npm 10.9.8, Linux. **Sin navegador disponible** (ver §7).
- Escala de severidad: CRÍTICO / ALTO / MEDIO / BAJO.
- Estados: **Resuelto** (corregido y verificado por pruebas o revisión de código), **Parcial** (corregido en código; falta una dependencia externa), **Pendiente** (requiere decisión o información del propietario), **Verificado sin hallazgo**.

## 1. Línea base (antes de cualquier cambio)

| Comando | Resultado |
| --- | --- |
| `npm ci` | OK — 249 paquetes, `found 0 vulnerabilities` |
| `npm run lint` | OK — sin errores ni advertencias |
| `npm test` | OK — 3 archivos, 7 pruebas aprobadas |
| `npm run build` | OK — JS 193,37 kB (gzip 59,71 kB); CSS 43,01 kB (gzip 9,50 kB) |
| `npm audit --audit-level=moderate` | OK — `found 0 vulnerabilities` |

Estado Git inicial: árbol limpio; HEAD `8b7eb12` = `main`. El remoto contiene además `arena/d2cef6fd-web-spafiber` (PR #1 ya fusionado en `main`) y `refs/pull/1/head`; no se tocaron.

## 2. Matriz de hallazgos

| ID | Severidad | Archivo / ubicación | Evidencia verificable | Causa raíz | Impacto | Corrección | Prueba de regresión | Estado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SPF-001 | ALTO | `src/components/contact/ContactSection.tsx` (envío); ausencia de receptor en el repo | Antes: el único destino era `VITE_CONTACT_ENDPOINT` externo; no existía `functions/` ni `server/` | Integración solo de cliente | Las cotizaciones no tenían destino verificable | Receptor `functions/api/contact.ts` + `server/contact/handler.ts` que reenvía a un webhook HTTPS configurado en servidor | `tests/contact-api.test.ts` (16 pruebas) | **Parcial** — código y pruebas listos; falta hosting, webhook y secretos |
| SPF-002 | ALTO | `ContactSection.tsx` (`handleSubmit`) | Antes: validación únicamente en el navegador | Validación solo cliente | Abuso y spam sin barrera en servidor | Validación única cliente/servidor (`src/lib/contact/validation.ts`) y reglas en el receptor | `tests/contact-validation.test.ts` (10), `tests/contact-api.test.ts` | Resuelto en código (límite en memoria; ver SPF-019) |
| SPF-003 | MEDIO | `ContactSection.tsx` (rama `mailto:`) | Antes: `window.location.href = mailto:…` con la dirección pública del bundle | Canal alternativo sin confirmación de recepción | Exposición de la dirección y flujo no verificable | Eliminado el `mailto:` como canal de envío; la recepción solo se confirma con 202 | `tests/contact.test.tsx` (no hay ruta mailto; el envío requiere 202) | Resuelto |
| SPF-004 | MEDIO | `ContactSection.tsx` (mensaje de error y panel de canal); `TechnologiesSection.tsx` | Antes: texto visible «configura VITE_CONTACT_ENDPOINT…» y «Stack de referencia editable…» | Textos de desarrollo en la UI | Expone detalles internos y transmite inmadurez | Copy corporativo; mensajes de error comprensibles | `tests/app.test.tsx` y `tests/contact.test.tsx` (texto renderizado sin `VITE_` ni «editable») | Resuelto |
| SPF-005 | ALTO | `src/App.tsx` (`handleQuoteSimilar`); `ProjectDetailModal.tsx` | Antes: `onQuoteSimilar(project.title)` y `App` ignoraba el argumento | Callback sin parámetros útiles | El formulario no conservaba el proyecto de referencia | Estado `referenceProject` en `App`; chip removible en el formulario; no se sobrescribe texto escrito | `tests/app.test.tsx` (flujo completo); `e2e/landing.spec.ts` | Resuelto |
| SPF-006 | MEDIO | `src/App.tsx` (`onClose` inline) y `ProjectDetailModal.tsx` (efecto con `onClose` en dependencias) | El efecto se re-ejecutaba en cada render del padre y recapturaba el elemento de foco | Dependencia inestable | Restauración de foco incorrecta | `onClose` en `ref`; `App` usa `useCallback`; el efecto depende solo de `project` | `tests/modal.test.tsx` (3 pruebas) | Resuelto |
| SPF-007 | MEDIO | `src/components/layout/Navbar.tsx` | Antes: Escape cerraba sin devolver el foco; al abrir, el foco no entraba en el menú | Gestión de foco incompleta | Usuarios de teclado pierden su posición | Foco al primer enlace al abrir; Escape devuelve el foco al botón | `tests/navigation.test.tsx`; `e2e/mobile-navigation.spec.ts` | Resuelto (E2E pendiente de ejecución; ver SPF-020) |
| SPF-008 | MEDIO | `ContactSection.tsx` | Antes: error general sin `aria-invalid` ni `aria-describedby` por campo | Semántica de errores incompleta | Lectores de pantalla no asocian el error al campo | Errores por campo asociados; el foco va al primer campo con error | `tests/contact.test.tsx` (`toHaveAccessibleDescription`) | Resuelto |
| SPF-009 | MEDIO | `ContactSection.tsx` | Antes: sin timeout ni cancelación; doble envío solo evitado por el botón | Falta de `AbortController` y guardas | Estado de carga indefinido; riesgo de duplicados | Timeout 15 s; guarda `inFlight`; cancelación al desmontar | `tests/contact-submit.test.ts`; `tests/contact.test.tsx` (doble clic) | Resuelto |
| SPF-010 | ALTO | Raíz del repositorio | Antes: no existía `.github/` | CI no implementada | Sin validación automática en PRs | `.github/workflows/ci.yml`: `npm ci`, lint, typecheck, test, build, audit y job E2E | Ejecución del workflow en el PR | **Parcial** — validado localmente; pendiente de ejecución en GitHub Actions |
| SPF-011 | MEDIO | `index.html` | Antes: `og:image`/`twitter:image` relativos (`/hero_composition.webp`); sin JSON-LD | Metadatos incompletos; dominio no confirmado | Vista previa social poco fiable; SEO técnico incompleto | JSON-LD Organization con datos del repositorio (nombre legal, sector, descripción) | `tests/seo-and-identity.test.ts` | **Parcial** — `canonical`, `sitemap.xml` y URLs absolutas pendientes del dominio |
| SPF-012 | MEDIO | `public/_headers` | Archivo en formato Netlify/Cloudflare Pages; sin verificación de aplicación | Hosting no confirmado | CSP y cabeceras podrían no estar activas | CSP reforzada (sin `mailto:`), COOP/CORP, caché inmutable para `/assets/*`; procedimiento de verificación con `curl` | Verificación manual tras despliegue (`docs/DEPLOYMENT.md` §5) | **Pendiente** — verificar tras despliegue |
| SPF-013 | MEDIO | `ContactForm.tsx` | Antes: no había consentimiento explícito | Requisito de tratamiento de datos no implementado | Riesgo de cumplimiento al recopilar datos personales | Casilla obligatoria; el servidor la exige (`consent === true`); enlace a privacidad si `VITE_PRIVACY_URL` existe | `tests/contact-validation.test.ts`; `tests/contact.test.tsx` | **Parcial** — política de privacidad pendiente de publicación y revisión jurídica |
| SPF-014 | MEDIO | `src/data/technologies.ts`; `TechnologiesSection.tsx` | Lista de tecnologías presentada como inventario sin verificación | Afirmación no verificada | Riesgo de declarar capacidades no confirmadas | Eliminado el párrafo que la presentaba como catálogo; comentario de pendiente en el dato | Revisión de copy | **Pendiente** — confirmar la lista con el equipo |
| SPF-015 | BAJO | `src/components/hero/HeroSection.tsx` | Antes: imagen LCP sin prioridad explícita | Atributo omitido | Posible retraso del LCP | `fetchPriority="high"` | Build y revisión de marcado | Resuelto (medición de LCP pendiente; ver §6) |
| SPF-016 | BAJO | `src/assets/*.png`, `logo_Spafiber.png`, `BOSETO_LADING.png` | Activos de 1,7–2 MB sin referencias en código (`grep`) | Fuentes de identidad sin optimizar | Peso del repositorio; no afecta la carga porque no se importan | **No eliminados**: son fuentes de la identidad visual y requieren confirmación del propietario | `grep -rn` sobre `src/` | **Pendiente** — decisión del propietario |
| SPF-017 | MEDIO | `tests/`, `tsconfig` | Antes: sin typecheck de `functions/`, sin E2E | Cobertura incompleta | Regresiones no detectadas | Typecheck de `server/`, `functions/` y `src/lib` (`npm run typecheck`); 63 pruebas de Vitest; 18 pruebas Playwright | `npm run typecheck`, `npm test` | Resuelto (E2E pendiente de ejecución; ver SPF-020) |
| SPF-018 | BAJO | `ContactForm.tsx`, `ContactSection.tsx` | Antes: «El tiempo de respuesta depende del canal» sin compromiso | Contenido pendiente | Expectativa ambigua | Texto neutral; no se promete plazo de respuesta | Revisión de copy | **Pendiente** — SLA comercial |
| SPF-019 | MEDIO | `server/contact/rateLimit.ts` | Límite de 5 solicitudes / 10 min **en memoria de la instancia** | Las instancias serverless no comparten memoria | El límite es parcial; un atacante distribuido puede superarlo | Documentado; se recomienda reglas de rate limiting del proveedor | `tests/contact-api.test.ts` (límite por IP) | **Pendiente** — configurar reglas en la plataforma |
| SPF-020 | MEDIO | `e2e/`, `playwright.config.ts` | Playwright no puede descargar navegadores en el entorno de desarrollo (CDN fuera de los hosts permitidos) | Limitación del entorno | Las pruebas E2E no se han ejecutado | Ejecutadas en el job `e2e` de CI (`npx playwright install --with-deps chromium`); `npx playwright test --list` valida la carga de las 18 pruebas | Job `e2e` en GitHub Actions | **Pendiente** — ejecutar en CI y confirmar |
| SPF-021 | BAJO | Bundle de producción | JS +14,3 kB (raw) y CSS +4,3 kB por el formulario, la revisión y los estados | Funcionalidad nueva | Ligero incremento de transferencia (gzip +3,8 kB JS, +0,9 kB CSS) | Aceptable; el formulario se mantiene en el mismo chunk. Posible lazy-load futuro | Medición de build (§6) | Aceptado |
| SPF-022 | MEDIO | `index.html`, `public/robots.txt`, `src/` | Sin `sitemap.xml`, `canonical` ni `og:url` | Dominio no confirmado | Indexación y previsualizaciones incompletas | No se generan URLs ficticias | — | **Pendiente** — dominio corporativo |

### Verificado sin hallazgo

- `npm audit --audit-level=moderate`: 0 vulnerabilidades en la línea base y después de los cambios (incluido `@playwright/test`).
- Secretos: ninguna credencial literal en `src/`, `server/`, `functions/`, `tests/` (búsqueda con patrones `api_key|secret|token|password`). `.env` excluido en `.gitignore`; `.env.example` sin valores.
- Ausencia de `dangerouslySetInnerHTML` e `innerHTML` en `src/`.
- Scripts inline: el único bloque `<script>` extra es JSON-LD (`application/ld+json`), que no es ejecutable y no lo bloquea `script-src 'self'`.
- Sin atributos `style="..."` en el HTML generado: compatible con `style-src 'self'`.
- Menú móvil cerrado: `visibility: hidden` y `aria-hidden` impiden foco y lectura de enlaces ocultos.
- Enlaces `target="_blank"` con `rel="noopener noreferrer"`.
- Redes sociales: solo se muestran si hay URLs HTTPS configuradas.
- Preferencias de movimiento: `prefers-reduced-motion` ya presente en `index.css`.
- Identidad: ninguna cadena de la interfaz menciona Wi-Fi, fibra óptica ni telecomunicaciones (prueba `tests/seo-and-identity.test.ts`).
- Logo: no se reemplazó ni se modificó ningún archivo de imagen (`git diff main` no contiene binarios).

## 3. Correcciones realizadas (por commit)

| Commit | Contenido |
| --- | --- |
| `d16872a` | Registro inicial de la auditoría (este documento, versión inicial) |
| `0ec9538` | Validación compartida, cliente de envío con timeout y receptor serverless (`server/contact/`, `functions/api/contact.ts`) |
| `349d6f5` | Formulario de cotización completo: campos, revisión, errores por campo, consentimiento, honeypot, estados |
| `d9a19b8` | Proyecto de referencia que pasa al formulario; modal sin dependencia inestable; foco al formulario |
| `f10f91d` | Foco del menú móvil (apertura y Escape) |
| `ad3111f` | Copy corporativo, `fetchPriority`, JSON-LD, pruebas de identidad |
| `afb2437` | Typecheck de servidor integrado en build y lint |
| `8ce8f34` | Workflow de CI, cabeceras y pruebas Playwright |
| `69eb2e7` | README, guía de despliegue y rollback |
| `f2a0d07` | Eliminación del límite de antigüedad del formulario (ver nota) |

**Nota sobre `f2a0d07`**: durante la revisión se detectó que el servidor rechazaba formularios con más de 24 h, sin forma de regenerar la marca de tiempo sin recargar la página. Se eliminó ese máximo; se conserva el mínimo de 2 s como heurística.

Archivos principales modificados: `src/components/contact/*` (nuevos: `ContactForm.tsx`, `ContactReview.tsx`, `contactFormState.ts`), `src/lib/contact/*`, `src/data/contactOptions.ts`, `server/contact/*`, `functions/api/contact.ts`, `src/App.tsx`, `src/components/modals/ProjectDetailModal.tsx`, `src/components/layout/Navbar.tsx`, `src/components/technologies/TechnologiesSection.tsx`, `src/components/hero/HeroSection.tsx`, `index.html`, `public/_headers`, `src/styles/index.css`, `package.json`, `eslint.config.js`, `vitest.config.ts`, `.env.example`, `README.md`, `docs/*`, `.github/workflows/ci.yml`, `e2e/*`, `playwright.config.ts`, `tsconfig.server.json`.

## 4. Mejoras visuales — alcance real

Se mantuvo el sistema visual existente (paleta violeta/negra, tipografía, isotipo y logo sin cambios). Lo implementado:

- **Estados de interacción**: foco visible unificado (`--color-focus`), estado `:disabled`, retroalimentación `:active` en botones y tokens de estado (`--color-danger`, `--color-success`, `--elevation-*`).
- **Formulario**: agrupado en «1. Proyecto» y «2. Datos de contacto», con revisión previa y botón de edición; etiquetas y ayudas elevadas a 13 px y 12 px (antes 10 px y 9 px) por legibilidad.
- **Proyecto de referencia**: chip visible con acción de quitar, con foco visible.

**No se realizó un rediseño completo del hero, la navbar ni el footer.** Esa tarea requiere revisión visual en navegador, que no fue posible en este entorno. Queda como trabajo pendiente.

## 5. Seguridad

### Riesgos corregidos

- SPF-001/002: receptor con validación server-side, límite de 16 KB, `Content-Type` JSON, origen obligatorio, honeypot, tiempo mínimo, rate limit por IP, webhook solo por HTTPS, `redirect: 'error'`, timeout y respuestas que no reflejan datos.
- SPF-003: eliminado el canal `mailto:` (exposición de la dirección y falsa sensación de envío).
- SPF-004: eliminada la exposición de nombres de variables y textos internos.
- Rate limit: no se confía en `X-Forwarded-For` (falsificable); se usa solo `CF-Connecting-IP`.
- Cabeceras: CSP sin `mailto:` en `form-action`; `Cross-Origin-Opener-Policy` y `Cross-Origin-Resource-Policy`.
- Registro de eventos sin datos personales.

### Riesgos pendientes

- **SPF-012**: las cabeceras de `public/_headers` solo funcionan si el proveedor las aplica. Verificar tras el despliegue.
- **SPF-019**: el rate limit en memoria es parcial. Configurar reglas en la plataforma.
- **SPF-013**: la casilla de consentimiento enlaza a la política de privacidad solo si `VITE_PRIVACY_URL` existe. Sin política publicada, el consentimiento carece de respaldo documental.
- Sin protección antispam de terceros (p. ej. Turnstile). Recomendada si aparece spam.
- No se ejecutaron pruebas de penetración ni ataques contra servicios externos (prohibido por el brief).

## 6. Rendimiento

**Mediciones reales de build (ejecutadas):**

| Métrica | Antes | Después | Variación |
| --- | --- | --- | --- |
| JS (raw) | 193,37 kB | 207,69 kB | +14,32 kB |
| JS (gzip) | 59,71 kB | 63,48 kB | +3,77 kB |
| CSS (raw) | 43,01 kB | 47,31 kB | +4,30 kB |
| CSS (gzip) | 9,50 kB | 10,38 kB | +0,88 kB |
| Imágenes | sin cambios | sin cambios | — |

**Core Web Vitals (LCP, INP, CLS): no medidos.** Requieren un navegador y un entorno desplegado. Los objetivos (LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1) son objetivos, no resultados.

Optimizaciones aplicadas: `fetchPriority="high"` en la imagen LCP; caché `immutable` para activos con hash; `loading="lazy"` ya presente en tarjetas y CTA. Pendiente: medir LCP en el preview de CI o en staging con Lighthouse; valorar lazy-load del formulario si el incremento de JS preocupa.

## 7. QA

### Ejecuciones reales (instalación limpia, `rm -rf node_modules dist` antes de `npm ci`)

| Comando | Resultado |
| --- | --- |
| `npm ci` | OK — `found 0 vulnerabilities` |
| `npm run lint` | OK — sin errores |
| `npm run typecheck` | OK — `src` (tsc -b) y `server`/`functions`/`src/lib` (tsconfig.server.json) |
| `npm test` | OK — **8 archivos, 63 pruebas aprobadas** |
| `npm run build` | OK — `tsc -b` + `tsc -p tsconfig.server.json` + `vite build` |
| `npm audit --audit-level=moderate` | OK — `found 0 vulnerabilities` |
| `npx playwright test --list` | OK — **18 pruebas listadas** (no ejecutadas) |
| Servidor de preview (`vite preview`) | `/` 200, JS 200, `/_headers` 200; `POST /api/contact` 404 (esperado: solo existe en la plataforma) |

### Pruebas no ejecutadas

- **E2E (Playwright)**: no ejecutadas. El navegador no puede descargarse desde el entorno (SPF-020). Ejecutar en el job `e2e` de CI.
- **Accesibilidad automatizada (axe) y lectores de pantalla**: no ejecutadas.
- **Rendimiento (Lighthouse / CWV)**: no ejecutadas.
- **Pruebas en resoluciones concretas**: cubiertas solo por los proyectos `desktop-chromium` y `mobile-chromium` de Playwright, no ejecutadas.
- **Verificación visual**: no realizada.

### Cobertura de las pruebas unitarias e integración

- Validación: límites, formatos, listas cerradas, consentimiento, campo trampa, control de caracteres.
- Cliente: solo 202 confirma; 400 con campos; 429 con `Retry-After`; 5xx; timeout; red; cancelación.
- Receptor: método, origen, `Content-Type`, tamaño, JSON, tiempo mínimo, rate limit, webhook no configurado, webhook HTTP (no HTTPS), fallo y timeout del webhook, reenvío con token.
- Componentes: revisión, edición sin pérdida, errores por campo, doble envío, error de red, datos conservados, proyecto de referencia, consentimiento, ausencia de textos técnicos.
- Modal: foco inicial, Escape y restauración, control de Tab, no restauración al cotizar.
- Navegación: apertura y cierre, foco al abrir y Escape, menú cerrado oculto.
- SEO e identidad: idioma, descripción, JSON-LD válido, ausencia de datos de contacto inventados, ausencia de referencias a telecomunicaciones.

## 8. GitHub

- Rama de trabajo: `arena/de47b50a-web-spafiber` (la sesión está fijada a este nombre; la rama `improvement/spefiber-corporate-v2` solicitada en el brief no se creó).
- Commits: ver §3.
- Pull Request: ver el resultado de la creación en el informe final (URL real).
- Merge: **no realizado**. Requiere aprobación del propietario.

## 9. Pendientes (decisiones o información del propietario)

1. **Hosting y webhook**: confirmar Cloudflare Pages y definir `CONTACT_WEBHOOK_URL` (CRM, helpdesk o automatización). Sin esto, el formulario no acepta envíos.
2. **Dominio corporativo**: `canonical`, `og:url`, URLs absolutas de imagen social, `sitemap.xml`.
3. **Política de privacidad y términos**: redacción, responsable del tratamiento y revisión jurídica; publicar y configurar `VITE_PRIVACY_URL` y `VITE_TERMS_URL`.
4. **Rangos presupuestarios y plazos**: confirmar valores y moneda (`src/data/contactOptions.ts`). Hoy son orientativos y en USD.
5. **Tecnologías**: confirmar la lista (`src/data/technologies.ts`).
6. **Casos reales de portafolio**: sustituir los conceptos demostrativos cuando existan autorizaciones y resultados verificables.
7. **Activos grandes sin uso**: decidir si se archivan o eliminan los PNG de 1,7–2 MB (SPF-016).
8. **Reglas de rate limiting** en la plataforma (SPF-019).
9. **Antispam adicional** si aparece spam (p. ej. Turnstile; requiere claves del proveedor).
10. **SLA de respuesta** comercial (SPF-018).
11. **Ejecución de E2E y mediciones de CWV** en CI o en staging.
12. **Verificación de cabeceras** tras el despliegue (SPF-012).

## 10. Recomendación de despliegue

**No listo para producción.** Clasificación: **listo con observaciones solo después de completar los pendientes bloqueantes**.

Bloqueantes:

1. Destino del webhook configurado y probado (sin él, el formulario no acepta solicitudes).
2. Política de privacidad publicada y revisada (el formulario recopila datos personales).
3. Ejecución verde del job E2E y de la CI en un Pull Request.
4. Verificación de cabeceras en el dominio desplegado.

No bloqueantes (recomendados antes del lanzamiento): dominio y SEO técnico completo, confirmación de tecnologías y rangos, medición de Core Web Vitals, revisión visual en navegador y auditoría de accesibilidad con herramientas automatizadas y lectores de pantalla.
