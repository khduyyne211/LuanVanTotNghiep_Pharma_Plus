import type { SanPhamChiTiet } from "../types/SanPhamChiTiet";

interface ThongTinChiTietSanPhamProps {
  sanPhamChiTiet: SanPhamChiTiet;
}

function ThongTinChiTietSanPham({
  sanPhamChiTiet,
}: ThongTinChiTietSanPhamProps) {
  const duLieuChuyenMonThuoc = sanPhamChiTiet.duLieuChuyenMonThuoc;

  return (
    <section className="chi-tiet-san-pham-noi-dung">
      <h2>Thông tin chi tiết sản phẩm</h2>

      <div className="nhom-thong-tin-san-pham">
        <div className="dong-thong-tin">
          <div className="dong-thong-tin-ten">Mô tả sản phẩm</div>
          <div className="dong-thong-tin-noi-dung">
            {sanPhamChiTiet.moTa || sanPhamChiTiet.moTaNgan || "Đang cập nhật"}
          </div>
        </div>

        <div className="dong-thong-tin">
          <div className="dong-thong-tin-ten">Dạng bào chế</div>
          <div className="dong-thong-tin-noi-dung">
            {duLieuChuyenMonThuoc?.dangBaoChe || "Đang cập nhật"}
          </div>
        </div>

        <div className="dong-thong-tin">
          <div className="dong-thong-tin-ten">Phân loại thuốc</div>
          <div className="dong-thong-tin-noi-dung">
            {duLieuChuyenMonThuoc?.phanLoaiThuoc || "Đang cập nhật"}
          </div>
        </div>

        <div className="dong-thong-tin">
          <div className="dong-thong-tin-ten">Công dụng tham khảo</div>
          <div className="dong-thong-tin-noi-dung">
            {duLieuChuyenMonThuoc?.congDungThamKhao || "Đang cập nhật"}
          </div>
        </div>

        <div className="dong-thong-tin">
          <div className="dong-thong-tin-ten">Cách dùng tham khảo</div>
          <div className="dong-thong-tin-noi-dung">
            {duLieuChuyenMonThuoc?.cachDungThamKhao || "Đang cập nhật"}
          </div>
        </div>

        <div className="dong-thong-tin">
          <div className="dong-thong-tin-ten">Cảnh báo an toàn</div>
          <div className="dong-thong-tin-noi-dung">
            {duLieuChuyenMonThuoc?.canhBaoAnToan || "Đang cập nhật"}
          </div>
        </div>

        <div className="dong-thong-tin">
          <div className="dong-thong-tin-ten">Trạng thái xác nhận</div>
          <div className="dong-thong-tin-noi-dung">
            {duLieuChuyenMonThuoc?.trangThaiXacNhan
              ? "Đã xác nhận"
              : "Chưa xác nhận"}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ThongTinChiTietSanPham;