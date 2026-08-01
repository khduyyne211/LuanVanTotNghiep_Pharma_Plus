import { TEN_TRANG_THAI_DON_HANG } from "../constants/TrangThaiDonHang";
import type { DonHangDanhSach } from "../types/DonHang";
import "../styles/TrangThaiDonHang.css";

interface TheDonHangProps {
  donHang: DonHangDanhSach;
  onXemChiTiet: (maDonHang: number) => void;
}

const dinhDangTien = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

const dinhDangNgay = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export default function TheDonHang({
  donHang,
  onXemChiTiet,
}: TheDonHangProps) {
  const sanPham = donHang.sanPhamDauTien;
  const maDonHangHienThi = `#${String(donHang.maDonHang).padStart(6, "0")}`;
  const ngayDatHangHienThi = dinhDangNgay.format(
    new Date(donHang.ngayDatHang),
  );

  const classTrangThai = donHang.trangThaiDonHang
    .toLowerCase()
    .replaceAll("_", "-");

  return (
    <article className="don-hang-the">
      <div className="don-hang-the-dau">
        <div className="don-hang-the-dau-ben-trai">
          <strong>Đơn hàng {ngayDatHangHienThi}</strong>

          <span className="don-hang-dau-ngan-cach">•</span>

          <span className="don-hang-ma">
            {maDonHangHienThi}
          </span>
        </div>

        <span
          className={
            `trang-thai-don-hang ` +
            `trang-thai-don-hang--${classTrangThai}`
          }
        >
          <span className="trang-thai-don-hang-cham" />
          {TEN_TRANG_THAI_DON_HANG[donHang.trangThaiDonHang]}
        </span>
      </div>

      <div className="don-hang-san-pham">
        <div className="don-hang-san-pham-ben-trai">
          <div className="don-hang-san-pham-anh">
            {sanPham.hinhAnh ? (
              <img
                src={sanPham.hinhAnh}
                alt={sanPham.tenSanPham}
              />
            ) : (
              <span>Không có ảnh</span>
            )}
          </div>

          <div className="don-hang-san-pham-thong-tin">
            <p className="don-hang-san-pham-ten">
              {sanPham.tenSanPham}
            </p>

            {donHang.soSanPhamKhac > 0 && (
              <p className="don-hang-san-pham-khac">
                +{donHang.soSanPhamKhac} sản phẩm khác
              </p>
            )}
          </div>
        </div>

        <div className="don-hang-san-pham-ben-phai">
          <strong className="don-hang-san-pham-gia">
            {dinhDangTien.format(sanPham.thanhTien)}
          </strong>

          <span className="don-hang-san-pham-so-luong">
            x{sanPham.soLuong} {sanPham.tenDonViTinh}
          </span>
        </div>
      </div>

      <div className="don-hang-the-cuoi">
        <button
          type="button"
          className="don-hang-xem-chi-tiet"
          onClick={() => onXemChiTiet(donHang.maDonHang)}
        >
          Xem chi tiết
          <i className="bi bi-chevron-right"></i>
        </button>

        <div className="don-hang-tong-tien">
          <span>Thành tiền:</span>

          <strong>
            {dinhDangTien.format(donHang.tongThanhToan)}
          </strong>
        </div>
      </div>
    </article>
  );
}