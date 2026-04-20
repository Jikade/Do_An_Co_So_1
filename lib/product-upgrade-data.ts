import {
  mockAnalytics,
  mockHistoryRecords,
  mockListeningHistory,
  mockPlaylists,
  mockSongs,
  type Emotion,
  type Language,
  type Playlist,
  type Song,
} from '@/lib/duLieuGiaLap'

export type DiscoveryMoodId =
  | 'happy'
  | 'sad'
  | 'focus'
  | 'healing'
  | 'relax'
  | 'lonely'
  | 'energetic'
  | 'sleep'

export interface LocalizedCopy {
  vi: string
  en: string
}

export interface DiscoveryMood {
  id: DiscoveryMoodId
  emotion: Emotion
  title: LocalizedCopy
  subtitle: LocalizedCopy
  accent: string
  playlistId: string
  songIds: string[]
}

export interface GenreCollection {
  id: string
  title: LocalizedCopy
  subtitle: LocalizedCopy
  accent: string
  playlistIds: string[]
  songIds: string[]
}

export interface AIPick {
  id: string
  title: LocalizedCopy
  reason: LocalizedCopy
  emotion: Emotion
  songId: string
}

export interface PremiumFeature {
  title: LocalizedCopy
  detail: LocalizedCopy
}

export interface LibraryCluster {
  id: string
  title: LocalizedCopy
  subtitle: LocalizedCopy
  accent: string
  songIds: string[]
}

export interface HowItWorksStep {
  id: string
  title: LocalizedCopy
  description: LocalizedCopy
}

export interface PersonalizedPreviewItem {
  id: string
  label: LocalizedCopy
  value: LocalizedCopy
  detail: LocalizedCopy
}

export interface LandingTrustTag {
  id: string
  label: LocalizedCopy
}

export interface SessionRecommendation {
  id: string
  songId: string
  source: 'mood' | 'genre' | 'taste' | 'history' | 'assistant'
  explanation: LocalizedCopy
  confidence: number
  genre: LocalizedCopy
}

const moodCollectionsMap: DiscoveryMood[] = [
  {
    id: 'happy',
    emotion: 'happy',
    title: { vi: 'Vui vẻ', en: 'Happy' },
    subtitle: { vi: 'Sáng, bắt tai và rất dễ nghe lại.', en: 'Bright, high-energy replays.' },
    accent: 'from-amber-400/25 via-orange-400/10 to-transparent',
    playlistId: 'pl1',
    songIds: ['1', '6', '11', '3'],
  },
  {
    id: 'sad',
    emotion: 'sad',
    title: { vi: 'Buồn', en: 'Sad' },
    subtitle: { vi: 'Những bài hát biết đồng cảm trước khi kéo mood lên.', en: 'Soft empathy before lifting the mood.' },
    accent: 'from-sky-400/25 via-blue-500/10 to-transparent',
    playlistId: 'pl3',
    songIds: ['5', '7', '10', '4'],
  },
  {
    id: 'focus',
    emotion: 'calm',
    title: { vi: 'Tập trung', en: 'Focus' },
    subtitle: { vi: 'Nhịp đều, sạch và giữ đầu óc ở đúng luồng.', en: 'Clean and steady for deep work.' },
    accent: 'from-emerald-400/22 via-cyan-400/10 to-transparent',
    playlistId: 'pl6',
    songIds: ['10', '2', '8', '6'],
  },
  {
    id: 'healing',
    emotion: 'calm',
    title: { vi: 'Chữa lành', en: 'Healing' },
    subtitle: { vi: 'Dịu hơn, ấm hơn và bớt áp lực hơn.', en: 'Softer, warmer, and less demanding.' },
    accent: 'from-emerald-400/22 via-lime-300/10 to-transparent',
    playlistId: 'pl6',
    songIds: ['10', '7', '2', '8'],
  },
  {
    id: 'relax',
    emotion: 'calm',
    title: { vi: 'Thư giãn', en: 'Relax' },
    subtitle: { vi: 'Hạ nhịp nghe xuống và mở ra khoảng thở.', en: 'Lower the pace and open breathing room.' },
    accent: 'from-cyan-400/25 via-teal-400/10 to-transparent',
    playlistId: 'pl6',
    songIds: ['10', '2', '6', '8'],
  },
  {
    id: 'lonely',
    emotion: 'nostalgic',
    title: { vi: 'Cô đơn', en: 'Lonely' },
    subtitle: { vi: 'Ấm, hoài niệm và vẫn có điểm tựa cảm xúc.', en: 'Warm nostalgia with emotional support.' },
    accent: 'from-orange-400/22 via-amber-300/10 to-transparent',
    playlistId: 'pl5',
    songIds: ['4', '5', '7', '10'],
  },
  {
    id: 'energetic',
    emotion: 'energetic',
    title: { vi: 'Năng động', en: 'Energetic' },
    subtitle: { vi: 'Nhịp nhanh, sắc và đẩy động lực lên rõ rệt.', en: 'Sharp tempo and momentum.' },
    accent: 'from-rose-400/24 via-red-500/10 to-transparent',
    playlistId: 'pl4',
    songIds: ['3', '9', '11', '6'],
  },
  {
    id: 'sleep',
    emotion: 'calm',
    title: { vi: 'Dễ ngủ', en: 'Sleep' },
    subtitle: { vi: 'Chậm, mềm và rất ít góc cạnh.', en: 'Slow and gentle wind-down listening.' },
    accent: 'from-violet-400/22 via-indigo-500/10 to-transparent',
    playlistId: 'pl6',
    songIds: ['10', '2', '7', '8'],
  },
]

