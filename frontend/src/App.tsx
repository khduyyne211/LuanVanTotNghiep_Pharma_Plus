import { useState } from "react";
import "./App.css";
import QuanLySanPhamPage from "./features/san-pham/pages/QuanLySanPhamPage";
import QuanLyDonThuocPage from "./features/don-thuoc/pages/QuanLyDonThuocPage";
import QuanLyYeuCau from "./pages/QuanLyYeuCau";
import QuanLyDonHangPage from "./features/don-hang/pages/QuanLyDonHangPage";

function App() {
  const [trangDangChon, setTrangDangChon] = useState("san-pham");

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>Pharma</h2>
          <span >Quản trị viên</span>
        </div>

        <nav className="sidebar-menu">
          <button
            className={
              trangDangChon === "san-pham"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setTrangDangChon("san-pham")}
          >
            Quản lý sản phẩm
          </button>

          <button
            className={
              trangDangChon === "don-thuoc"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setTrangDangChon("don-thuoc")}
          >
            Quản lý đơn thuốc
          </button>

          {/* <button
            className={
              trangDangChon === "yeu-cau"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setTrangDangChon("yeu-cau")}
          >
            Quản lý yêu cầu tư vấn
          </button> */}

          <button
            className={
              trangDangChon === "don-hang"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setTrangDangChon("don-hang")}
          >
            Quản lý đơn hàng
          </button>

          {/* <button className="menu-item">
            Đơn hàng cần duyệt
          </button> */}
        </nav>
      </aside>

      <main className="main-content">
        {trangDangChon === "san-pham" && (
          <QuanLySanPhamPage />
        )}

        {trangDangChon === "don-thuoc" && (
          <QuanLyDonThuocPage />
        )}

        {trangDangChon === "yeu-cau" && (
          <QuanLyYeuCau />
        )}

        {trangDangChon === "don-hang" && (
          <QuanLyDonHangPage />
        )}
      </main>
    </div>
  );
}

export default App;