import type { NhaCungCap } from "../types/NhaCungCap";

type NhaCungCapTableProps = {
  danhSachNhaCungCap: NhaCungCap[];
  loading: boolean;
  maNhaCungCapDangXuLy: number | null;
  onSua: (nhaCungCap: NhaCungCap) => void;
  onDoiTrangThai: (nhaCungCap: NhaCungCap) => void;
};

function NhaCungCapTable({
  danhSachNhaCungCap,
  loading,
  maNhaCungCapDangXuLy,
  onSua,
  onDoiTrangThai,
}: NhaCungCapTableProps) {
  return (
    <div className="ql-table-wrapper">
      <table className="ql-table">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên nhà cung cấp</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="ql-table-message">
                Đang tải danh sách nhà cung cấp...
              </td>
            </tr>
          ) : danhSachNhaCungCap.length === 0 ? (
            <tr>
              <td colSpan={7} className="ql-table-message">
                Chưa có nhà cung cấp
              </td>
            </tr>
          ) : (
            danhSachNhaCungCap.map((nhaCungCap) => {
              const dangXuLy =
                maNhaCungCapDangXuLy === nhaCungCap.maNhaCungCap;

              return (
                <tr key={nhaCungCap.maNhaCungCap}>
                  <td>
                    <strong>#{nhaCungCap.maNhaCungCap}</strong>
                  </td>

                  <td>
                    <strong>{nhaCungCap.tenNhaCungCap}</strong>
                  </td>

                  <td>
                    {nhaCungCap.soDienThoai || "Chưa cập nhật"}
                  </td>

                  <td>
                    <span className="ql-muted-text">
                      {nhaCungCap.diaChi || "Chưa cập nhật"}
                    </span>
                  </td>

                  <td>
                    <span className="ql-muted-text">
                      {nhaCungCap.email || "Chưa cập nhật"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        nhaCungCap.trangThaiHopTac
                          ? "ql-status ql-status-active"
                          : "ql-status ql-status-inactive"
                      }
                    >
                      {nhaCungCap.trangThaiHopTac
                        ? "Đang hợp tác"
                        : "Ngừng hợp tác"}
                    </span>
                  </td>

                  <td>
                    <div className="ql-action-group">
                      <button
                        type="button"
                        className="ql-action-button"
                        onClick={() => onSua(nhaCungCap)}
                        disabled={dangXuLy}
                      >
                        <i className="bi bi-pencil-square" />
                        Sửa
                      </button>

                      <button
                        type="button"
                        className="ql-action-button"
                        onClick={() => onDoiTrangThai(nhaCungCap)}
                        disabled={dangXuLy}
                      >
                        <i
                          className={
                            nhaCungCap.trangThaiHopTac
                              ? "bi bi-eye-slash"
                              : "bi bi-eye"
                          }
                        />
                        {dangXuLy
                          ? "Đang xử lý..."
                          : nhaCungCap.trangThaiHopTac
                            ? "Ngừng hợp tác"
                            : "Hợp tác lại"}
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

export default NhaCungCapTable;
