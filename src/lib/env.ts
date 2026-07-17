export type Environment = "develop" | "stg" | "prod";

/**
 * Configuración de entorno separada por contexto de ejecución.
 *
 * Hay DOS fuentes distintas a propósito:
 *
 *   - `NEXT_PUBLIC_ENV`  -> se inyecta en el bundle del NAVEGADOR. Sirve para
 *     lo que el cliente necesita saber (banners de staging, feature flags,
 *     logging en cliente). Nunca debe usar para decisiones de seguridad.
 *
 *   - `ENV`              -> SOLO servidor (server actions, middleware, auth).
 *     Es la fuente para cualquier decisión que afecte la seguridad
 *     (cookie `secure`, bypass de auth, mocks de auth).
 *
 * Separarlas evita que una variable pública parezca controlar el comportamiento
 * de seguridad del servidor, aunque en la práctica tengan el mismo valor.
 *
 *   develop -> mocks (dev-store en cliente + getMockResponse en servidor)
 *   stg/prod -> API real (NEXT_PUBLIC_API_URL)
 */

/**
 * Entorno del NAVEGADOR. Usar solo para cosmetics del cliente (banners,
 * flags). No usar para decisiones de seguridad ni para elegir mocks.
 */
export function getClientEnv(): Environment | undefined {
  const env = process.env.NEXT_PUBLIC_ENV;
  return env === "develop" || env === "stg" || env === "prod" ? env : undefined;
}

/**
 * True cuando el backend real está apagado y se usan mocks.
 *
 * Fail-safe: si `ENV` falta o es inválido, devuelve `false` (API real),
 * de modo que nunca se arranca en modo mock por accidente en producción.
 */
export function isMockMode(): boolean {
  return process.env.ENV === "develop";
}

export function getApiUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_API_URL;
}
