import type { Emotion } from '@/lib/duLieuGiaLap'

export type VideoTimeBucket = 'sang' | 'chieu' | 'toi' | 'dem'

export interface LocalVideoItem {
  id: string
  fileName: string
  title: string
  artist: string
  poster?: string
  moodLabel: string
  genreLabel: string
  sessionLabel: string
  accent: string
  moods: Emotion[]
  genres: string[]
  moments: VideoTimeBucket[]
  reasons: {
    mood: string
    genre: string
    session: string
    time: Partial<Record<VideoTimeBucket, string>>
  }
}

export interface CuratedVideoItem extends LocalVideoItem {
  reason: string
  score: number
  videoSrc: string
}

export type HomepageVideoCollectionId = 'all' | 'emotion' | 'genre' | 'taste' | 'tonight'

export interface HomepageVideoCollection {
  id: HomepageVideoCollectionId
  items: CuratedVideoItem[]
}

export const localVideoLibrary: LocalVideoItem[] = [
  {
    id: 'video-as-if-its-your-last',
    fileName: "(7) BLACKPINK - '마지막처럼 (AS IF IT'S YOUR LAST)' M-V - YouTube.mp4",
    title: "As If It's Your Last",
    artist: 'BLACKPINK',
    poster: '/img/as-if-your.png',
    moodLabel: 'Vui vẻ',
    genreLabel: 'K-pop',
    sessionLabel: 'MV sáng mood ngay từ đầu phiên',
    accent: 'from-pink-500/30 via-rose-400/18 to-transparent',
    moods: ['happy', 'romantic', 'energetic'],
    genres: ['k-pop', 'pop'],
    moments: ['chieu', 'toi'],
    reasons: {
      mood: 'Nâng mood vui lên rất nhanh mà vẫn giữ chất sang, bóng và bắt tai.',
      genre: 'Khớp trực tiếp với gu K-pop hiện tại của cậu.',
      session: 'Hợp để mở đầu phiên nghe khi cần một cú hích sáng và gọn.',
      time: {
        toi: 'Hợp với không khí buổi tối khi cậu muốn phiên nghe bừng sáng hơn.',
      },
    },
  },
  {
    id: 'video-go',
    fileName: '(7) BLACKPINK - GO M-V - YouTube.mp4',
    title: 'GO',
    artist: 'BLACKPINK',
    poster: '/img/go.png',
    moodLabel: 'Năng động',
    genreLabel: 'K-pop',
    sessionLabel: 'MV đẩy nhịp cho phiên này',
    accent: 'from-red-500/28 via-orange-400/16 to-transparent',
    moods: ['energetic', 'happy', 'angry'],
    genres: ['k-pop', 'pop', 'edm'],
    moments: ['chieu', 'toi'],
    reasons: {
      mood: 'Đẩy nhịp và tăng độ bốc cho phiên nghe đang cần nhiều năng lượng.',
      genre: 'Giữ đúng trục K-pop mà vẫn đủ mạnh để làm điểm bứt tốc.',
      session: 'Rất hợp với đoạn giữa phiên khi cậu muốn chuyển từ nghe sang bùng.',
      time: {
        chieu: 'Khớp với nhịp nghe buổi chiều khi cần thêm lực để tiếp tục.',
        toi: 'Lên hình đẹp và giữ năng lượng tốt cho phiên nghe buổi tối.',
      },
    },
  },
  {
    id: 'video-dream',
    fileName: '(7) LISA - DREAM feat. Kentaro Sakaguchi (Official Short Film MV) - YouTube.mp4',
    title: 'DREAM',
    artist: 'LISA ft. Kentaro Sakaguchi',
    poster: '/img/dream.png',
    moodLabel: 'Lãng mạn',
    genreLabel: 'K-pop',
    sessionLabel: 'MV dịu và điện ảnh cho tối nay',
    accent: 'from-violet-500/28 via-fuchsia-400/14 to-transparent',
    moods: ['romantic', 'calm', 'nostalgic'],
    genres: ['k-pop', 'ballad', 'pop'],
    moments: ['toi', 'dem'],
    reasons: {
      mood: 'Hợp với trạng thái mềm, gần và có chút mơ của phiên nghe hiện tại.',
      genre: 'Vừa đúng gu K-pop, vừa đủ điện ảnh để làm phiên nghe sâu hơn.',
      session: 'Đây là kiểu MV kéo cả mood lẫn hình ảnh vào cùng một nhịp.',
      time: {
        toi: 'Rất hợp với buổi tối khi cậu muốn phiên nghe trở nên lãng mạn hơn.',
        dem: 'Hợp với khung đêm khi cậu cần một MV mềm, đẹp và không ồn.',
      },
    },
  },
  {
    id: 'video-loi-hua-bo-quen',
    fileName: '(7) NHỮNG LỜI HỨA BỎ QUÊN - VŨ. x DEAR JANE (Official MV) tư Album -Bao Tang Cua Nuôi Tiêc- - YouTube.mp4',
    title: 'Những Lời Hứa Bỏ Quên',
    artist: 'VŨ. x DEAR JANE',
    poster: '/img/nhung-loi-hua-bo-quen.png',
    moodLabel: 'Buồn',
    genreLabel: 'Ballad',
    sessionLabel: 'MV hợp mood nội tâm',
    accent: 'from-sky-500/28 via-indigo-400/16 to-transparent',
    moods: ['sad', 'nostalgic', 'calm'],
    genres: ['ballad', 'indie', 'v-pop'],
    moments: ['toi', 'dem'],
    reasons: {
      mood: 'Rất hợp với khi phiên nghe đang nghiêng về cảm xúc sâu và có chút tiếc nuối.',
      genre: 'Khớp gu ballad, indie và kiểu nghe đào sâu ca từ.',
      session: 'Giữ phiên nghe chậm lại đúng lúc, không phá mạch cảm xúc.',
      time: {
        toi: 'Càng về tối, MV này càng hợp với nhịp nghe chậm và sâu.',
        dem: 'Đây là kiểu MV đêm khuya: mềm, buồn và rất dễ chạm.',
      },
    },
  },
  {
    id: 'video-chiu-cach-minh-noi-thua',
    fileName: '(7) RHYDER - CHỊU CÁCH MÌNH NÓI THUA - ft. BAN x COOLKID - OFFICIAL MUSIC VIDEO - YouTube.mp4',
    title: 'Chịu Cách Mình Nói Thua',
    artist: 'RHYDER ft. BAN x COOLKID',
    poster: '/img/chiu-cach-minh.png',
    moodLabel: 'Tâm trạng',
    genreLabel: 'V-pop',
    sessionLabel: 'MV được đẩy lên cho phiên này',
    accent: 'from-amber-500/24 via-orange-400/14 to-transparent',
    moods: ['nostalgic', 'sad', 'romantic'],
    genres: ['v-pop', 'pop', 'ballad'],
    moments: ['toi', 'dem'],
    reasons: {
      mood: 'Giữ mood tâm trạng vừa đủ, không quá nặng nhưng vẫn có chiều sâu.',
      genre: 'Khớp với gu V-pop hiện tại và cách nghe thiên về vocal.',
      session: 'Được chọn cho phiên này vì vừa có câu chuyện, vừa dễ giữ người xem ở lại.',
      time: {
        toi: 'Hợp với buổi tối khi cậu muốn một MV có cảm xúc nhưng vẫn hiện đại.',
      },
    },
  },
  {
    id: 'video-thuc-giac',
    fileName: '(7) Thức Giấc - Da LAB (Official Music Video) - YouTube.mp4',
    title: 'Thức Giấc',
    artist: 'Da LAB',
    moodLabel: 'Chữa lành',
    genreLabel: 'Indie',
    sessionLabel: 'Video dịu cho phiên cần thở',
    accent: 'from-emerald-500/24 via-teal-400/14 to-transparent',
    moods: ['calm', 'stressed', 'nostalgic'],
    genres: ['indie', 'pop', 'acoustic'],
    moments: ['sang', 'toi'],
    reasons: {
      mood: 'Rất hợp với lúc cậu muốn dịu lại và nghe một thứ có độ ấm.',
      genre: 'Khớp với gu indie mềm và kiểu nghe có ca từ gần người.',
      session: 'Hợp để làm khoảng nghỉ đẹp trong một phiên nghe dài.',
      time: {
        sang: 'Một kiểu video mở ngày mới nhẹ, sạch và dễ vào mood.',
        toi: 'Buổi tối xem rất vừa: không ồn, không nặng, chỉ đủ chạm.',
      },
    },
  },
  {
    id: 'video-mot-trieu-kha-nang',
    fileName: '(7) [Vietsub + Kara] Một triệu khả năng - Trương Hàm Vận - 一百万个可能 张含韵 - YouTube.mp4',
    title: 'Một Triệu Khả Năng',
    artist: 'Trương Hàm Vận',
    poster: '/img/mot-trieu-kha-nang.png',
    moodLabel: 'Bình yên',
    genreLabel: 'Ballad',
    sessionLabel: 'Video dịu cho cuối phiên',
    accent: 'from-cyan-500/24 via-sky-400/14 to-transparent',
    moods: ['calm', 'romantic', 'stressed'],
    genres: ['ballad', 'pop'],
    moments: ['toi', 'dem'],
    reasons: {
      mood: 'Phù hợp với trạng thái cần hạ nhịp và giữ không gian nghe mềm lại.',
      genre: 'Hợp gu ballad nhẹ, vocal sáng và dễ replay.',
      session: 'Rất hợp để khép phiên nghe theo hướng êm và sáng hơn.',
      time: {
        dem: 'Đây là kiểu video đêm khuya: mềm, sáng và giúp phiên nghe dịu xuống.',
      },
    },
  },
  {
    id: 'video-anh-vui',
    fileName: '(7) Anh Vui - Phạm Kỳ (Duzme Remix) - Anh Vui Đến Nỗi Nghẹn Ngào...Remix Tik Tok - YouTube.mp4',
    title: 'Anh Vui',
    artist: 'Phạm Kỳ',
    poster: '/img/anhvui.png',
    moodLabel: 'Xả stress',
    genreLabel: 'V-pop',
    sessionLabel: 'Video remix kéo mood lên nhanh',
    accent: 'from-orange-500/28 via-rose-400/14 to-transparent',
    moods: ['energetic', 'happy', 'stressed'],
    genres: ['v-pop', 'pop', 'edm'],
    moments: ['chieu', 'toi'],
    reasons: {
      mood: 'Hợp khi cậu muốn xả stress nhanh và kéo mood lên ngay.',
      genre: 'Khớp gu V-pop remix, dễ vào tai và giàu tính giải tỏa.',
      session: 'Tạo cảm giác phiên nghe đang sống động hơn, bớt tĩnh quá lâu.',
      time: {
        chieu: 'Buổi chiều mở rất hợp khi cần đổi năng lượng nhanh.',
      },
    },
  },
  {
    id: 'video-anh-met-roi',
    fileName: '(7) Anh Mệt Rồi x Em Ổn Không (Quoc Huy Remix) - Anh Quân Idol ft Trịnh Thiên Ân - YouTube.mp4',
    title: 'Anh Mệt Rồi x Em Ổn Không',
    artist: 'Anh Quân Idol ft. Trịnh Thiên Ân',
    moodLabel: 'Hoài niệm',
    genreLabel: 'V-pop',
    sessionLabel: 'Video hợp lúc phiên nghe chùng xuống',
    accent: 'from-slate-500/24 via-blue-400/14 to-transparent',
    moods: ['sad', 'nostalgic', 'stressed'],
    genres: ['v-pop', 'ballad', 'pop'],
    moments: ['toi', 'dem'],
    reasons: {
      mood: 'Khớp với khi cậu đang mệt, cần một video có cảm giác đồng điệu.',
      genre: 'Vẫn giữ trục V-pop quen tai nên rất dễ hòa vào phiên nghe.',
      session: 'Được kéo lên khi phiên nghe đang chùng xuống nhưng chưa muốn quá buồn.',
      time: {
        dem: 'Đêm khuya xem hợp hơn vì phần cảm xúc lên rõ và gần hơn.',
      },
    },
  },
  {
    id: 'video-bloody-mary',
    fileName: '(7) Bloody Mary Remix (refrain + dum dum, da-di-da) Tiktok remix (full version) - YouTube.mp4',
    title: 'Bloody Mary Remix',
    artist: 'Bản remix viral',
    moodLabel: 'Năng lượng cao',
    genreLabel: 'Pop remix',
    sessionLabel: 'Video tăng nhiệt cho phiên nghe',
    accent: 'from-fuchsia-500/30 via-violet-400/16 to-transparent',
    moods: ['energetic', 'angry', 'happy'],
    genres: ['pop', 'edm', 'electronic'],
    moments: ['toi', 'dem'],
    reasons: {
      mood: 'Hợp với lúc cậu muốn tăng nhịp thật nhanh và giải phóng năng lượng.',
      genre: 'Khớp gu pop remix có lực, gọn và dễ tạo cao trào.',
      session: 'Rất hợp để đổi màu phiên nghe khi mọi thứ đang quá hiền.',
      time: {
        toi: 'Buổi tối mở lên cho cảm giác rõ chất cinematic và mạnh hơn.',
        dem: 'Đêm khuya xem sẽ đậm chất dark-pop hơn hẳn.',
      },
    },
  },
]

