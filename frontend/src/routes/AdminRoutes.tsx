import { lazy, Suspense } from "react";

import { Navigate, Route } from "react-router-dom";

import BatBuocDangNhap from "../features/xac-thuc/components/BatBuocDangNhap";

import DashboardPage from "../features/admin/dashboard/pages/DashboardPage";
import QuanLySanPhamPage from "../features/admin/san-pham/pages/QuanLySanPhamPage";
import QuanLyDonHangPage from "../features/admin/don-hang/pages/QuanLyDonHangPage";
import QuanLyDanhMucSanPhamPage from "../features/admin/danh-muc-san-pham/pages/QuanLyDanhMucSanPhamPage";
import QuanLyNhaSanXuatPage from "../features/admin/nha-san-xuat/pages/QuanLyNhaSanXuatPage";
import QuanLyDonViTinhPage from "../features/admin/don-vi-tinh/pages/QuanLyDonViTinhPage";
import QuanLyHoatChatPage from "../features/admin/hoat-chat/pages/QuanLyHoatChatPage";
import QuanLyKhuyenMaiPage from "../features/admin/khuyen-mai/pages/QuanLyKhuyenMaiPage";
import QuanLyNhaCungCapPage from "../features/admin/nha-cung-cap/pages/QuanLyNhaCungCapPage";
import QuanLyPhieuNhapPage from "../features/admin/phieu-nhap/pages/QuanLyPhieuNhapPage";
import QuanLyKhoPage from "../features/admin/kho/pages/QuanLyKhoPage";
import QuanLyTaiKhoanVaiTroPage from "../features/admin/tai-khoan-vai-tro/pages/QuanLyTaiKhoanVaiTroPage";
import QuanLyVoucherDonHangPage from "../features/admin/voucher-don-hang/pages/QuanLyVoucherDonHangPage";

const AdminLayout = lazy(() => import("../layouts/admin/AdminLayout"));

export const AdminRoutes = (
  <Route
    path="/admin/*"
    element={
      <BatBuocDangNhap vaiTroBatBuoc="ADMIN">
        <Suspense fallback={<div>Đang tải trang quản trị...</div>}>
          <AdminLayout />
        </Suspense>
      </BatBuocDangNhap>
    }
  >
    <Route index element={<Navigate to="/admin/dashboard" replace />} />

    <Route path="dashboard" element={<DashboardPage />} />

    <Route path="san-pham" element={<QuanLySanPhamPage />} />

    <Route path="danh-muc" element={<QuanLyDanhMucSanPhamPage />} />

    <Route path="nha-san-xuat" element={<QuanLyNhaSanXuatPage />} />

    <Route path="don-vi-tinh" element={<QuanLyDonViTinhPage />} />

    <Route path="hoat-chat" element={<QuanLyHoatChatPage />} />

    <Route path="khuyen-mai" element={<QuanLyKhuyenMaiPage />} />

    <Route path="voucher-don-hang" element={<QuanLyVoucherDonHangPage />} />

    <Route path="don-hang" element={<QuanLyDonHangPage />} />

    <Route path="nha-cung-cap" element={<QuanLyNhaCungCapPage />} />

    <Route path="phieu-nhap" element={<QuanLyPhieuNhapPage />} />

    <Route path="kho" element={<QuanLyKhoPage />} />

    <Route path="tai-khoan-vai-tro" element={<QuanLyTaiKhoanVaiTroPage />} />

    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
  </Route>
);
