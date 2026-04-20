"use client"

import { useState } from "react"
import Image from "next/image"
import { Bell, Check, Music, Smile, TrendingUp, Sparkles, Gift, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { translations } from "@/lib/duLieuGiaLap"
import { useTheme } from "@/lib/nguCanhGiaoDien"

interface Notification {
  id: string
  type: "recommendation" | "mood" | "insight" | "feature" | "promo"
  titleVi: string
  titleEn: string
  descVi: string
  descEn: string
  time: string
  read: boolean
  icon: typeof Music
  color: string
  image?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "recommendation",
    titleVi: "Playlist mới cho bạn",
    titleEn: "New playlist for you",
    descVi: "Dựa trên tâm trạng vui vẻ của bạn hôm nay",
    descEn: "Based on your happy mood today",
    time: "2m",
    read: false,
    icon: Music,
    color: "#ec4899",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=60&h=60&fit=crop",
  },
  {
    id: "2",
    type: "mood",
    titleVi: "Phát hiện cảm xúc mới",
    titleEn: "New emotion detected",
    descVi: "AI nhận diện bạn đang cảm thấy bình yên",
    descEn: "AI detected you're feeling calm",
    time: "15m",
    read: false,
    icon: Smile,
    color: "#22c55e",
  },
  {
    id: "3",
    type: "insight",
    titleVi: "Báo cáo tuần đã sẵn sàng",
    titleEn: "Weekly report ready",
    descVi: "Xem phân tích cảm xúc và âm nhạc của bạn",
    descEn: "View your emotion and music analysis",
    time: "1h",
    read: false,
    icon: TrendingUp,
    color: "#f59e0b",
  },
  {
    id: "4",
    type: "feature",
    titleVi: "Tính năng mới",
    titleEn: "New feature",
    descVi: "Thử phân tích giọng nói theo thời gian thực",
    descEn: "Try real-time voice analysis",
    time: "3h",
    read: true,
    icon: Sparkles,
    color: "#8b5cf6",
  },
  {
    id: "5",
    type: "promo",
    titleVi: "Ưu đãi VIP Pro",
    titleEn: "VIP Pro offer",
    descVi: "Giảm 50% cho gói VIP Pro tháng đầu tiên",
    descEn: "50% off on your first month of VIP Pro",
    time: "1d",
    read: true,
    icon: Gift,
    color: "#ef4444",
  },
]

export function NotificationDropdown() {
  const { language } = useTheme()
  const t = translations[language]
  const [notifications, setNotifications] = useState(mockNotifications)
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 sm:w-96 p-0 bg-background/95 backdrop-blur-xl border-white/10"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-semibold text-foreground">
            {language === "vi" ? "Thông báo" : "Notifications"}
          </h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-primary hover:text-primary/80"
              onClick={markAllAsRead}
            >
              <Check className="w-3 h-3 mr-1" />
              {language === "vi" ? "Đánh dấu đã đọc" : "Mark all read"}
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="max-h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {language === "vi" 
                  ? "Không có thông báo"
                  : "No notifications"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex gap-3 p-4 hover:bg-white/5 transition-colors relative group ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  {/* Icon or Image */}
                  {notification.image ? (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={notification.image}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${notification.color}20` }}
                    >
                      <notification.icon 
                        className="w-5 h-5" 
                        style={{ color: notification.color }}
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-sm font-medium truncate ${
                        !notification.read ? "text-foreground" : "text-muted-foreground"
                      }`}>
                        {language === "vi" ? notification.titleVi : notification.titleEn}
                      </h4>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {language === "vi" ? notification.descVi : notification.descEn}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                  )}

                  {/* Remove button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeNotification(notification.id)
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t border-white/10">
          <Button variant="ghost" className="w-full text-sm" onClick={() => setOpen(false)}>
            {language === "vi" ? "Xem tất cả thông báo" : "View all notifications"}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
