import { apiPost } from "@/lib/api-client";

export type AuthUser = {
  id: number;
  email: string;
  name: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
};

export type TokenResponse = {
  access_token: string;
  token_type?: string;
  user: AuthUser;
};

export async function login(payload: LoginPayload): Promise<TokenResponse> {
  const data = await apiPost<TokenResponse>("/auth/login", payload, {
    auth: false,
  });

  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  return apiPost<AuthUser>("/auth/register", payload, {
    auth: false,
  });
}

export function logout() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}
