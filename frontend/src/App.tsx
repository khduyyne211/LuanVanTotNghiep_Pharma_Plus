import { useState } from "react";

import "./App.css";

import DashboardPage from "./features/dashboard/pages/DashboardPage";
import QuanLySanPhamPage from "./features/san-pham/pages/QuanLySanPhamPage";
import QuanLyDonHangPage from "./features/don-hang/pages/QuanLyDonHangPage";
import QuanLyDanhMucSanPhamPage from "./features/danh-muc-san-pham/pages/QuanLyDanhMucSanPhamPage";
import QuanLyNhaSanXuatPage from "./features/nha-san-xuat/pages/QuanLyNhaSanXuatPage";
import QuanLyDonViTinhPage from "./features/don-vi-tinh/pages/QuanLyDonViTinhPage";
import QuanLyHoatChatPage from "./features/hoat-chat/pages/QuanLyHoatChatPage";
import QuanLyKhuyenMaiPage from "./features/khuyen-mai/pages/QuanLyKhuyenMaiPage";
import QuanLyNhaCungCapPage from "./features/nha-cung-cap/pages/QuanLyNhaCungCapPage";
import QuanLyPhieuNhapPage from "./features/phieu-nhap/pages/QuanLyPhieuNhapPage";

function App() {
  const [trangDangChon, setTrangDangChon] = useState("dashboard");

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>Pharma</h2>
          <span>Quản trị viên</span>
        </div>

        <nav className="sidebar-menu">
          <button
            type="button"
            className={
              trangDangChon === "dashboard" ? "menu-item active" : "menu-item"
            }
            onClick={() => setTrangDangChon("dashboard")}
          >
            Dashboard
          </button>

          <button
            type="button"
            className={
              trangDangChon === "san-pham" ? "menu-item active" : "menu-item"
            }
            onClick={() => setTrangDangChon("san-pham")}
          >
            Quản lý sản phẩm
          </button>

          <button
            type="button"
            className={
              trangDangChon === "danh-muc-san-pham"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setTrangDangChon("danh-muc-san-pham")}
          >
            Quản lý danh mục
          </button>

          <button
            type="button"
            className={
              trangDangChon === "nha-san-xuat"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setTrangDangChon("nha-san-xuat")}
          >
            Quản lý nhà sản xuất
          </button>

          <button
            type="button"
            className={
              trangDangChon === "don-vi-tinh" ? "menu-item active" : "menu-item"
            }
            onClick={() => setTrangDangChon("don-vi-tinh")}
          >
            Quản lý đơn vị tính
          </button>

          <button
            type="button"
            className={
              trangDangChon === "hoat-chat" ? "menu-item active" : "menu-item"
            }
            onClick={() => setTrangDangChon("hoat-chat")}
          >
            Quản lý hoạt chất
          </button>

          <button
            type="button"
            className={
              trangDangChon === "khuyen-mai" ? "menu-item active" : "menu-item"
            }
            onClick={() => setTrangDangChon("khuyen-mai")}
          >
            Quản lý khuyến mãi
          </button>

          <button
            type="button"
            className={
              trangDangChon === "don-hang" ? "menu-item active" : "menu-item"
            }
            onClick={() => setTrangDangChon("don-hang")}
          >
            Quản lý đơn hàng
          </button>

          <button
            type="button"
            className={
              trangDangChon === "nha-cung-cap"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setTrangDangChon("nha-cung-cap")}
          >
            Quản lý nhà cung cấp
          </button>

          <button
            type="button"
            className={
              trangDangChon === "phieu-nhap" ? "menu-item active" : "menu-item"
            }
            onClick={() => setTrangDangChon("phieu-nhap")}
          >
            Quản lý phiếu nhập
          </button>
        </nav>
      </aside>

      <main className="main-content">
        {trangDangChon === "dashboard" && <DashboardPage />}

        {trangDangChon === "san-pham" && <QuanLySanPhamPage />}

        {trangDangChon === "danh-muc-san-pham" && <QuanLyDanhMucSanPhamPage />}

        {trangDangChon === "nha-san-xuat" && <QuanLyNhaSanXuatPage />}

        {trangDangChon === "don-vi-tinh" && <QuanLyDonViTinhPage />}

        {trangDangChon === "hoat-chat" && <QuanLyHoatChatPage />}

        {trangDangChon === "khuyen-mai" && <QuanLyKhuyenMaiPage />}

        {trangDangChon === "don-hang" && <QuanLyDonHangPage />}

        {trangDangChon === "nha-cung-cap" && <QuanLyNhaCungCapPage />}

        {trangDangChon === "phieu-nhap" && <QuanLyPhieuNhapPage />}
      </main>
    </div>
  );
}

export default App;
