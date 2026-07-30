import type { NhaCungCap } from "../types/NhaCungCap";

type NhaCungCapTableProps = {
  danhSachNhaCungCap: NhaCungCap[];
  loading: boolean;
  loi: string | null;
  maNhaCungCapDangXuLy: number | null;
  onSua: (NhaCungCap: NhaCungCap) => void;
  onDoiTrangThai: (nhaSanXuat: NhaCungCap) => void;
};

function NhaCungCapTable({
  danhSachNhaCungCap,
  loading,
  loi,
  maNhaCungCapDangXuLy,
  onSua,
  onDoiTrangThai,
}: NhaCungCapTableProps) {
  return (
    <div className="table-card">
      {loading ? (
        <p style={{ padding: "16px" }}>
          Đang tải danh sách nhà cung cấp...
        </p>
      ) : loi ? (
        <p style={{ padding: "16px" }}>{loi}</p>
      ) : (
        <>
          <table className="data-table">
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
              {danhSachNhaCungCap.map((NhaCungCap) => {
                const dangXuLy = maNhaCungCapDangXuLy === NhaCungCap.maNhaCungCap;
                return (
                  <tr key={NhaCungCap.maNhaCungCap}>
                    <td>{NhaCungCap.maNhaCungCap}</td>

                    <td>
                      <strong>
                        {NhaCungCap.tenNhaCungCap}
                      </strong>
                    </td>

                    <td>
                      {NhaCungCap.soDienThoai ||
                        "Chưa cập nhật"}
                    </td>

                    <td>
                      <div className="muted-text">
                        {NhaCungCap.diaChi ||
                          "Chưa cập nhật"}
                      </div>
                    </td>

                    <td>
                      <div className="muted-text">
                        {NhaCungCap.email ||
                          "Chưa cập nhật"}
                      </div>
                    </td>

                    <td>
                      <span
                        className={
                          NhaCungCap.trangThaiHopTac
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {NhaCungCap.trangThaiHopTac
                          ? "Hiện"
                          : "Ẩn"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="small-button"
                          onClick={() =>
                            onSua(NhaCungCap)
                          }
                          disabled={dangXuLy}
                        >
                          Sửa
                        </button>

                        <button
                          type="button"
                          className="small-button"
                          onClick={() =>
                            onDoiTrangThai(NhaCungCap)
                          }
                          disabled={dangXuLy}
                        >
                          {dangXuLy
                            ? "Đang xử lý..."
                            : NhaCungCap.trangThaiHopTac
                              ? "Ẩn"
                              : "Hiện"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {danhSachNhaCungCap.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="empty-cell"
                  >
                    Chưa có nhà cung cấp.
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
              <strong>
                {danhSachNhaCungCap.length}
              </strong>{" "}
              nhà cung cấp
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NhaCungCapTable;