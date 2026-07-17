export type Environment = "develop" | "stg" | "prod";

export function getClientEnv(): Environment | undefined {
  const env = process.env.NEXT_PUBLIC_ENV;
  return env === "develop" || env === "stg" || env === "prod" ? env : undefined;
}

export function isMockMode(): boolean {
  return process.env.ENV === "develop";
}

export function getApiUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_API_URL;
}