export const moodCollections = moodCollectionsMap

export const genreCollections: GenreCollection[] = [
  {
    id: 'pop',
    title: { vi: 'Pop', en: 'Pop' },
    subtitle: { vi: 'Dễ bật nghe ngay, gọn và bắt tai.', en: 'Immediate, easy-start picks.' },
    accent: 'from-pink-400/22 via-rose-400/10 to-transparent',
    playlistIds: ['pl1', 'pl2'],
    songIds: ['1', '6', '8', '11'],
  },
  {
    id: 'ballad',
    title: { vi: 'Ballad', en: 'Ballad' },
    subtitle: { vi: 'Vocal giàu cảm xúc, hợp những phiên nghe đêm.', en: 'Emotion-forward vocals for late nights.' },
    accent: 'from-blue-400/20 via-violet-400/10 to-transparent',
    playlistIds: ['pl2', 'pl3'],
    songIds: ['2', '5', '7', '12'],
  },
  {
    id: 'lofi',
    title: { vi: 'Lofi', en: 'Lofi' },
    subtitle: { vi: 'Cho học tập, làm việc và những lúc cần yên.', en: 'For study, work, and quiet sessions.' },
    accent: 'from-cyan-400/22 via-sky-400/10 to-transparent',
    playlistIds: ['pl6'],
    songIds: ['10', '7', '2', '6'],
  },
  {
    id: 'indie',
    title: { vi: 'Indie', en: 'Indie' },
    subtitle: { vi: 'Ấm, mềm nhưng vẫn có chất riêng.', en: 'Warm textures with personality.' },
    accent: 'from-emerald-400/22 via-teal-400/10 to-transparent',
    playlistIds: ['pl5', 'pl6'],
    songIds: ['4', '7', '10', '11'],
  },
  {
    id: 'edm',
    title: { vi: 'EDM', en: 'EDM' },
    subtitle: { vi: 'Beat lớn, vào nhanh và nâng nhịp rõ.', en: 'Big beats and fast lift-offs.' },
    accent: 'from-red-400/24 via-orange-400/12 to-transparent',
    playlistIds: ['pl4'],
    songIds: ['3', '9', '11', '6'],
  },
  {
    id: 'kpop',
    title: { vi: 'K-pop', en: 'K-pop' },
    subtitle: { vi: 'Mainstream, polished và rất dễ replay.', en: 'Mainstream, polished, and replayable.' },
    accent: 'from-fuchsia-400/24 via-pink-400/12 to-transparent',
    playlistIds: ['pl1', 'pl2'],
    songIds: ['1', '2', '3', '8'],
  },
  {
    id: 'vpop',
    title: { vi: 'V-pop', en: 'V-pop' },
    subtitle: { vi: 'Gần gũi, tình cảm và dễ quay lại.', en: 'Closer, more intimate replay choices.' },
    accent: 'from-amber-400/22 via-orange-400/10 to-transparent',
    playlistIds: ['pl3', 'pl5'],
    songIds: ['4', '5', '7', '12'],
  },
  {
    id: 'chill',
    title: { vi: 'Chill', en: 'Chill' },
    subtitle: { vi: 'Nhịp chậm, không gian rộng và mood mềm.', en: 'Soft pace inside the dark shell.' },
    accent: 'from-slate-300/14 via-sky-400/10 to-transparent',
    playlistIds: ['pl6', 'pl3'],
    songIds: ['10', '7', '2', '5'],
  },
  {
    id: 'acoustic',
    title: { vi: 'Acoustic', en: 'Acoustic' },
    subtitle: { vi: 'Mộc, rõ và rất gần người nghe.', en: 'Minimal production, closer vocals.' },
    accent: 'from-lime-300/18 via-emerald-400/10 to-transparent',
    playlistIds: ['pl5', 'pl2'],
    songIds: ['4', '5', '8', '2'],
  },
]

