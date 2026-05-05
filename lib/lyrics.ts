export type LyricLine = {
  time: number;
  text: string;
};

const LYRIC_LINE_RE = /^(\d{1,2}):(\d{2})(.*)$/;

export function parseLyrics(rawLyrics?: string | null): LyricLine[] {
  if (!rawLyrics?.trim()) return [];

  return rawLyrics
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(LYRIC_LINE_RE);

      if (!match) return null;

      const minutes = Number(match[1]);
      const seconds = Number(match[2]);

      if (
        !Number.isFinite(minutes) ||
        !Number.isFinite(seconds) ||
        seconds > 59
      ) {
        return null;
      }

      const text = match[3]
        .trim()
        .replace(/^♪\s*/, "")
        .replace(/\s*♪$/, "")
        .trim();

      if (!text) return null;

      return {
        time: minutes * 60 + seconds,
        text,
      };
    })
    .filter((line): line is LyricLine => Boolean(line))
    .sort((a, b) => a.time - b.time);
}

export function getCurrentLyricLine(
  lines: LyricLine[],
  currentTime: number,
): LyricLine | null {
  if (!lines.length) return null;

  let left = 0;
  let right = lines.length - 1;
  let result: LyricLine | null = null;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (lines[mid].time <= currentTime) {
      result = lines[mid];
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}
