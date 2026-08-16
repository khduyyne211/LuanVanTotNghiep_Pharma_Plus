import {
  Link,
} from "react-router-dom";

import TrangThaiYeuCauTuVan
  from "../../yeu-cau-tu-van/components/TrangThaiYeuCauTuVan";

import {
  useChiTietYeuCauTuVan,
} from "../../yeu-cau-tu-van/hooks/useChiTietYeuCauTuVan";

import "../../yeu-cau-tu-van/styles/YeuCauTuVan.css";
import "../../yeu-cau-tu-van/styles/ChiTietYeuCauTuVan.css";

const dinhDangNgayGio =
  new Intl.DateTimeFormat(
    "vi-VN",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

function layTenHinhThucLienHe(
  hinhThucLienHe: string
) {
  if (
    hinhThucLienHe ===
    "GOI_DIEN"
  ) {
    return "Gọi điện thoại";
  }

  if (
    hinhThucLienHe === "ZALO"
  ) {
    return "Liên hệ qua Zalo";
  }

  return hinhThucLienHe;
}

export default function ChiTietYeuCauTuVanPage() {
  const {
    chiTietYeuCau,
    dangTai,
    loi,
    taiChiTietYeuCau,
  } = useChiTietYeuCauTuVan();

  if (dangTai) {
    return (
      <section className="chi-tiet-yeu-cau-trang">
        <div className="chi-tiet-yeu-cau-thong-bao">
          <div className="chi-tiet-yeu-cau-dang-tai" />

          <p>
            Đang tải chi tiết yêu cầu tư vấn...
          </p>
        </div>
      </section>
    );
  }

  if (loi) {
    return (
      <section className="chi-tiet-yeu-cau-trang">
        <div className="chi-tiet-yeu-cau-thong-bao chi-tiet-yeu-cau-thong-bao--loi">
          <p>
            {loi}
          </p>

          <button
            type="button"
            className="chi-tiet-yeu-cau-thu-lai"
            onClick={() =>
              void taiChiTietYeuCau()
            }
          >
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  if (!chiTietYeuCau) {
    return (
      <section className="chi-tiet-yeu-cau-trang">
        <div className="chi-tiet-yeu-cau-thong-bao">
          Không tìm thấy yêu cầu tư vấn.
        </div>
      </section>
    );
  }

  const ngayTaoHienThi =
    dinhDangNgayGio.format(
      new Date(
        chiTietYeuCau.ngayTao
      )
    );

  const tenHinhThucLienHe =
    layTenHinhThucLienHe(
      chiTietYeuCau
        .hinhThucLienHe
    );

  return (
    <section className="chi-tiet-yeu-cau-trang">
      <div className="chi-tiet-yeu-cau-header">
        <Link
          to="/tai-khoan/yeu-cau-tu-van"
          className="chi-tiet-yeu-cau-quay-lai"
        >
          ← Quay lại danh sách yêu cầu tư vấn
        </Link>
      </div>

      <div className="chi-tiet-yeu-cau-khoi">
        <div className="chi-tiet-yeu-cau-khoi-dau">
          <div>
            <p className="chi-tiet-yeu-cau-label">
              Ngày tạo yêu cầu
            </p>

            <h1 className="chi-tiet-yeu-cau-tieu-de">
              {ngayTaoHienThi}
            </h1>
          </div>

          <div>
            <p className="chi-tiet-yeu-cau-label">
              Trạng thái tư vấn
            </p>

            <TrangThaiYeuCauTuVan
              trangThai={
                chiTietYeuCau
                  .trangThaiTuVan
              }
            />
          </div>
        </div>
      </div>

      <div className="chi-tiet-yeu-cau-hai-cot">
        <div className="chi-tiet-yeu-cau-khoi">
          <h2 className="chi-tiet-yeu-cau-khoi-tieu-de">
            Thông tin khách hàng
          </h2>

          <div className="chi-tiet-yeu-cau-danh-sach-thong-tin">
            <div className="chi-tiet-yeu-cau-dong">
              <span>
                Họ và tên
              </span>

              <strong>
                {
                  chiTietYeuCau
                    .tenKhachHang
                }
              </strong>
            </div>

            <div className="chi-tiet-yeu-cau-dong">
              <span>
                Số điện thoại
              </span>

              <strong>
                {
                  chiTietYeuCau
                    .soDienThoai
                }
              </strong>
            </div>

            <div className="chi-tiet-yeu-cau-dong">
              <span>
                Hình thức liên hệ
              </span>

              <strong>
                {
                  tenHinhThucLienHe
                }
              </strong>
            </div>
          </div>
        </div>

        <div className="chi-tiet-yeu-cau-khoi">
          <h2 className="chi-tiet-yeu-cau-khoi-tieu-de">
            Thông tin tiếp nhận
          </h2>

          <div className="chi-tiet-yeu-cau-danh-sach-thong-tin">
            <div className="chi-tiet-yeu-cau-dong">
              <span>
                Nhân viên tiếp nhận
              </span>

              <strong>
                {chiTietYeuCau
                  .tenNhanVienTiepNhan ||
                  "Chưa có nhân viên tiếp nhận"}
              </strong>
            </div>
          </div>
        </div>
      </div>

      <div className="chi-tiet-yeu-cau-khoi">
        <h2 className="chi-tiet-yeu-cau-khoi-tieu-de">
          Sản phẩm cần tư vấn
        </h2>

        {chiTietYeuCau.sanPham ? (
          <div className="chi-tiet-yeu-cau-san-pham">
            <div className="chi-tiet-yeu-cau-san-pham-anh">
              {chiTietYeuCau
                .sanPham
                .hinhAnh ? (
                <img
                  src={
                    chiTietYeuCau
                      .sanPham
                      .hinhAnh
                  }
                  alt={
                    chiTietYeuCau
                      .sanPham
                      .tenSanPham
                  }
                />
              ) : (
                <i className="bi bi-capsule" />
              )}
            </div>

            <div className="chi-tiet-yeu-cau-san-pham-thong-tin">
              <strong>
                {
                  chiTietYeuCau
                    .sanPham
                    .tenSanPham
                }
              </strong>

              {chiTietYeuCau
                .sanPham
                .laThuocKeDon && (
                <span>
                  Thuốc kê đơn
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="chi-tiet-yeu-cau-san-pham-rong">
            Yêu cầu này không gắn với
            sản phẩm cụ thể.
          </div>
        )}
      </div>

      <div className="chi-tiet-yeu-cau-khoi">
        <h2 className="chi-tiet-yeu-cau-khoi-tieu-de">
          Nội dung cần tư vấn
        </h2>

        <div className="chi-tiet-yeu-cau-noi-dung">
          {
            chiTietYeuCau
              .noiDungCanTuVan
          }
        </div>
      </div>

      <div className="chi-tiet-yeu-cau-khoi">
        <h2 className="chi-tiet-yeu-cau-khoi-tieu-de">
          Kết quả tư vấn
        </h2>

        <div
          className={
            chiTietYeuCau
              .ketQuaTuVan
              ? "chi-tiet-yeu-cau-noi-dung"
              : "chi-tiet-yeu-cau-noi-dung chi-tiet-yeu-cau-noi-dung--rong"
          }
        >
          {chiTietYeuCau
            .ketQuaTuVan ||
            "Chưa có kết quả tư vấn."}
        </div>
      </div>
    </section>
  );
}