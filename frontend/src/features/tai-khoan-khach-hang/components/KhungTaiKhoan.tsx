import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useXacThucContext } from "../../xac-thuc/context/XacThucContext";
import "../styles/TaiKhoan.css";

function KhungTaiKhoan() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    nguoiDungDangNhap,
    dangXuat,
  } = useXacThucContext();

  const duongDan = location.pathname;

  const dangOSoDiaChi =
    duongDan.startsWith(
      "/tai-khoan/so-dia-chi"
    );

  const dangODanhSachDonHang =
    duongDan === "/tai-khoan/don-hang";

  const dangOChiTietDonHang =
    duongDan.startsWith(
      "/tai-khoan/don-hang/"
    );

  const dangODanhSachYeuCauTuVan =
    duongDan ===
    "/tai-khoan/yeu-cau-tu-van";

  const dangOTaoYeuCauTuVan =
    duongDan ===
    "/tai-khoan/yeu-cau-tu-van/tao-moi";

  const dangOChiTietYeuCauTuVan =
    duongDan.startsWith(
      "/tai-khoan/yeu-cau-tu-van/"
    ) &&
    !dangOTaoYeuCauTuVan;

  const tenTrangHienTai =
    dangOChiTietYeuCauTuVan
      ? "Chi tiết yêu cầu tư vấn"
      : dangOTaoYeuCauTuVan
        ? "Tạo yêu cầu tư vấn"
        : dangODanhSachYeuCauTuVan
          ? "Yêu cầu tư vấn của tôi"
          : dangOChiTietDonHang
            ? "Chi tiết đơn hàng"
            : dangODanhSachDonHang
              ? "Đơn hàng của tôi"
              : dangOSoDiaChi
                ? "Quản lý sổ địa chỉ"
                : "Thông tin cá nhân";

  const dangOTrangConDonHang =
    dangOChiTietDonHang;

  const dangOTrangConYeuCauTuVan =
    dangOChiTietYeuCauTuVan ||
    dangOTaoYeuCauTuVan;

  const xuLyDangXuat = () => {
    dangXuat();
    navigate("/");
  };

  return (
    <main className="tai-khoan-trang">
      <div className="page-container">
        <div className="tai-khoan-duong-dan">
          <NavLink to="/">
            Trang chủ
          </NavLink>

          <span>/</span>

          <NavLink to="/tai-khoan">
            Cá nhân
          </NavLink>

          <span>/</span>

          {dangOTrangConDonHang && (
            <>
              <NavLink to="/tai-khoan/don-hang">
                Đơn hàng của tôi
              </NavLink>

              <span>/</span>
            </>
          )}

          {dangOTrangConYeuCauTuVan && (
            <>
              <NavLink to="/tai-khoan/yeu-cau-tu-van">
                Yêu cầu tư vấn của tôi
              </NavLink>

              <span>/</span>
            </>
          )}

          <strong>
            {tenTrangHienTai}
          </strong>
        </div>

        <div className="tai-khoan-bo-cuc">
          <aside className="tai-khoan-ben-trai">
            <div className="tai-khoan-the-nguoi-dung">
              <div className="tai-khoan-anh-dai-dien">
                <i className="bi bi-person-fill"></i>
              </div>

              <strong>
                {nguoiDungDangNhap?.hoTen ||
                  "Khách hàng"}
              </strong>

              <span>
                {nguoiDungDangNhap
                  ?.soDienThoai || ""}
              </span>
            </div>

            <nav className="tai-khoan-menu-ben-trai">
              <NavLink
                to="/tai-khoan"
                end
                className={({ isActive }) =>
                  isActive
                    ? "tai-khoan-menu-muc dang-chon"
                    : "tai-khoan-menu-muc"
                }
              >
                <i className="bi bi-person-circle"></i>

                <span>
                  Thông tin cá nhân
                </span>

                <i className="bi bi-chevron-right tai-khoan-menu-mui-ten"></i>
              </NavLink>

              <NavLink
                to="/tai-khoan/don-hang"
                className={({ isActive }) =>
                  isActive
                    ? "tai-khoan-menu-muc dang-chon"
                    : "tai-khoan-menu-muc"
                }
              >
                <i className="bi bi-box-seam"></i>

                <span>
                  Đơn hàng của tôi
                </span>

                <i className="bi bi-chevron-right tai-khoan-menu-mui-ten"></i>
              </NavLink>

              <NavLink
                to="/tai-khoan/so-dia-chi"
                className={({ isActive }) =>
                  isActive
                    ? "tai-khoan-menu-muc dang-chon"
                    : "tai-khoan-menu-muc"
                }
              >
                <i className="bi bi-geo-alt"></i>

                <span>
                  Quản lý sổ địa chỉ
                </span>

                <i className="bi bi-chevron-right tai-khoan-menu-mui-ten"></i>
              </NavLink>

              <NavLink
                to="/tai-khoan/yeu-cau-tu-van"
                className={({ isActive }) =>
                  isActive
                    ? "tai-khoan-menu-muc dang-chon"
                    : "tai-khoan-menu-muc"
                }
              >
                <i className="bi bi-chat-left-text"></i>

                <span>
                  Yêu cầu tư vấn
                </span>

                <i className="bi bi-chevron-right tai-khoan-menu-mui-ten"></i>
              </NavLink>

              <button
                type="button"
                className="tai-khoan-menu-muc tai-khoan-menu-dang-xuat"
                onClick={xuLyDangXuat}
              >
                <i className="bi bi-box-arrow-right"></i>

                <span>Đăng xuất</span>

                <i className="bi bi-chevron-right tai-khoan-menu-mui-ten"></i>
              </button>
            </nav>
          </aside>

          <div className="tai-khoan-ben-phai">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
}

export default KhungTaiKhoan;