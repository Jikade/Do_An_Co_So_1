"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import { useAuth } from "@/lib/nguCanhXacThuc";

const ADMIN_EMAIL = "admin@gmail.com";

type AdminRouteGuardProps = {
  children: ReactNode;
};

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const isAdmin = user?.email === ADMIN_EMAIL || user?.role === "admin";

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/dangNhap");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16 text-white">
        Đang kiểm tra quyền truy cập...
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-white">
        <div className="rounded-3xl border border-red-400/20 bg-red-400/10 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-300">
            Không có quyền truy cập
          </p>

          <h1 className="mt-3 text-2xl font-bold">
            Chỉ tài khoản admin mới được vào trang này
          </h1>

          <p className="mt-3 text-sm text-white/70">
            Vui lòng đăng nhập bằng tài khoản admin để quản lý bài hát.
          </p>

          <Link
            href="/dangNhap"
            className="mt-5 inline-flex rounded-full bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
          >
            Đăng nhập admin
          </Link>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
