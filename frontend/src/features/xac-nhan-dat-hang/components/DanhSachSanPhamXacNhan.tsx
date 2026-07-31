import type { ChiTietGioHang } from "../../gio-hang/types/ChiTietGioHang";

interface DanhSachSanPhamXacNhanProps {
  danhSachChiTietGioHang: ChiTietGioHang[];
}

function dinhDangTien(soTien: number) {
  return soTien.toLocaleString("vi-VN") + "đ";
}

function DanhSachSanPhamXacNhan({
  danhSachChiTietGioHang,
}: DanhSachSanPhamXacNhanProps) {
  return (
    <section className="xac-nhan-khu-vuc-san-pham">
      <h2 className="xac-nhan-tieu-de-khu-vuc">
        Danh sách sản phẩm
      </h2>

      <div className="xac-nhan-danh-sach-san-pham">
        {danhSachChiTietGioHang.map((chiTiet) => (
          <article
            key={chiTiet.maChiTietGioHang}
            className="xac-nhan-san-pham-dong"
          >
            <div className="xac-nhan-san-pham-thong-tin">
              <div className="xac-nhan-san-pham-hinh-anh">
                {chiTiet.hinhAnh ? (
                  <img
                    src={chiTiet.hinhAnh}
                    alt={chiTiet.tenSanPham}
                  />
                ) : (
                  <div className="xac-nhan-san-pham-khong-anh">
                    Chưa có ảnh
                  </div>
                )}
              </div>

              <strong>{chiTiet.tenSanPham}</strong>
            </div>

            <strong className="xac-nhan-san-pham-gia">
              {dinhDangTien(chiTiet.thanhTien)}
            </strong>

            <span className="xac-nhan-san-pham-so-luong">
              x{chiTiet.soLuong}{" "}
              {chiTiet.tenDonViTinh ||
                chiTiet.kyHieuDonViTinh ||
                ""}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DanhSachSanPhamXacNhan;