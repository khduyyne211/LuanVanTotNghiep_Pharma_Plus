import { useParams } from "react-router-dom";
import { useChiTietSanPham } from "../../features/customer/san-pham/hooks/useChiTietSanPham";
import ThongTinTongQuanSanPham from "../../features/customer/san-pham/components/ThongTinTongQuanSanPham";
import ThongTinChiTietSanPham from "../../features/customer/san-pham/components/ThongTinChiTietSanPham";
import DuongDanDanhMuc from "../../features/customer/danh-muc/components/DuongDanDanhMuc";
import "../../features/customer/san-pham/styles/ChiTietSanPham.css";

function ChiTietSanPhamPage() {
  const { maSanPham } = useParams();

  const maSanPhamDangXem = maSanPham ? Number(maSanPham) : undefined;

  const { sanPhamChiTiet, dangTaiDuLieu } =
    useChiTietSanPham(maSanPhamDangXem);

  if (dangTaiDuLieu) {
    return (
      <div className="page-container">
        <p>Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (!sanPhamChiTiet) {
    return (
      <div className="page-container">
        <p>Không tìm thấy sản phẩm.</p>
      </div>
    );
  }

  return (
    <div className="page-container trang-chi-tiet-san-pham">
      <DuongDanDanhMuc maDanhMuc = {sanPhamChiTiet.maDanhMuc} tenMucHienTai = {sanPhamChiTiet.tenSanPham}/>

      <ThongTinTongQuanSanPham sanPhamChiTiet={sanPhamChiTiet} />

      <ThongTinChiTietSanPham sanPhamChiTiet={sanPhamChiTiet} />
    </div>
  );
}

export default ChiTietSanPhamPage;