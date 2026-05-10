"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  createSong,
  deleteSong,
  getAssetUrl,
  getSongs,
  Song,
  updateSong,
} from "@/lib/api/songs";

import { analyzeLyricsMood, LyricsMoodResult } from "@/lib/api/lyrics-mood";

const MOODS = ["relax", "happy", "sad", "angry", "focus", "romantic"];

type FormState = {
  title: string;
  artist: string;
  mood: string;
  lyrics: string;
};

const emptyForm: FormState = {
  title: "",
  artist: "",
  mood: "relax",
  lyrics: "",
};

export default function SongManager() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [mp3File, setMp3File] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [moodLoading, setMoodLoading] = useState(false);
  const [moodError, setMoodError] = useState("");
  const [suggestedMoods, setSuggestedMoods] = useState<LyricsMoodResult[]>([]);

  async function fetchSongs() {
    const data = await getSongs();
    setSongs(data);
  }

  useEffect(() => {
    fetchSongs().catch((error) => {
      console.error(error);
      setMessage("Không tải được danh sách bài hát");
    });
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setMp3File(null);
    setImageFile(null);
    setEditingSong(null);
    setSuggestedMoods([]);
    setMoodError("");

    const mp3Input = document.getElementById(
      "file_mp3",
    ) as HTMLInputElement | null;

    const imageInput = document.getElementById(
      "image",
    ) as HTMLInputElement | null;

    if (mp3Input) mp3Input.value = "";
    if (imageInput) imageInput.value = "";
  }

  async function handleSuggestMood() {
    const lyrics = form.lyrics.trim();

    if (lyrics.length < 10) {
      setMoodError("Vui lòng nhập lyrics dài hơn để phân tích mood.");
      setSuggestedMoods([]);
      return;
    }

    setMoodLoading(true);
    setMoodError("");
    setSuggestedMoods([]);

    try {
      const result = await analyzeLyricsMood(lyrics);
      setSuggestedMoods(result.moods);

      if (result.moods.length > 0) {
        setForm((prev) => ({
          ...prev,
          mood: result.moods[0].mood,
        }));
      } else {
        setMoodError("Không tìm thấy mood phù hợp.");
      }
    } catch (error) {
      console.error(error);
      setMoodError("Phân tích mood thất bại. Vui lòng thử lại.");
    } finally {
      setMoodLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      if (!editingSong && !mp3File) {
        setMessage("Vui lòng chọn file mp3");
        return;
      }

      if (!editingSong && !imageFile) {
        setMessage("Vui lòng chọn ảnh bài hát");
        return;
      }

      const payload = {
        title: form.title,
        artist: form.artist,
        mood: form.mood,
        lyrics: form.lyrics.trim() ? form.lyrics : null,
        file_mp3: mp3File,
        image: imageFile,
      };

      if (editingSong) {
        await updateSong(editingSong.id, payload);
        setMessage("Cập nhật bài hát thành công");
      } else {
        await createSong(payload);
        setMessage("Thêm bài hát thành công");
      }

      resetForm();

      await fetchSongs();
    } catch (error) {
      console.error(error);
      setMessage("Có lỗi xảy ra khi lưu bài hát");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(song: Song) {
    setEditingSong(song);

    setForm({
      title: song.title,
      artist: song.artist,
      mood: song.mood || song.emotion || "relax",
      lyrics: song.lyrics ?? "",
    });

    setMp3File(null);
    setImageFile(null);
    setMessage("");
    setMoodError("");
    setSuggestedMoods([]);
  }

  async function handleDelete(song: Song) {
    const ok = window.confirm(`Xoá bài hát "${song.title}"?`);
    if (!ok) return;

    setLoading(true);
    setMessage("");

    try {
      await deleteSong(song.id);
      await fetchSongs();

      if (editingSong?.id === song.id) {
        resetForm();
      }

      setMessage("Xoá bài hát thành công");
    } catch (error) {
      console.error(error);
      setMessage("Không xoá được bài hát");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4">
      <div>
        <h1 className="text-3xl font-bold">Quản lý bài hát</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thêm, sửa, xoá bài hát. Mỗi bài hát gồm title, artist, file mp3,
          image, mood và lyric.
        </p>
      </div>

      <section className="rounded-2xl border bg-card p-5 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">
          {editingSong ? "Sửa bài hát" : "Thêm bài hát"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Tên bài hát</span>
            <input
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  title: event.target.value,
                }))
              }
              required
              className="rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Nghệ sĩ</span>
            <input
              value={form.artist}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  artist: event.target.value,
                }))
              }
              required
              className="rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Mood</span>
            <select
              value={form.mood}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  mood: event.target.value,
                }))
              }
              className="rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            >
              {MOODS.map((mood) => (
                <option key={mood} value={mood}>
                  {mood}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Lyric đồng bộ thời gian</span>

            <textarea
              value={form.lyrics}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  lyrics: event.target.value,
                }))
              }
              rows={8}
              placeholder={
                "0:01[RINGING SOUND]\n0:06[♪♪♪]\n0:15♪ The club isn't the best place to find a lover ♪\n0:23♪ Drinking fast and then we talk slow ♪"
              }
              className="min-h-40 rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />

            <span className="text-xs text-muted-foreground">
              Không bắt buộc. Để trống thì backend sẽ lưu NULL.
            </span>
          </label>

          <div className="rounded-2xl border bg-muted/30 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSuggestMood}
                disabled={moodLoading || !form.lyrics.trim()}
                className="rounded-xl border bg-background px-4 py-2 text-sm font-medium disabled:opacity-60"
              >
                {moodLoading
                  ? "Đang phân tích lyrics..."
                  : "Đề xuất mood phù hợp"}
              </button>

              {suggestedMoods.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  Mood tốt nhất đã được tự động chọn vào ô Mood.
                </span>
              )}
            </div>

            {moodError && (
              <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {moodError}
              </p>
            )}

            {suggestedMoods.length > 0 && (
              <div className="mt-4 grid gap-3">
                {suggestedMoods.map((item) => (
                  <div
                    key={item.mood}
                    className="rounded-xl border bg-card p-3"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{item.mood}</p>

                        {item.matched_keywords.length > 0 && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Từ khóa: {item.matched_keywords.join(", ")}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">
                          {item.confidence}%
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              mood: item.mood,
                            }))
                          }
                          className="rounded-lg border px-2 py-1 text-xs font-medium"
                        >
                          Chọn
                        </button>
                      </div>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${item.confidence}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium">
              File mp3 {editingSong ? "(để trống nếu không đổi)" : ""}
            </span>
            <input
              id="file_mp3"
              type="file"
              accept=".mp3,audio/mpeg"
              onChange={(event) => setMp3File(event.target.files?.[0] || null)}
              className="rounded-xl border bg-background px-3 py-2"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">
              Image {editingSong ? "(để trống nếu không đổi)" : ""}
            </span>
            <input
              id="image"
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/*"
              onChange={(event) =>
                setImageFile(event.target.files?.[0] || null)
              }
              className="rounded-xl border bg-background px-3 py-2"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {loading
                ? "Đang xử lý..."
                : editingSong
                  ? "Lưu thay đổi"
                  : "Thêm bài hát"}
            </button>

            {editingSong && (
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                className="rounded-xl border px-4 py-2 text-sm font-medium"
              >
                Huỷ sửa
              </button>
            )}
          </div>
        </form>

        {message && (
          <p className="mt-4 rounded-xl border bg-muted px-3 py-2 text-sm">
            {message}
          </p>
        )}
      </section>

      <section className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Danh sách bài hát</h2>

          <button
            type="button"
            onClick={() => fetchSongs()}
            className="rounded-xl border px-3 py-2 text-sm font-medium"
          >
            Tải lại
          </button>
        </div>

        <div className="grid gap-3">
          {songs.map((song) => (
            <article
              key={song.id}
              className="flex flex-col gap-3 rounded-2xl border p-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex gap-3">
                {song.cover_image ? (
                  <img
                    src={getAssetUrl(song.cover_image)}
                    alt={song.title}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                ) : null}

                <div>
                  <h3 className="font-semibold">{song.title}</h3>
                  <p className="text-sm text-muted-foreground">{song.artist}</p>
                  <p className="text-xs text-muted-foreground">
                    Mood: {song.mood || song.emotion || "unknown"}
                  </p>

                  {song.lyrics ? (
                    <p className="mt-1 text-xs text-green-600">Có lyric</p>
                  ) : (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Chưa có lyric
                    </p>
                  )}

                  {song.audio_url && (
                    <audio
                      src={getAssetUrl(song.audio_url)}
                      controls
                      className="mt-2 w-full max-w-md"
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(song)}
                  className="rounded-xl border px-3 py-2 text-sm font-medium"
                >
                  Sửa
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(song)}
                  className="rounded-xl bg-destructive px-3 py-2 text-sm font-medium text-destructive-foreground"
                >
                  Xoá
                </button>
              </div>
            </article>
          ))}

          {songs.length === 0 && (
            <p className="rounded-xl border p-4 text-sm text-muted-foreground">
              Chưa có bài hát nào.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
