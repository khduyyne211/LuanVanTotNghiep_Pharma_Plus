import { lazy, Suspense } from "react";

import { Navigate, Route } from "react-router-dom";

import BatBuocDangNhap from "../features/xac-thuc/components/BatBuocDangNhap";

import QuanLyYeuCauTuVanDuocSiPage from "../features/duoc-si/yeu-cau-tu-van/pages/QuanLyYeuCauTuVanDuocSiPage";

import QuanLyDonThuocPage from "../features/duoc-si/don-thuoc/pages/QuanLyDonThuocPage";

import QuanLyDonHangDuocSiPage from "../features/duoc-si/don-hang/pages/QuanLyDonHangDuocSiPage";

import TuVanDonThuocDuocSiPage from "../features/duoc-si/tu-van-don-thuoc/pages/TuVanDonThuocDuocSiPage";

import TaoDonTaiQuayPage from "../features/duoc-si/tao-don-tai-quay/pages/TaoDonTaiQuayPage";

const DuocSiLayout = lazy(() => import("../layouts/duoc-si/DuocSiLayout"));

export const DuocSiRoutes = (
  <Route
    path="/duoc-si/*"
    element={
      <BatBuocDangNhap vaiTroBatBuoc="DUOC_SI">
        <Suspense fallback={<div>Đang tải giao diện Dược sĩ...</div>}>
          <DuocSiLayout />
        </Suspense>
      </BatBuocDangNhap>
    }
  >
    <Route
      index
      element={
        <Navigate to="/duoc-si/tu-van-don-thuoc/yeu-cau-tu-van" replace />
      }
    />

    <Route path="tu-van-don-thuoc" element={<TuVanDonThuocDuocSiPage />}>
      <Route
        index
        element={
          <Navigate to="/duoc-si/tu-van-don-thuoc/yeu-cau-tu-van" replace />
        }
      />

      <Route path="yeu-cau-tu-van" element={<QuanLyYeuCauTuVanDuocSiPage />} />

      <Route path="don-thuoc" element={<QuanLyDonThuocPage />} />
    </Route>

    <Route
      path="yeu-cau-tu-van"
      element={
        <Navigate to="/duoc-si/tu-van-don-thuoc/yeu-cau-tu-van" replace />
      }
    />

    <Route
      path="don-thuoc"
      element={<Navigate to="/duoc-si/tu-van-don-thuoc/don-thuoc" replace />}
    />

    <Route path="don-hang" element={<QuanLyDonHangDuocSiPage />} />

    <Route path="tao-don-tai-quay" element={<TaoDonTaiQuayPage />} />

    <Route
      path="*"
      element={
        <Navigate to="/duoc-si/tu-van-don-thuoc/yeu-cau-tu-van" replace />
      }
    />
  </Route>
);
