import { Link } from "react-router-dom";
import { useGioHangContext } from "../context/GioHangContext";
import { useXacThucContext } from "../../xac-thuc/context/XacThucContext";
import "../styles/ThongBaoGioHang.css"

function NutGioHang() {
  const { soDongChiTietGioHang } =
    useGioHangContext();

  const {
    daDangNhap,
    moHopThoaiDangNhap,
  } = useXacThucContext();

  const xuLyBamGioHang = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (!daDangNhap) {
      event.preventDefault();
      moHopThoaiDangNhap();
    }
  };

  return (
    <Link
      to="/gio-hang"
      className="nut-gio-hang-header"
      onClick={xuLyBamGioHang}
    >
      <span className="nut-gio-hang-bieu-tuong">
        <i className="bi bi-cart-fill"></i>

        {soDongChiTietGioHang > 0 && (
          <span className="nut-gio-hang-so-luong">
            {soDongChiTietGioHang}
          </span>
        )}
      </span>

      <span>Giỏ hàng</span>
    </Link>
  );
}

export default NutGioHang;