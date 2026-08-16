import {
  Outlet,
  Route,
} from "react-router-dom";

import CustomerLayout
  from "../layouts/khach-hang/CustomerLayout";

import CustomerProviders
  from "../shared/providers/CustomerProviders";

import BatBuocDangNhap
  from "../features/xac-thuc/components/BatBuocDangNhap";

import KhungTaiKhoan
  from "../features/khach-hang/tai-khoan/components/KhungTaiKhoan";

import TrangChuPage
  from "../features/khach-hang/trang-chu/pages/TrangChuPage";

import DanhSachSanPhamPage
  from "../features/khach-hang/san-pham/pages/DanhSachSanPhamPage";

import ChiTietSanPhamPage
  from "../features/khach-hang/san-pham/pages/ChiTietSanPhamPage";

import DangKyTaiKhoanPage
  from "../features/khach-hang/dang-ky/pages/DangKyTaiKhoanPage";

import GioHangPage
  from "../features/khach-hang/gio-hang/pages/GioHangPage";

import XacNhanDatHangPage
  from "../features/khach-hang/xac-nhan-dat-hang/pages/XacNhanDatHangPage";

import QuetMaThanhToanZaloPayPage
  from "../features/khach-hang/thanh-toan/pages/QuetMaThanhToanZaloPayPage";

import KetQuaThanhToanZaloPayPage
  from "../features/khach-hang/thanh-toan/pages/KetQuaThanhToanZaloPayPage";

import ThongTinCaNhanPage
  from "../features/khach-hang/tai-khoan/pages/ThongTinCaNhanPage";

import SoDiaChiNhanHangPage
  from "../features/khach-hang/dia-chi-giao-hang/pages/SoDiaChiNhanHangPage";

import DonHangCuaToiPage
  from "../features/khach-hang/don-hang/pages/DonHangCuaToiPage";

import ChiTietDonHangPage
  from "../features/khach-hang/don-hang/pages/ChiTietDonHangPage";

import DanhSachYeuCauTuVanPage
  from "../features/khach-hang/yeu-cau-tu-van/pages/DanhSachYeuCauTuVanPage";

import ChiTietYeuCauTuVanPage
  from "../features/khach-hang/yeu-cau-tu-van/pages/ChiTietYeuCauTuVanPage";

import TaoYeuCauTuVanPage
  from "../features/khach-hang/yeu-cau-tu-van/pages/TaoYeuCauTuVanPage";

import DanhSachDonThuocPage
  from "../features/khach-hang/don-thuoc/pages/DanhSachDonThuocPage";

import GuiDonThuocPage
  from "../features/khach-hang/don-thuoc/pages/GuiDonThuocPage";

import ChiTietDonThuocPage
  from "../features/khach-hang/don-thuoc/pages/ChiTietDonThuocPage";

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

        <Route
          path="don-thuoc"
          element={
            <DanhSachDonThuocPage />
          }
        />

        <Route
          path="don-thuoc/gui-moi"
          element={
            <GuiDonThuocPage />
          }
        />

        <Route
          path="don-thuoc/:maDonThuoc"
          element={
            <ChiTietDonThuocPage />
          }
        />
      </Route>
    </Route>
  </Route>
);