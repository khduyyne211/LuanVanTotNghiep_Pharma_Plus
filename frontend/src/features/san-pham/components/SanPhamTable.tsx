import type { SanPham } from "../types/SanPham";

type SanPhamTableProps = {
  danhSachSanPham: SanPham[];
  loading: boolean;

  page: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;

  onSua: (sanPham: SanPham) => void;
  onXemChiTiet: (maSanPham: number) => void;
  onAn: (maSanPham: number) => void;
  onHien: (maSanPham: number) => void;
  onPageChange: (pageMoi: number) => void;
};

function SanPhamTable({
  danhSachSanPham,
  loading,
  page,
  totalElements,
  totalPages,
  first,
  last,
  onSua,
  onXemChiTiet,
  onAn,
  onHien,
  onPageChange,
}: SanPhamTableProps) {
  const dinhDangNgay = (ngay: string) => {
    return new Date(ngay).toLocaleDateString("vi-VN");
  };

  return (
    <div className="table-card">
      {loading ? (
        <p style={{ padding: "16px" }}>
          Đang tải danh sách sản phẩm...
        </p>
      ) : (
        <>
          <table className="data-table">
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
              {danhSachSanPham.map((sanPham) => (
                <tr key={sanPham.maSanPham}>
                  <td>{sanPham.maSanPham}</td>

                  <td>
                    <strong>{sanPham.tenSanPham}</strong>

                    <div className="muted-text">
                      {sanPham.moTaNgan}
                    </div>
                  </td>

                  <td>{sanPham.tenDanhMuc}</td>

                  <td>
                    {sanPham.tenNhaSanXuat || "Chưa cập nhật"}
                  </td>

                  <td>
                    {sanPham.laThuocKeDon ? "Có" : "Không"}
                  </td>

                  <td>
                    <span
                      className={
                        sanPham.trangThaiSanPham
                          ? "status-active"
                          : "status-inactive"
                      }
                    >
                      {sanPham.trangThaiSanPham
                        ? "Hiện"
                        : "Ẩn"}
                    </span>
                  </td>

                  <td>{dinhDangNgay(sanPham.ngayTao)}</td>

                  <td>
                    <div className="action-buttons">
                      <button
                        className="small-button"
                        onClick={() => onSua(sanPham)}
                      >
                        Sửa
                      </button>

                      <button
                        className="small-button"
                        onClick={() =>
                          onXemChiTiet(sanPham.maSanPham)
                        }
                      >
                        <i className="bi bi-eye" />
                      </button>

                      {sanPham.trangThaiSanPham ? (
                        <button
                          className="small-button warning-button"
                          onClick={() =>
                            onAn(sanPham.maSanPham)
                          }
                        >
                          Ẩn
                        </button>
                      ) : (
                        <button
                          className="small-button success-button"
                          onClick={() =>
                            onHien(sanPham.maSanPham)
                          }
                        >
                          Hiện
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {danhSachSanPham.length === 0 && (
                <tr>
                  <td colSpan={8} className="empty-cell">
                    Không tìm thấy sản phẩm phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div
            className="pagination-row"
            style={{ padding: "0 16px 16px" }}
          >
            <div>
              Tổng cộng <strong>{totalElements}</strong> sản phẩm
            </div>

            <div className="pagination-actions">
              <button
                className="small-button"
                disabled={first}
                onClick={() => onPageChange(page - 1)}
              >
                Trang trước
              </button>

              <span>
                Trang{" "}
                <strong>
                  {totalPages === 0 ? 0 : page + 1}
                </strong>{" "}
                / <strong>{totalPages}</strong>
              </span>

              <button
                className="small-button"
                disabled={last}
                onClick={() => onPageChange(page + 1)}
              >
                Trang sau
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SanPhamTable;