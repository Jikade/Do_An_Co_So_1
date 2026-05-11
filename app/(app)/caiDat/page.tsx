"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Crown,
  LogIn,
  LogOut,
  Mail,
  RefreshCcw,
  Shield,
  User,
  UserCircle2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/nguCanhXacThuc";
import { cn } from "@/lib/tienIch";

function getProviderLabel(provider?: string | null) {
  if (!provider) return "Không xác định";

  if (provider === "local") return "Email / Mật khẩu";
  if (provider === "google") return "Google";

  return provider;
}

function getUserInitial(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || "U";

  return source.charAt(0).toUpperCase();
}

export default function UserProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout, refreshUser } = useAuth();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isAdmin = useMemo(() => {
    return user?.email === "admin@gmail.com" || user?.role === "admin";
  }, [user?.email, user?.role]);

  const isVipPro = Boolean(user?.is_vip);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/dangNhap");
    }
  }, [isLoading, isAuthenticated, router]);

  async function handleRefreshUser() {
    setMessage(null);
    setIsRefreshing(true);

    try {
      await refreshUser();
      setMessage("Đã cập nhật thông tin tài khoản mới nhất.");
    } catch (error) {
      console.warn("Không thể cập nhật thông tin user:", error);
      setMessage("Không thể cập nhật thông tin tài khoản. Vui lòng thử lại.");
    } finally {
      setIsRefreshing(false);
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logout();
      router.replace("/dangNhap");
    } catch (error) {
      console.warn("Không thể đăng xuất:", error);
      setIsLoggingOut(false);
    }
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16 text-white">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardContent className="p-6 text-white/70">
            Đang tải hồ sơ người dùng...
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 text-white">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-black/30 md:p-8">
        <div className="absolute right-[-6rem] top-[-6rem] h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute bottom-[-7rem] left-[-5rem] h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative h-28 w-28 overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-xl">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name || user.email}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/10 text-4xl font-black text-white">
                  {getUserInitial(user.name, user.email)}
                </div>
              )}

              {isVipPro ? (
                <div className="absolute bottom-2 right-2 rounded-full bg-amber-400 p-1.5 text-slate-950 shadow-lg">
                  <Crown className="h-4 w-4" />
                </div>
              ) : null}
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
                Hồ sơ người dùng
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                {user.name || "Người dùng MoodSync"}
              </h1>

              <p className="mt-2 flex items-center gap-2 text-sm text-white/60">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge
                  className={cn(
                    "border px-3 py-1",
                    isVipPro
                      ? "border-amber-300/30 bg-amber-300/15 text-amber-100"
                      : "border-white/10 bg-white/10 text-white/70",
                  )}
                >
                  <Crown className="mr-1.5 h-3.5 w-3.5" />
                  {isVipPro ? "VIP PRO đã kích hoạt" : "Chưa có VIP PRO"}
                </Badge>

                <Badge
                  className={cn(
                    "border px-3 py-1",
                    isAdmin
                      ? "border-emerald-300/30 bg-emerald-300/15 text-emerald-100"
                      : "border-white/10 bg-white/10 text-white/70",
                  )}
                >
                  <Shield className="mr-1.5 h-3.5 w-3.5" />
                  {isAdmin ? "Admin" : "User"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <Button
              type="button"
              onClick={handleRefreshUser}
              disabled={isRefreshing}
              className="rounded-full bg-white text-slate-950 hover:bg-white/90"
            >
              <RefreshCcw
                className={cn("mr-2 h-4 w-4", isRefreshing && "animate-spin")}
              />
              {isRefreshing ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="rounded-full border-red-300/30 bg-red-400/10 text-red-100 hover:bg-red-400/20"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
            </Button>
          </div>
        </div>
      </section>

      {message ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white/70">
          {message}
        </div>
      ) : null}

      <section className="mt-8 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="border-white/10 bg-white/[0.04] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle2 className="h-5 w-5 text-amber-300" />
              Thông tin tài khoản
            </CardTitle>

            <CardDescription className="text-white/50">
              Các thông tin được lấy từ tài khoản đang đăng nhập.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                ID người dùng
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                #{user.id}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                Tên hiển thị
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {user.name || "Chưa cập nhật"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                Email
              </p>
              <p className="mt-2 break-all text-lg font-semibold text-white">
                {user.email}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                Phương thức đăng nhập
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {getProviderLabel(user.auth_provider)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                Vai trò
              </p>
              <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-white">
                <Shield className="h-5 w-5 text-emerald-300" />
                {isAdmin ? "Quản trị viên" : "Người dùng"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
                Trạng thái VIP PRO
              </p>
              <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-white">
                <Crown
                  className={cn(
                    "h-5 w-5",
                    isVipPro ? "text-amber-300" : "text-white/40",
                  )}
                />
                {isVipPro ? "Đã kích hoạt" : "Chưa kích hoạt"}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="border-white/10 bg-white/[0.04] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-300" />
                Gói VIP PRO
              </CardTitle>

              <CardDescription className="text-white/50">
                Trạng thái quyền tải nhạc độc quyền.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {isVipPro ? (
                <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                  <div className="flex items-center gap-2 text-emerald-100">
                    <BadgeCheck className="h-5 w-5" />
                    <p className="font-semibold">
                      Tài khoản đã được duyệt VIP PRO
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-emerald-100/75">
                    Bạn có thể tải các bài nhạc độc quyền từ chúng tôi.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                  <div className="flex items-center gap-2 text-amber-100">
                    <Crown className="h-5 w-5" />
                    <p className="font-semibold">Chưa đăng ký VIP PRO</p>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-amber-100/75">
                    Hãy nâng cấp VIP PRO để có thể tải nhạc độc quyền từ chúng
                    tôi.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Truy cập nhanh
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {!isVipPro ? (
                <Link
                  href="/"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/75 transition hover:bg-white/[0.08]"
                >
                  <span>Mở VIP PRO ở thanh topbar để nâng cấp</span>
                  <Crown className="h-4 w-4 text-amber-300" />
                </Link>
              ) : null}

              {isAdmin ? (
                <>
                  <Link
                    href="/quanLyDonHang"
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/75 transition hover:bg-white/[0.08]"
                  >
                    <span>Quản lý đơn hàng VIP PRO</span>
                    <Shield className="h-4 w-4 text-emerald-300" />
                  </Link>

                  <Link
                    href="/quanLyBaiHat"
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/75 transition hover:bg-white/[0.08]"
                  >
                    <span>Quản lý bài hát</span>
                    <Shield className="h-4 w-4 text-emerald-300" />
                  </Link>
                </>
              ) : null}

              {!isAuthenticated ? (
                <Link
                  href="/dangNhap"
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/75 transition hover:bg-white/[0.08]"
                >
                  <span>Đăng nhập</span>
                  <LogIn className="h-4 w-4" />
                </Link>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
