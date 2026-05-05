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

const MOODS = ["relax", "happy", "sad", "angry", "focus", "romantic"];

type FormState = {
  title: string;
  artist: string;
  mood: string;
};

const emptyForm: FormState = {
  title: "",
  artist: "",
  mood: "relax",
};

export default function SongManager() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [mp3File, setMp3File] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

    const mp3Input = document.getElementById(
      "file_mp3",
    ) as HTMLInputElement | null;
    const imageInput = document.getElementById(
      "image",
    ) as HTMLInputElement | null;

    if (mp3Input) mp3Input.value = "";
    if (imageInput) imageInput.value = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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

      // Quan trọng: fetch lại API để dữ liệu mới hiển thị ngay
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
    });
    setMp3File(null);
    setImageFile(null);
    setMessage("");
  }

  async function handleDelete(song: Song) {
    const ok = window.confirm(`Xoá bài hát "${song.title}"?`);

    if (!ok) return;

    setLoading(true);
    setMessage("");

    try {
      await deleteSong(song.id);

      // Quan trọng: fetch lại API sau khi xoá
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
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý bài hát</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Thêm, sửa, xoá bài hát. Mỗi bài hát gồm title, artist, file mp3, image
          và mood.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 rounded-2xl border bg-card p-5 shadow-sm"
      >
        <h2 className="text-xl font-semibold">
          {editingSong ? "Sửa bài hát" : "Thêm bài hát"}
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2">
            <span className="text-sm font-medium">Tên bài hát</span>
            <input
              className="rounded-xl border bg-background px-3 py-2"
              value={form.title}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, title: event.target.value }))
              }
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Nghệ sĩ</span>
            <input
              className="rounded-xl border bg-background px-3 py-2"
              value={form.artist}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, artist: event.target.value }))
              }
              required
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">Mood</span>
            <select
              className="rounded-xl border bg-background px-3 py-2"
              value={form.mood}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, mood: event.target.value }))
              }
            >
              {MOODS.map((mood) => (
                <option key={mood} value={mood}>
                  {mood}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-medium">
              File mp3 {editingSong ? "(để trống nếu không đổi)" : ""}
            </span>
            <input
              id="file_mp3"
              type="file"
              accept="audio/mpeg,.mp3"
              className="rounded-xl border bg-background px-3 py-2"
              onChange={(event) => setMp3File(event.target.files?.[0] || null)}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium">
              Image {editingSong ? "(để trống nếu không đổi)" : ""}
            </span>
            <input
              id="image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="rounded-xl border bg-background px-3 py-2"
              onChange={(event) =>
                setImageFile(event.target.files?.[0] || null)
              }
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-60"
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
              className="rounded-xl border px-4 py-2 font-medium"
            >
              Huỷ sửa
            </button>
          )}
        </div>

        {message && <p className="text-sm">{message}</p>}
      </form>

      <div className="rounded-2xl border bg-card p-5 shadow-sm">
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

        <div className="grid gap-4">
          {songs.map((song) => (
            <div
              key={song.id}
              className="grid gap-4 rounded-2xl border p-4 md:grid-cols-[96px_1fr_auto]"
            >
              <div className="h-24 w-24 overflow-hidden rounded-xl bg-muted">
                {song.cover_image ? (
                  <img
                    src={getAssetUrl(song.cover_image)}
                    alt={song.title}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>

              <div className="space-y-2">
                <div>
                  <h3 className="font-semibold">{song.title}</h3>
                  <p className="text-sm text-muted-foreground">{song.artist}</p>
                  <p className="text-sm">
                    Mood: {song.mood || song.emotion || "unknown"}
                  </p>
                </div>

                {song.audio_url && (
                  <audio controls src={getAssetUrl(song.audio_url)} />
                )}
              </div>

              <div className="flex items-start gap-2">
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
            </div>
          ))}

          {songs.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Chưa có bài hát nào.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
