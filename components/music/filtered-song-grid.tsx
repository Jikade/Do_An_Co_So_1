"use client";

import { useMemo } from "react";

import SongCard from "@/components/music/song-card";
import type { Song } from "@/lib/api/songs";
import { useTheme } from "@/lib/nguCanhGiaoDien";

type FilteredSongGridProps = {
  songs: Song[];
  emptyMessage?: string;
  forceLikedOnly?: boolean;
};

function normalizeText(value?: string | null) {
  return value?.toLowerCase().trim() ?? "";
}

function normalizeMood(value?: string | null) {
  const mood = normalizeText(value);

  if (mood === "relax" || mood === "focus") {
    return "calm";
  }

  return mood;
}

export function FilteredSongGrid({
  songs,
  emptyMessage = "Không có bài hát nào phù hợp với bộ lọc.",
  forceLikedOnly = false,
}: FilteredSongGridProps) {
  const {
    songSearchQuery,
    moodFilter,
    likedOnly,
    isLoadingLikes,
    isTrackLiked,
  } = useTheme();

  const shouldShowLikedOnly = forceLikedOnly || likedOnly;

  const filteredSongs = useMemo(() => {
    const keyword = normalizeText(songSearchQuery);
    const selectedMood = normalizeMood(moodFilter);

    return songs.filter((song) => {
      const title = normalizeText(song.title);
      const artist = normalizeText(song.artist);
      const mood = normalizeMood(song.mood || song.emotion);
      const emotionLabel = normalizeText(song.emotion_label_vi);

      const matchesKeyword =
        !keyword ||
        title.includes(keyword) ||
        artist.includes(keyword) ||
        mood.includes(keyword) ||
        emotionLabel.includes(keyword);

      const matchesMood = selectedMood === "all" || mood === selectedMood;

      const matchesLiked = !shouldShowLikedOnly || isTrackLiked(song.id);

      return matchesKeyword && matchesMood && matchesLiked;
    });
  }, [songs, songSearchQuery, moodFilter, shouldShowLikedOnly, isTrackLiked]);

  if (forceLikedOnly && isLoadingLikes) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-white/50">
        Đang tải danh sách bài hát đã thích...
      </div>
    );
  }

  if (filteredSongs.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-white/50">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {songSearchQuery || moodFilter !== "all" || shouldShowLikedOnly ? (
        <p className="text-sm text-white/45">
          Đang hiển thị{" "}
          <span className="font-semibold text-white/80">
            {filteredSongs.length}
          </span>{" "}
          / {songs.length} bài hát
          {shouldShowLikedOnly ? " đã thích" : " phù hợp với bộ lọc"}.
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredSongs.map((song) => (
          <SongCard key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
}
