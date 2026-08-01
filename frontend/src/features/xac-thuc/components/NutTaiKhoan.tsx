import { useNavigate } from "react-router-dom";
import { useXacThucContext } from "../context/XacThucContext";

function NutTaiKhoan() {
  const navigate = useNavigate();

  const {
    nguoiDungDangNhap,
    daDangNhap,
    moHopThoaiDangNhap,
    dangXuat,
  } = useXacThucContext();

  const xuLyBamNutTaiKhoan = () => {
    if (!daDangNhap) {
      moHopThoaiDangNhap();
      return;
    }

    navigate("/tai-khoan");
  };

  const chuyenDenThongTinCaNhan = () => {
    navigate("/tai-khoan");
  };

  const chuyenDenSoDiaChi = () => {
    navigate("/tai-khoan/so-dia-chi");
  };

  const chuyenDenDonHangCuaToi = () => {
    navigate("/tai-khoan/don-hang");
  };

  const chuyenDenYeuCanTuVan = () => {
    navigate("/tai-khoan/yeu-cau-tu-van");
  };

  const xuLyDangXuat = () => {
    dangXuat();
    navigate("/");
  };

  return (
    <div className="nut-tai-khoan-khu-vuc">
      <button
        type="button"
        className="nut-tai-khoan-header"
        onClick={xuLyBamNutTaiKhoan}
        title={nguoiDungDangNhap?.hoTen || "Đăng nhập"}
      >
        <span className="nut-tai-khoan-icon">
          <i className="bi bi-person-fill"></i>
        </span>

        <span className="nut-tai-khoan-noi-dung">
          {nguoiDungDangNhap?.hoTen || "Đăng nhập"}
        </span>
      </button>

      {daDangNhap && (
        <div className="nut-tai-khoan-menu-khu-vuc">
          <div className="nut-tai-khoan-menu">
            <span className="nut-tai-khoan-menu-mui-ten"></span>

            <button
              type="button"
              className="nut-tai-khoan-menu-muc"
              onClick={chuyenDenThongTinCaNhan}
            >
              <i className="bi bi-person"></i>
              <span>Thông tin cá nhân</span>
            </button>

            <button
              type="button"
              className="nut-tai-khoan-menu-muc"
              onClick={chuyenDenDonHangCuaToi}
            >
              <i className="bi bi-box-seam"></i>
              <span>Đơn hàng của tôi</span>
            </button>

            <button
              type="button"
              className="nut-tai-khoan-menu-muc"
              onClick={chuyenDenSoDiaChi}
            >
              <i className="bi bi-geo-alt"></i>
              <span>Sổ địa chỉ nhận hàng</span>
            </button>

            <button
              type="button"
              className="nut-tai-khoan-menu-muc"
              onClick={chuyenDenYeuCanTuVan}
            >
              <i className="bi bi-chat-left-text"></i>
              <span>Yêu cầu tư vấn</span>
            </button>

            <button
              type="button"
              className="nut-tai-khoan-menu-muc nut-tai-khoan-menu-dang-xuat"
              onClick={xuLyDangXuat}
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NutTaiKhoan;