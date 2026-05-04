const DEFAULT_API_BASE_URL = "http://localhost:8000";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

type ApiOptions = RequestInit & {
  auth?: boolean;
};

function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

function buildHeaders(options: ApiOptions): Headers {
  const headers = new Headers(options.headers);
  const token = getAccessToken();

  headers.set("Accept", "application/json");

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth !== false && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

async function parseErrorMessage(response: Response): Promise<string> {
  let message = `API lỗi: ${response.status} ${response.statusText}`;

  try {
    const errorBody = await response.json();

    if (errorBody?.detail) {
      message = Array.isArray(errorBody.detail)
        ? JSON.stringify(errorBody.detail)
        : String(errorBody.detail);
    }
  } catch {
    // Backend không trả JSON thì giữ message mặc định
  }

  return message;
}

export async function apiRequest<T>(
  path: string,
  options: ApiOptions = {},
): Promise<T> {
  const url = buildApiUrl(path);
  const headers = buildHeaders(options);

  const response = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function apiGet<T>(path: string, options?: ApiOptions): Promise<T> {
  return apiRequest<T>(path, {
    method: "GET",
    ...options,
  });
}

export function apiPost<T>(
  path: string,
  body?: unknown,
  options?: ApiOptions,
): Promise<T> {
  return apiRequest<T>(path, {
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
    ...options,
  });
}

export function apiPut<T>(
  path: string,
  body?: unknown,
  options?: ApiOptions,
): Promise<T> {
  return apiRequest<T>(path, {
    method: "PUT",
    body: body === undefined ? undefined : JSON.stringify(body),
    ...options,
  });
}

export function apiPatch<T>(
  path: string,
  body?: unknown,
  options?: ApiOptions,
): Promise<T> {
  return apiRequest<T>(path, {
    method: "PATCH",
    body: body === undefined ? undefined : JSON.stringify(body),
    ...options,
  });
}

export function apiDelete<T>(path: string, options?: ApiOptions): Promise<T> {
  return apiRequest<T>(path, {
    method: "DELETE",
    ...options,
  });
}

export function toMediaUrl(value?: string | null): string {
  if (!value) return "";

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/media/")) {
    return `${API_BASE_URL}${value}`;
  }

  return `${API_BASE_URL}/media/${encodeURIComponent(value)}`;
}

export function toImageUrl(value?: string | null): string {
  if (!value) return "/placeholder.svg";

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith("/images/")) {
    return `${API_BASE_URL}${value}`;
  }

  return `${API_BASE_URL}/images/${encodeURIComponent(value)}`;
}
