import { useState } from "react";
import "./AdminLayout.css";
import QuanLySanPhamPage from "../../features/san-pham/pages/QuanLySanPhamPage";
import QuanLyYeuCau from "../../pages/QuanLyYeuCau";
import QuanLyDonHangPage from "../../features/don-hang/pages/QuanLyDonHangPage";
import QuanLyDanhMucSanPhamPage from "../../features/danh-muc-san-pham/pages/QuanLyDanhMucSanPhamPage";
import QuanLyNhaSanXuatPage from "../../features/nha-san-xuat/pages/QuanLyNhaSanXuatPage";
import QuanLyDonViTinhPage from "../../features/don-vi-tinh/pages/QuanLyDonViTinhPage";
import QuanLyHoatChatPage from "../../features/hoat-chat/pages/QuanLyHoatChatPage";
import QuanLyKhuyenMaiPage from "../../features/khuyen-mai/pages/QuanLyKhuyenMaiPage";
import QuanLyNhaCungCapPage from "../../features/nha-cung-cap/pages/QuanLyNhaCungCapPage";
function AdminLayout() {
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
                trangDangChon === "danh-muc-san-pham"
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() => setTrangDangChon("danh-muc-san-pham")}
            >
              Quản lý danh mục
            </button>
            <button
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
                className={
                  trangDangChon === "don-vi-tinh"
                    ? "menu-item active"
                    : "menu-item"
                }
                onClick={() => setTrangDangChon("don-vi-tinh")}
              >
                Quản lý đơn vị tính
              </button>
            <button
              className={
                trangDangChon === "hoat-chat"
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() => setTrangDangChon("hoat-chat")}
            >
              Quản lý hoạt chất
            </button>
          <button
            className={
              trangDangChon === "khuyen-mai"
                ? "menu-item active"
                : "menu-item"
            }
            onClick={() => setTrangDangChon("khuyen-mai")}
          >
            Quản lý khuyến mãi
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

          <button
              className={
                trangDangChon === "nha-cung-cap"
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() => setTrangDangChon("nha-cung-cap")}
            >
              Quản lý nhà cung cấp
            </button>
        </nav>
      </aside>

      <main className="main-content">
        {trangDangChon === "san-pham" && (
          <QuanLySanPhamPage />
        )}

        {trangDangChon === "danh-muc-san-pham" && (
          <QuanLyDanhMucSanPhamPage/>
        )}
        {trangDangChon === "nha-san-xuat" && (
          <QuanLyNhaSanXuatPage />
        )}
        {trangDangChon === "don-vi-tinh" && (
          <QuanLyDonViTinhPage />
        )}
        {trangDangChon === "hoat-chat" && (
          <QuanLyHoatChatPage />
        )}
        {trangDangChon === "khuyen-mai" && (
          <QuanLyKhuyenMaiPage />
        )}
        {trangDangChon === "yeu-cau" && (
          <QuanLyYeuCau />
        )}

        {trangDangChon === "don-hang" && (
          <QuanLyDonHangPage />
        )}
        {trangDangChon === "nha-cung-cap" && (
          <QuanLyNhaCungCapPage />
        )}
      </main>
    </div>
  );
}

export default AdminLayout;