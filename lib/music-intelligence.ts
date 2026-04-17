import type { Emotion, Language } from '@/lib/duLieuGiaLap'

export interface TasteSlice {
  id: string
  label: Record<Language, string>
  value: number
  accent: string
}

export interface ListeningWindow {
  id: string
  label: Record<Language, string>
  summary: Record<Language, string>
  value: number
}

export interface TasteCluster {
  id: string
  title: Record<Language, string>
  description: Record<Language, string>
  accent: string
}

export interface AssistantQuickAction {
  id: string
  label: Record<Language, string>
  prompt: Record<Language, string>
}

export interface MoodModeDescriptor {
  id: 'text' | 'voice' | 'face'
  title: Record<Language, string>
  description: Record<Language, string>
  helper: Record<Language, string>
}

export const tasteProfile = {
  topGenres: [
    { id: 'kpop', label: { vi: 'K-Pop', en: 'K-Pop' }, value: 42, accent: '#ff5db1' },
    { id: 'lofi', label: { vi: 'Lo-fi', en: 'Lo-fi' }, value: 28, accent: '#7c8dff' },
    { id: 'rnb', label: { vi: 'R&B', en: 'R&B' }, value: 18, accent: '#a78bfa' },
    { id: 'indie', label: { vi: 'Indie', en: 'Indie' }, value: 12, accent: '#1ed760' },
  ] as TasteSlice[],
  topArtists: [
    { id: 'blackpink', label: { vi: 'BLACKPINK', en: 'BLACKPINK' }, value: 31, accent: '#ff5db1' },
    { id: 'lisa', label: { vi: 'LISA', en: 'LISA' }, value: 24, accent: '#ff8ec7' },
    { id: 'midnight-echo', label: { vi: 'Midnight Echo', en: 'Midnight Echo' }, value: 16, accent: '#7c8dff' },
  ] as TasteSlice[],
  topMoods: [
    { id: 'happy', label: { vi: 'Vui vẻ', en: 'Happy' }, value: 34, accent: '#f59e0b' },
    { id: 'calm', label: { vi: 'Bình yên', en: 'Calm' }, value: 27, accent: '#10b981' },
    { id: 'romantic', label: { vi: 'Lãng mạn', en: 'Romantic' }, value: 21, accent: '#ec4899' },
    { id: 'nostalgic', label: { vi: 'Hoài niệm', en: 'Nostalgic' }, value: 18, accent: '#f97316' },
  ] as TasteSlice[],
  listeningWindows: [
    {
      id: 'late-night',
      label: { vi: '21:00 - 23:30', en: '9:00 PM - 11:30 PM' },
      summary: {
        vi: 'Khung giờ nghe nhiều nhất với playlist thư giãn và replay comfort.',
        en: 'Your strongest listening window, dominated by comfort replays and softer playlists.',
      },
      value: 91,
    },
    {
      id: 'focus-block',
      label: { vi: '13:00 - 15:00', en: '1:00 PM - 3:00 PM' },
      summary: {
        vi: 'Âm nhạc tập trung và lofi xuất hiện dày đặc trong lúc học / làm việc.',
        en: 'Focus sessions and lo-fi tracks dominate your study and work blocks.',
      },
      value: 72,
    },
  ] as ListeningWindow[],
  clusters: [
    {
      id: 'late-night-listener',
      title: { vi: 'Late-night listener', en: 'Late-night listener' },
      description: {
        vi: 'Bạn nghe nhạc nhiều nhất vào buổi tối, ưu tiên comfort replay, chill pop và playlist có nhịp vừa.',
        en: 'You listen most at night, leaning toward comfort replays, chill pop, and mid-tempo playlists.',
      },
      accent: '#7c8dff',
    },
    {
      id: 'mood-driven-discovery',
      title: { vi: 'Mood-driven discovery', en: 'Mood-driven discovery' },
      description: {
        vi: 'Đề xuất hiệu quả nhất khi kết hợp cảm xúc hiện tại với gu nhạc đã học được từ lịch sử nghe.',
        en: 'Recommendations work best when current mood is blended with the taste profile learned from your history.',
      },
      accent: '#1ed760',
    },
  ] as TasteCluster[],
  recommendationReasons: {
    happy: {
      vi: 'Ưu tiên những bài giúp giữ nhịp hưng phấn nhưng vẫn sáng, dễ replay.',
      en: 'Favor upbeat tracks that sustain momentum while staying replay-friendly.',
    },
    calm: {
      vi: 'Kết hợp lo-fi, indie nhẹ và vocal mềm để giữ trạng thái cân bằng.',
      en: 'Blend lo-fi, light indie, and soft vocals to protect a balanced state.',
    },
    sad: {
      vi: 'Bắt đầu bằng bài đồng cảm, sau đó nâng dần năng lượng để tránh chìm sâu.',
      en: 'Start with validating songs, then slowly raise the energy to avoid emotional drop-off.',
    },
    romantic: {
      vi: 'Ưu tiên nhịp vừa, vocal gần và playlist có chiều sâu cảm xúc.',
      en: 'Favor mid-tempo tracks, intimate vocals, and emotionally deep playlists.',
    },
    energetic: {
      vi: 'Đẩy nhanh tempo, giữ sắc thái mạnh và rõ nhịp để tăng động lực.',
      en: 'Push tempo upward and keep the rhythm sharp to maximize momentum.',
    },
    angry: {
      vi: 'Ưu tiên bài xả áp có beat mạnh rồi hạ dần về vùng ổn định hơn.',
      en: 'Use high-impact tracks for release first, then transition toward steadier territory.',
    },
    nostalgic: {
      vi: 'Chọn các bài có texture ấm, nhịp vừa và cảm giác hồi tưởng rõ rệt.',
      en: 'Lean into warm textures, mid-tempo pacing, and strong memory cues.',
    },
    stressed: {
      vi: 'Giảm cường độ bằng vocal mềm, ambient nhè nhẹ và nhịp thở âm thanh ổn định.',
      en: 'Lower intensity through soft vocals, light ambient layers, and stable sonic pacing.',
    },
  } as Record<Emotion, Record<Language, string>>,
}

