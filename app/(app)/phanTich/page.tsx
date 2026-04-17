<<<<<<< HEAD
'use client'

import Link from 'next/link'
import {
  ArrowUpRight,
  BarChart3,
  Brain,
  Clock3,
  Headphones,
  Music2,
  Sparkles,
  Waves,
} from 'lucide-react'
import { useTheme } from '@/lib/nguCanhGiaoDien'
import { mockAnalytics, mockEmotions } from '@/lib/duLieuGiaLap'
import { localizedLabel, tasteProfile } from '@/lib/music-intelligence'
import { MoodBadge } from '@/components/huyHieuCamXuc'

export default function AnalyticsPage() {
  const { language, currentEmotion, fusionScore } = useTheme()

  const totalHours = mockAnalytics.weeklyListening.reduce((sum, item) => sum + item.hours, 0)
  const strongestMood = tasteProfile.topMoods[0]
  const strongestGenre = tasteProfile.topGenres[0]
  const strongestArtist = tasteProfile.topArtists[0]

  return (
    <div className="space-y-8 pb-10">
      <section className="surface-elevated overflow-hidden p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="pill-label text-[0.66rem] text-white/35">Taste intelligence</p>
            <h1 className="mt-4 text-3xl font-bold text-white md:text-4xl">
              {language === 'vi' ? 'Gu nhạc, mood pattern và nhịp nghe của bạn nằm ở đây.' : 'Your taste profile, mood pattern, and listening rhythm live here.'}
            </h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-white/62 md:text-base">
              {language === 'vi'
                ? 'Trang phân tích giờ không chỉ là thống kê khô. Nó gom cả genre, artist, mood, khung giờ nghe và logic đề xuất thành một bức chân dung nghe nhạc rõ ràng hơn.'
                : 'Analytics is no longer dry statistics. It now combines genre, artist, mood, listening windows, and recommendation logic into a clearer taste portrait.'}
            </p>
          </div>
          <div className="surface-panel p-4">
            <p className="pill-label text-[0.62rem] text-white/30">Current sync</p>
            <div className="mt-4 flex items-center gap-4">
              <MoodBadge emotion={currentEmotion} size="lg" animated />
              <div>
                <p className="text-3xl font-bold text-white">{fusionScore}%</p>
                <p className="text-xs text-white/42">{language === 'vi' ? 'Mood confidence' : 'Mood confidence'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="surface-panel p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04] text-[var(--brand-accent)]">
            <Music2 className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-white/46">{language === 'vi' ? 'Top genre' : 'Top genre'}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{localizedLabel(strongestGenre.label, language)}</h3>
          <p className="mt-2 text-sm text-white/42">{strongestGenre.value}% {language === 'vi' ? 'trọng số trong profile' : 'weight in your profile'}</p>
        </div>
        <div className="surface-panel p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04] text-[var(--song-primary)]">
            <Headphones className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-white/46">{language === 'vi' ? 'Top artist' : 'Top artist'}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{localizedLabel(strongestArtist.label, language)}</h3>
          <p className="mt-2 text-sm text-white/42">{strongestArtist.value}% {language === 'vi' ? 'xuất hiện trong replay' : 'presence in replay loops'}</p>
        </div>
        <div className="surface-panel p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04] text-[#f59e0b]">
            <Brain className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-white/46">{language === 'vi' ? 'Dominant mood' : 'Dominant mood'}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{localizedLabel(strongestMood.label, language)}</h3>
          <p className="mt-2 text-sm text-white/42">{strongestMood.value}% {language === 'vi' ? 'dấu vết mood' : 'mood share'}</p>
        </div>
        <div className="surface-panel p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.04] text-white">
            <Clock3 className="h-5 w-5" />
          </div>
          <p className="mt-4 text-sm text-white/46">{language === 'vi' ? 'Weekly hours' : 'Weekly hours'}</p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{totalHours.toFixed(1)}h</h3>
          <p className="mt-2 text-sm text-white/42">{language === 'vi' ? 'được giữ khá đều cả tuần' : 'kept fairly consistent across the week'}</p>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_24rem]">
        <div className="space-y-6">
          <div className="surface-elevated p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="pill-label text-[0.62rem] text-white/30">Profile clusters</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{language === 'vi' ? 'Hai lớp profile mạnh nhất của bạn' : 'Your strongest profile layers'}</h2>
              </div>
              <BarChart3 className="h-5 w-5 text-[var(--brand-accent)]" />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {tasteProfile.clusters.map((cluster) => (
                <div key={cluster.id} className="glass rounded-[1.5rem] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-white">{localizedLabel(cluster.title, language)}</h3>
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: cluster.accent }} />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/56">{localizedLabel(cluster.description, language)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-elevated p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="pill-label text-[0.62rem] text-white/30">Mood distribution</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{language === 'vi' ? 'Cảm xúc nào đang dẫn profile' : 'What mood leads your profile'}</h2>
              </div>
              <Link href="/nhanDienCamXuc" className="text-sm font-medium text-[var(--brand-accent)] hover:underline">
                {language === 'vi' ? 'Quét lại mood' : 'Scan mood again'}
              </Link>
            </div>
            <div className="mt-5 space-y-4">
              {tasteProfile.topMoods.map((mood) => {
                const matched = mockEmotions.find((item) => item.id === mood.id)
                return (
                  <div key={mood.id} className="rounded-[1.3rem] border border-white/6 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{matched?.emoji}</span>
                        <div>
                          <p className="text-sm font-medium text-white">{localizedLabel(mood.label, language)}</p>
                          <p className="text-xs text-white/42">{tasteProfile.recommendationReasons[mood.id as keyof typeof tasteProfile.recommendationReasons][language]}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-white">{mood.value}%</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                      <div className="h-full rounded-full" style={{ width: `${mood.value}%`, backgroundColor: mood.accent }} />
=======
"use client"

import { useState } from "react"
import Image from "next/image"
import { TrendingUp, TrendingDown, Clock, Music, Heart, Smile, BarChart3, PieChart, Calendar, ChevronDown, Sparkles, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockSongs, mockEmotions, mockGenres, translations } from "@/lib/duLieuGiaLap"
import { useTheme } from "@/lib/nguCanhGiaoDien"
import { MoodBadge } from "@/components/huyHieuCamXuc"

const weeklyMoodData = [
  { day: "Mon", happy: 45, sad: 12, calm: 25, energetic: 18 },
  { day: "Tue", happy: 32, sad: 28, calm: 20, energetic: 20 },
  { day: "Wed", happy: 55, sad: 8, calm: 22, energetic: 15 },
  { day: "Thu", happy: 38, sad: 15, calm: 32, energetic: 15 },
  { day: "Fri", happy: 62, sad: 5, calm: 18, energetic: 15 },
  { day: "Sat", happy: 48, sad: 10, calm: 28, energetic: 14 },
  { day: "Sun", happy: 42, sad: 18, calm: 30, energetic: 10 },
]

const listeningHoursData = [
  { hour: "6AM", value: 5 },
  { hour: "9AM", value: 25 },
  { hour: "12PM", value: 40 },
  { hour: "3PM", value: 35 },
  { hour: "6PM", value: 55 },
  { hour: "9PM", value: 70 },
  { hour: "12AM", value: 30 },
]

const emotionGenreCorrelation = [
  { emotion: "happy", genres: ["K-pop", "Pop", "Dance"], percentage: 72 },
  { emotion: "sad", genres: ["Ballad", "Indie", "R&B"], percentage: 65 },
  { emotion: "calm", genres: ["Lo-fi", "Chill", "Acoustic"], percentage: 80 },
  { emotion: "energetic", genres: ["EDM", "Hip-hop", "Rock"], percentage: 78 },
  { emotion: "romantic", genres: ["R&B", "Ballad", "Pop"], percentage: 70 },
  { emotion: "nostalgic", genres: ["Indie", "Acoustic", "Folk"], percentage: 68 },
]

export default function AnalyticsPage() {
  const { language, currentSong } = useTheme()
  const t = translations[language]
  const [timeRange, setTimeRange] = useState("week")

  const topEmotions = mockEmotions.slice(0, 5).map((emotion, index) => ({
    ...emotion,
    percentage: [35, 22, 18, 15, 10][index],
    trend: index < 2 ? "up" : index > 3 ? "down" : "stable",
    change: ["+5%", "+2%", "0%", "-1%", "-3%"][index],
  }))

  const insights = [
    {
      titleVi: "Tâm trạng tích cực tăng",
      titleEn: "Positive Mood Rising",
      descVi: "Tuần này bạn có 23% thời gian nghe với tâm trạng vui vẻ hơn tuần trước",
      descEn: "This week you spent 23% more listening time in happy moods than last week",
      icon: TrendingUp,
      color: "#22c55e",
    },
    {
      titleVi: "Giờ cao điểm nghe nhạc",
      titleEn: "Peak Listening Hours",
      descVi: "Bạn thường nghe nhạc nhiều nhất vào 9PM - 11PM",
      descEn: "You typically listen to music most between 9PM - 11PM",
      icon: Clock,
      color: "#f59e0b",
    },
    {
      titleVi: "K-pop là thể loại yêu thích",
      titleEn: "K-pop is Your Favorite",
      descVi: "45% bài hát bạn nghe thuộc thể loại K-pop",
      descEn: "45% of songs you listen to are K-pop",
      icon: Music,
      color: "#ec4899",
    },
    {
      titleVi: "Đề xuất cá nhân hóa",
      titleEn: "Personalized Suggestions",
      descVi: "Dựa trên cảm xúc, AI đã tìm 24 bài mới phù hợp với bạn",
      descEn: "Based on your emotions, AI found 24 new songs that match you",
      icon: Sparkles,
      color: "#8b5cf6",
    },
  ]

  const topSongsByMood = mockEmotions.slice(0, 4).map((emotion) => ({
    emotion,
    songs: mockSongs.filter((s) => s.mood === emotion.id).slice(0, 3),
  }))

  return (
    <div className="min-h-screen p-6 pb-32">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t.analytics}</h1>
            <p className="text-muted-foreground mt-1">
              {language === "vi" 
                ? "Khám phá mối liên hệ giữa cảm xúc và âm nhạc của bạn"
                : "Discover the connection between your emotions and music"}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-card/50 border-white/10">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">{language === "vi" ? "Tuần này" : "This Week"}</SelectItem>
                <SelectItem value="month">{language === "vi" ? "Tháng này" : "This Month"}</SelectItem>
                <SelectItem value="year">{language === "vi" ? "Năm này" : "This Year"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-rose-500/20 to-pink-500/10 border-rose-500/20 backdrop-blur-xl">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === "vi" ? "Tổng giờ nghe" : "Total Hours"}
                  </p>
                  <p className="text-3xl font-bold text-foreground">127.5</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs text-emerald-500">+12%</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-rose-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-violet-500/20 to-purple-500/10 border-violet-500/20 backdrop-blur-xl">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === "vi" ? "Bài đã nghe" : "Songs Played"}
                  </p>
                  <p className="text-3xl font-bold text-foreground">1,847</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs text-emerald-500">+8%</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <Music className="w-5 h-5 text-violet-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-amber-500/20 backdrop-blur-xl">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === "vi" ? "Phân tích cảm xúc" : "Mood Scans"}
                  </p>
                  <p className="text-3xl font-bold text-foreground">342</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs text-emerald-500">+25%</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                  <Smile className="w-5 h-5 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border-emerald-500/20 backdrop-blur-xl">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {language === "vi" ? "Độ chính xác AI" : "AI Accuracy"}
                  </p>
                  <p className="text-3xl font-bold text-foreground">94%</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span className="text-xs text-emerald-500">+3%</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {insights.map((insight, index) => (
            <Card 
              key={index}
              className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl hover:border-white/20 transition-all"
            >
              <CardContent className="p-5">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${insight.color}20` }}
                >
                  <insight.icon className="w-5 h-5" style={{ color: insight.color }} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {language === "vi" ? insight.titleVi : insight.titleEn}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {language === "vi" ? insight.descVi : insight.descEn}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mood Distribution */}
          <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                {language === "vi" ? "Phân bố cảm xúc" : "Emotion Distribution"}
              </CardTitle>
              <CardDescription>
                {language === "vi" ? "Cảm xúc phổ biến trong tuần" : "Popular emotions this week"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topEmotions.map((emotion) => (
                  <div key={emotion.id} className="flex items-center gap-4">
                    <div className="flex items-center gap-3 w-32">
                      <span className="text-xl">{emotion.emoji}</span>
                      <span className="text-sm font-medium text-foreground">
                        {language === "vi" ? emotion.labelVi : emotion.labelEn}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${emotion.percentage}%`,
                            backgroundColor: emotion.color 
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-20 justify-end">
                      <span className="text-sm font-medium text-foreground">{emotion.percentage}%</span>
                      {emotion.trend === "up" && (
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                      )}
                      {emotion.trend === "down" && (
                        <TrendingDown className="w-3 h-3 text-rose-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Listening Activity */}
          <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                {language === "vi" ? "Hoạt động nghe nhạc" : "Listening Activity"}
              </CardTitle>
              <CardDescription>
                {language === "vi" ? "Thời gian nghe trong ngày" : "Listening hours throughout the day"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-2 h-40">
                {listeningHoursData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 flex-1">
                    <div 
                      className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80"
                      style={{ 
                        height: `${item.value}%`,
                        background: `linear-gradient(to top, ${currentSong?.palette.primary || '#ec4899'}40, ${currentSong?.palette.primary || '#ec4899'}80)`
                      }}
                    />
                    <span className="text-xs text-muted-foreground">{item.hour}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emotion-Genre Correlation */}
        <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>
              {language === "vi" ? "Cảm xúc & Thể loại yêu thích" : "Emotion & Genre Correlation"}
            </CardTitle>
            <CardDescription>
              {language === "vi" 
                ? "Thể loại nhạc bạn thường nghe theo từng cảm xúc"
                : "Music genres you typically listen to for each emotion"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {emotionGenreCorrelation.map((item) => {
                const emotion = mockEmotions.find((e) => e.id === item.emotion)
                if (!emotion) return null

                return (
                  <div 
                    key={item.emotion}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{emotion.emoji}</span>
                      <div>
                        <p className="font-medium text-foreground">
                          {language === "vi" ? emotion.labelVi : emotion.labelEn}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.percentage}% {language === "vi" ? "phù hợp" : "match"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.genres.map((genre) => (
                        <Badge 
                          key={genre} 
                          variant="outline" 
                          className="border-white/10 text-xs"
                          style={{ 
                            backgroundColor: `${emotion.color}15`,
                            borderColor: `${emotion.color}30`
                          }}
                        >
                          {genre}
                        </Badge>
                      ))}
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
                    </div>
                  </div>
                )
              })}
            </div>
<<<<<<< HEAD
          </div>

          <div className="surface-elevated p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="pill-label text-[0.62rem] text-white/30">Listening rhythm</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{language === 'vi' ? 'Khung giờ và nhịp nghe trong tuần' : 'Listening windows and weekly rhythm'}</h2>
              </div>
              <Waves className="h-5 w-5 text-[var(--song-primary)]" />
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {tasteProfile.listeningWindows.map((window) => (
                <div key={window.id} className="glass rounded-[1.5rem] p-5">
                  <p className="pill-label text-[0.6rem] text-white/28">Peak window</p>
                  <h3 className="mt-3 text-xl font-semibold text-white">{localizedLabel(window.label, language)}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/56">{localizedLabel(window.summary, language)}</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full rounded-full bg-gradient-to-r from-[var(--brand-accent)] via-[var(--song-primary)] to-[var(--song-secondary)]" style={{ width: `${window.value}%` }} />
=======
          </CardContent>
        </Card>

        {/* Top Songs by Mood */}
        <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>
              {language === "vi" ? "Bài hát hàng đầu theo cảm xúc" : "Top Songs by Mood"}
            </CardTitle>
            <CardDescription>
              {language === "vi" 
                ? "Bài hát bạn nghe nhiều nhất cho từng tâm trạng"
                : "Your most played songs for each mood"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {topSongsByMood.map(({ emotion, songs }) => (
                <div key={emotion.id} className="space-y-3">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">{emotion.emoji}</span>
                    <span className="font-medium text-foreground">
                      {language === "vi" ? emotion.labelVi : emotion.labelEn}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {songs.map((song, index) => (
                      <div 
                        key={song.id}
                        className="flex items-center gap-3 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <span className="text-xs text-muted-foreground w-4">{index + 1}</span>
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={song.coverUrl}
                            alt={song.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{song.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                        </div>
                      </div>
                    ))}
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
                  </div>
                </div>
              ))}
            </div>
<<<<<<< HEAD
            <div className="mt-5 grid grid-cols-7 gap-2">
              {mockAnalytics.weeklyListening.map((day) => (
                <div key={day.day} className="rounded-2xl border border-white/6 bg-white/[0.03] px-3 py-4 text-center">
                  <p className="text-xs text-white/34">{day.day}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{day.hours}</p>
                  <p className="text-[0.68rem] text-white/38">h</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface-panel p-5">
            <p className="pill-label text-[0.62rem] text-white/30">Taste profile</p>
            <div className="mt-4 space-y-3">
              {tasteProfile.topGenres.map((genre) => (
                <div key={genre.id} className="rounded-2xl border border-white/6 bg-white/[0.03] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{localizedLabel(genre.label, language)}</p>
                    <span className="text-sm text-white/48">{genre.value}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/8">
                    <div className="h-full rounded-full" style={{ width: `${genre.value}%`, backgroundColor: genre.accent }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel p-5">
            <p className="pill-label text-[0.62rem] text-white/30">Top artists</p>
            <div className="mt-4 space-y-3">
              {tasteProfile.topArtists.map((artist) => (
                <div key={artist.id} className="flex items-center justify-between rounded-2xl border border-white/6 bg-white/[0.03] px-4 py-3">
                  <p className="text-sm font-medium text-white">{localizedLabel(artist.label, language)}</p>
                  <span className="text-sm text-white/48">{artist.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="surface-panel p-5">
            <p className="pill-label text-[0.62rem] text-white/30">Recommendation engine</p>
            <h3 className="mt-3 text-xl font-semibold text-white">{language === 'vi' ? 'Lý do đề xuất' : 'Why recommendations fit'}</h3>
            <p className="mt-3 text-sm leading-7 text-white/56">{tasteProfile.recommendationReasons[currentEmotion][language]}</p>
            <Link href="/goiY" className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-accent)] hover:underline">
              {language === 'vi' ? 'Mở gợi ý theo profile' : 'Open profile-based picks'}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="surface-panel p-5">
            <p className="pill-label text-[0.62rem] text-white/30">Next upgrade</p>
            <div className="mt-4 rounded-[1.4rem] bg-[linear-gradient(180deg,rgba(124,141,255,0.16),rgba(255,255,255,0.03))] p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Sparkles className="h-4 w-4 text-[var(--song-primary)]" />
                {language === 'vi' ? 'Mood + taste + assistant' : 'Mood + taste + assistant'}
              </div>
              <p className="mt-3 text-sm leading-7 text-white/56">
                {language === 'vi'
                  ? 'Chatbox có thể đọc yêu cầu, map sang hành động trong app và tận dụng cả mood lẫn taste profile để giải thích vì sao bài hát đó nên phát tiếp.'
                  : 'The chatbox can read intent, map it to safe in-app actions, and use both mood and taste profile to explain why a track should play next.'}
              </p>
            </div>
          </div>
        </div>
      </section>
=======
          </CardContent>
        </Card>

        {/* Weekly Mood Calendar */}
        <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>
              {language === "vi" ? "Lịch cảm xúc tuần này" : "Weekly Mood Calendar"}
            </CardTitle>
            <CardDescription>
              {language === "vi" 
                ? "Theo dõi sự thay đổi cảm xúc trong tuần"
                : "Track your emotional changes throughout the week"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-3">
              {weeklyMoodData.map((day) => {
                const dominantMood = day.happy > day.sad && day.happy > day.calm && day.happy > day.energetic
                  ? mockEmotions.find((e) => e.id === "happy")
                  : day.sad > day.calm && day.sad > day.energetic
                    ? mockEmotions.find((e) => e.id === "sad")
                    : day.calm > day.energetic
                      ? mockEmotions.find((e) => e.id === "calm")
                      : mockEmotions.find((e) => e.id === "energetic")

                return (
                  <div 
                    key={day.day}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                    style={{ 
                      boxShadow: `0 0 20px ${dominantMood?.color}15`
                    }}
                  >
                    <span className="text-sm font-medium text-muted-foreground">{day.day}</span>
                    <span className="text-3xl">{dominantMood?.emoji}</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.max(day.happy, day.sad, day.calm, day.energetic)}%
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Genre Stats */}
        <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>
              {language === "vi" ? "Thể loại yêu thích" : "Favorite Genres"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {mockGenres.map((genre, index) => {
                const percentage = [45, 28, 22, 18, 15, 12][index] || 10
                return (
                  <div 
                    key={genre.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <span className="text-xl">{genre.icon}</span>
                    <div>
                      <p className="font-medium text-foreground">{genre.name}</p>
                      <p className="text-xs text-muted-foreground">{percentage}%</p>
                    </div>
                    <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: genre.color 
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
>>>>>>> 8587083219adb682e5b3c9d1293f3780e0522532
    </div>
  )
}
