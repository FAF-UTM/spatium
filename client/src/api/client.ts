// Thin fetch wrapper around the Spatium backend.
// The base URL comes from VITE_API_URL (see .env), falling back to localhost.

const API_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ||
  'http://localhost:3000';

const TOKEN_KEY = 'spatium_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export interface ApiErrorShape {
  success: false;
  message: string;
  details?: Array<{ field: string; message: string }>;
}

export class ApiError extends Error {
  status: number;
  details?: Array<{ field: string; message: string }>;
  constructor(status: number, message: string, details?: ApiErrorShape['details']) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown; // plain object -> JSON, FormData -> multipart
  auth?: boolean; // attach bearer token
  signal?: AbortSignal;
}

export async function request<T = unknown>(
  path: string,
  { method = 'GET', body, auth = false, signal }: RequestOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {};
  let payload: BodyInit | undefined;

  if (body instanceof FormData) {
    payload = body; // let the browser set the multipart boundary
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: payload,
      credentials: 'include', // send/receive the session cookie too
      signal,
    });
  } catch {
    // Network-level failure (server down, DNS, CORS preflight, offline).
    throw new ApiError(
      0,
      `Cannot reach the server at ${API_URL}. Make sure the backend is running.`
    );
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = data as ApiErrorShape;
    throw new ApiError(res.status, err.message || 'Request failed', err.details);
  }

  return data as T;
}

export const API_BASE_URL = API_URL;

/**
 * Turn any thrown value into a user-facing message, including backend
 * field-validation details when present.
 */
export function errorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (err instanceof ApiError) {
    if (err.details && err.details.length) {
      return err.details.map((d) => d.message).join(' · ');
    }
    return err.message || fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