export const premiumFeatures: PremiumFeature[] = [
  {
    title: { vi: 'Playlist thích ứng', en: 'Adaptive playlists' },
    detail: { vi: 'Playlist đổi theo cảm xúc, lịch sử nghe và khung giờ quen thuộc.', en: 'Playlists adapt to mood, history, and listening windows.' },
  },
  {
    title: { vi: 'Phân tích sâu hơn', en: 'Richer insights' },
    detail: { vi: 'Đọc sâu hơn về gu nghe, vòng lặp nghe lại và hành vi nghe nhạc.', en: 'Deeper taste, replay-loop, and behavior cluster insights.' },
  },
  {
    title: { vi: 'Nhận diện cảm xúc nâng cao', en: 'Advanced mood analysis' },
    detail: { vi: 'Tổng hợp chi tiết hơn từ văn bản, giọng nói và khuôn mặt.', en: 'More detailed fusion across text, voice, and face modes.' },
  },
  {
    title: { vi: 'Trợ lý chuyên sâu', en: 'Assistant depth' },
    detail: { vi: 'Trợ lý có thể giải thích, tạo playlist và gợi ý theo mục tiêu nghe.', en: 'Copilot can explain, build playlists, and map listening goals.' },
  },
]

export const landingTrustTags: LandingTrustTag[] = [
  { id: 'mood-detect', label: { vi: 'Nhận diện cảm xúc', en: 'Mood detection' } },
  { id: 'taste-profile', label: { vi: 'Hồ sơ gu nghe', en: 'Taste profile' } },
  { id: 'assistant-guided', label: { vi: 'Gợi ý có trợ lý', en: 'Assistant-guided picks' } },
]

export const aiPicks: AIPick[] = [
  {
    id: 'ai-happy-reset',
    title: { vi: 'Nạp lại năng lượng', en: 'Happy reset' },
    reason: {
      vi: 'Được đẩy lên cao vì cậu hay replay Pop vui sau 21:00 và phiên gần nhất có mood sáng.',
      en: 'Ranked high because you replay happy pop after 9 PM and your latest session was upbeat.',
    },
    emotion: 'happy',
    songId: '11',
  },
  {
    id: 'ai-soft-landing',
    title: { vi: 'Hạ cánh nhẹ', en: 'Soft landing' },
    reason: {
      vi: 'Hợp khi chuyển từ mệt sang cân bằng, ưu tiên vocal mềm và tempo vừa.',
      en: 'Fits the transition from stress into balance with soft vocals and measured tempo.',
    },
    emotion: 'calm',
    songId: '10',
  },
  {
    id: 'ai-romantic-late-night',
    title: { vi: 'Lãng mạn đêm khuya', en: 'Late-night romantic' },
    reason: {
      vi: 'Kết hợp thói quen nghe đêm với xu hướng mở playlist lãng mạn gần đây.',
      en: 'This pairs your late-night cluster with a recent return to romantic listening.',
    },
    emotion: 'romantic',
    songId: '8',
  },
]

