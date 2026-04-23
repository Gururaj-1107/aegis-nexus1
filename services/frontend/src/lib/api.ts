/**
 * Centralized API fetch utility for Aegis Nexus.
 * Automatically prepends the backend URL and attaches Bearer auth token.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://aegis-backend-75btxxix5a-uc.a.run.app';

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const url = `${API_BASE}${path}`;

  // Read auth token from localStorage (client-side only)
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('auth');
  }

  const headers = new Headers(options.headers || {});

  // Attach Bearer token if available
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Set Content-Type for JSON bodies if not already set and body is not FormData
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

export default apiFetch;
