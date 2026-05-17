import type { Emotion, Language, Song } from "@/lib/duLieuGiaLap";

type CommandReason = "random" | "mood" | "artist" | "title" | "fuzzy";

export type BotMusicCommand =
  | {
      type: "play";
      song: Song;
      reason: CommandReason;
      reply: string;
      confidence?: number;
      matchedText?: string;
      emotion?: Emotion;
    }
  | {
      type: "control";
      control: "pause" | "resume" | "next" | "previous";
      reply: string;
    }
  | {
      type: "volume";
      value: number;
      muted?: boolean;
      reply: string;
    }
  | {
      type: "help";
      reply: string;
    };

interface ResolveOptions {
  language?: Language;
  currentEmotion?: Emotion;
  nowPlaying?: Song | null;
}

const emotionLabelVi: Record<Emotion, string> = {
  happy: "vui vẻ",
  sad: "buồn",
  calm: "bình yên",
  angry: "xả áp",
  romantic: "lãng mạn",
  nostalgic: "hoài niệm",
  energetic: "năng lượng",
  stressed: "giảm căng thẳng",
};

const emotionLabelEn: Record<Emotion, string> = {
  happy: "happy",
  sad: "sad",
  calm: "calm",
  angry: "release",
  romantic: "romantic",
  nostalgic: "nostalgic",
  energetic: "energetic",
  stressed: "stress relief",
};

const moodKeywords: Record<Emotion, string[]> = {
  happy: [
    "vui",
    "vui ve",
    "yeu doi",
    "tuoi",
    "happy",
    "sunny",
    "hung phan",
    "phan khich",
  ],
  sad: [
    "buon",
    "nhac buon",
    "sad",
    "khong vui",
    "tam trang",
    "that tinh",
    "sau lang",
    "cry",
    "lụy",
    "luy",
  ],
  calm: [
    "binh yen",
    "diu",
    "nhe",
    "chill",
    "calm",
    "relax",
    "thu gian",
    "lofi",
    "ngu ngon",
  ],
  angry: ["gian", "tuc gian", "buc", "uc che", "angry", "xa ap", "xả áp"],
  romantic: [
    "lang man",
    "romantic",
    "yeu",
    "love",
    "crush",
    "tinh cam",
    "hen ho",
  ],
  nostalgic: [
    "hoai niem",
    "nostalgic",
    "nho",
    "xua",
    "ky niem",
    "ki niem",
    "ngay cu",
  ],
  energetic: [
    "nang luong",
    "sung",
    "chay",
    "boc",
    "gym",
    "workout",
    "energetic",
    "dance",
    "remix",
  ],
  stressed: [
    "cang thang",
    "stress",
    "ap luc",
    "lo au",
    "overthinking",
    "met",
    "roi",
  ],
};

export const musicBotQuickPrompts = [
  {
    id: "random",
    label: { vi: "Random", en: "Random" },
    prompt: {
      vi: "Hãy phát ngẫu nhiên một bài hát",
      en: "Play a random song",
    },
  },
  {
    id: "sad",
    label: { vi: "Nhạc buồn", en: "Sad music" },
    prompt: {
      vi: "Tôi muốn nghe nhạc buồn",
      en: "Play sad music",
    },
  },
  {
    id: "blackpink",
    label: { vi: "BLACKPINK", en: "BLACKPINK" },
    prompt: {
      vi: "Hãy phát nhạc của Black Pink",
      en: "Play music by Black Pink",
    },
  },
  {
    id: "stay",
    label: { vi: "Thử STAi", en: "Try STAi" },
    prompt: {
      vi: "Muốn nghe bài STAi",
      en: "Play STAi",
    },
  },
] as const;

function say(language: Language, vi: string, en: string) {
  return language === "en" ? en : vi;
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function compactText(value: string) {
  return normalizeText(value).replace(/\s+/g, "");
}

function containsAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(normalizeText(keyword)));
}

function randomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function detectMood(input: string): Emotion | null {
  const text = normalizeText(input);

  for (const [emotion, keywords] of Object.entries(moodKeywords) as [
    Emotion,
    string[],
  ][]) {
    if (containsAny(text, keywords)) return emotion;
  }

  return null;
}

