// Límite de peticiones por clave (IP) con ventana fija.
// Limitación conocida: el estado vive en memoria de la instancia. En producción debe
// complementarse con reglas de rate limiting de la plataforma (ver docs/DEPLOYMENT.md).

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

export interface RateLimiter {
  check(key: string, now: number): RateLimitResult;
}

export interface RateLimiterOptions {
  limit?: number;
  windowMs?: number;
  maxKeys?: number;
}

export function createMemoryRateLimiter(options: RateLimiterOptions = {}): RateLimiter {
  const limit = options.limit ?? 5;
  const windowMs = options.windowMs ?? 10 * 60 * 1000;
  const maxKeys = options.maxKeys ?? 10_000;
  const windows = new Map<string, { count: number; resetAt: number }>();

  const prune = (now: number) => {
    for (const [key, entry] of windows) {
      if (entry.resetAt <= now) windows.delete(key);
    }
  };

  return {
    check(key, now) {
      if (windows.size >= maxKeys) prune(now);

      const current = windows.get(key);
      if (!current || current.resetAt <= now) {
        windows.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true };
      }

      if (current.count >= limit) {
        return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)) };
      }

      current.count += 1;
      return { allowed: true };
    },
  };
}
