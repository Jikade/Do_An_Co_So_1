import { TOKEN_STORAGE_KEY } from "@/lib/api/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

export type PaymentOrderStatus = "pending" | "approved" | "rejected";

export type PaymentOrder = {
  id: number;
  order_code: string;
  user_id: number;
  user_email: string;
  package_name: string;
  amount: number;
  qr_url: string;
  status: PaymentOrderStatus;
  created_at: string;
  updated_at: string;
  approved_at?: string | null;
};

type RequestOptions = RequestInit & {
  token?: string | null;
};

async function requestJson<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const token =
    options.token ??
    (typeof window !== "undefined"
      ? localStorage.getItem(TOKEN_STORAGE_KEY)
      : null);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.detail || "Có lỗi xảy ra khi gọi API.");
  }

  return data as T;
}

export function createPaymentOrder(amount = 1000) {
  return requestJson<PaymentOrder>("/payment-orders", {
    method: "POST",
    body: JSON.stringify({
      amount,
      package_name: "VIP PRO",
    }),
  });
}

export function listMyPaymentOrders() {
  return requestJson<PaymentOrder[]>("/payment-orders/me");
}

export function listAdminPaymentOrders(search = "") {
  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }

  const query = params.toString();

  return requestJson<PaymentOrder[]>(
    `/payment-orders/admin${query ? `?${query}` : ""}`,
  );
}

export function approvePaymentOrder(orderId: number) {
  return requestJson<PaymentOrder>(`/payment-orders/admin/${orderId}/approve`, {
    method: "PATCH",
  });
}

export function buildVipQrUrl(email: string, amount = 1000) {
  return `https://img.vietqr.io/image/momo-0983947901-qr_only.png?amount=${amount}&addInfo=${encodeURIComponent(
    email,
  )}`;
}