function normalizeTag(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '')
}

function hasGenreMatch(item: LocalVideoItem | CuratedVideoItem, normalizedGenre: string) {
  return item.genres.some((genre) => normalizeTag(genre) === normalizedGenre)
}

function hasArtistMatch(item: LocalVideoItem | CuratedVideoItem, favoriteArtists: string[]) {
  const normalizedArtist = normalizeTag(item.artist)
  return favoriteArtists.some((artist) => normalizedArtist.includes(normalizeTag(artist)))
}

function pickDiverseVideos(items: CuratedVideoItem[], count: number) {
  const picked: CuratedVideoItem[] = []
  const usedIds = new Set<string>()
  const moodCounts = new Map<string, number>()
  const genreCounts = new Map<string, number>()

  while (picked.length < count) {
    const nextCandidate = items
      .filter((item) => !usedIds.has(item.id))
      .sort((left, right) => {
        const leftPenalty = (moodCounts.get(left.moodLabel) ?? 0) * 2 + (genreCounts.get(left.genreLabel) ?? 0) * 1.35
        const rightPenalty = (moodCounts.get(right.moodLabel) ?? 0) * 2 + (genreCounts.get(right.genreLabel) ?? 0) * 1.35
        return (right.score - rightPenalty) - (left.score - leftPenalty) || right.score - left.score
      })[0]

    if (!nextCandidate) break

    picked.push(nextCandidate)
    usedIds.add(nextCandidate.id)
    moodCounts.set(nextCandidate.moodLabel, (moodCounts.get(nextCandidate.moodLabel) ?? 0) + 1)
    genreCounts.set(nextCandidate.genreLabel, (genreCounts.get(nextCandidate.genreLabel) ?? 0) + 1)
  }

  return picked
}

