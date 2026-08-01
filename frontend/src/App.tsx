import { Outlet, Route, Routes } from "react-router-dom";

import AdminLayout from "./layouts/admin/AdminLayout";
import CustomerLayout from "./layouts/customer/CustomerLayout";
import CustomerProviders from "./shared/providers/CustomerProviders";

import BatBuocDangNhap from "./features/xac-thuc/components/BatBuocDangNhap";
import KhungTaiKhoan from "./features/tai-khoan-khach-hang/components/KhungTaiKhoan";

import TrangChuPage from "./pages/customer/TrangChuPage";
import DanhSachSanPhamPage from "./pages/customer/DanhSachSanPhamPage";
import ChiTietSanPhamPage from "./pages/customer/ChiTietSanPhamPage";
import DangKyTaiKhoanPage from "./pages/customer/DangKyTaiKhoanPage";
import GioHangPage from "./pages/customer/GioHangPage";
import XacNhanDatHangPage from "./pages/customer/XacNhanDatHangPage";
import QuetMaThanhToanZaloPayPage from "./pages/customer/QuetMaThanhToanZaloPayPage";
import KetQuaThanhToanZaloPayPage from "./pages/customer/KetQuaThanhToanZaloPayPage";
import ThongTinCaNhanPage from "./pages/customer/ThongTinCaNhanPage";
import SoDiaChiNhanHangPage from "./pages/customer/SoDiaChiNhanHangPage";
import DonHangCuaToiPage from "./pages/customer/DonHangCuaToiPage";
import ChiTietDonHangPage from "./pages/customer/ChiTietDonHangPage";
import DanhSachYeuCauTuVanPage from "./pages/customer/DanhSachYeuCauTuVanPage";
import ChiTietYeuCauTuVanPage from "./pages/customer/ChiTietYeuCauTuVanPage";
import TaoYeuCauTuVanPage from "./pages/customer/TaoYeuCauTuVanPage";

function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <BatBuocDangNhap vaiTroBatBuoc="ADMIN">
            <AdminLayout />
          </BatBuocDangNhap>
        }
      />

      <Route
        element={
          <CustomerProviders>
            <CustomerLayout />
          </CustomerProviders>
        }
      >
        <Route index element={<TrangChuPage />} />
        <Route path="san-pham" element={<DanhSachSanPhamPage />} />
        <Route path="danh-muc/:maDanhMuc/:slug" element={<DanhSachSanPhamPage />} />
        <Route path="san-pham/:maSanPham/:slug" element={<ChiTietSanPhamPage />} />
        <Route path="dang-ky" element={<DangKyTaiKhoanPage />} />

        <Route
          element={
            <BatBuocDangNhap vaiTroBatBuoc="KHACH_HANG">
              <Outlet />
            </BatBuocDangNhap>
          }
        >
          <Route path="gio-hang" element={<GioHangPage />} />
          <Route path="xac-nhan-dat-hang" element={<XacNhanDatHangPage />} />
          <Route path="thanh-toan/zalopay/quet-ma" element={<QuetMaThanhToanZaloPayPage />} />
          <Route path="thanh-toan/zalopay/ket-qua" element={<KetQuaThanhToanZaloPayPage />} />

          <Route path="tai-khoan" element={<KhungTaiKhoan />}>
            <Route index element={<ThongTinCaNhanPage />} />
            <Route path="so-dia-chi" element={<SoDiaChiNhanHangPage />} />
            <Route path="don-hang" element={<DonHangCuaToiPage />} />
            <Route path="don-hang/:maDonHang" element={<ChiTietDonHangPage />} />
            <Route path="yeu-cau-tu-van" element={<DanhSachYeuCauTuVanPage />} />
            <Route path="yeu-cau-tu-van/tao-moi" element={<TaoYeuCauTuVanPage />} />
            <Route path="yeu-cau-tu-van/:maYeuCauTuVan" element={<ChiTietYeuCauTuVanPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
