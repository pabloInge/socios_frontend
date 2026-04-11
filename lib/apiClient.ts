const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchAPI(endpoint: string, tokenBase64?: string, options: RequestInit = {}) {
    const url = `${API_URL}${endpoint}`;

    const headers = new Headers(options.headers || {});
    headers.append('Content-Type', 'application/json');

    if (tokenBase64) {
        headers.append('Authorization', `Basic ${tokenBase64}`);
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
    }

    return response.json();
}
