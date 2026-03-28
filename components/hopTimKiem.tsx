"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search, X, Play, Heart, Clock, TrendingUp, Music, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { mockSongs, mockPlaylists, mockArtists, translations, formatDuration } from "@/lib/duLieuGiaLap"
import { useTheme } from "@/lib/nguCanhGiaoDien"
import { MoodBadge } from "@/components/huyHieuCamXuc"

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const { language, setCurrentSong } = useTheme()
  const t = translations[language]
  const [query, setQuery] = useState("")
  const [recentSearches] = useState(["Pink Sunset", "LUNAIRE", "Happy vibes", "Chill lo-fi"])

  const filteredSongs = query
    ? mockSongs.filter(
        (song) =>
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          song.artist.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const filteredPlaylists = query
    ? mockPlaylists.filter(
        (playlist) =>
          playlist.name[language].toLowerCase().includes(query.toLowerCase()) ||
          playlist.description[language].toLowerCase().includes(query.toLowerCase())
      )
    : []

  const filteredArtists = query
    ? mockArtists.filter((artist) =>
        artist.name.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const trendingSearches = [
    { term: "K-pop hits 2024", icon: TrendingUp },
    { term: "Chill study beats", icon: Music },
    { term: "VYNN new album", icon: Mic },
    { term: "Mood boost playlist", icon: Heart },
  ]

  useEffect(() => {
    if (!open) setQuery("")
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-xl border-white/10 p-0 gap-0">
        <DialogHeader className="p-4 pb-0">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder={language === "vi" ? "Tìm kiếm bài hát, nghệ sĩ, playlist..." : "Search songs, artists, playlists..."}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 pr-12 h-14 text-lg bg-white/5 border-white/10 rounded-2xl"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setQuery("")}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          {!query ? (
            <div className="p-4 space-y-6">
              {/* Recent Searches */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  {language === "vi" ? "Tìm kiếm gần đây" : "Recent Searches"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => setQuery(search)}
                      className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-sm"
                    >
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-foreground">{search}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  {language === "vi" ? "Xu hướng" : "Trending"}
                </h3>
                <div className="space-y-2">
                  {trendingSearches.map((item, index) => (
                    <button
                      key={item.term}
                      onClick={() => setQuery(item.term)}
                      className="flex items-center gap-4 w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-lg font-bold text-muted-foreground w-6">{index + 1}</span>
                      <item.icon className="w-4 h-4 text-primary" />
                      <span className="text-foreground">{item.term}</span>
                      <TrendingUp className="w-4 h-4 text-emerald-500 ml-auto" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">
                  {language === "vi" ? "Tìm kiếm nhanh" : "Quick Search"}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setQuery("happy")}
                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                  >
                    <span className="text-2xl">😊</span>
                    <span className="text-foreground font-medium">
                      {language === "vi" ? "Vui vẻ" : "Happy"}
                    </span>
                  </button>
                  <button
                    onClick={() => setQuery("calm")}
                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                  >
                    <span className="text-2xl">😌</span>
                    <span className="text-foreground font-medium">
                      {language === "vi" ? "Bình yên" : "Calm"}
                    </span>
                  </button>
                  <button
                    onClick={() => setQuery("energetic")}
                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-rose-500/20 to-pink-500/10 border border-rose-500/20 hover:border-rose-500/40 transition-colors"
                  >
                    <span className="text-2xl">⚡</span>
                    <span className="text-foreground font-medium">
                      {language === "vi" ? "Năng lượng" : "Energetic"}
                    </span>
                  </button>
                  <button
                    onClick={() => setQuery("romantic")}
                    className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-colors"
                  >
                    <span className="text-2xl">💕</span>
                    <span className="text-foreground font-medium">
                      {language === "vi" ? "Lãng mạn" : "Romantic"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-white/5 border border-white/10 p-1 mb-4">
                  <TabsTrigger value="all" className="data-[state=active]:bg-primary/20">
                    {language === "vi" ? "Tất cả" : "All"}
                  </TabsTrigger>
                  <TabsTrigger value="songs" className="data-[state=active]:bg-primary/20">
                    {language === "vi" ? "Bài hát" : "Songs"} ({filteredSongs.length})
                  </TabsTrigger>
                  <TabsTrigger value="artists" className="data-[state=active]:bg-primary/20">
                    {language === "vi" ? "Nghệ sĩ" : "Artists"} ({filteredArtists.length})
                  </TabsTrigger>
                  <TabsTrigger value="playlists" className="data-[state=active]:bg-primary/20">
                    Playlists ({filteredPlaylists.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                  {/* Songs */}
                  {filteredSongs.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">
                        {language === "vi" ? "Bài hát" : "Songs"}
                      </h3>
                      <div className="space-y-2">
                        {filteredSongs.slice(0, 4).map((song) => (
                          <button
                            key={song.id}
                            onClick={() => {
                              setCurrentSong(song)
                              onOpenChange(false)
                            }}
                            className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                          >
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
                            <div className="flex-1 min-w-0 text-left">
                              <h4 className="font-medium text-foreground truncate">{song.title}</h4>
                              <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                            </div>
                            <MoodBadge emotion={song.emotion} size="sm" />
                            <span className="text-sm text-muted-foreground">{formatDuration(song.duration)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Artists */}
                  {filteredArtists.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">
                        {language === "vi" ? "Nghệ sĩ" : "Artists"}
                      </h3>
                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {filteredArtists.slice(0, 4).map((artist) => (
                          <div
                            key={artist.id}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors min-w-[100px]"
                          >
                            <div className="relative w-16 h-16 rounded-full overflow-hidden">
                              <Image
                                src={artist.imageUrl}
                                alt={artist.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="text-sm font-medium text-foreground text-center">{artist.name}</span>
                            <span className="text-xs text-muted-foreground">{artist.followers}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Playlists */}
                  {filteredPlaylists.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">
                        Playlists
                      </h3>
                      <div className="space-y-2">
                        {filteredPlaylists.slice(0, 3).map((playlist) => (
                          <div
                            key={playlist.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={playlist.coverUrl}
                                alt={playlist.name[language]}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground truncate">{playlist.name[language]}</h4>
                              <p className="text-sm text-muted-foreground truncate">
                                {playlist.songCount} {language === "vi" ? "bài hát" : "songs"}
                              </p>
                            </div>
                            <MoodBadge emotion={playlist.emotion} size="sm" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredSongs.length === 0 && filteredArtists.length === 0 && filteredPlaylists.length === 0 && (
                    <div className="text-center py-12">
                      <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {language === "vi" 
                          ? `Không tìm thấy kết quả cho "${query}"`
                          : `No results found for "${query}"`}
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="songs" className="space-y-2">
                  {filteredSongs.map((song) => (
                    <button
                      key={song.id}
                      onClick={() => {
                        setCurrentSong(song)
                        onOpenChange(false)
                      }}
                      className="flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                    >
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
                      <div className="flex-1 min-w-0 text-left">
                        <h4 className="font-medium text-foreground truncate">{song.title}</h4>
                        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                      </div>
                      <MoodBadge emotion={song.emotion} size="sm" />
                      <span className="text-sm text-muted-foreground">{formatDuration(song.duration)}</span>
                    </button>
                  ))}
                </TabsContent>

                <TabsContent value="artists" className="space-y-2">
                  {filteredArtists.map((artist) => (
                    <div
                      key={artist.id}
                      className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="relative w-14 h-14 rounded-full overflow-hidden">
                        <Image
                          src={artist.imageUrl}
                          alt={artist.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{artist.name}</h4>
                        <p className="text-sm text-muted-foreground">{artist.followers} followers</p>
                      </div>
                      <Button variant="outline" size="sm">
                        {language === "vi" ? "Theo dõi" : "Follow"}
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="playlists" className="space-y-2">
                  {filteredPlaylists.map((playlist) => (
                    <div
                      key={playlist.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={playlist.coverUrl}
                          alt={playlist.name[language]}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{playlist.name[language]}</h4>
                        <p className="text-sm text-muted-foreground truncate">
                          {playlist.songCount} {language === "vi" ? "bài hát" : "songs"} • {playlist.description[language]}
                        </p>
                      </div>
                      <MoodBadge emotion={playlist.emotion} size="sm" />
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
