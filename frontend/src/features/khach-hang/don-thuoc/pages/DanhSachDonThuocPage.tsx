import {
  Link,
  useNavigate,
} from "react-router-dom";

import TrangThaiDonThuoc
  from "../components/TrangThaiDonThuoc";

import {
  useDanhSachDonThuoc,
} from "../hooks/useDanhSachDonThuoc";

import "../styles/DonThuocKhachHang.css";

const DINH_DANG_NGAY_GIO =
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

export default function DanhSachDonThuocPage() {
  const navigate =
    useNavigate();

  const {
    danhSachDonThuoc,

    dangTaiDuLieu,
    dangTaiThem,

    loiTaiDuLieu,

    khongCoDuLieu,

    tongSoPhanTu,

    conDonThuocDeXemThem,

    xemThemDonThuoc,
    taiLaiDanhSach,
  } = useDanhSachDonThuoc();

  return (
    <section className="don-thuoc-trang">
      <div className="don-thuoc-danh-sach-header">
        <div>
          <h1>
            Đơn thuốc của tôi
          </h1>

          <p>
            Theo dõi các đơn thuốc bạn đã
            gửi cho nhà thuốc kiểm tra.
          </p>
        </div>

        <Link
          to="/tai-khoan/don-thuoc/gui-moi"
          className="don-thuoc-nut-chinh"
        >
          <i className="bi bi-cloud-arrow-up" />

          Gửi đơn thuốc
        </Link>
      </div>

      {dangTaiDuLieu ? (
        <div className="don-thuoc-thong-bao">
          <div className="don-thuoc-vong-xoay" />

          <span>
            Đang tải danh sách đơn thuốc...
          </span>
        </div>
      ) : loiTaiDuLieu ? (
        <div className="don-thuoc-thong-bao don-thuoc-thong-bao--loi">
          <p>
            {loiTaiDuLieu}
          </p>

          <button
            type="button"
            onClick={
              taiLaiDanhSach
            }
          >
            Thử lại
          </button>
        </div>
      ) : khongCoDuLieu ? (
        <div className="don-thuoc-thong-bao">
          <i className="bi bi-file-earmark-medical don-thuoc-rong-icon" />

          <strong>
            Bạn chưa gửi đơn thuốc nào
          </strong>

          <p>
            Khi cần mua thuốc kê đơn,
            bạn có thể gửi ảnh đơn thuốc
            để dược sĩ kiểm tra.
          </p>

          <Link
            to="/tai-khoan/don-thuoc/gui-moi"
            className="don-thuoc-nut-chinh"
          >
            Gửi đơn thuốc
          </Link>
        </div>
      ) : (
        <>
          <div className="don-thuoc-danh-sach">
            {danhSachDonThuoc.map(
              (donThuoc) => (
                <article
                  key={
                    donThuoc.maDonThuoc
                  }
                  className="don-thuoc-the"
                >
                  <div className="don-thuoc-the-anh">
                    <img
                      src={
                        donThuoc.anhDonThuoc
                      }
                      alt={
                        `Đơn thuốc #${donThuoc.maDonThuoc}`
                      }
                    />
                  </div>

                  <div className="don-thuoc-the-thong-tin">
                    <div className="don-thuoc-the-dau">
                      <div>
                        <strong>
                          Đơn thuốc #
                          {
                            donThuoc.maDonThuoc
                          }
                        </strong>

                        <span>
                          {
                            DINH_DANG_NGAY_GIO.format(
                              new Date(
                                donThuoc.ngayUpload
                              )
                            )
                          }
                        </span>
                      </div>

                      <TrangThaiDonThuoc
                        trangThai={
                          donThuoc
                            .trangThaiDonThuoc
                        }
                      />
                    </div>

                    <div className="don-thuoc-the-cuoi">
                      <span>
                        {donThuoc
                          .tenNhanVienDuyet
                          ? `Dược sĩ: ${donThuoc.tenNhanVienDuyet}`
                          : "Đang chờ dược sĩ kiểm tra"}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/tai-khoan/don-thuoc/${donThuoc.maDonThuoc}`
                          )
                        }
                      >
                        Xem chi tiết

                        <i className="bi bi-chevron-right" />
                      </button>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>

          <p className="don-thuoc-tong-so">
            Tổng số đơn thuốc:{" "}
            {tongSoPhanTu}
          </p>

          {conDonThuocDeXemThem && (
            <div className="don-thuoc-xem-them">
              <button
                type="button"
                disabled={
                  dangTaiThem
                }
                onClick={
                  xemThemDonThuoc
                }
              >
                {dangTaiThem
                  ? "Đang tải..."
                  : "Xem thêm"}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}