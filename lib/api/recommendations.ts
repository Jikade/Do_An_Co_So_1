import type { Song } from "@/lib/api/songs";

export type RecommendationResponse = {
  tracks: Song[];
  rationale?: string | null;
};

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "/api-backend"
).replace(/\/$/, "");

const TOKEN_STORAGE_KEY = "moodsync_access_token";

function getAccessToken() {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem(TOKEN_STORAGE_KEY) ||
    localStorage.getItem("access_token")
  );
}

async function waitForAccessToken(maxWaitMs = 1200) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < maxWaitMs) {
    const token = getAccessToken();

    if (token) {
      return token;
    }

    await new Promise((resolve) => window.setTimeout(resolve, 100));
  }

  return getAccessToken();
}

async function parseErrorMessage(response: Response) {
  try {
    const data = await response.json();

    if (typeof data?.detail === "string") {
      return data.detail;
    }

    if (Array.isArray(data?.detail)) {
      return data.detail
        .map((item: { msg?: string }) => item.msg)
        .filter(Boolean)
        .join("\n");
    }
  } catch {
    // ignored
  }

  return `API gợi ý lỗi: ${response.status} ${response.statusText}`;
}

export async function getPersonalRecommendations(
  limit = 24,
  emotionState: Record<string, unknown> = {},
): Promise<RecommendationResponse> {
  const token = await waitForAccessToken();

  if (!token) {
    throw new Error("Bạn cần đăng nhập để xem gợi ý cá nhân hóa.");
  }

  const response = await fetch(`${API_BASE_URL}/recommend/`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      limit,
      emotion_state: emotionState,
    }),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return response.json() as Promise<RecommendationResponse>;
}
