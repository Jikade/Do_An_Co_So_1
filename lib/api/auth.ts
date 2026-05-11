export type AuthUser = {
  id: number;
  email: string;
  name: string;
  auth_provider: string;
  avatar_url?: string | null;
  role?: "user" | "admin";
  is_vip?: boolean;
};

export type AuthResponse = {
  access_token: string;
  token_type: "bearer";
  user: AuthUser;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const TOKEN_STORAGE_KEY = "moodsync_access_token";
export const USER_STORAGE_KEY = "moodsync_user";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

async function getErrorMessage(response: Response) {
  try {
    const data = await response.json();
    if (typeof data?.detail === "string") return data.detail;
    if (Array.isArray(data?.detail)) {
      return data.detail
        .map((item: { msg?: string; loc?: string[] }) => {
          const field = Array.isArray(item.loc) ? item.loc.at(-1) : undefined;
          return field ? `${field}: ${item.msg}` : item.msg;
        })
        .filter(Boolean)
        .join("\n");
    }
    if (typeof data?.message === "string") return data.message;
  } catch {
    // ignored
  }
  return "Không thể xử lý yêu cầu. Vui lòng thử lại.";
}

async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function registerWithEmail(payload: RegisterPayload) {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginWithEmail(payload: LoginPayload) {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginWithGoogleCredential(credential: string) {
  return apiRequest<AuthResponse>("/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });
}

export function fetchCurrentUser(token: string) {
  return apiRequest<AuthUser>("/auth/me", {
    method: "GET",
    token,
  });
}

export function logoutOnServer(token: string) {
  return apiRequest<{ message: string }>("/auth/logout", {
    method: "POST",
    token,
  });
}
