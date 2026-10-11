// Adaptador para Cloudflare Pages Functions: POST /api/contact.
// La lógica vive en server/contact/handler.ts para poder probarla sin la plataforma.
import { handleContactRequest, type ContactEnv } from '../../server/contact/handler';
import { createMemoryRateLimiter } from '../../server/contact/rateLimit';

const rateLimiter = createMemoryRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

export const onRequest = (context: { request: Request; env: ContactEnv }) =>
  handleContactRequest(context.request, context.env, {
    rateLimiter,
    log: (event, details) => console.warn(JSON.stringify({ event, ...details })),
  });
