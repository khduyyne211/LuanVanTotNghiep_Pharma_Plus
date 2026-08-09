import type { DanhMucSanPham } from "../types/DanhMucSanPham";

type DanhMucSanPhamTableProps = {
  danhSachDanhMuc: DanhMucSanPham[];
  loading: boolean;
  maDanhMucDangXuLy: number | null;
  onSua: (danhMuc: DanhMucSanPham) => void;
  onDoiTrangThai: (danhMuc: DanhMucSanPham) => void;
};

function DanhMucSanPhamTable({
  danhSachDanhMuc,
  loading,
  maDanhMucDangXuLy,
  onSua,
  onDoiTrangThai,
}: DanhMucSanPhamTableProps) {
  return (
    <div className="ql-table-wrapper">
      <table className="ql-table">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên danh mục</th>
            <th>Danh mục cha</th>
            <th>Mô tả</th>
            <th>Thứ tự</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="ql-table-message">
                Đang tải danh sách danh mục sản phẩm...
              </td>
            </tr>
          ) : danhSachDanhMuc.length === 0 ? (
            <tr>
              <td colSpan={7} className="ql-table-message">
                Chưa có danh mục sản phẩm
              </td>
            </tr>
          ) : (
            danhSachDanhMuc.map((danhMuc) => {
              const dangXuLy =
                maDanhMucDangXuLy === danhMuc.maDanhMuc;

              return (
                <tr key={danhMuc.maDanhMuc}>
                  <td>
                    <strong>#{danhMuc.maDanhMuc}</strong>
                  </td>

                  <td>
                    <strong>{danhMuc.tenDanhMuc}</strong>
                  </td>

                  <td>
                    {danhMuc.tenDanhMucCha
                      ?? "Danh mục cấp cao nhất"}
                  </td>

                  <td>
                    <span className="ql-muted-text">
                      {danhMuc.moTa || "Chưa có mô tả"}
                    </span>
                  </td>

                  <td>{danhMuc.thuTuHienThi ?? "—"}</td>

                  <td>
                    <span
                      className={
                        danhMuc.trangThaiHienThi
                          ? "ql-status ql-status-active"
                          : "ql-status ql-status-inactive"
                      }
                    >
                      {danhMuc.trangThaiHienThi ? "Hiện" : "Ẩn"}
                    </span>
                  </td>

                  <td>
                    <div className="ql-action-group">
                      <button
                        type="button"
                        className="ql-action-button"
                        onClick={() => onSua(danhMuc)}
                        disabled={dangXuLy}
                      >
                        <i className="bi bi-pencil-square" />
                        Sửa
                      </button>

                      <button
                        type="button"
                        className="ql-action-button"
                        onClick={() => onDoiTrangThai(danhMuc)}
                        disabled={dangXuLy}
                      >
                        <i
                          className={
                            danhMuc.trangThaiHienThi
                              ? "bi bi-eye-slash"
                              : "bi bi-eye"
                          }
                        />
                        {dangXuLy
                          ? "Đang xử lý..."
                          : danhMuc.trangThaiHienThi
                            ? "Ẩn"
                            : "Hiện"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DanhMucSanPhamTable;
