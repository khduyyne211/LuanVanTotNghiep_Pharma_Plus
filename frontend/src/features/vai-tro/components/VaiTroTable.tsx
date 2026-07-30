import type { VaiTro } from "../types/VaiTro";

type VaiTroTableProps = {
  danhSachVaiTro: VaiTro[];
  loading: boolean;
  loi: string | null;
  maVaiTroDangXuLy: number | null;
  onSua: (VaiTro: VaiTro) => void;
  onDoiTrangThai: (vaiTro: VaiTro) => void;
};

function VaiTroTable({
  danhSachVaiTro,
  loading,
  loi,
  maVaiTroDangXuLy,
  onSua,
  onDoiTrangThai,
}: VaiTroTableProps) {
  return (
    <div className="table-card">
      {loading ? (
        <p style={{ padding: "16px" }}>
          Đang tải danh sách vai trò...
        </p>
      ) : loi ? (
        <p style={{ padding: "16px" }}>{loi}</p>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên vai trò</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {danhSachVaiTro.map((VaiTro) => {
                const dangXuLy = maVaiTroDangXuLy === VaiTro.maVaiTro;
                return (
                  <tr key={VaiTro.maVaiTro}>
                    <td>{VaiTro.maVaiTro}</td>

                    <td>
                      <strong>
                        {VaiTro.tenVaiTro}
                      </strong>
                    </td>

                    <td>
                      <div className="muted-text">
                        {VaiTro.moTa ||
                          "Chưa cập nhật"}
                      </div>
                    </td>

                    <td>
                      <span
                        className={
                          VaiTro.trangThai
                            ? "status-active"
                            : "status-inactive"
                        }
                      >
                        {VaiTro.trangThai
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
                            onSua(VaiTro)
                          }
                          disabled={dangXuLy}
                        >
                          Sửa
                        </button>

                        <button
                          type="button"
                          className="small-button"
                          onClick={() =>
                            onDoiTrangThai(VaiTro)
                          }
                          disabled={dangXuLy}
                        >
                          {dangXuLy
                            ? "Đang xử lý..."
                            : VaiTro.trangThai
                              ? "Ẩn"
                              : "Hiện"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {danhSachVaiTro.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="empty-cell"
                  >
                    Chưa có vai trò.
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
                {danhSachVaiTro.length}
              </strong>{" "}
              vai trò
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default VaiTroTable;