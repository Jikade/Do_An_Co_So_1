"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import {
  buildVipQrUrl,
  createPaymentOrder,
  listMyPaymentOrders,
  type PaymentOrder,
} from "@/lib/api/payment-orders";
import { useAuth } from "@/lib/nguCanhXacThuc";

const VIP_AMOUNT = 1000;

type VipProPaymentProps = {
  onClose?: () => void;
};

function getStatusLabel(status: PaymentOrder["status"]) {
  if (status === "pending") return "Chờ xử lý";
  if (status === "approved") return "Đã duyệt";
  if (status === "rejected") return "Đã từ chối";
  return status;
}

function getStatusClassName(status: PaymentOrder["status"]) {
  if (status === "approved") {
    return "border-emerald-300/30 bg-emerald-300/10 text-emerald-200";
  }

  if (status === "rejected") {
    return "border-red-300/30 bg-red-300/10 text-red-200";
  }

  return "border-amber-300/30 bg-amber-300/10 text-amber-100";
}

function formatDate(value?: string | null) {
  if (!value) return "Chưa có";

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function VipProPayment({ onClose }: VipProPaymentProps) {
  const { user, isAuthenticated, refreshUser } = useAuth();

  const [showQr, setShowQr] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  const qrUrl = useMemo(() => {
    if (!user?.email) return "";
    return buildVipQrUrl(user.email, VIP_AMOUNT);
  }, [user?.email]);

  async function fetchMyLatestOrder() {
    if (!isAuthenticated || !user?.email) return;

    setError(null);
    setIsLoadingOrders(true);

    try {
      const orders = await listMyPaymentOrders();

      const latestOrder = orders[0] ?? null;

      if (latestOrder) {
        setOrder(latestOrder);
        setShowQr(true);
      } else {
        setOrder(null);
        setShowQr(false);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể tải hóa đơn VIP PRO.",
      );
    } finally {
      setIsLoadingOrders(false);
    }
  }

  async function handleConfirmPayment() {
    setError(null);
    setIsConfirming(true);

    try {
      const createdOrder = await createPaymentOrder(VIP_AMOUNT);

      setOrder(createdOrder);
      setShowQr(true);

      await refreshUser();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Không thể xác nhận thanh toán.",
      );
    } finally {
      setIsConfirming(false);
    }
  }

  useEffect(() => {
    fetchMyLatestOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.email]);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-400">
          VIP PRO
        </p>

        <h3 className="mt-2 text-lg font-bold text-white">
          Nâng cấp tài khoản
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/70">
          Hãy nâng cấp VIP PRO để có thể tải nhạc độc quyền từ chúng tôi
        </p>
      </div>

      {!isAuthenticated || !user?.email ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-white/70">
            Bạn cần đăng nhập để tạo mã QR thanh toán theo email tài khoản.
          </p>

          <Link
            href="/dangNhap"
            className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-amber-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-300"
          >
            Đăng nhập
          </Link>
        </div>
      ) : null}

      {isAuthenticated && user?.email ? (
        <>
          {isLoadingOrders ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              Đang tải hóa đơn VIP PRO...
            </div>
          ) : null}

          {!isLoadingOrders && !order && !showQr ? (
            <button
              type="button"
              onClick={() => setShowQr(true)}
              className="w-full rounded-full bg-amber-400 px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-amber-300"
            >
              NÂNG CẤP
            </button>
          ) : null}

          {!isLoadingOrders && showQr ? (
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {order ? "Hóa đơn VIP PRO" : "Thanh toán VIP PRO"}
                  </p>

                  <p className="mt-1 text-xs text-white/60">
                    Giá tiền:{" "}
                    <span className="font-semibold text-amber-300">
                      {VIP_AMOUNT.toLocaleString("vi-VN")} VND
                    </span>
                  </p>

                  <p className="mt-1 break-all text-xs text-white/60">
                    Mã đơn hàng:{" "}
                    <span className="font-semibold text-white">
                      {user.email}
                    </span>
                  </p>
                </div>

                {onClose ? (
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 hover:bg-white/10"
                  >
                    Đóng
                  </button>
                ) : null}
              </div>

              <div className="mt-4 rounded-2xl bg-white p-3">
                <img
                  src={order?.qr_url || qrUrl}
                  alt={`QR thanh toán VIP PRO cho ${user.email}`}
                  className="mx-auto aspect-square w-full max-w-[220px] object-contain"
                />
              </div>

              {order ? (
                <div className="mt-4 space-y-3">
                  <div
                    className={`rounded-2xl border p-3 text-sm ${getStatusClassName(
                      order.status,
                    )}`}
                  >
                    Trạng thái đơn hàng:{" "}
                    <span className="font-bold">
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/60">
                    <div className="flex justify-between gap-3">
                      <span>Ngày tạo đơn</span>
                      <span className="text-right text-white/80">
                        {formatDate(order.created_at)}
                      </span>
                    </div>

                    <div className="mt-2 flex justify-between gap-3">
                      <span>Ngày duyệt</span>
                      <span className="text-right text-white/80">
                        {formatDate(order.approved_at)}
                      </span>
                    </div>
                  </div>

                  {order.status === "pending" ? (
                    <p className="text-xs leading-5 text-white/50">
                      Đơn hàng của bạn đang chờ admin kiểm tra và duyệt.
                    </p>
                  ) : null}

                  {order.status === "approved" ? (
                    <p className="text-xs leading-5 text-emerald-200">
                      Tài khoản của bạn đã được nâng cấp VIP PRO.
                    </p>
                  ) : null}

                  {order.status === "rejected" ? (
                    <p className="text-xs leading-5 text-red-200">
                      Đơn hàng đã bị từ chối. Vui lòng liên hệ admin để được hỗ
                      trợ.
                    </p>
                  ) : null}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isConfirming}
                  className="mt-4 w-full rounded-full bg-emerald-400 px-4 py-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isConfirming ? "Đang xác nhận..." : "Xác nhận thanh toán"}
                </button>
              )}

              {error ? (
                <p className="mt-3 text-sm text-red-300">{error}</p>
              ) : null}
            </div>
          ) : null}

          {!isLoadingOrders && error && !showQr ? (
            <p className="text-sm text-red-300">{error}</p>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