export const libraryClusters: LibraryCluster[] = [
  {
    id: 'saved-moods',
    title: { vi: 'Bộ sưu tập cảm xúc', en: 'Mood collections' },
    subtitle: { vi: 'Những nhóm bài cậu hay quay lại theo trạng thái cảm xúc.', en: 'Collections you revisit by emotional state.' },
    accent: 'from-cyan-400/22 via-violet-400/10 to-transparent',
    songIds: ['10', '8', '3', '5'],
  },
  {
    id: 'saved-recommendations',
    title: { vi: 'Gợi ý đã lưu', en: 'Saved recommendations' },
    subtitle: { vi: 'Những gợi ý được giữ lại để nghe vào lúc khác.', en: 'Recommendations saved for later sessions.' },
    accent: 'from-emerald-400/22 via-green-300/10 to-transparent',
    songIds: ['11', '2', '7', '1'],
  },
  {
    id: 'uploaded-tracks',
    title: { vi: 'Tải lên hoặc tạo mới', en: 'Uploaded or generated' },
    subtitle: { vi: 'Khu vực dành cho track cậu đưa vào hệ thống.', en: 'A ready shelf for tracks you bring into the system.' },
    accent: 'from-amber-400/20 via-orange-400/10 to-transparent',
    songIds: ['4', '6', '12', '9'],
  },
]

export const howItWorksSteps: HowItWorksStep[] = [
  {
    id: 'detect',
    title: { vi: 'Nhận diện cảm xúc', en: 'Detect your mood' },
    description: {
      vi: 'Đọc trạng thái qua văn bản, giọng nói hoặc khuôn mặt để hiểu cậu đang cần nghe gì.',
      en: 'Read your state through text, voice, or face to understand what you need to hear.',
    },
  },
  {
    id: 'taste',
    title: { vi: 'Hiểu gu nghe', en: 'Understand your taste' },
    description: {
      vi: 'Nhìn vào thể loại, nghệ sĩ yêu thích, vòng lặp nghe lại và khung giờ nghe mạnh nhất.',
      en: 'Look at your top genres, top artists, replay loops, and strongest listening windows.',
    },
  },
  {
    id: 'recommend',
    title: { vi: 'Gợi ý đúng bài', en: 'Recommend the right songs' },
    description: {
      vi: 'Ghép cảm xúc hiện tại với lịch sử nghe để tạo gợi ý có lý do rõ ràng.',
      en: 'Blend current mood with listening history to produce recommendations with clear reasoning.',
    },
  },
  {
    id: 'assistant',
    title: { vi: 'Nhanh hơn với trợ lý', en: 'Move faster with the assistant' },
    description: {
      vi: 'Trợ lý AI giúp phát nhạc, mở trang và đẩy nhanh đúng thứ cậu muốn nghe.',
      en: 'The assistant helps play music, open routes, and fast-track what you want to hear.',
    },
  },
]

