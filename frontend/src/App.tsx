import { useState } from "react";
import "./App.css";
import QuanLySanPham from "./pages/QuanLySanPham";
import QuanLyDonThuoc from "./pages/QuanLyDonThuoc";
import QuanLyYeuCau from "./pages/QuanLyYeuCau";

function App() {
  const [trangDangChon, setTrangDangChon] = useState("san-pham");

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>Pharma</h2>
          <span>Dược sĩ</span>
        </div>

        <nav className="sidebar-menu">
          <button
            className={trangDangChon === "san-pham" ? "menu-item active" : "menu-item"}
            onClick={() => setTrangDangChon("san-pham")}
          >
            Quản lý sản phẩm
          </button>

          <button
            className={trangDangChon === "don-thuoc" ? "menu-item active" : "menu-item"}
            onClick={() => setTrangDangChon("don-thuoc")}
          >
            Quản lý đơn thuốc
          </button>

          <button
            className={trangDangChon === "yeu-cau" ? "menu-item active" : "menu-item"}
            onClick={() => setTrangDangChon("yeu-cau")}
          >
            Quản lý yêu cầu tư vấn
          </button>
          <button className="menu-item">Đơn hàng cần duyệt</button>
        </nav>
      </aside>

      <main className="main-content">
        {trangDangChon === "san-pham" && <QuanLySanPham />}
        {trangDangChon === "don-thuoc" && <QuanLyDonThuoc />}
        {trangDangChon === "yeu-cau" && <QuanLyYeuCau />}
      </main>
    </div>
  );
}

export default App;