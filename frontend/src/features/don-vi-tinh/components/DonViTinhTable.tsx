import type { DonViTinh } from "../types/DonViTinh";

type DonViTinhTableProps = {
  danhSachDonViTinh: DonViTinh[];
  loading: boolean;
  maDonViTinhDangXuLy: number | null;
  onSua: (donViTinh: DonViTinh) => void;
  onDoiTrangThai: (donViTinh: DonViTinh) => void;
};

function DonViTinhTable({
  danhSachDonViTinh,
  loading,
  maDonViTinhDangXuLy,
  onSua,
  onDoiTrangThai,
}: DonViTinhTableProps) {
  return (
    <div className="ql-table-wrapper">
      <table className="ql-table">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên đơn vị tính</th>
            <th>Ký hiệu</th>
            <th>Mô tả</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="ql-table-message">
                Đang tải danh sách đơn vị tính...
              </td>
            </tr>
          ) : danhSachDonViTinh.length === 0 ? (
            <tr>
              <td colSpan={6} className="ql-table-message">
                Chưa có đơn vị tính
              </td>
            </tr>
          ) : (
            danhSachDonViTinh.map((donViTinh) => {
              const dangXuLy =
                maDonViTinhDangXuLy === donViTinh.maDonViTinh;

              return (
                <tr key={donViTinh.maDonViTinh}>
                  <td>
                    <strong>#{donViTinh.maDonViTinh}</strong>
                  </td>

                  <td>
                    <strong>{donViTinh.tenDonViTinh}</strong>
                  </td>

                  <td>{donViTinh.kyHieu || "Chưa cập nhật"}</td>

                  <td>
                    <span className="ql-muted-text">
                      {donViTinh.moTa || "Chưa có mô tả"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        donViTinh.trangThai
                          ? "ql-status ql-status-active"
                          : "ql-status ql-status-inactive"
                      }
                    >
                      {donViTinh.trangThai ? "Hiện" : "Ẩn"}
                    </span>
                  </td>

                  <td>
                    <div className="ql-action-group">
                      <button
                        type="button"
                        className="ql-action-button"
                        onClick={() => onSua(donViTinh)}
                        disabled={dangXuLy}
                      >
                        <i className="bi bi-pencil-square" />
                        Sửa
                      </button>

                      <button
                        type="button"
                        className="ql-action-button"
                        onClick={() => onDoiTrangThai(donViTinh)}
                        disabled={dangXuLy}
                      >
                        <i
                          className={
                            donViTinh.trangThai
                              ? "bi bi-eye-slash"
                              : "bi bi-eye"
                          }
                        />
                        {dangXuLy
                          ? "Đang xử lý..."
                          : donViTinh.trangThai
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

export default DonViTinhTable;