export const personalizedPreview: PersonalizedPreviewItem[] = [
  {
    id: 'current-mood',
    label: { vi: 'Cảm xúc hiện tại', en: 'Current mood' },
    value: { vi: 'Thư giãn', en: 'Relax' },
    detail: { vi: 'Gần đây cậu nghiêng về những bài hạ nhịp và mở ra khoảng thở thoải mái.', en: 'Recently you have leaned toward tracks that lower the pace and open breathing room.' },
  },
  {
    id: 'favorite-genres',
    label: { vi: 'Thể loại nổi bật', en: 'Favorite genres' },
    value: { vi: 'K-pop • Lofi', en: 'K-pop • Lofi' },
    detail: { vi: 'Hai nhóm này xuất hiện nhiều nhất trong các phiên nghe lại.', en: 'These dominate your repeat-heavy sessions.' },
  },
  {
    id: 'top-artist',
    label: { vi: 'Nghệ sĩ nổi bật', en: 'Top artist' },
    value: { vi: 'BLACKPINK', en: 'BLACKPINK' },
    detail: { vi: 'Là nghệ sĩ cậu mở nhiều nhất ở các phiên cần thêm năng lượng.', en: 'Your strongest repeat artist when sessions need more momentum.' },
  },
  {
    id: 'late-night',
    label: { vi: 'Khung nghe đêm', en: 'Late-night pattern' },
    value: { vi: '21:00 - 23:30', en: '9:00 PM - 11:30 PM' },
    detail: { vi: 'Đây là lúc playlist sâu và những bài quen được mở lại nhiều nhất.', en: 'Late night is when mood-deep playlists and comfort repeats rise.' },
  },
  {
    id: 'assistant-picks',
    label: { vi: 'Gợi ý từ trợ lý', en: 'Assistant picks' },
    value: { vi: '3 lựa chọn ưu tiên', en: '3 priority picks' },
    detail: { vi: 'Trợ lý đẩy lên các bài có lý do rõ ràng cho từng phiên nghe.', en: 'The assistant pushes up tracks with explicit reasons for each session.' },
  },
]

export const featuredLandingPlaylistIds = ['pl1', 'pl2', 'pl6', 'pl4']

export const sessionRecommendations: SessionRecommendation[] = [
  {
    id: 'rec-1',
    songId: '10',
    source: 'mood',
    explanation: {
      vi: 'Hợp với trạng thái cân bằng hiện tại và nhịp nghe đêm của cậu.',
      en: 'Matches your balanced mood and late-night listening pattern.',
    },
    confidence: 94,
    genre: { vi: 'Lofi', en: 'Lofi' },
  },
  {
    id: 'rec-2',
    songId: '11',
    source: 'taste',
    explanation: {
      vi: 'Được ưu tiên vì cậu hay replay Pop sáng màu vào cuối ngày.',
      en: 'Prioritized because you replay bright pop near the end of the day.',
    },
    confidence: 91,
    genre: { vi: 'Pop', en: 'Pop' },
  },
  {
    id: 'rec-3',
    songId: '8',
    source: 'assistant',
    explanation: {
      vi: 'Trợ lý chọn bài này để giữ phiên nghe ấm, nhẹ và liền mạch.',
      en: 'The assistant picked this to keep the session warm, soft, and connected.',
    },
    confidence: 89,
    genre: { vi: 'Ballad', en: 'Ballad' },
  },
  {
    id: 'rec-4',
    songId: '3',
    source: 'genre',
    explanation: {
      vi: 'Đẩy lên cho lúc cậu muốn nâng nhịp và chuyển sang năng lượng cao.',
      en: 'Raised for moments when you want to switch into high energy.',
    },
    confidence: 88,
    genre: { vi: 'EDM', en: 'EDM' },
  },
  {
    id: 'rec-5',
    songId: '7',
    source: 'history',
    explanation: {
      vi: 'Quay lại từ lịch sử nghe gần đây và các phiên có xu hướng nội tâm.',
      en: 'Returned from recent history and introspective session patterns.',
    },
    confidence: 86,
    genre: { vi: 'Indie', en: 'Indie' },
  },
  {
    id: 'rec-6',
    songId: '2',
    source: 'taste',
    explanation: {
      vi: 'Chất vocal này hợp với cụm nghệ sĩ yêu thích và các phiên đầu tối.',
      en: 'This vocal texture fits your top-artist cluster and early-evening sessions.',
    },
    confidence: 90,
    genre: { vi: 'Ballad', en: 'Ballad' },
  },
]

