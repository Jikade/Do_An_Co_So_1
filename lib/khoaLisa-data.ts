import {
  BrainCircuit,
  CloudRain,
  Compass,
  Headphones,
  Home,
  Library,
  MoonStar,
  Music2,
  Palette,
  Search,
  Settings,
  Sparkles,
  UserRound,
  Waves,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { mockPlaylists, mockSongs, mockUser, type Playlist, type Song } from '@/lib/duLieuGiaLap'

export interface LandingFeature {
  title: string
  description: string
  icon: LucideIcon
}

export interface MoodCardItem {
  slug: string
  title: string
  subtitle: string
  accent: string
  icon: LucideIcon
}

export interface StudioNavItem {
  label: string
  href: string
  icon: LucideIcon
}

export interface SpotlightCard {
  title: string
  subtitle: string
  value: string
}

export const studioNavItems: StudioNavItem[] = [
  { label: 'Home', href: '/app', icon: Home },
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Library', href: '/library', icon: Library },
  { label: 'Playlist', href: '/playlist/pl2', icon: Music2 },
  { label: 'Profile', href: '/profile', icon: UserRound },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export const landingFeatures: LandingFeature[] = [
  {
    title: 'Goi y theo cam xuc',
    description: 'Tap trung vao tam trang hien tai de dua ra playlist vua dep, vua dung mood.',
    icon: BrainCircuit,
  },
  {
    title: 'Giao dien doi mau theo bai hat',
    description: 'Bang mau chuyen dong tinh te theo album art, giu trai nghiem lien mach va dien anh.',
    icon: Palette,
  },
  {
    title: 'Ca nhan hoa that su',
    description: 'Tu tiep tuc nghe den goi y moi, moi khoanh khac deu co cam giac duoc chon rieng.',
    icon: Sparkles,
  },
]

export const landingMoods: MoodCardItem[] = [
  {
    slug: 'chill-dem',
    title: 'Chill dem',
    subtitle: 'Mong, muot, de troi di cham.',
    accent: 'from-violet-500/35 via-fuchsia-500/15 to-transparent',
    icon: MoonStar,
  },
  {
    slug: 'buon',
    title: 'Buon',
    subtitle: 'Nhe, sau va co mot chut am.',
    accent: 'from-sky-500/30 via-indigo-500/15 to-transparent',
    icon: CloudRain,
  },
  {
    slug: 'tang-dong',
    title: 'Tang dong',
    subtitle: 'Bat nhip nhanh, day nang luong.',
    accent: 'from-cyan-400/30 via-emerald-400/15 to-transparent',
    icon: Zap,
  },
  {
    slug: 'mua',
    title: 'Mua',
    subtitle: 'Lanh, mo va rat de tap trung.',
    accent: 'from-slate-400/25 via-sky-500/15 to-transparent',
    icon: CloudRain,
  },
  {
    slug: 'tap-trung',
    title: 'Tap trung',
    subtitle: 'Sach, toi gian, khong lam phien.',
    accent: 'from-emerald-400/30 via-cyan-400/15 to-transparent',
    icon: Headphones,
  },
]

export const landingSpotlights: SpotlightCard[] = [
  { title: 'Adaptive color', subtitle: 'visual engine', value: '02s' },
  { title: 'Mood precision', subtitle: 'recommendation fit', value: '92%' },
  { title: 'Personal flow', subtitle: 'from discovery to replay', value: '24/7' },
]

export const dashboardData = {
  greetingName: mockUser.name,
  welcomeTitle: 'Thiet ke de nghe nhac that su de chiu',
  welcomeSubtitle:
    'Khoi dong nhanh, bo cuc thoang, cac section vua du de ban tiep tuc nghe, kham pha va quay lai bai dang mo.',
  continueListening: mockSongs.slice(0, 3),
  recommendedSongs: mockSongs.slice(5, 9),
  trendingSongs: [mockSongs[2], mockSongs[8], mockSongs[11], mockSongs[10]],
  newReleases: [mockSongs[1], mockSongs[6], mockSongs[7], mockSongs[9]],
  quickStats: [
    { label: 'Minutes today', value: '126' },
    { label: 'Saved mixes', value: '18' },
    { label: 'Focus streak', value: '6 days' },
  ],
}

export const appPreviewPlaylist = mockSongs.slice(0, 4)

export const appPreviewHighlights = [
  { label: 'Mood', value: 'Late night glow' },
  { label: 'Scene', value: 'Seamless player + queue' },
  { label: 'Vibe', value: 'Premium dark cinematic' },
]

export function getPlaylistById(id: string): Playlist | undefined {
  return mockPlaylists.find((playlist) => playlist.id === id)
}

export function getSongsForPlaylist(id: string): Song[] {
  return getPlaylistById(id)?.songs ?? mockSongs.slice(0, 4)
}

export function getTimeGreeting(hour = new Date().getHours()): string {
  if (hour < 12) return 'Chao buoi sang'
  if (hour < 18) return 'Chao buoi chieu'
  return 'Chao buoi toi'
}

export const libraryShelves = [
  { title: 'Recently saved', items: mockSongs.slice(0, 4) },
  { title: 'Your mood playlists', items: mockSongs.slice(4, 8) },
]

export const profileMoments = [
  'Ban nghe nhieu nhat vao 22:00 - 00:00.',
  'Mau sac yeu thich nghieng ve violet, cyan va pink.',
  'Playlist lang man duoc quay lai nhieu nhat trong tuan.',
]

export const settingGroups = [
  {
    title: 'Playback',
    items: ['Crossfade nhe', 'Autoplay theo mood', 'Chat luong uu tien cao'],
  },
  {
    title: 'Personalization',
    items: ['Tong hop lich su nghe', 'Dong bo palette theo bai hat', 'Goi y theo khoang thoi gian'],
  },
  {
    title: 'Privacy',
    items: ['Cho phep camera khi can', 'Micro chi kich hoat khi xac nhan', 'Du lieu cam xuc co the xoa nhanh'],
  },
]

export const exploreHints = [
  { label: 'For rainy nights', icon: CloudRain },
  { label: 'Focus deep work', icon: Compass },
  { label: 'High-energy mixes', icon: Waves },
]
