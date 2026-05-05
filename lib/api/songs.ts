export type Song = {
  id: number;
  title: string;
  artist: string;
  audio_url: string;
  cover_image?: string | null;
  duration?: number;
  emotion?: string | null;
  mood?: string | null;
  emotion_label_vi?: string | null;
  emotion_scores?: Record<string, number> | null;
  lyrics?: string | null;
};

export type SongFormInput = {
  title: string;
  artist: string;
  mood: string;
  lyrics?: string | null;
  file_mp3?: File | null;
  image?: File | null;
};

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export function getAssetUrl(url?: string | null) {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${API_BASE_URL}${url}`;
}

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    ...init,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "API request failed");
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

function buildSongFormData(input: SongFormInput) {
  const formData = new FormData();

  formData.append("title", input.title);
  formData.append("artist", input.artist);
  formData.append("mood", input.mood);

  // lyrics không bắt buộc.
  // Nếu rỗng thì backend sẽ normalize thành NULL.
  formData.append("lyrics", input.lyrics?.trim() ? input.lyrics : "");

  if (input.file_mp3) {
    formData.append("file_mp3", input.file_mp3);
  }

  if (input.image) {
    formData.append("image", input.image);
  }

  return formData;
}

export function getSongs() {
  return apiRequest<Song[]>("/tracks/");
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
