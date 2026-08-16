import { useRef } from "react";
import {
  faChevronLeft,
  faChevronRight,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import TheSanPham from "../../san-pham/components/TheSanPham";
import { useSanPhamBanChay } from "../../san-pham/hooks/useSanPhamBanChay";

import "../../san-pham/styles/SanPham.css";
import "../styles/TrangChu.css";

const dinhDangSoLuong = new Intl.NumberFormat("vi-VN");

function SanPhamBanChay() {
  const danhSachRef = useRef<HTMLDivElement>(null);

  const {
    danhSachSanPhamBanChay,
    dangTaiSanPhamBanChay,
    loiTaiSanPhamBanChay,
  } = useSanPhamBanChay(12);

  const truotDanhSach = (
    huong: "TRAI" | "PHAI"
  ) => {
    const danhSach = danhSachRef.current;

    if (!danhSach) {
      return;
    }

    const khoangTruot =
      danhSach.clientWidth * 0.85;

    danhSach.scrollBy({
      left:
        huong === "PHAI"
          ? khoangTruot
          : -khoangTruot,
      behavior: "smooth",
    });
  };

  const coHienThiNutDieuHuong =
    danhSachSanPhamBanChay.length > 4;

  return (
    <section className="san-pham-ban-chay">
      <div className="san-pham-ban-chay-tieu-de">
        <FontAwesomeIcon icon={faFire} />
        <h2>Sản phẩm bán chạy</h2>
      </div>

      {coHienThiNutDieuHuong && (
        <button
          type="button"
          className="san-pham-ban-chay-dieu-huong san-pham-ban-chay-dieu-huong--trai"
          aria-label="Xem sản phẩm phía trước"
          onClick={() =>
            truotDanhSach("TRAI")
          }
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
          />
        </button>
      )}

      <div
        ref={danhSachRef}
        className="san-pham-ban-chay-danh-sach"
      >
        {dangTaiSanPhamBanChay && (
          <p className="san-pham-ban-chay-trang-thai">
            Đang tải sản phẩm bán chạy...
          </p>
        )}

        {!dangTaiSanPhamBanChay &&
          loiTaiSanPhamBanChay && (
            <p
              className="san-pham-ban-chay-trang-thai san-pham-ban-chay-trang-thai--loi"
              role="alert"
            >
              {loiTaiSanPhamBanChay}
            </p>
          )}

        {!dangTaiSanPhamBanChay &&
          !loiTaiSanPhamBanChay &&
          danhSachSanPhamBanChay.length === 0 && (
            <p className="san-pham-ban-chay-trang-thai">
              Hiện chưa có dữ liệu sản phẩm bán chạy.
            </p>
          )}

        {!dangTaiSanPhamBanChay &&
          !loiTaiSanPhamBanChay &&
          danhSachSanPhamBanChay.map(
            (sanPhamBanChay) => (
              <div
                key={
                  sanPhamBanChay.sanPham.maSanPham
                }
                className="san-pham-ban-chay-the"
              >
                <span className="san-pham-ban-chay-da-ban">
                  {dinhDangSoLuong.format(
                    sanPhamBanChay.soLuotMua
                  )}{" "}
                  lượt mua / 30 ngày
                </span>

                <TheSanPham
                  sanPham={
                    sanPhamBanChay.sanPham
                  }
                />
              </div>
            )
          )}
      </div>

      {coHienThiNutDieuHuong && (
        <button
          type="button"
          className="san-pham-ban-chay-dieu-huong san-pham-ban-chay-dieu-huong--phai"
          aria-label="Xem thêm sản phẩm"
          onClick={() =>
            truotDanhSach("PHAI")
          }
        >
          <FontAwesomeIcon
            icon={faChevronRight}
          />
        </button>
      )}
    </section>
  );
}

export default SanPhamBanChay;