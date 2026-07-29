import type { DonViTinh } from "../types/DonViTinh";

type DonViTinhTableProps = {
  danhSachDonViTinh: DonViTinh[];
  loading: boolean;
  loi: string | null;
  maDonViTinhDangXuLy: number | null;
  onSua: (donViTinh: DonViTinh) => void;
  onDoiTrangThai: (donViTinh: DonViTinh) => void;
};

function DonViTinhTable({
  danhSachDonViTinh,
  loading,
  loi,
  maDonViTinhDangXuLy,
  onSua,
  onDoiTrangThai,
}: DonViTinhTableProps) {
  return (
    <div className="table-card">
      {loading ? (
        <p style={{ padding: "16px" }}>Đang tải danh sách đơn vị tính...</p>
      ) : loi ? (
        <p style={{ padding: "16px" }}>{loi}</p>
      ) : (
        <>
          <table className="data-table">
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
              {danhSachDonViTinh.map((donViTinh) => {
                const dangXuLy =
                  maDonViTinhDangXuLy === donViTinh.maDonViTinh;

                return (
                  <tr key={donViTinh.maDonViTinh}>
                    <td>{donViTinh.maDonViTinh}</td>

                    <td>
                      <strong>{donViTinh.tenDonViTinh}</strong>
                    </td>

                    <td>{donViTinh.kyHieu || "Chưa cập nhật"}</td>

                    <td>
                      <div className="muted-text">
                        {donViTinh.moTa || "Chưa có mô tả"}
                      </div>
                    </td>

                    <td>
                      <span
                        className={
                          donViTinh.trangThai
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {donViTinh.trangThai ? "Hiện" : "Ẩn"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="small-button"
                          onClick={() => onSua(donViTinh)}
                          disabled={dangXuLy}
                        >
                          Sửa
                        </button>

                        <button
                          type="button"
                          className="small-button"
                          onClick={() => onDoiTrangThai(donViTinh)}
                          disabled={dangXuLy}
                        >
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
              })}

              {danhSachDonViTinh.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-cell">
                    Chưa có đơn vị tính.
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
              Tổng cộng <strong>{danhSachDonViTinh.length}</strong> đơn vị tính
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DonViTinhTable;