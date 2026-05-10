"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  suggestLyricsMoods,
  type LyricsMoodResult,
} from "@/lib/lyrics-mood-api";

type LyricsMoodSuggesterProps = {
  lyrics: string;
  className?: string;
  onApplyMood?: (mood: string, moods: LyricsMoodResult[]) => void;
};

export default function LyricsMoodSuggester({
  lyrics,
  className,
  onApplyMood,
}: LyricsMoodSuggesterProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [moods, setMoods] = useState<LyricsMoodResult[]>([]);

  const handleAnalyze = async () => {
    const trimmedLyrics = lyrics.trim();

    if (trimmedLyrics.length < 10) {
      setError("Vui lòng nhập lyrics dài hơn để phân tích mood.");
      setMoods([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await suggestLyricsMoods(trimmedLyrics, 3);
      setMoods(response.moods);

      if (!response.moods.length) {
        setError("Không tìm thấy mood phù hợp từ lyrics này.");
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Phân tích mood thất bại. Vui lòng thử lại.";

      setError(message);
      setMoods([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button
        type="button"
        variant="secondary"
        onClick={handleAnalyze}
        disabled={loading}
        className="gap-2"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="h-4 w-4" />
        )}
        {loading ? "Đang phân tích lyrics..." : "Đề xuất mood phù hợp"}
      </Button>

      {error ? <p className="mt-2 text-sm text-red-500">{error}</p> : null}

      {moods.length > 0 ? (
        <div className="mt-4 space-y-3 rounded-xl border p-4">
          <p className="text-sm font-medium">Mood được đề xuất</p>

          {moods.map((item) => (
            <div key={item.mood} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold capitalize">
                    {item.mood}
                  </p>

                  {item.signals?.matched_keywords?.length ? (
                    <p className="text-xs text-muted-foreground">
                      Từ khóa:{" "}
                      {item.signals.matched_keywords.slice(0, 6).join(", ")}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {item.confidence}%
                  </span>

                  {onApplyMood ? (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => onApplyMood(item.mood, moods)}
                    >
                      Dùng mood này
                    </Button>
                  ) : null}
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${item.confidence}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
