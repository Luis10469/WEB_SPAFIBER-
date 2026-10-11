# Despliegue, configuración y rollback

> Estado: **no desplegado**. Este documento describe el procedimiento. El despliegue a producción requiere aprobación del propietario.

## 1. Hosting recomendado y justificación

**Cloudflare Pages** (sitio estático + Pages Functions):

- Sirve `dist/` y ejecuta `functions/api/contact.ts` en el mismo origen, por lo que el formulario no requiere CORS.
- Lee `public/_headers` (copiado a `dist/_headers` por Vite).
- Ofrece compresión, HTTPS y reglas de rate limiting a nivel de plataforma.

Alternativa equivalente: Netlify (Functions en `netlify/functions` y `_headers` compatible), con un adaptador similar. El núcleo (`server/contact/handler.ts`) no depende de la plataforma.

Dominio: **pendiente**. No se configuran URLs canónicas, `sitemap.xml` ni URLs absolutas de Open Graph hasta confirmar el dominio corporativo.

## 2. Configuración del proyecto en el hosting

| Ajuste | Valor |
| --- | --- |
| Comando de build | `npm run build` |
| Directorio de salida | `dist` |
| Versión de Node | 22 (fijar en la configuración del proveedor) |
| Rama de producción | `main`, **solo tras aprobación y fusión del PR** |
| Vistas previas | Pull Requests (preview deployments), sin acceso a secretos de producción |

## 3. Secretos y variables

Configurar en el panel del proveedor (no en Git):

| Nombre | Tipo | Requisito |
| --- | --- | --- |
| `CONTACT_WEBHOOK_URL` | Secreto | HTTPS. Destino real de las solicitudes. **Sin esta variable el formulario no acepta envíos** (responde 503). |
| `CONTACT_WEBHOOK_TOKEN` | Secreto | Opcional; recomendado. |
| `CONTACT_ALLOWED_ORIGINS` | Variable | Opcional; orígenes adicionales. |
| `VITE_*` | Variables de build | Públicas; ver `.env.example`. |

Nunca registrar, imprimir ni commitear valores de estas variables. Rotar el token si se sospecha exposición.

## 4. Requisitos previos a producción

- [ ] Destino del webhook definido y probado en *staging* (una solicitud de prueba con datos ficticios).
- [ ] Política de privacidad publicada (`VITE_PRIVACY_URL`) y aprobada jurídicamente.
- [ ] Términos de servicio publicados (`VITE_TERMS_URL`), si aplica.
- [ ] Rangos presupuestarios y plazos confirmados comercialmente (`src/data/contactOptions.ts`).
- [ ] Dominio confirmado; añadir `canonical`, `og:url`, URLs absolutas de imagen social y `sitemap.xml`.
- [ ] Lista de tecnologías confirmada (`src/data/technologies.ts`).
- [ ] Decisión sobre antispam adicional (p. ej. Cloudflare Turnstile) si aparece spam pese a honeypot y rate limit.
- [ ] Reglas de rate limiting en la plataforma para `/api/contact` (complementan el límite en memoria).
- [ ] Pruebas E2E en verde en el job `e2e` del último PR.

## 5. Verificación de cabeceras tras cada despliegue

```bash
curl -sI https://<dominio>/ | grep -iE "content-security-policy|x-frame-options|x-content-type-options|referrer-policy|permissions-policy"
curl -sI https://<dominio>/assets/<archivo-hash>.js | grep -i cache-control
```

Si las cabeceras no aparecen, el proveedor no está aplicando `public/_headers`: **las protecciones no están activas** y debe corregirse antes de publicar.

Comprobar también el receptor sin datos reales:

```bash
# Debe responder 403 (origen no permitido)
curl -s -o /dev/null -w "%{http_code}\n" -X POST https://<dominio>/api/contact -H "Content-Type: application/json" -d '{}'
# Debe responder 405 (método no permitido)
curl -s -o /dev/null -w "%{http_code}\n" https://<dominio>/api/contact
```

## 6. Procedimiento de despliegue

1. Abrir Pull Request desde la rama de trabajo hacia `main`.
2. Esperar a que el workflow **CI** (`lint`, `typecheck`, `test`, `build`, `audit`, `e2e`) esté en verde.
3. Revisar el *preview deployment* y ejecutar la lista de la sección 4 en *staging*.
4. Obtener la aprobación del propietario.
5. Fusionar el PR (**merge manual**; no hay fusión automática).
6. Confirmar el despliegue de producción y ejecutar la verificación de la sección 5.

## 7. Rollback

- **Frontend**: en el proveedor, reactivar el despliegue anterior ("Rollback" o "Promote" de un despliegue previo). Es instantáneo y no altera datos.
- **Código**: revertir el commit con `git revert <sha>` en una rama nueva y abrir PR; no reescribir `main`.
- **Receptor**: el mismo mecanismo que el frontend (las funciones forman parte del despliegue). Si el problema es el webhook, cambiar `CONTACT_WEBHOOK_URL` al destino de respaldo; el formulario responderá 503 mientras no haya destino válido, sin perder los datos del visitante, que permanecen en el formulario.
- Tras el rollback, repetir la verificación de la sección 5.

## 8. Operación y monitorización

- Los eventos del receptor se registran en JSON sin datos personales (`origin-rejected`, `rate-limited`, `timing-rejected`, `delivery-not-configured`, `delivery-failed`, `delivery-timeout`, `delivery-error`).
- Revisar periódicamente el volumen de respuestas 429 y 403 para detectar abuso.
- Revisar `npm audit` mensualmente y tras cada actualización de dependencias.
