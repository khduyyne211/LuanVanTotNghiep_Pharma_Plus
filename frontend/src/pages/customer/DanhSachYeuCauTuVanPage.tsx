import {
  Link,
  useNavigate,
} from "react-router-dom";

import TheYeuCauTuVan from "../../features/yeu-cau-tu-van-khach-hang/components/TheYeuCauTuVan";
import { useDanhSachYeuCauTuVan } from "../../features/yeu-cau-tu-van-khach-hang/hooks/useDanhSachYeuCauTuVan";

import "../../features/yeu-cau-tu-van-khach-hang/styles/YeuCauTuVan.css";

export default function DanhSachYeuCauTuVanPage() {
  const navigate = useNavigate();

  const {
    danhSachYeuCau,
    dangTaiDuLieu,
    dangTaiThem,
    loiTaiDuLieu,
    khongCoDuLieu,
    tongSoPhanTu,
    conYeuCauDeXemThem,
    xemThemYeuCau,
    taiLaiDanhSach,
  } = useDanhSachYeuCauTuVan();

  const xuLyXemChiTiet = (
    maYeuCauTuVan: number
  ) => {
    navigate(
      `/tai-khoan/yeu-cau-tu-van/${maYeuCauTuVan}`
    );
  };

  const hienThiNoiDungDanhSach = () => {
    if (dangTaiDuLieu) {
      return (
        <div className="yeu-cau-tu-van-thong-bao">
          <div className="yeu-cau-tu-van-dang-tai" />

          <p>
            Đang tải danh sách yêu cầu tư vấn...
          </p>
        </div>
      );
    }

    if (loiTaiDuLieu) {
      return (
        <div className="yeu-cau-tu-van-thong-bao yeu-cau-tu-van-thong-bao--loi">
          <p>{loiTaiDuLieu}</p>

          <button
            type="button"
            className="yeu-cau-tu-van-thu-lai"
            onClick={taiLaiDanhSach}
          >
            Thử lại
          </button>
        </div>
      );
    }

    if (khongCoDuLieu) {
      return (
        <div className="yeu-cau-tu-van-thong-bao yeu-cau-tu-van-thong-bao--rong">
          <div className="yeu-cau-tu-van-rong-bieu-tuong">
            <i className="bi bi-chat-left-text"></i>
          </div>

          <p className="yeu-cau-tu-van-rong-tieu-de">
            Bạn chưa có yêu cầu tư vấn nào
          </p>

          <p className="yeu-cau-tu-van-rong-mo-ta">
            Các yêu cầu tư vấn đã gửi sẽ
            được hiển thị tại đây.
          </p>

          <Link
            to="/tai-khoan/yeu-cau-tu-van/tao-moi"
            className="yeu-cau-tu-van-tao-moi-rong"
          >
            Tạo yêu cầu tư vấn
          </Link>
        </div>
      );
    }

    return (
      <>
        <div className="yeu-cau-tu-van-danh-sach">
          {danhSachYeuCau.map(
            (yeuCau) => (
              <TheYeuCauTuVan
                key={yeuCau.maYeuCauTuVan}
                yeuCau={yeuCau}
                onXemChiTiet={
                  xuLyXemChiTiet
                }
              />
            )
          )}
        </div>

        {conYeuCauDeXemThem && (
          <div className="yeu-cau-tu-van-xem-them-khu-vuc">
            <button
              type="button"
              className="yeu-cau-tu-van-xem-them"
              disabled={dangTaiThem}
              onClick={xemThemYeuCau}
            >
              {dangTaiThem
                ? "Đang tải..."
                : "Xem thêm"}
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <section className="yeu-cau-tu-van-trang">
      <div className="yeu-cau-tu-van-tieu-de-khu-vuc">
        <h1>Yêu cầu tư vấn của tôi</h1>

        <div className="yeu-cau-tu-van-tieu-de-ben-phai">
          {!dangTaiDuLieu &&
            !loiTaiDuLieu && (
              <span>
                Đang hiển thị{" "}
                {tongSoPhanTu} yêu cầu
              </span>
            )}

          <Link
            to="/tai-khoan/yeu-cau-tu-van/tao-moi"
            className="yeu-cau-tu-van-nut-tao-moi"
          >
            <i className="bi bi-plus-lg"></i>

            Tạo yêu cầu mới
          </Link>
        </div>
      </div>

      {hienThiNoiDungDanhSach()}
    </section>
  );
}