import type { HoatChat } from "../types/HoatChat";

type HoatChatTableProps = {
  danhSachHoatChat: HoatChat[];
  loading: boolean;
  loi: string | null;
};

function HoatChatTable({
  danhSachHoatChat,
  loading,
  loi,
}: HoatChatTableProps) {
  return (
    <div className="table-card">
      {loading ? (
        <p style={{ padding: "16px" }}>Đang tải danh sách hoạt chất...</p>
      ) : loi ? (
        <p style={{ padding: "16px" }}>{loi}</p>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên hoạt chất</th>
                <th>Đơn vị mặc định</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {danhSachHoatChat.map((hoatChat) => (
                <tr key={hoatChat.maHoatChat}>
                  <td>{hoatChat.maHoatChat}</td>

                  <td>
                    <strong>{hoatChat.tenHoatChat}</strong>
                  </td>

                  <td>{hoatChat.donVi || "Chưa cập nhật"}</td>

                  <td>
                    <div className="muted-text">
                      {hoatChat.moTa || "Chưa có mô tả"}
                    </div>
                  </td>

                  <td>
                    <span
                      className={
                        hoatChat.trangThai
                          ? "status-active"
                          : "status-inactive"
                      }
                    >
                      {hoatChat.trangThai ? "Hiện" : "Ẩn"}
                    </span>
                  </td>
                </tr>
              ))}

              {danhSachHoatChat.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-cell">
                    Chưa có hoạt chất.
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
              Tổng cộng <strong>{danhSachHoatChat.length}</strong> hoạt chất
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default HoatChatTable;