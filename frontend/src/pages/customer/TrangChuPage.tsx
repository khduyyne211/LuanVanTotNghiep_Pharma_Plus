import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import DanhMucNoiBat from "../../features/trang-chu/components/DanhMucNoiBat";
import "../../features/trang-chu/styles/TrangChu.css";
import SanPhamBanChay from "../../features/trang-chu/components/SanPhamBanChay";

interface TrangThaiTrangChu {
  tuKhoaKhongCoKetQua?: string;
}

function TrangChuPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const trangThaiTrangChu =
    location.state as TrangThaiTrangChu | null;

  const tuKhoaKhongCoKetQua =
    trangThaiTrangChu?.tuKhoaKhongCoKetQua;

  const coThongBaoTimKiem =
    tuKhoaKhongCoKetQua !== undefined;

  const dongThongBaoTimKiem = () => {
    navigate("/", {
      replace: true,
      state: null,
    });
  };

  return (
    <main className="trang-chu">
      <div className="page-container">
        {coThongBaoTimKiem && (
          <div
            className="trang-chu-thong-bao-tim-kiem"
            role="status"
            aria-live="polite"
          >
            <div className="trang-chu-thong-bao-icon">
              <i className="bi bi-search"></i>
            </div>

            <div className="trang-chu-thong-bao-noi-dung">
              <strong>
                Không tìm thấy sản phẩm phù hợp
              </strong>

              <p>
                {tuKhoaKhongCoKetQua ? (
                  <>
                    Không có sản phẩm liên quan đến
                    từ khóa{" "}
                    <span>
                      “{tuKhoaKhongCoKetQua}”
                    </span>
                    . Vui lòng kiểm tra lại hoặc nhập
                    một từ khóa khác.
                  </>
                ) : (
                  <>
                    Từ khóa tìm kiếm không tồn tại.
                    Vui lòng nhập một từ khóa khác để
                    tìm sản phẩm.
                  </>
                )}
              </p>
            </div>

            <button
              type="button"
              className="trang-chu-thong-bao-dong"
              aria-label="Đóng thông báo"
              onClick={dongThongBaoTimKiem}
            >
              ×
            </button>
          </div>
        )}

        <DanhMucNoiBat />

        <SanPhamBanChay />
      </div>
    </main>
  );
}

export default TrangChuPage;