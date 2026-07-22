import type { DonHangChiTiet } from "../types/DonHang";

type Props = {
  donHang: DonHangChiTiet | null;
  dangTai: boolean;
  onDong: () => void;
};

const dinhDangTien = (giaTri: number | null | undefined) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(giaTri ?? 0);

const dinhDangNgay = (giaTri: string | null | undefined) => {
  if (!giaTri) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(giaTri));
};

const hienThiTrangThai = (giaTri: string | null | undefined) =>
  (giaTri || "CHUA_CO").replaceAll("_", " ");

export default function DonHangChiTietModal({
  donHang,
  dangTai,
  onDong,
}: Props) {
  if (!donHang && !dangTai) return null;

  return (
    <div className="dh-modal-overlay" onMouseDown={onDong}>
      <div className="dh-modal dh-modal-large" onMouseDown={(e) => e.stopPropagation()}>
        <div className="dh-modal-header">
          <div>
            <p className="dh-eyebrow">Chi tiết đơn hàng</p>
            <h2>{donHang ? `Đơn #${donHang.maDonHang}` : "Đang tải..."}</h2>
          </div>
          <button className="dh-icon-button" onClick={onDong} aria-label="Đóng">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {dangTai || !donHang ? (
          <div className="dh-loading-block">Đang tải chi tiết đơn hàng...</div>
        ) : (
          <div className="dh-modal-body">
            <div className="dh-detail-grid">
              <section className="dh-detail-card">
                <h3>Thông tin chung</h3>
                <div className="dh-info-row">
                  <span>Ngày tạo</span>
                  <strong>{dinhDangNgay(donHang.ngayDatHang)}</strong>
                </div>
                <div className="dh-info-row">
                  <span>Loại khách</span>
                  <strong>{hienThiTrangThai(donHang.loaiKhach)}</strong>
                </div>
                <div className="dh-info-row">
                  <span>Dược sĩ xử lý</span>
                  <strong>{donHang.tenNhanVienXuLy || "Chưa phân công"}</strong>
                </div>
                <div className="dh-info-row">
                  <span>Phương thức thanh toán</span>
                  <strong>{hienThiTrangThai(donHang.phuongThucThanhToan)}</strong>
                </div>
              </section>

              <section className="dh-detail-card">
                <h3>Khách hàng</h3>
                <div className="dh-info-row">
                  <span>Họ tên</span>
                  <strong>{donHang.tenKhachHang || "Khách vãng lai"}</strong>
                </div>
                <div className="dh-info-row">
                  <span>Số điện thoại</span>
                  <strong>{donHang.soDienThoaiKhachHang || "—"}</strong>
                </div>
                <div className="dh-info-row">
                  <span>Email</span>
                  <strong>{donHang.emailKhachHang || "—"}</strong>
                </div>
                <div className="dh-info-row">
                  <span>Địa chỉ</span>
                  <strong>
                    {[donHang.diaChiChiTiet, donHang.phuongXa, donHang.quanHuyen, donHang.tinhThanh]
                      .filter(Boolean)
                      .join(", ") || "Mua trực tiếp tại quầy"}
                  </strong>
                </div>
              </section>

              <section className="dh-detail-card">
                <h3>Trạng thái</h3>
                <div className="dh-info-row">
                  <span>Đơn hàng</span>
                  <span className={`dh-badge dh-badge-${donHang.trangThaiDonHang.toLowerCase()}`}>
                    {hienThiTrangThai(donHang.trangThaiDonHang)}
                  </span>
                </div>
                <div className="dh-info-row">
                  <span>Thanh toán</span>
                  <span className={`dh-badge dh-badge-${(donHang.trangThaiThanhToan || "").toLowerCase()}`}>
                    {hienThiTrangThai(donHang.trangThaiThanhToan)}
                  </span>
                </div>
                <div className="dh-info-row">
                  <span>Kiểm duyệt</span>
                  <span className={`dh-badge dh-badge-${donHang.trangThaiKiemDuyet.toLowerCase()}`}>
                    {hienThiTrangThai(donHang.trangThaiKiemDuyet)}
                  </span>
                </div>
                <div className="dh-info-row">
                  <span>Thuốc kê đơn</span>
                  <strong>{donHang.coThuocKeDon ? "Có" : "Không"}</strong>
                </div>
              </section>

              <section className="dh-detail-card">
                <h3>Thanh toán</h3>
                <div className="dh-info-row">
                  <span>Tiền hàng</span>
                  <strong>{dinhDangTien(donHang.tongTienHang)}</strong>
                </div>
                <div className="dh-info-row">
                  <span>Phí giao hàng</span>
                  <strong>{dinhDangTien(donHang.phiGiaoHang)}</strong>
                </div>
                <div className="dh-info-row">
                  <span>Giảm giá</span>
                  <strong>{dinhDangTien(donHang.giamGia)}</strong>
                </div>
                <div className="dh-info-row dh-info-total">
                  <span>Tổng thanh toán</span>
                  <strong>{dinhDangTien(donHang.tongThanhToan)}</strong>
                </div>
              </section>
            </div>

            <section className="dh-detail-card dh-products-card">
              <h3>Sản phẩm trong đơn</h3>
              <div className="dh-detail-products">
                {donHang.danhSachChiTiet.map((chiTiet) => (
                  <div className="dh-detail-product" key={chiTiet.maChiTietDonHang}>
                    <img
                      src={(chiTiet.hinhAnh || "").trim() || "https://placehold.co/72x72?text=SP"}
                      alt={chiTiet.tenSanPham}
                    />
                    <div className="dh-detail-product-main">
                      <div className="dh-product-title-row">
                        <strong>{chiTiet.tenSanPham}</strong>
                        {chiTiet.laThuocKeDon && (
                          <span className="dh-prescription-tag">Thuốc kê đơn</span>
                        )}
                      </div>
                      <span>
                        {chiTiet.tenDonViTinh} × {chiTiet.soLuong}
                      </span>
                    </div>
                    <div className="dh-detail-product-price">
                      <span>{dinhDangTien(chiTiet.donGia)}</span>
                      <strong>{dinhDangTien(chiTiet.thanhTien)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {(donHang.ghiChu || donHang.ghiChuKiemDuyet) && (
              <section className="dh-detail-card dh-note-card">
                <h3>Ghi chú</h3>
                {donHang.ghiChu && <p><strong>Đơn hàng:</strong> {donHang.ghiChu}</p>}
                {donHang.ghiChuKiemDuyet && (
                  <p><strong>Kiểm duyệt:</strong> {donHang.ghiChuKiemDuyet}</p>
                )}
              </section>
            )}
          </div>
        )}

        <div className="dh-modal-footer">
          <button className="dh-button dh-button-secondary" onClick={onDong}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
