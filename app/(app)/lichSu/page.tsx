"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, Calendar, Filter, Play, Heart, MoreHorizontal, Clock, Smile, Mic, FileText, Camera, ChevronDown, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockSongs, mockHistoryRecords, mockEmotions, translations, type Language } from "@/lib/duLieuGiaLap"
import { useTheme } from "@/lib/nguCanhGiaoDien"
import { MoodBadge } from "@/components/huyHieuCamXuc"

export default function HistoryPage() {
  const { language } = useTheme()
  const t = translations[language]
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMood, setSelectedMood] = useState("all")
  const [selectedSource, setSelectedSource] = useState("all")
  const [timeRange, setTimeRange] = useState("week")

  const filteredHistory = mockHistoryRecords.filter((record) => {
    const song = mockSongs.find((s) => s.id === record.songId)
    if (!song) return false
    
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMood = selectedMood === "all" || record.emotion === selectedMood
    const matchesSource = selectedSource === "all" || record.source === selectedSource
    
    return matchesSearch && matchesMood && matchesSource
  })

  const moodStats = mockEmotions.map((emotion) => ({
    ...emotion,
    count: mockHistoryRecords.filter((r) => r.emotion === emotion.id).length,
  })).sort((a, b) => b.count - a.count)

  const topMood = moodStats[0]

  const sourceIcons = {
    face: Camera,
    voice: Mic,
    text: FileText,
    multimodal: TrendingUp,
  }

  const getSourceLabel = (source: string) => {
    const labels: Record<string, Record<Language, string>> = {
      face: { vi: "Khuôn mặt", en: "Face" },
      voice: { vi: "Giọng nói", en: "Voice" },
      text: { vi: "Văn bản", en: "Text" },
      multimodal: { vi: "Đa phương thức", en: "Multimodal" },
    }
    return labels[source]?.[language] || source
  }

  const getActionLabel = (action: string) => {
    const labels: Record<string, Record<Language, string>> = {
      played: { vi: "Đã phát", en: "Played" },
      liked: { vi: "Đã thích", en: "Liked" },
      added_to_queue: { vi: "Thêm vào hàng đợi", en: "Added to queue" },
      skipped: { vi: "Đã bỏ qua", en: "Skipped" },
    }
    return labels[action]?.[language] || action
  }

  return (
    <div className="min-h-screen p-6 pb-32">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t.history}</h1>
            <p className="text-muted-foreground mt-1">
              {language === "vi" 
                ? "Xem lại hành trình âm nhạc và cảm xúc của bạn"
                : "Review your music and emotion journey"}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-card/50 border-white/10">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">{language === "vi" ? "Hôm nay" : "Today"}</SelectItem>
                <SelectItem value="week">{language === "vi" ? "Tuần này" : "This Week"}</SelectItem>
                <SelectItem value="month">{language === "vi" ? "Tháng này" : "This Month"}</SelectItem>
                <SelectItem value="all">{language === "vi" ? "Tất cả" : "All Time"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{mockHistoryRecords.length}</p>
                  <p className="text-xs text-muted-foreground">
                    {language === "vi" ? "Bài đã nghe" : "Songs Played"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${topMood?.color}20` }}
                >
                  <Smile className="w-5 h-5" style={{ color: topMood?.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{topMood?.labelVi}</p>
                  <p className="text-xs text-muted-foreground">
                    {language === "vi" ? "Cảm xúc phổ biến" : "Top Mood"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {mockHistoryRecords.filter((r) => r.action === "liked").length}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === "vi" ? "Bài đã thích" : "Liked Songs"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">4.2h</p>
                  <p className="text-xs text-muted-foreground">
                    {language === "vi" ? "Thời gian nghe" : "Listen Time"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mood Timeline */}
        <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {language === "vi" ? "Dòng thời gian cảm xúc" : "Mood Timeline"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
              {moodStats.slice(0, 8).map((mood) => (
                <div
                  key={mood.id}
                  className="flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 min-w-[100px]"
                  style={{ 
                    boxShadow: `0 0 20px ${mood.color}20`,
                    borderColor: `${mood.color}30`
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${mood.color}20` }}
                  >
                    {mood.emoji}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {language === "vi" ? mood.labelVi : mood.labelEn}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {mood.count} {language === "vi" ? "lần" : "times"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={language === "vi" ? "Tìm kiếm bài hát..." : "Search songs..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card/50 border-white/10"
            />
          </div>

          <div className="flex items-center gap-3">
            <Select value={selectedMood} onValueChange={setSelectedMood}>
              <SelectTrigger className="w-40 bg-card/50 border-white/10">
                <Smile className="w-4 h-4 mr-2" />
                <SelectValue placeholder={language === "vi" ? "Cảm xúc" : "Mood"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "vi" ? "Tất cả" : "All Moods"}</SelectItem>
                {mockEmotions.map((emotion) => (
                  <SelectItem key={emotion.id} value={emotion.id}>
                    {emotion.emoji} {language === "vi" ? emotion.labelVi : emotion.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-40 bg-card/50 border-white/10">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder={language === "vi" ? "Nguồn" : "Source"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "vi" ? "Tất cả nguồn" : "All Sources"}</SelectItem>
                <SelectItem value="face">{language === "vi" ? "Khuôn mặt" : "Face"}</SelectItem>
                <SelectItem value="voice">{language === "vi" ? "Giọng nói" : "Voice"}</SelectItem>
                <SelectItem value="text">{language === "vi" ? "Văn bản" : "Text"}</SelectItem>
                <SelectItem value="multimodal">{language === "vi" ? "Đa phương thức" : "Multimodal"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* History Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-card/50 border border-white/10 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary/20">
              {language === "vi" ? "Tất cả" : "All"}
            </TabsTrigger>
            <TabsTrigger value="played" className="data-[state=active]:bg-primary/20">
              {language === "vi" ? "Đã phát" : "Played"}
            </TabsTrigger>
            <TabsTrigger value="liked" className="data-[state=active]:bg-primary/20">
              {language === "vi" ? "Đã thích" : "Liked"}
            </TabsTrigger>
            <TabsTrigger value="skipped" className="data-[state=active]:bg-primary/20">
              {language === "vi" ? "Đã bỏ qua" : "Skipped"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl overflow-hidden">
              <div className="divide-y divide-white/5">
                {filteredHistory.map((record) => {
                  const song = mockSongs.find((s) => s.id === record.songId)
                  if (!song) return null
                  
                  const emotion = mockEmotions.find((e) => e.id === record.emotion)
                  const SourceIcon = sourceIcons[record.source as keyof typeof sourceIcons] || TrendingUp

                  return (
                    <div
                      key={record.id}
                      className="flex items-center gap-4 p-4 hover:bg-white/5 transition-colors group"
                    >
                      {/* Time */}
                      <div className="w-20 text-xs text-muted-foreground hidden md:block">
                        {record.timestamp}
                      </div>

                      {/* Cover */}
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={song.coverUrl}
                          alt={song.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>

                      {/* Song Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{song.title}</h4>
                        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                      </div>

                      {/* Emotion */}
                      {emotion && (
                        <MoodBadge 
                          mood={emotion.id} 
                          size="sm"
                          className="hidden sm:flex"
                        />
                      )}

                      {/* Source */}
                      <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
                        <SourceIcon className="w-3.5 h-3.5" />
                        <span>{getSourceLabel(record.source)}</span>
                      </div>

                      {/* Action */}
                      <Badge variant="outline" className="hidden md:flex border-white/10 text-xs">
                        {getActionLabel(record.action)}
                      </Badge>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {filteredHistory.length === 0 && (
                <div className="p-12 text-center">
                  <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {language === "vi" 
                      ? "Không tìm thấy lịch sử nghe"
                      : "No listening history found"}
                  </p>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="played" className="mt-6">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl p-8 text-center">
              <p className="text-muted-foreground">
                {language === "vi" ? "Xem các bài hát đã phát" : "View played songs"}
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="liked" className="mt-6">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl p-8 text-center">
              <p className="text-muted-foreground">
                {language === "vi" ? "Xem các bài hát đã thích" : "View liked songs"}
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="skipped" className="mt-6">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl p-8 text-center">
              <p className="text-muted-foreground">
                {language === "vi" ? "Xem các bài hát đã bỏ qua" : "View skipped songs"}
              </p>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Weekly Summary */}
        <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl overflow-hidden">
          <CardHeader>
            <CardTitle>
              {language === "vi" ? "Tổng kết tuần này" : "Weekly Summary"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-2xl bg-white/5">
                <p className="text-3xl font-bold text-foreground mb-1">127</p>
                <p className="text-sm text-muted-foreground">
                  {language === "vi" ? "Bài hát" : "Songs"}
                </p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/5">
                <p className="text-3xl font-bold text-foreground mb-1">18</p>
                <p className="text-sm text-muted-foreground">
                  {language === "vi" ? "Playlist" : "Playlists"}
                </p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/5">
                <p className="text-3xl font-bold text-foreground mb-1">6</p>
                <p className="text-sm text-muted-foreground">
                  {language === "vi" ? "Nghệ sĩ" : "Artists"}
                </p>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/5">
                <p className="text-3xl font-bold text-foreground mb-1">24</p>
                <p className="text-sm text-muted-foreground">
                  {language === "vi" ? "Giờ nghe" : "Hours"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