function mergeCandidates(primary: CuratedVideoItem[], fallback: CuratedVideoItem[]) {
  const merged: CuratedVideoItem[] = []
  const seen = new Set<string>()

  for (const item of [...primary, ...fallback]) {
    if (seen.has(item.id)) continue
    merged.push(item)
    seen.add(item.id)
  }

  return merged
}

function mergeMultipleCandidates(...groups: CuratedVideoItem[][]) {
  return groups.reduce<CuratedVideoItem[]>((merged, group) => mergeCandidates(merged, group), [])
}

export function getVideoSrc(fileName: string) {
  return `/video/${encodeURIComponent(fileName)}`
}

export function getCurrentVideoTimeBucket(hour: number): VideoTimeBucket {
  if (hour < 11) return 'sang'
  if (hour < 17) return 'chieu'
  if (hour < 23) return 'toi'
  return 'dem'
}

export function getCuratedVideoPicks({
  currentEmotion,
  topGenre,
  hour,
}: {
  currentEmotion: Emotion
  topGenre: string
  hour: number
}): CuratedVideoItem[] {
  const timeBucket = getCurrentVideoTimeBucket(hour)
  const normalizedGenre = normalizeTag(topGenre)

  return localVideoLibrary
    .map((item) => {
      let score = 0
      let reason = item.reasons.session

      if (item.moods.includes(currentEmotion)) {
        score += 5
        reason = item.reasons.mood
      }

      if (item.genres.some((genre) => normalizeTag(genre) === normalizedGenre)) {
        score += 3
        if (!item.moods.includes(currentEmotion)) reason = item.reasons.genre
      }

      if (item.moments.includes(timeBucket)) {
        score += 2
        if (!item.moods.includes(currentEmotion) && !item.genres.some((genre) => normalizeTag(genre) === normalizedGenre)) {
          reason = item.reasons.time[timeBucket] ?? item.reasons.session
        }
      }

      return {
        ...item,
        score,
        reason,
        videoSrc: getVideoSrc(item.fileName),
      }
    })
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
}

