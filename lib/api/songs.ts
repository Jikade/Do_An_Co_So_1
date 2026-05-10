export type Song = {
  id: number;
  title: string;
  artist: string;
  audio_url: string;
  cover_image?: string | null;
  duration?: number;
  emotion?: string | null;
  mood?: string | null;
  lyrics?: string | null;
  emotion_label_vi?: string | null;
  emotion_scores?: Record<string, number> | null;
};

export type SongFormInput = {
  title: string;
  artist: string;
  mood: string;
  lyrics?: string | null;
  file_mp3?: File | null;
  image?: File | null;
};

const normalizeBaseUrl = (url?: string) => {
  return (url || "http://127.0.0.1:8000").replace(/\/$/, "");
};

export const API_BASE_URL = normalizeBaseUrl(
  process.env.API_INTERNAL_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://127.0.0.1:8000",
);

export const PUBLIC_API_BASE_URL = normalizeBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000",
);

export function getAssetUrl(url?: string | null) {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${PUBLIC_API_BASE_URL}${url}`;
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  let response: Response;

  try {
    response = await fetch(url, {
      cache: "no-store",
      ...init,
    });
  } catch (error) {
    throw new Error(
      `Không kết nối được backend tại ${url}. Chi tiết: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function buildSongFormData(input: SongFormInput) {
  const formData = new FormData();

  formData.append("title", input.title);
  formData.append("artist", input.artist);
  formData.append("mood", input.mood);

  if (input.lyrics !== undefined && input.lyrics !== null) {
    formData.append("lyrics", input.lyrics);
  }

  if (input.file_mp3) {
    formData.append("file_mp3", input.file_mp3);
  }

  if (input.image) {
    formData.append("image", input.image);
  }

  return formData;
}

export async function getSongs(): Promise<Song[]> {
  const url = `${API_BASE_URL}/tracks/`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    return (await response.json()) as Song[];
  } catch {
    return [];
  }
}

export function createSong(input: SongFormInput) {
  return apiRequest<Song>("/tracks/", {
    method: "POST",
    body: buildSongFormData(input),
  });
}

export function updateSong(id: number, input: SongFormInput) {
  return apiRequest<Song>(`/tracks/${id}`, {
    method: "PUT",
    body: buildSongFormData(input),
  });
}

export function deleteSong(id: number) {
  return apiRequest<{ message: string; id: number }>(`/tracks/${id}`, {
    method: "DELETE",
  });
}
