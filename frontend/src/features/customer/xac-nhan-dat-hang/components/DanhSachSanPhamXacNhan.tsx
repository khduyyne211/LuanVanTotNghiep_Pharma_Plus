import type { ChiTietGioHangHienThi } from "../../../gio-hang/types/GioHangHienThi";

interface DanhSachSanPhamXacNhanProps {
  danhSachChiTietGioHang: ChiTietGioHangHienThi[];
}

function dinhDangTien(soTien: number) {
  return soTien.toLocaleString("vi-VN") + "đ";
}

function DanhSachSanPhamXacNhan({
  danhSachChiTietGioHang,
}: DanhSachSanPhamXacNhanProps) {
  return (
    <section className="xac-nhan-danh-sach">
      <h2>Danh sách sản phẩm</h2>

      <div className="xac-nhan-danh-sach-san-pham">
        {danhSachChiTietGioHang.map((chiTiet) => (
          <article
            key={chiTiet.maDonViSanPham}
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

              <strong>
                {chiTiet.tenSanPham}
              </strong>
            </div>

            <div className="xac-nhan-san-pham-cum-gia">
              {chiTiet.coKhuyenMai &&
                chiTiet.thanhTienGoc >
                  chiTiet.thanhTien && (
                  <span className="xac-nhan-san-pham-gia-goc">
                    {dinhDangTien(
                      chiTiet.thanhTienGoc
                    )}
                  </span>
                )}

              <strong className="xac-nhan-san-pham-gia">
                {dinhDangTien(
                  chiTiet.thanhTien
                )}
              </strong>
            </div>

            <span className="xac-nhan-san-pham-so-luong">
              x{chiTiet.soLuong}{" "}
              {chiTiet.tenDonViTinh}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DanhSachSanPhamXacNhan;