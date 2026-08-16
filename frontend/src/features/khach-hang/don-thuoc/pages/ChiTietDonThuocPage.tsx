import {
  Link,
} from "react-router-dom";

import TrangThaiDonThuoc
  from "../components/TrangThaiDonThuoc";

import {
  useChiTietDonThuoc,
} from "../hooks/useChiTietDonThuoc";

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

export default function ChiTietDonThuocPage() {
  const {
    donThuoc,

    dangTai,

    loi,

    taiChiTietDonThuoc,
  } = useChiTietDonThuoc();

  if (dangTai) {
    return (
      <section className="don-thuoc-trang">
        <div className="don-thuoc-thong-bao">
          <div className="don-thuoc-vong-xoay" />

          <span>
            Đang tải chi tiết đơn thuốc...
          </span>
        </div>
      </section>
    );
  }

  if (loi) {
    return (
      <section className="don-thuoc-trang">
        <div className="don-thuoc-thong-bao don-thuoc-thong-bao--loi">
          <p>
            {loi}
          </p>

          <button
            type="button"
            onClick={() =>
              void taiChiTietDonThuoc()
            }
          >
            Thử lại
          </button>
        </div>
      </section>
    );
  }

  if (!donThuoc) {
    return (
      <section className="don-thuoc-trang">
        <div className="don-thuoc-thong-bao">
          Không tìm thấy đơn thuốc.
        </div>
      </section>
    );
  }

  return (
    <section className="don-thuoc-trang">
      <div className="don-thuoc-quay-lai">
        <Link to="/tai-khoan/don-thuoc">
          ← Quay lại danh sách đơn thuốc
        </Link>
      </div>

      <div className="don-thuoc-khoi">
        <div className="don-thuoc-chi-tiet-header">
          <div>
            <p className="don-thuoc-label">
              Mã đơn thuốc
            </p>

            <h1>
              Đơn thuốc #
              {donThuoc.maDonThuoc}
            </h1>
          </div>

          <div>
            <p className="don-thuoc-label">
              Trạng thái
            </p>

            <TrangThaiDonThuoc
              trangThai={
                donThuoc
                  .trangThaiDonThuoc
              }
            />
          </div>
        </div>
      </div>

      <div className="don-thuoc-khoi">
        <h2>
          Thông tin đơn thuốc
        </h2>

        <div className="don-thuoc-thong-tin-grid">
          <div>
            <span>
              Ngày gửi
            </span>

            <strong>
              {
                DINH_DANG_NGAY_GIO.format(
                  new Date(
                    donThuoc.ngayUpload
                  )
                )
              }
            </strong>
          </div>

          <div>
            <span>
              Dược sĩ kiểm duyệt
            </span>

            <strong>
              {donThuoc
                .tenNhanVienDuyet ||
                "Chưa có dược sĩ kiểm duyệt"}
            </strong>
          </div>
        </div>
      </div>

      <div className="don-thuoc-khoi">
        <h2>
          Ảnh đơn thuốc
        </h2>

        <div className="don-thuoc-chi-tiet-anh">
          <img
            src={
              donThuoc.anhDonThuoc
            }
            alt={
              `Đơn thuốc #${donThuoc.maDonThuoc}`
            }
          />
        </div>
      </div>

      {donThuoc.trangThaiDonThuoc ===
        "CHO_DUYET" && (
        <div className="don-thuoc-luu-y">
          <i className="bi bi-clock-history" />

          <div>
            <strong>
              Đơn thuốc đang chờ kiểm duyệt
            </strong>

            <p>
              Dược sĩ sẽ kiểm tra ảnh đơn
              thuốc và cập nhật kết quả
              sau khi xử lý.
            </p>
          </div>
        </div>
      )}

      {donThuoc.trangThaiDonThuoc ===
        "DA_DUYET" && (
        <div className="don-thuoc-khoi">
          <h2>
            Kết quả kiểm duyệt
          </h2>

          <div className="don-thuoc-ket-qua don-thuoc-ket-qua--thanh-cong">
            <i className="bi bi-check-circle" />

            <div>
              <strong>
                Đơn thuốc đã được duyệt
              </strong>

              <p>
                {donThuoc
                  .ghiChuDuocSi ||
                  "Đơn thuốc đã được dược sĩ xác nhận hợp lệ."}
              </p>
            </div>
          </div>
        </div>
      )}

      {donThuoc.trangThaiDonThuoc ===
        "TU_CHOI" && (
        <div className="don-thuoc-khoi">
          <h2>
            Kết quả kiểm duyệt
          </h2>

          <div className="don-thuoc-ket-qua don-thuoc-ket-qua--tu-choi">
            <i className="bi bi-x-circle" />

            <div>
              <strong>
                Đơn thuốc bị từ chối
              </strong>

              <p>
                <b>
                  Lý do:
                </b>{" "}
                {donThuoc
                  .lyDoTuChoi ||
                  "Chưa có lý do cụ thể."}
              </p>

              {donThuoc
                .ghiChuDuocSi && (
                <p>
                  <b>
                    Ghi chú:
                  </b>{" "}
                  {
                    donThuoc
                      .ghiChuDuocSi
                  }
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}