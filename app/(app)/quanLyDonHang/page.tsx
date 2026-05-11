"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  approvePaymentOrder,
  listAdminPaymentOrders,
  type PaymentOrder,
} from "@/lib/api/payment-orders";
import { useAuth } from "@/lib/nguCanhXacThuc";

const ADMIN_EMAIL = "admin@gmail.com";

function formatStatus(status: PaymentOrder["status"]) {
  if (status === "pending") return "Chờ xử lý";
  if (status === "approved") return "Đã duyệt";
  if (status === "rejected") return "Đã từ chối";
  return status;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function QuanLyDonHangPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth();

  const [orders, setOrders] = useState<PaymentOrder[]>([]);
  const [search, setSearch] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = useMemo(() => {
    return user?.email === ADMIN_EMAIL;
  }, [user?.email]);

  async function fetchOrders(nextSearch = search) {
    setError(null);
    setIsFetching(true);

    try {
      const data = await listAdminPaymentOrders(nextSearch);
      setOrders(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Không thể tải danh sách đơn hàng.",
      );
    } finally {
      setIsFetching(false);
    }
  }

  async function handleApprove(orderId: number) {
    setError(null);
    setApprovingId(orderId);

    try {
      const updatedOrder = await approvePaymentOrder(orderId);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId ? updatedOrder : order,
        ),
      );

      await refreshUser();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể duyệt đơn hàng.",
      );
    } finally {
      setApprovingId(null);
    }
  }

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/dangNhap");
      return;
    }

    if (!isAdmin) return;

    fetchOrders("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, isAdmin]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-10 text-white">
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
          <h1 className="text-2xl font-bold">Không có quyền truy cập</h1>
          <p className="mt-3 text-white/70">
            Chỉ tài khoản admin mới có thể vào trang quản lý đơn hàng.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-10 text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-bold">Quản lý đơn hàng VIP PRO</h1>
          <p className="mt-2 text-sm text-white/60">
            Tìm kiếm đơn hàng bằng mã đơn hàng. Mã đơn hàng chính là email của
            user.
          </p>
        </div>

        <form
          className="flex w-full gap-2 md:w-auto"
          onSubmit={(event) => {
            event.preventDefault();
            fetchOrders(search);
          }}
        >
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Nhập email / mã đơn hàng..."
            className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-amber-300 md:w-80"
          />

          <button
            type="submit"
            className="rounded-full bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
          >
            Tìm
          </button>
        </form>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
        <div className="border-b border-white/10 px-5 py-4 text-sm text-white/60">
          {isFetching
            ? "Đang tải đơn hàng..."
            : `Tổng số đơn: ${orders.length}`}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.2em] text-white/50">
              <tr>
                <th className="px-5 py-4">Mã đơn hàng</th>
                <th className="px-5 py-4">Gói</th>
                <th className="px-5 py-4">Giá</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Ngày tạo</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-white/10">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">
                      {order.order_code}
                    </div>
                    <div className="text-xs text-white/40">
                      {order.user_email}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-white/70">
                    {order.package_name}
                  </td>

                  <td className="px-5 py-4 font-semibold text-amber-300">
                    {order.amount.toLocaleString("vi-VN")} VND
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80">
                      {formatStatus(order.status)}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-white/60">
                    {formatDate(order.created_at)}
                  </td>

                  <td className="px-5 py-4 text-right">
                    {order.status === "pending" ? (
                      <button
                        type="button"
                        onClick={() => handleApprove(order.id)}
                        disabled={approvingId === order.id}
                        className="rounded-full bg-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {approvingId === order.id ? "Đang duyệt..." : "Duyệt"}
                      </button>
                    ) : (
                      <span className="text-xs text-white/40">
                        Không cần thao tác
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {!orders.length && !isFetching ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-white/50"
                  >
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
