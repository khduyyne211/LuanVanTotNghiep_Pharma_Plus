import { Route, Routes } from "react-router-dom";

import AdminLayout from "./layouts/admin/AdminLayout";
import CustomerLayout from "./layouts/customer/CustomerLayout";
import CustomerProviders from "./shared/providers/CustomerProviders";

import TrangChuPage from "./pages/customer/TrangChuPage";
import DanhSachSanPhamPage from "./pages/customer/DanhSachSanPhamPage";
import ChiTietSanPhamPage from "./pages/customer/ChiTietSanPhamPage";
import DangKyTaiKhoanPage from "./pages/customer/DangKyTaiKhoanPage";

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminLayout />} />

      <Route
        element={
          <CustomerProviders>
            <CustomerLayout />
          </CustomerProviders>
        }
      >
        <Route index element={<TrangChuPage />} />
        <Route path="/san-pham" element={<DanhSachSanPhamPage />} />
        <Route path="/danh-muc/:maDanhMuc/:slug" element={<DanhSachSanPhamPage />} />
        <Route path="/san-pham/:maSanPham/:slug" element={<ChiTietSanPhamPage />} />
        <Route path="/dang-ky" element={<DangKyTaiKhoanPage />} />
      </Route>
    </Routes>
  );
}

export default App;
