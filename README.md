# Socios Frontend

Next.js 16 + React 19 + Tailwind v4 + Material Design 3.

## Entornos

El proyecto soporta **tres instancias**, controladas por la variable `ENV`:

| `ENV`      | Origen de datos             | `NEXT_PUBLIC_API_URL`            |
|------------|-----------------------------|----------------------------------|
| `develop`  | Mocks en memoria            | — (no se usa)                    |
| `stg`      | API real de staging         | `http://cjr-staging.runasp.net/api/v1` |
| `prod`     | API real de producción      | _por definir_                    |

Cuando `ENV=develop`, **todo** el fetch se intercepta en `src/lib/apiClient.ts` y devuelve datos de `src/lib/mocks.ts`. No se toca la red. El login acepta cualquier usuario/contraseña.

Cuando `ENV=stg` o `ENV=prod`, `fetchAPI` pega contra `NEXT_PUBLIC_API_URL` con Basic Auth (`usuario:contraseña` en base64) tomada de la cookie `authToken`.

## Cómo correr

### Local — DEV con todo mockeado (por defecto)

```bash
pnpm install
pnpm dev          # usa .env.local → ENV=develop → TODO mockeado
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
pnpm build        # usa el .env.local actual
pnpm build:stg    # carga .env.stg
pnpm build:prod   # carga .env.prod
pnpm start        # sirve el build producido
```

## Deploy en Vercel

En **Project Settings → Environment Variables** crear dos variables, una por cada Vercel environment:

| Vercel Environment | `ENV`   | `NEXT_PUBLIC_API_URL`                       |
|--------------------|---------|---------------------------------------------|
| Production         | `prod`  | _URL de prod_                               |
| Preview            | `stg`   | `http://cjr-staging.runasp.net/api/v1`      |
| Development        | `develop` | —                                         |

Como `NEXT_PUBLIC_API_URL` es `NEXT_PUBLIC_*`, Vercel la reemplaza en **build time** → tras cambiarla hay que **redeployear**.

## Tests

```bash
pnpm test         # jest
pnpm test:watch
```

Todos los tests corren con `ENV=develop` forzado en `jest.setup.ts`, así que nunca tocan la red.

## Estructura relevante

- `src/lib/apiClient.ts` — cliente HTTP + dispatcher de mocks.
- `src/lib/mocks.ts` — datos mockeados centralizados.
- `src/lib/auth.ts` — `obtenerSesion()`: mock en dev, valida cookie contra `/me` en stg/prod.
- `src/proxy.ts` — proxy (renombrado desde `middleware.ts` en Next.js 16).
- `src/app/login/actions.ts` — `loginAction`: Basic Auth contra `/me`.
- `src/app/dashboard/socios/actions.ts` — `obtenerSocios()`: mock en dev, GET `/socios` en stg/prod.
