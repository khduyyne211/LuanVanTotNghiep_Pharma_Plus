import {
  Outlet,
  Route,
} from "react-router-dom";

import CustomerLayout
  from "../layouts/customer/CustomerLayout";

import CustomerProviders
  from "../shared/providers/CustomerProviders";

import BatBuocDangNhap
  from "../features/xac-thuc/components/BatBuocDangNhap";

import KhungTaiKhoan
  from "../features/customer/tai-khoan/components/KhungTaiKhoan";

import TrangChuPage
  from "../features/customer/trang-chu/pages/TrangChuPage";

import DanhSachSanPhamPage
  from "../features/customer/san-pham/pages/DanhSachSanPhamPage";

import ChiTietSanPhamPage
  from "../features/customer/san-pham/pages/ChiTietSanPhamPage";

import DangKyTaiKhoanPage
  from "../features/customer/dang-ky/pages/DangKyTaiKhoanPage";

import GioHangPage
  from "../features/customer/gio-hang/pages/GioHangPage";

import XacNhanDatHangPage
  from "../features/customer/xac-nhan-dat-hang/pages/XacNhanDatHangPage";

import QuetMaThanhToanZaloPayPage
  from "../features/customer/thanh-toan/pages/QuetMaThanhToanZaloPayPage";

import KetQuaThanhToanZaloPayPage
  from "../features/customer/thanh-toan/pages/KetQuaThanhToanZaloPayPage";

import ThongTinCaNhanPage
  from "../features/customer/tai-khoan/pages/ThongTinCaNhanPage";

import SoDiaChiNhanHangPage
  from "../features/customer/dia-chi-giao-hang/pages/SoDiaChiNhanHangPage";

import DonHangCuaToiPage
  from "../features/customer/don-hang/pages/DonHangCuaToiPage";

import ChiTietDonHangPage
  from "../features/customer/don-hang/pages/ChiTietDonHangPage";

import DanhSachYeuCauTuVanPage
  from "../features/customer/yeu-cau-tu-van/pages/DanhSachYeuCauTuVanPage";

import ChiTietYeuCauTuVanPage
  from "../features/customer/yeu-cau-tu-van/pages/ChiTietYeuCauTuVanPage";

import TaoYeuCauTuVanPage
  from "../features/customer/yeu-cau-tu-van/pages/TaoYeuCauTuVanPage";

export const CustomerRoutes = (
  <Route
    element={
      <CustomerProviders>
        <CustomerLayout />
      </CustomerProviders>
    }
  >
    <Route
      index
      element={<TrangChuPage />}
    />

    <Route
      path="san-pham"
      element={<DanhSachSanPhamPage />}
    />

    <Route
      path="danh-muc/:maDanhMuc/:slug"
      element={<DanhSachSanPhamPage />}
    />

    <Route
      path="san-pham/:maSanPham/:slug"
      element={<ChiTietSanPhamPage />}
    />

    <Route
      path="dang-ky"
      element={<DangKyTaiKhoanPage />}
    />

    <Route
      element={
        <BatBuocDangNhap
          vaiTroBatBuoc="KHACH_HANG"
        >
          <Outlet />
        </BatBuocDangNhap>
      }
    >
      <Route
        path="gio-hang"
        element={<GioHangPage />}
      />

      <Route
        path="xac-nhan-dat-hang"
        element={<XacNhanDatHangPage />}
      />

      <Route
        path="thanh-toan/zalopay/quet-ma"
        element={
          <QuetMaThanhToanZaloPayPage />
        }
      />

      <Route
        path="thanh-toan/zalopay/ket-qua"
        element={
          <KetQuaThanhToanZaloPayPage />
        }
      />

      <Route
        path="tai-khoan"
        element={<KhungTaiKhoan />}
      >
        <Route
          index
          element={<ThongTinCaNhanPage />}
        />

        <Route
          path="so-dia-chi"
          element={<SoDiaChiNhanHangPage />}
        />

        <Route
          path="don-hang"
          element={<DonHangCuaToiPage />}
        />

        <Route
          path="don-hang/:maDonHang"
          element={<ChiTietDonHangPage />}
        />

        <Route
          path="yeu-cau-tu-van"
          element={
            <DanhSachYeuCauTuVanPage />
          }
        />

        <Route
          path="yeu-cau-tu-van/tao-moi"
          element={
            <TaoYeuCauTuVanPage />
          }
        />

        <Route
          path="yeu-cau-tu-van/:maYeuCauTuVan"
          element={
            <ChiTietYeuCauTuVanPage />
          }
        />
      </Route>
    </Route>
  </Route>
);
