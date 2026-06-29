import { getMockResponse } from "./mocks";

export function isMockMode(): boolean {
  return process.env.ENV === "develop";
}

export async function fetchAPI<T = unknown>(
  endpoint: string,
  tokenBase64?: string,
  options: RequestInit = {}
): Promise<T> {
  if (isMockMode()) {
    return getMockResponse(endpoint) as T;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error(
      `NEXT_PUBLIC_API_URL no está definida para el entorno "${process.env.ENV}".`
    );
  }

  const url = `${apiUrl}${endpoint}`;

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (tokenBase64) {
    headers.set("Authorization", `Basic ${tokenBase64}`);
  }

  const response = await fetch(url, { ...options, headers, cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}