function extractTitleQuery(input: string) {
  let text = normalizeText(input);

  const patterns = [
    /(?:mo|mở|bat|bật|phat|phát|play|nghe)\s+(?:bai hat|bài hát|bai|bài|hat|hát|song|track|ca khuc|ca khúc|mv|m v|nhac|nhạc)?\s*(.+)/,
    /(?:toi muon nghe|minh muon nghe|muon nghe|cho minh nghe)\s+(?:bai|nhac|track)?\s*(.+)/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      text = match[1];
      break;
    }
  }

  return text
    .replace(
      /\b(hay|giup|minh|toi|tui|nhe|di|voi|cho|bai hat|bai|hat|song|nhac|track|ca khuc|mv|m v)\b/g,
      " ",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function levenshtein(a: string, b: string) {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array<number>(b.length + 1).fill(0),
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
}

function bigrams(text: string) {
  if (text.length <= 1) return [text];
  return Array.from({ length: text.length - 1 }, (_, index) =>
    text.slice(index, index + 2),
  );
}

function diceScore(a: string, b: string) {
  const aPairs = bigrams(a);
  const bPairs = bigrams(b);
  let hits = 0;
  const used = new Set<number>();

  for (const pair of aPairs) {
    const index = bPairs.findIndex((item, i) => item === pair && !used.has(i));
    if (index >= 0) {
      hits++;
      used.add(index);
    }
  }

  return (2 * hits) / Math.max(1, aPairs.length + bPairs.length);
}

function tokenScore(query: string, target: string) {
  const queryTokens = normalizeText(query).split(" ").filter(Boolean);
  const targetTokens = new Set(
    normalizeText(target).split(" ").filter(Boolean),
  );

  if (queryTokens.length === 0) return 0;

  const hits = queryTokens.filter((token) => targetTokens.has(token)).length;
  return hits / queryTokens.length;
}

function similarity(query: string, target: string) {
  const q = normalizeText(query);
  const t = normalizeText(target);
  const cq = compactText(q);
  const ct = compactText(t);

  if (!q || !t) return 0;
  if (q === t || cq === ct) return 1;
  if (t.includes(q) || ct.includes(cq))
    return Math.min(0.95, q.length / t.length + 0.45);
  if (q.includes(t) || cq.includes(ct)) return 0.86;

  const distance = levenshtein(cq, ct);
  const levScore = 1 - distance / Math.max(cq.length, ct.length, 1);

  return Math.max(levScore, diceScore(cq, ct), tokenScore(q, t));
}

function findArtistMatch(input: string, songs: Song[]) {
  const text = normalizeText(input);
  const compactInput = compactText(input);

  const artists = Array.from(
    new Set(songs.map((song) => song.artist).filter(Boolean)),
  ).sort((a, b) => b.length - a.length);

  for (const artist of artists) {
    const artistText = normalizeText(artist);
    const artistCompact = compactText(artist);

    if (text.includes(artistText) || compactInput.includes(artistCompact)) {
      const candidates = songs.filter(
        (song) => compactText(song.artist) === artistCompact,
      );

      return {
        artist,
        candidates,
        confidence: 1,
      };
    }
  }

  const match = text.match(
    /(?:cua|của|by|artist|actor|ca si|nghe si|nhom nhac|ban nhac)\s+(.+)$/,
  );
  const query = match?.[1]?.trim();

  if (!query) return null;

  const scored = artists
    .map((artist) => ({
      artist,
      score: similarity(query, artist),
    }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  if (!best || best.score < 0.58) return null;

  return {
    artist: best.artist,
    candidates: songs.filter(
      (song) => compactText(song.artist) === compactText(best.artist),
    ),
    confidence: best.score,
  };
}

function findTitleMatch(input: string, songs: Song[]) {
  const query = extractTitleQuery(input);
  const normalizedInput = normalizeText(input);

  if (query.length < 2) return null;

  const scored = songs
    .map((song) => {
      const titleScore = similarity(query, song.title);
      const fullScore =
        similarity(query, `${song.title} ${song.artist}`) * 0.96;
      const rawInputScore = similarity(normalizedInput, song.title) * 0.88;

      return {
        song,
        score: Math.max(titleScore, fullScore, rawInputScore),
      };
    })
    .sort((a, b) => b.score - a.score);

  const best = scored[0];

  if (!best || best.score < 0.48) return null;

  return {
    song: best.song,
    confidence: best.score,
    query,
  };
}

function playableSongs(songs: Song[]) {
  return songs.filter((song) => Boolean(song.audioUrl));
}

function suggestions(songs: Song[]) {
  return songs
    .slice(0, 4)
    .map((song) => `"${song.title}"`)
    .join(", ");
}

export function resolveBotMusicCommand(
  input: string,
  songs: Song[],
  options: ResolveOptions = {},
): BotMusicCommand {
  const language = options.language ?? "vi";
  const text = normalizeText(input);
  const availableSongs = playableSongs(songs);

  if (availableSongs.length === 0) {
    return {
      type: "help",
      reply: say(
        language,
        "Mình chưa thấy danh sách bài hát nào có audio để phát. Hãy kiểm tra API `/tracks/` hoặc dữ liệu mock.",
        "I cannot find any playable songs yet. Please check the `/tracks/` API or mock data.",
      ),
    };
  }

  if (containsAny(text, ["tam dung", "pause", "dung nhac", "ngung nhac"])) {
    return {
      type: "control",
      control: "pause",
      reply: say(language, "Đã tạm dừng nhạc.", "Music paused."),
    };
  }

  if (containsAny(text, ["tiep tuc", "resume", "phat tiep", "play tiep"])) {
    if (!options.nowPlaying) {
      const song = randomItem(availableSongs);
      return {
        type: "play",
        song,
        reason: "random",
        reply: say(
          language,
          `Chưa có bài đang chọn, mình phát luôn "${song.title}" — ${song.artist}.`,
          `Nothing was selected, so I’m playing "${song.title}" — ${song.artist}.`,
        ),
      };
    }

    return {
      type: "control",
      control: "resume",
      reply: say(language, "Tiếp tục phát nhạc.", "Resuming music."),
    };
  }

  if (containsAny(text, ["bai tiep", "next", "chuyen bai", "skip"])) {
    return {
      type: "control",
      control: "next",
      reply: say(
        language,
        "Chuyển sang bài tiếp theo.",
        "Skipping to the next song.",
      ),
    };
  }

  if (containsAny(text, ["bai truoc", "previous", "quay lai", "back"])) {
    return {
      type: "control",
      control: "previous",
      reply: say(
        language,
        "Quay lại bài trước.",
        "Going back to the previous song.",
      ),
    };
  }

  if (containsAny(text, ["tat tieng", "mute"])) {
    return {
      type: "volume",
      value: 0,
      muted: true,
      reply: say(language, "Đã tắt tiếng.", "Muted."),
    };
  }

  const volumeMatch = text.match(
    /(?:am luong|volume|vol)\s*(?:la|=|to|nho)?\s*(\d{1,3})/,
  );
  if (volumeMatch?.[1]) {
    const value = Math.max(0, Math.min(100, Number(volumeMatch[1])));

    return {
      type: "volume",
      value,
      muted: value === 0,
      reply: say(
        language,
        `Đã chỉnh âm lượng về ${value}%.`,
        `Volume set to ${value}%.`,
      ),
    };
  }

  if (
    containsAny(text, [
      "ngau nhien",
      "random",
      "bat ky",
      "bai nao cung duoc",
      "gi cung duoc",
      "surprise",
    ])
  ) {
    const song = randomItem(availableSongs);

    return {
      type: "play",
      song,
      reason: "random",
      reply: say(
        language,
        `Mình phát ngẫu nhiên "${song.title}" — ${song.artist}.`,
        `Playing a random song: "${song.title}" — ${song.artist}.`,
      ),
    };
  }

  const artistMatch = findArtistMatch(input, availableSongs);
  if (artistMatch && artistMatch.candidates.length > 0) {
    const song = randomItem(artistMatch.candidates);

    return {
      type: "play",
      song,
      reason: "artist",
      confidence: artistMatch.confidence,
      matchedText: artistMatch.artist,
      reply: say(
        language,
        `Đã phát một bài của ${artistMatch.artist}: "${song.title}".`,
        `Playing ${artistMatch.artist}: "${song.title}".`,
      ),
    };
  }

  const mood = detectMood(input);
  if (mood) {
    const moodSongs = availableSongs.filter(
      (song) => song.emotion === mood || song.mood === mood,
    );
    const pool = moodSongs.length > 0 ? moodSongs : availableSongs;
    const song = randomItem(pool);
    const label =
      language === "en" ? emotionLabelEn[mood] : emotionLabelVi[mood];

    return {
      type: "play",
      song,
      reason: "mood",
      emotion: mood,
      reply: say(
        language,
        `Mình chọn nhạc ${label}: "${song.title}" — ${song.artist}.`,
        `I picked ${label} music: "${song.title}" — ${song.artist}.`,
      ),
    };
  }

  const titleMatch = findTitleMatch(input, availableSongs);
  if (titleMatch) {
    const reason: CommandReason =
      titleMatch.confidence >= 0.86 ? "title" : "fuzzy";

    return {
      type: "play",
      song: titleMatch.song,
      reason,
      confidence: titleMatch.confidence,
      matchedText: titleMatch.query,
      reply:
        reason === "fuzzy"
          ? say(
              language,
              `Mình hiểu bạn muốn nghe "${titleMatch.song.title}" vì gần khớp với "${titleMatch.query}". Đang phát nhé.`,
              `I think you meant "${titleMatch.song.title}" from "${titleMatch.query}". Playing it now.`,
            )
          : say(
              language,
              `Đang phát "${titleMatch.song.title}" — ${titleMatch.song.artist}.`,
              `Playing "${titleMatch.song.title}" — ${titleMatch.song.artist}.`,
            ),
    };
  }

  return {
    type: "help",
    reply: say(
      language,
      `Mình chưa tìm được bài phù hợp. Bạn có thể thử: "phát ngẫu nhiên", "nhạc buồn", "nhạc của BLACKPINK", hoặc một tên bài như ${suggestions(availableSongs)}.`,
      `I could not find a matching song. Try: "play random", "sad music", "music by BLACKPINK", or a title like ${suggestions(availableSongs)}.`,
    ),
  };
}