export function getHomepageVideoCollections({
  currentEmotion,
  topGenre,
  hour,
  favoriteArtists = [],
}: {
  currentEmotion: Emotion
  topGenre: string
  hour: number
  favoriteArtists?: string[]
}): HomepageVideoCollection[] {
  const curated = getCuratedVideoPicks({ currentEmotion, topGenre, hour })
  const timeBucket = getCurrentVideoTimeBucket(hour)
  const normalizedGenre = normalizeTag(topGenre)
  const expandedCount = Math.min(localVideoLibrary.length, 10)

  const allSource = mergeMultipleCandidates(
    curated.filter((item) => item.moods.includes(currentEmotion)),
    curated.filter((item) => hasGenreMatch(item, normalizedGenre)),
    curated.filter((item) => item.moments.includes(timeBucket)),
    [...curated].sort((left, right) => {
      const leftBoost = (hasArtistMatch(left, favoriteArtists) ? 2.2 : 0) + (left.poster ? 0.6 : 0)
      const rightBoost = (hasArtistMatch(right, favoriteArtists) ? 2.2 : 0) + (right.poster ? 0.6 : 0)
      return (right.score + rightBoost) - (left.score + leftBoost)
    }),
    curated,
  )

  const allItems = pickDiverseVideos(allSource, expandedCount)

  const emotionSource = mergeCandidates(
    curated.filter((item) => item.moods.includes(currentEmotion)),
    curated,
  )

  const genreSource = mergeCandidates(
    curated.filter((item) => hasGenreMatch(item, normalizedGenre)),
    curated,
  )

  const tasteSource = [...curated]
    .sort((left, right) => {
      const leftBoost = (hasArtistMatch(left, favoriteArtists) ? 2.4 : 0) + (hasGenreMatch(left, normalizedGenre) ? 1.8 : 0) + (left.poster ? 0.6 : 0)
      const rightBoost = (hasArtistMatch(right, favoriteArtists) ? 2.4 : 0) + (hasGenreMatch(right, normalizedGenre) ? 1.8 : 0) + (right.poster ? 0.6 : 0)
      return (right.score + rightBoost) - (left.score + leftBoost)
    })

  const tonightSource = mergeCandidates(
    curated.filter((item) => item.moments.includes(timeBucket)),
    curated.filter((item) => item.moments.includes('toi') || item.moments.includes('dem')),
  )

  return [
    { id: 'all', items: allItems },
    { id: 'emotion', items: pickDiverseVideos(emotionSource, expandedCount) },
    { id: 'genre', items: pickDiverseVideos(genreSource, expandedCount) },
    { id: 'taste', items: pickDiverseVideos(tasteSource, expandedCount) },
    { id: 'tonight', items: pickDiverseVideos(mergeCandidates(tonightSource, curated), expandedCount) },
  ]
}