export const moodModes: MoodModeDescriptor[] = [
  {
    id: 'text',
    title: { vi: 'Đọc tâm trạng từ văn bản', en: 'Read mood from text' },
    description: {
      vi: 'Cho người dùng gõ nhanh trạng thái hiện tại và nhận playlist tương ứng.',
      en: 'Let the user type their current state and get a matching listening direction.',
    },
    helper: {
      vi: 'Phù hợp khi muốn nói rõ cảm xúc, ý nghĩ hoặc bối cảnh.',
      en: 'Best when the user wants to describe feelings, thoughts, or context directly.',
    },
  },
  {
    id: 'voice',
    title: { vi: 'Phân tích sắc thái giọng nói', en: 'Analyze vocal tone' },
    description: {
      vi: 'Lấy nhịp nói, cường độ và sắc thái để ước lượng tâm trạng.',
      en: 'Use pacing, intensity, and vocal tone to estimate emotional state.',
    },
    helper: {
      vi: 'Phù hợp khi người dùng muốn nói tự nhiên thay vì gõ.',
      en: 'Best when the user prefers natural speech instead of typing.',
    },
  },
  {
    id: 'face',
    title: { vi: 'Đọc biểu cảm khuôn mặt', en: 'Read facial expression' },
    description: {
      vi: 'Ưu tiên phản ứng rất nhanh để chuyển ngay sang playlist phù hợp.',
      en: 'Optimized for quick emotional reading and fast playlist transition.',
    },
    helper: {
      vi: 'Phù hợp cho trải nghiệm chạm nhanh, nhìn nhanh, nghe ngay.',
      en: 'Best for a glance-and-play experience.',
    },
  },
]

export const assistantQuickActions: AssistantQuickAction[] = [
  {
    id: 'calm-play',
    label: { vi: 'Phát gì đó dịu lại', en: 'Play something calm' },
    prompt: { vi: 'Phát nhạc giúp mình dịu lại', en: 'Play something calm' },
  },
  {
    id: 'voice-mode',
    label: { vi: 'Mở voice detection', en: 'Open voice detection' },
    prompt: { vi: 'Mở nhận diện giọng nói', en: 'Open voice detection' },
  },
  {
    id: 'taste-profile',
    label: { vi: 'Cho mình xem gu nhạc', en: 'Show my taste profile' },
    prompt: { vi: 'Cho mình xem gu nhạc', en: 'Show my taste profile' },
  },
  {
    id: 'focus-playlist',
    label: { vi: 'Tạo playlist tập trung', en: 'Build a focus playlist' },
    prompt: { vi: 'Tạo playlist tập trung', en: 'Build a focus playlist' },
  },
]

const keywordMap: Array<{ emotion: Emotion; keywords: string[] }> = [
  { emotion: 'happy', keywords: ['vui', 'happy', 'fresh', 'sunny', 'hứng', 'phấn khích'] },
  { emotion: 'sad', keywords: ['buồn', 'sad', 'down', 'mệt', 'tụt mood', 'cry'] },
  { emotion: 'calm', keywords: ['calm', 'bình yên', 'dịu', 'nhẹ', 'relax', 'thư giãn'] },
  { emotion: 'angry', keywords: ['giận', 'angry', 'ức', 'bực', 'stress mạnh'] },
  { emotion: 'romantic', keywords: ['romantic', 'thích', 'yêu', 'crush', 'lụy'] },
  { emotion: 'nostalgic', keywords: ['hoài niệm', 'nostalgic', 'nhớ', 'xưa', 'kỷ niệm'] },
  { emotion: 'energetic', keywords: ['năng lượng', 'energetic', 'gym', 'workout', 'cháy', 'bốc'] },
  { emotion: 'stressed', keywords: ['căng', 'stress', 'overthinking', 'áp lực', 'lo âu'] },
]

export function detectEmotionFromText(input: string): Emotion {
  const normalized = input.toLowerCase()
  const found = keywordMap.find((entry) => entry.keywords.some((keyword) => normalized.includes(keyword)))
  return found?.emotion ?? 'calm'
}

export function localizedLabel(label: Record<Language, string>, language: Language) {
  return label[language]
}
