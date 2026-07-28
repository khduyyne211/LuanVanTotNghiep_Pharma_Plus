import type { DanhMucSanPham } from "../types/DanhMucSanPham";

type DanhMucSanPhamTableProps = {
  danhSachDanhMuc: DanhMucSanPham[];
  loading: boolean;
  loi: string | null;
  onSua: (danhMuc: DanhMucSanPham) => void;
};

function DanhMucSanPhamTable({
  danhSachDanhMuc,
  loading,
  loi,
  onSua,
}: DanhMucSanPhamTableProps) {
  return (
    <div className="table-card">
      {loading ? (
        <p style={{ padding: "16px" }}>
          Đang tải danh sách danh mục sản phẩm...
        </p>
      ) : loi ? (
        <p style={{ padding: "16px" }}>{loi}</p>
      ) : (
        <>
          <table className="data-table">
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
              {danhSachDanhMuc.map((danhMuc) => (
                <tr key={danhMuc.maDanhMuc}>
                  <td>{danhMuc.maDanhMuc}</td>

                  <td>
                    <strong>{danhMuc.tenDanhMuc}</strong>
                  </td>

                  <td>
                    {danhMuc.tenDanhMucCha ??
                      "Danh mục cấp cao nhất"}
                  </td>

                  <td>
                    <div className="muted-text">
                      {danhMuc.moTa || "Chưa có mô tả"}
                    </div>
                  </td>

                  <td>
                    {danhMuc.thuTuHienThi ?? "—"}
                  </td>

                  <td>
                    <span
                      className={
                        danhMuc.trangThaiHienThi
                          ? "status-active"
                          : "status-inactive"
                      }
                    >
                      {danhMuc.trangThaiHienThi
                        ? "Hiện"
                        : "Ẩn"}
                    </span>
                  </td>

                  <td>
                    <div className="action-buttons">
                      <button
                        type="button"
                        className="small-button"
                        onClick={() => onSua(danhMuc)}
                      >
                        Sửa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {danhSachDanhMuc.length === 0 && (
                <tr>
                  <td colSpan={7} className="empty-cell">
                    Chưa có danh mục sản phẩm.
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
              Tổng cộng{" "}
              <strong>{danhSachDanhMuc.length}</strong>{" "}
              danh mục
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DanhMucSanPhamTable;