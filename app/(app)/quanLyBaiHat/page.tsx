import AdminRouteGuard from "@/components/admin/admin-route-guard";
import SongManager from "@/components/admin/song-manager";

export const dynamic = "force-dynamic";

export default function QuanLyBaiHatPage() {
  return (
    <AdminRouteGuard>
      <SongManager />
    </AdminRouteGuard>
  );
}