export function localizedCopy(copy: LocalizedCopy, language: Language) {
  return copy[language]
}

export function getSongsByIds(songIds: string[]): Song[] {
  return songIds
    .map((songId) => mockSongs.find((song) => song.id === songId))
    .filter((song): song is Song => Boolean(song))
}

export function getPlaylistsByIds(playlistIds: string[]): Playlist[] {
  return playlistIds
    .map((playlistId) => mockPlaylists.find((playlist) => playlist.id === playlistId))
    .filter((playlist): playlist is Playlist => Boolean(playlist))
}

export function getMoodCollection(moodId: DiscoveryMoodId) {
  return moodCollectionsMap.find((collection) => collection.id === moodId) ?? moodCollectionsMap[0]
}

export function getGenreCollection(genreId: string) {
  return genreCollections.find((collection) => collection.id === genreId) ?? genreCollections[0]
}

export function getLatestMoodSource() {
  return mockListeningHistory[0] ?? null
}

export function getContinueListeningSongs() {
  return mockListeningHistory.slice(0, 4).map((item) => item.song)
}

export function getLikedSongs() {
  return mockHistoryRecords
    .filter((item) => item.action === 'liked')
    .map((item) => mockSongs.find((song) => song.id === item.songId))
    .filter((song): song is Song => Boolean(song))
}

export function getSavedRecommendationSongs() {
  return getSongsByIds(['11', '10', '8', '2'])
}

export function getAllSongsLibrary() {
  return mockSongs
}

export function getRecentlyPlayedLibrary() {
  return mockListeningHistory.slice(0, 6).map((item) => item.song)
}

export function getUserPlaylists() {
  return mockPlaylists.slice(0, 4)
}

export function getSavedPlaylists() {
  return mockPlaylists.slice(2, 6)
}

export function getForYouSongs(currentEmotion: Emotion) {
  const currentMoodSongs = mockSongs.filter((song) => song.emotion === currentEmotion)
  const lateNightSongs = getSongsByIds(['11', '8', '10', '2'])
  return [...currentMoodSongs, ...lateNightSongs]
    .filter((song, index, list) => list.findIndex((candidate) => candidate.id === song.id) === index)
    .slice(0, 4)
}

export function getForYouPlaylists(currentEmotion: Emotion) {
  const leading = mockPlaylists.find((playlist) => playlist.emotion === currentEmotion)
  const supporting = getPlaylistsByIds(['pl2', 'pl6', 'pl1'])
  return [leading, ...supporting]
    .filter((playlist, index, list): playlist is Playlist => Boolean(playlist) && list.findIndex((candidate) => candidate?.id === playlist?.id) === index)
    .slice(0, 3)
}

export function getUserLibraryStats() {
  return [
    { id: 'songs', value: `${mockSongs.length}`, label: { vi: 'Tất cả bài hát', en: 'All songs' } },
    { id: 'playlists', value: `${mockPlaylists.length}`, label: { vi: 'Playlist', en: 'Playlists' } },
    { id: 'liked', value: `${getLikedSongs().length}`, label: { vi: 'Bài đã thích', en: 'Liked songs' } },
    {
      id: 'hours',
      value: `${mockAnalytics.weeklyListening.reduce((sum, item) => sum + item.hours, 0).toFixed(1)}h`,
      label: { vi: 'Tuần này', en: 'This week' },
    },
  ]
}

export function getFeaturedLandingPlaylists() {
  return getPlaylistsByIds(featuredLandingPlaylistIds)
}

export function getSessionRecommendations() {
  return sessionRecommendations
    .map((recommendation) => ({
      ...recommendation,
      song: mockSongs.find((song) => song.id === recommendation.songId),
    }))
    .filter((recommendation): recommendation is SessionRecommendation & { song: Song } => Boolean(recommendation.song))
}
