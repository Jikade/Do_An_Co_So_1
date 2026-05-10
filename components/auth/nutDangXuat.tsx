"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { useAuth } from "@/lib/nguCanhXacThuc";
import { cn } from "@/lib/tienIch";

export function LogoutButton({ className }: { className?: string }) {
  const { logout } = useAuth();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    setIsPending(true);
    await logout();
    router.replace("/dangNhap");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-60",
        className,
      )}
    >
      <LogOut className="size-4" />
      {isPending ? "Đang thoát..." : "Đăng xuất"}
    </button>
  );
}
