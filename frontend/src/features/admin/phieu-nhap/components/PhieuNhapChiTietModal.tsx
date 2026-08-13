import AdminLoading from "../../shared/components/loading/AdminLoading";
import type { PhieuNhap, TrangThaiPhieuNhap } from "../types/PhieuNhap";

type PhieuNhapChiTietModalProps = {
  isOpen: boolean;
  phieuNhap: PhieuNhap | null;
  loading: boolean;
  loi: string | null;
  dangXuLy: boolean;
  onClose: () => void;
  onXacNhan: (maPhieuNhap: number) => void;
  onHuy: (maPhieuNhap: number) => void;
};

const dinhDangTien = (giaTri: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(giaTri);
};

const dinhDangNgayGio = (giaTri: string) => {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(giaTri));
};

const dinhDangNgay = (giaTri: string) => {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
  }).format(new Date(`${giaTri}T00:00:00`));
};

const layThongTinTrangThai = (trangThai: TrangThaiPhieuNhap) => {
  switch (trangThai) {
    case "CHO_XAC_NHAN":
      return {
        nhan: "Chờ xác nhận",
        className: "ql-status ql-status-pending",
      };

    case "DA_NHAP":
      return {
        nhan: "Đã nhập",
        className: "ql-status ql-status-active",
      };

    case "DA_HUY":
      return {
        nhan: "Đã hủy",
        className: "ql-status ql-status-inactive",
      };
  }
};

function PhieuNhapChiTietModal({
  isOpen,
  phieuNhap,
  loading,
  loi,
  dangXuLy,
  onClose,
  onXacNhan,
  onHuy,
}: PhieuNhapChiTietModalProps) {
  if (!isOpen) {
    return null;
  }

  const thongTinTrangThai = phieuNhap
    ? layThongTinTrangThai(phieuNhap.trangThaiPhieuNhap)
    : null;

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal-card product-detail-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2>
              {phieuNhap
                ? `Chi tiết phiếu nhập #${phieuNhap.maPhieuNhap}`
                : "Chi tiết phiếu nhập"}
            </h2>

            <p>
              Thông tin nhà cung cấp, nhân viên lập và các lô sản phẩm trong
              phiếu.
            </p>
          </div>

          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            disabled={loading || dangXuLy}
            aria-label="Đóng"
          >
            ×
          </button>
        </div>

        {loading ? (
          <AdminLoading noiDung="Đang tải chi tiết phiếu nhập..." />
        ) : loi ? (
          <div className="ql-error-message">
            <i className="bi bi-exclamation-circle-fill" />
            <span>{loi}</span>
          </div>
        ) : phieuNhap ? (
          <>
            <section className="detail-section">
              <h3>Thông tin chung</h3>

              <div className="detail-grid">
                <div>
                  <span>Mã phiếu</span>
                  <strong>#{phieuNhap.maPhieuNhap}</strong>
                </div>

                <div>
                  <span>Ngày nhập</span>
                  <strong>{dinhDangNgayGio(phieuNhap.ngayNhap)}</strong>
                </div>

                <div>
                  <span>Trạng thái</span>
                  {thongTinTrangThai && (
                    <span className={thongTinTrangThai.className}>
                      {thongTinTrangThai.nhan}
                    </span>
                  )}
                </div>

                <div>
                  <span>Nhà cung cấp</span>
                  <strong>{phieuNhap.tenNhaCungCap}</strong>
                </div>

                <div>
                  <span>Nhân viên lập</span>
                  <strong>{phieuNhap.tenNhanVienLap}</strong>
                </div>

                <div>
                  <span>Tổng tiền</span>
                  <strong>{dinhDangTien(phieuNhap.tongTien)}</strong>
                </div>
              </div>

              <div className="detail-description">
                <span>Ghi chú</span>
                <p>{phieuNhap.ghiChu || "Không có ghi chú"}</p>
              </div>
            </section>

            <section className="detail-section">
              <h3>Sản phẩm nhập kho</h3>

              <div className="ql-table-wrapper">
                <table className="ql-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Đơn vị nhập</th>
                      <th>Số lượng</th>
                      <th>Quy đổi</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                      <th>Hạn sử dụng</th>
                      <th>Tồn còn lại</th>
                    </tr>
                  </thead>

                  <tbody>
                    {phieuNhap.danhSachChiTiet.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="ql-table-message">
                          Phiếu nhập chưa có sản phẩm
                        </td>
                      </tr>
                    ) : (
                      phieuNhap.danhSachChiTiet.map((chiTiet) => (
                        <tr key={chiTiet.maChiTietPhieuNhap}>
                          <td>
                            <strong>{chiTiet.tenSanPham}</strong>
                          </td>

                          <td>{chiTiet.tenDonViTinh}</td>

                          <td>{chiTiet.soLuongNhap}</td>

                          <td>{chiTiet.soLuongTheoQuyDoi}</td>

                          <td>{dinhDangTien(chiTiet.donGiaNhap)}</td>

                          <td>
                            <strong>{dinhDangTien(chiTiet.thanhTien)}</strong>
                          </td>

                          <td>{dinhDangNgay(chiTiet.hanSuDung)}</td>

                          <td>{chiTiet.soLuongConLaiTheoQuyDoi}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="form-actions">
              {phieuNhap.trangThaiPhieuNhap === "CHO_XAC_NHAN" && (
                <>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => onXacNhan(phieuNhap.maPhieuNhap)}
                    disabled={dangXuLy}
                  >
                    {dangXuLy ? "Đang xử lý..." : "Xác nhận nhập kho"}
                  </button>

                  <button
                    type="button"
                    className="danger-button small-button"
                    onClick={() => onHuy(phieuNhap.maPhieuNhap)}
                    disabled={dangXuLy}
                  >
                    Hủy phiếu
                  </button>
                </>
              )}

              <button
                type="button"
                className="secondary-button"
                onClick={onClose}
                disabled={dangXuLy}
              >
                Đóng
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default PhieuNhapChiTietModal;
