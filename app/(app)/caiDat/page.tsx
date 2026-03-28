"use client"

import { useState } from "react"
import Image from "next/image"
import { User, Palette, Music, Languages, Bell, Shield, Sliders, Link2, Save, Check, Camera, Mic, FileText, Smartphone, Monitor, Moon, Sun, Volume2, Zap, Heart, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { mockGenres, translations } from "@/lib/duLieuGiaLap"
import { useTheme } from "@/lib/nguCanhGiaoDien"
import { useToast } from "@/hooks/dungThongBao"

export default function SettingsPage() {
  const { language, setLanguage } = useTheme()
  const { toast } = useToast()
  const t = translations[language]

  const [profile, setProfile] = useState({
    name: "KhoaLisa",
    email: "khoalisa@moodsync.ai",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
  })

  const [preferences, setPreferences] = useState({
    theme: "dark",
    autoPlay: true,
    crossfade: true,
    crossfadeDuration: 5,
    normalizeVolume: true,
    showLyrics: true,
    highQualityStreaming: true,
    downloadQuality: "high",
  })

  const [privacy, setPrivacy] = useState({
    cameraAccess: true,
    microphoneAccess: true,
    emotionHistory: true,
    shareListening: false,
    personalizedAds: false,
  })

  const [notifications, setNotifications] = useState({
    newRecommendations: true,
    weeklyInsights: true,
    moodReminders: true,
    newFeatures: true,
    email: false,
    push: true,
  })

  const [selectedGenres, setSelectedGenres] = useState<string[]>(["kpop", "pop", "rnb", "indie"])

  const handleSave = () => {
    toast({
      title: language === "vi" ? "Đã lưu cài đặt" : "Settings saved",
      description: language === "vi" 
        ? "Tất cả thay đổi đã được áp dụng"
        : "All changes have been applied",
    })
  }

  const connectedServices = [
    { 
      name: "Spotify", 
      icon: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=40&h=40&fit=crop",
      connected: true,
      status: language === "vi" ? "Đã kết nối" : "Connected"
    },
    { 
      name: "Apple Music", 
      icon: "https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=40&h=40&fit=crop",
      connected: false,
      status: language === "vi" ? "Chưa kết nối" : "Not connected"
    },
    { 
      name: "YouTube Music", 
      icon: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=40&h=40&fit=crop",
      connected: true,
      status: language === "vi" ? "Đã kết nối" : "Connected"
    },
  ]

  return (
    <div className="min-h-screen p-6 pb-32">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t.settings}</h1>
            <p className="text-muted-foreground mt-1">
              {language === "vi" 
                ? "Quản lý tài khoản và tùy chỉnh trải nghiệm"
                : "Manage your account and customize your experience"}
            </p>
          </div>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            {language === "vi" ? "Lưu thay đổi" : "Save Changes"}
          </Button>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-card/50 border border-white/10 p-1 flex-wrap h-auto gap-1">
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary/20 gap-2">
              <User className="w-4 h-4" />
              {language === "vi" ? "Hồ sơ" : "Profile"}
            </TabsTrigger>
            <TabsTrigger value="appearance" className="data-[state=active]:bg-primary/20 gap-2">
              <Palette className="w-4 h-4" />
              {language === "vi" ? "Giao diện" : "Appearance"}
            </TabsTrigger>
            <TabsTrigger value="music" className="data-[state=active]:bg-primary/20 gap-2">
              <Music className="w-4 h-4" />
              {language === "vi" ? "Âm nhạc" : "Music"}
            </TabsTrigger>
            <TabsTrigger value="privacy" className="data-[state=active]:bg-primary/20 gap-2">
              <Shield className="w-4 h-4" />
              {language === "vi" ? "Quyền riêng tư" : "Privacy"}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary/20 gap-2">
              <Bell className="w-4 h-4" />
              {language === "vi" ? "Thông báo" : "Notifications"}
            </TabsTrigger>
            <TabsTrigger value="connections" className="data-[state=active]:bg-primary/20 gap-2">
              <Link2 className="w-4 h-4" />
              {language === "vi" ? "Kết nối" : "Connections"}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-6 space-y-6">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>{language === "vi" ? "Thông tin cá nhân" : "Personal Information"}</CardTitle>
                <CardDescription>
                  {language === "vi" 
                    ? "Cập nhật thông tin tài khoản của bạn"
                    : "Update your account information"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/50">
                      <Image
                        src={profile.avatar}
                        alt="Avatar"
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    </div>
                    <Button 
                      size="icon" 
                      variant="secondary"
                      className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{profile.name}</h3>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                    <Badge className="mt-2 bg-gradient-to-r from-rose-500 to-pink-500">
                      VIP Pro
                    </Badge>
                  </div>
                </div>

                <Separator className="bg-white/10" />

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{language === "vi" ? "Tên hiển thị" : "Display Name"}</Label>
                    <Input 
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{language === "vi" ? "Ngôn ngữ giao diện" : "Interface Language"}</Label>
                  <Select value={language} onValueChange={(v) => setLanguage(v as "vi" | "en")}>
                    <SelectTrigger className="w-full md:w-64 bg-white/5 border-white/10">
                      <Globe className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vi">Tiếng Việt</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="mt-6 space-y-6">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>{language === "vi" ? "Giao diện" : "Appearance"}</CardTitle>
                <CardDescription>
                  {language === "vi" 
                    ? "Tùy chỉnh giao diện ứng dụng"
                    : "Customize how the app looks"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>{language === "vi" ? "Chế độ màu" : "Color Mode"}</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: "light", icon: Sun, label: language === "vi" ? "Sáng" : "Light" },
                      { id: "dark", icon: Moon, label: language === "vi" ? "Tối" : "Dark" },
                      { id: "system", icon: Monitor, label: language === "vi" ? "Hệ thống" : "System" },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setPreferences({ ...preferences, theme: mode.id })}
                        className={`p-4 rounded-2xl border transition-all ${
                          preferences.theme === mode.id
                            ? "bg-primary/20 border-primary"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <mode.icon className="w-6 h-6 mx-auto mb-2 text-foreground" />
                        <span className="text-sm text-foreground">{mode.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "vi" ? "Hiện lời bài hát" : "Show Lyrics"}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "vi" 
                        ? "Hiển thị lời bài hát khi phát nhạc"
                        : "Display lyrics while playing music"}
                    </p>
                  </div>
                  <Switch 
                    checked={preferences.showLyrics}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, showLyrics: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Music Tab */}
          <TabsContent value="music" className="mt-6 space-y-6">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>{language === "vi" ? "Tùy chọn phát nhạc" : "Playback Preferences"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "vi" ? "Tự động phát" : "Autoplay"}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "vi" 
                        ? "Tự động phát bài tiếp theo"
                        : "Automatically play next song"}
                    </p>
                  </div>
                  <Switch 
                    checked={preferences.autoPlay}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, autoPlay: checked })}
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "vi" ? "Chuyển bài mượt" : "Crossfade"}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "vi" 
                        ? "Chuyển đổi mượt mà giữa các bài"
                        : "Smooth transition between songs"}
                    </p>
                  </div>
                  <Switch 
                    checked={preferences.crossfade}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, crossfade: checked })}
                  />
                </div>

                {preferences.crossfade && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>{language === "vi" ? "Thời gian crossfade" : "Crossfade Duration"}</Label>
                      <span className="text-sm text-muted-foreground">{preferences.crossfadeDuration}s</span>
                    </div>
                    <Slider
                      value={[preferences.crossfadeDuration]}
                      onValueChange={([value]) => setPreferences({ ...preferences, crossfadeDuration: value })}
                      max={12}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "vi" ? "Chuẩn hóa âm lượng" : "Normalize Volume"}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "vi" 
                        ? "Giữ âm lượng đồng đều giữa các bài"
                        : "Keep volume consistent across songs"}
                    </p>
                  </div>
                  <Switch 
                    checked={preferences.normalizeVolume}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, normalizeVolume: checked })}
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "vi" ? "Phát chất lượng cao" : "High Quality Streaming"}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "vi" 
                        ? "Phát nhạc ở chất lượng cao nhất"
                        : "Stream music at highest quality"}
                    </p>
                  </div>
                  <Switch 
                    checked={preferences.highQualityStreaming}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, highQualityStreaming: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>{language === "vi" ? "Thể loại yêu thích" : "Preferred Genres"}</CardTitle>
                <CardDescription>
                  {language === "vi" 
                    ? "Chọn thể loại để cải thiện đề xuất"
                    : "Select genres to improve recommendations"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {mockGenres.map((genre) => {
                    const isSelected = selectedGenres.includes(genre.id)
                    return (
                      <button
                        key={genre.id}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedGenres(selectedGenres.filter((g) => g !== genre.id))
                          } else {
                            setSelectedGenres([...selectedGenres, genre.id])
                          }
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                          isSelected
                            ? "bg-primary/20 border-primary"
                            : "bg-white/5 border-white/10 hover:border-white/20"
                        }`}
                      >
                        <span>{genre.icon}</span>
                        <span className="text-sm font-medium text-foreground">{genre.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-primary" />}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="mt-6 space-y-6">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>{language === "vi" ? "Quyền truy cập" : "Access Permissions"}</CardTitle>
                <CardDescription>
                  {language === "vi" 
                    ? "Quản lý quyền truy cập cho phân tích cảm xúc"
                    : "Manage permissions for emotion analysis"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Camera className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <Label>{language === "vi" ? "Truy cập camera" : "Camera Access"}</Label>
                      <p className="text-sm text-muted-foreground">
                        {language === "vi" 
                          ? "Cho phân tích khuôn mặt"
                          : "For facial analysis"}
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={privacy.cameraAccess}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, cameraAccess: checked })}
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                      <Mic className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                      <Label>{language === "vi" ? "Truy cập microphone" : "Microphone Access"}</Label>
                      <p className="text-sm text-muted-foreground">
                        {language === "vi" 
                          ? "Cho phân tích giọng nói"
                          : "For voice analysis"}
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={privacy.microphoneAccess}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, microphoneAccess: checked })}
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <Label>{language === "vi" ? "Lưu lịch sử cảm xúc" : "Emotion History"}</Label>
                      <p className="text-sm text-muted-foreground">
                        {language === "vi" 
                          ? "Lưu lại phân tích cảm xúc"
                          : "Save emotion analysis history"}
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={privacy.emotionHistory}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, emotionHistory: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>{language === "vi" ? "Chia sẻ dữ liệu" : "Data Sharing"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "vi" ? "Chia sẻ hoạt động nghe" : "Share Listening Activity"}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "vi" 
                        ? "Cho bạn bè thấy bạn đang nghe gì"
                        : "Let friends see what you're listening to"}
                    </p>
                  </div>
                  <Switch 
                    checked={privacy.shareListening}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, shareListening: checked })}
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "vi" ? "Quảng cáo cá nhân hóa" : "Personalized Ads"}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "vi" 
                        ? "Nhận quảng cáo dựa trên sở thích"
                        : "Receive ads based on your preferences"}
                    </p>
                  </div>
                  <Switch 
                    checked={privacy.personalizedAds}
                    onCheckedChange={(checked) => setPrivacy({ ...privacy, personalizedAds: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="mt-6 space-y-6">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>{language === "vi" ? "Thông báo" : "Notifications"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "vi" ? "Đề xuất mới" : "New Recommendations"}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "vi" 
                        ? "Thông báo khi có đề xuất mới"
                        : "Notify when new recommendations available"}
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.newRecommendations}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, newRecommendations: checked })}
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "vi" ? "Báo cáo tuần" : "Weekly Insights"}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "vi" 
                        ? "Nhận báo cáo cảm xúc hàng tuần"
                        : "Receive weekly emotion reports"}
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.weeklyInsights}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyInsights: checked })}
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "vi" ? "Nhắc nhở tâm trạng" : "Mood Reminders"}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "vi" 
                        ? "Nhắc nhở quét cảm xúc định kỳ"
                        : "Remind to scan emotions periodically"}
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.moodReminders}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, moodReminders: checked })}
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{language === "vi" ? "Tính năng mới" : "New Features"}</Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "vi" 
                        ? "Thông báo về cập nhật và tính năng mới"
                        : "Notify about updates and new features"}
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.newFeatures}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, newFeatures: checked })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>{language === "vi" ? "Kênh thông báo" : "Notification Channels"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email</Label>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>

                <Separator className="bg-white/10" />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                  </div>
                  <Switch 
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Connections Tab */}
          <TabsContent value="connections" className="mt-6 space-y-6">
            <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>{language === "vi" ? "Dịch vụ đã kết nối" : "Connected Services"}</CardTitle>
                <CardDescription>
                  {language === "vi" 
                    ? "Quản lý kết nối với các dịch vụ âm nhạc"
                    : "Manage connections to music services"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {connectedServices.map((service) => (
                  <div 
                    key={service.name}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10">
                        <Image
                          src={service.icon}
                          alt={service.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{service.name}</p>
                        <p className={`text-sm ${service.connected ? "text-emerald-500" : "text-muted-foreground"}`}>
                          {service.status}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant={service.connected ? "outline" : "default"}
                      size="sm"
                    >
                      {service.connected 
                        ? (language === "vi" ? "Ngắt kết nối" : "Disconnect")
                        : (language === "vi" ? "Kết nối" : "Connect")}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-card/80 to-card/40 border-white/10 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>{language === "vi" ? "Thiết bị" : "Devices"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Monitor className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">MacBook Pro</p>
                      <p className="text-sm text-emerald-500">
                        {language === "vi" ? "Thiết bị hiện tại" : "Current device"}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/50 text-emerald-500">
                    {language === "vi" ? "Đang hoạt động" : "Active"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">iPhone 15 Pro</p>
                      <p className="text-sm text-muted-foreground">
                        {language === "vi" ? "Hoạt động 2 giờ trước" : "Active 2 hours ago"}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    {language === "vi" ? "Xóa" : "Remove"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
