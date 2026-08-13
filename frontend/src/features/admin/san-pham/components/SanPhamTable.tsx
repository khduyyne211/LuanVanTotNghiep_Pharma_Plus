import AdminLoading from "../../shared/components/loading/AdminLoading";
import type { SanPham } from "../types/SanPham";

type SanPhamTableProps = {
  danhSachSanPham: SanPham[];
  loading: boolean;
  onSua: (sanPham: SanPham) => void;
  onXemChiTiet: (maSanPham: number) => void;
  onAn: (maSanPham: number) => void;
  onHien: (maSanPham: number) => void;
};

function SanPhamTable({
  danhSachSanPham,
  loading,
  onSua,
  onXemChiTiet,
  onAn,
  onHien,
}: SanPhamTableProps) {
  const dinhDangNgay = (ngay: string) => {
    return new Date(ngay).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return <AdminLoading noiDung="Đang tải danh sách sản phẩm..." />;
  }

  return (
    <div className="ql-table-wrapper">
      <table className="ql-table">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên sản phẩm</th>
            <th>Danh mục</th>
            <th>Nhà sản xuất</th>
            <th>Kê đơn</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {danhSachSanPham.length === 0 ? (
            <tr>
              <td colSpan={8} className="ql-table-message">
                Không tìm thấy sản phẩm phù hợp
              </td>
            </tr>
          ) : (
            danhSachSanPham.map((sanPham) => (
              <tr key={sanPham.maSanPham}>
                <td>
                  <strong>#{sanPham.maSanPham}</strong>
                </td>

                <td>
                  <strong>{sanPham.tenSanPham}</strong>

                  {sanPham.moTaNgan && (
                    <div className="ql-muted-text">{sanPham.moTaNgan}</div>
                  )}
                </td>

                <td>{sanPham.tenDanhMuc}</td>

                <td>{sanPham.tenNhaSanXuat || "Chưa cập nhật"}</td>

                <td>{sanPham.laThuocKeDon ? "Có" : "Không"}</td>

                <td>
                  <span
                    className={
                      sanPham.trangThaiSanPham
                        ? "ql-status ql-status-active"
                        : "ql-status ql-status-inactive"
                    }
                  >
                    {sanPham.trangThaiSanPham ? "Đang hiển thị" : "Đã ẩn"}
                  </span>
                </td>

                <td>{dinhDangNgay(sanPham.ngayTao)}</td>

                <td>
                  <div className="ql-action-group">
                    <button
                      type="button"
                      className="ql-action-button"
                      onClick={() => onSua(sanPham)}
                    >
                      <i className="bi bi-pencil-square" />
                      Sửa
                    </button>

                    <button
                      type="button"
                      className="ql-action-button"
                      onClick={() => onXemChiTiet(sanPham.maSanPham)}
                      aria-label="Xem chi tiết sản phẩm"
                      title="Xem chi tiết"
                    >
                      <i className="bi bi-eye" />
                    </button>

                    <button
                      type="button"
                      className="ql-action-button"
                      onClick={() =>
                        sanPham.trangThaiSanPham
                          ? onAn(sanPham.maSanPham)
                          : onHien(sanPham.maSanPham)
                      }
                    >
                      <i
                        className={
                          sanPham.trangThaiSanPham
                            ? "bi bi-eye-slash"
                            : "bi bi-eye"
                        }
                      />

                      {sanPham.trangThaiSanPham ? "Ẩn" : "Hiện"}
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SanPhamTable;
