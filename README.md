# Socios Frontend

Next.js 16 + React 19 + Tailwind v4 + Material Design 3.

## Entornos

El proyecto soporta **tres instancias** (`develop` / `stg` / `prod`). La configuración de entorno está separada en **dos fuentes** según quién la consuma:

| Variable             | Dónde vive                          | Quién la lee                        | Uso                                               |
|----------------------|-------------------------------------|-------------------------------------|---------------------------------------------------|
| `NEXT_PUBLIC_ENV`    | Bundle del navegador + servidor     | Cliente (banners, flags cosméticos) | Identificar entorno en la UI                      |
| `ENV`                | **Solo servidor** (server-only)     | Server Actions, middleware, auth    | **Decisiones de seguridad**: cookie `secure`, mocks, bypass de auth |
| `NEXT_PUBLIC_API_URL`| Bundle del navegador + servidor     | `fetchAPI`                          | URL base del backend                              |

> Separar `ENV` (servidor) de `NEXT_PUBLIC_ENV` (pública) evita que una variable expuesta en el navegador parezca controlar decisiones de seguridad del servidor. En la práctica valen lo mismo, pero conceptualmente son distintas. Si `ENV` falta o es inválido, se hace **fail-safe a API real** (nunca se arranca en modo mock por accidente).

El helper central está en `src/lib/env.ts`: `isMockMode()` lee `ENV`; `getClientEnv()` lee `NEXT_PUBLIC_ENV`.

| Valor      | Origen de datos             | `NEXT_PUBLIC_API_URL`                       |
|------------|-----------------------------|---------------------------------------------|
| `develop`  | Mocks en memoria            | — (no se usa)                               |
| `stg`      | API real de staging         | `http://cjr-staging.runasp.net/api/v1`      |
| `prod`     | API real de producción      | _por definir_                               |

Cuando `ENV=develop`, **todo** el fetch se intercepta en `src/lib/apiClient.ts` y devuelve datos de `src/lib/mocks.ts`. No se toca la red. El login acepta cualquier usuario/contraseña.

Cuando `ENV=stg` o `ENV=prod`, `fetchAPI` pega contra `NEXT_PUBLIC_API_URL` con Basic Auth (`usuario:contraseña` en base64) tomada de la cookie `authToken`.

## Cómo correr

### Local — DEV con todo mockeado (por defecto)

```bash
pnpm install
pnpm dev          # usa .env → ENV=develop + NEXT_PUBLIC_ENV=develop → TODO mockeado
```

Abrí http://localhost:3000. Entrá a `/dashboard` directamente (sesión mockeada). El login acepta cualquier credencial.

### Local — contra API de staging

```bash
pnpm dev:stg      # carga .env.stg
```

Acá el login valida de verdad contra `{API_URL}/me`. Necesitás un usuario/contraseña válido en stg.

### Local — contra API de producción

```bash
pnpm dev:prod     # carga .env.prod (editar la URL antes)
```

> ⚠️ La API de stg está en HTTP. Si probás desde el browser en `https://localhost`, habrá *mixed content*; usá `http://localhost:3000`. Las llamadas server-side (Server Actions, Server Components) no tienen ese problema.

## Build por entorno

```bash
pnpm build        # usa el .env actual
pnpm build:stg    # carga .env.stg
pnpm build:prod   # carga .env.prod
pnpm start        # sirve el build producido
```

## Deploy en Vercel

En **Project Settings → Environment Variables** crear **tres** variables por cada Vercel environment:

| Vercel Environment | `ENV`  | `NEXT_PUBLIC_ENV` | `NEXT_PUBLIC_API_URL`                       |
|--------------------|--------|-------------------|---------------------------------------------|
| Production         | `prod` | `prod`            | _URL de prod_                               |
| Preview            | `stg`  | `stg`             | `http://cjr-staging.runasp.net/api/v1`      |
| Development        | `develop` | `develop`      | —                                           |

> `ENV` **debe** crearse (sin el prefijo `NEXT_PUBLIC_`) para que las decisiones de seguridad del servidor (cookie `secure`, mocks) funcionen. Si se omite, la app arranca en modo API real (fail-safe).

Como `NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_ENV` son `NEXT_PUBLIC_*`, Vercel las reemplaza en **build time** → tras cambiarlas hay que **redeployear**. `ENV` se lee en runtime, así que no requiere redeploy.

## Tests

```bash
pnpm test         # jest
pnpm test:watch
```

Todos los tests corren con `ENV=develop` + `NEXT_PUBLIC_ENV=develop` forzados en `jest.setup.ts`, así que nunca tocan la red.

## Estructura relevante

- `src/lib/env.ts` — fuente de verdad del entorno: `isMockMode()` (servidor, lee `ENV`), `getClientEnv()` (cliente, lee `NEXT_PUBLIC_ENV`), `getApiUrl()`.
- `src/lib/apiClient.ts` — cliente HTTP + dispatcher de mocks.
- `src/lib/mocks.ts` — datos mockeados centralizados.
- `src/lib/auth.ts` — `obtenerSesion()`: mock en dev, valida cookie contra `/me` en stg/prod.
- `src/proxy.ts` — proxy (renombrado desde `middleware.ts` en Next.js 16).
- `src/app/login/actions.ts` — `loginAction`: Basic Auth contra `/me`.
- `src/app/dashboard/socios/actions.ts` — `obtenerSocios()`: mock en dev, GET `/socios` en stg/prod.
