import type { HoatChat } from "../types/HoatChat";

type HoatChatTableProps = {
  danhSachHoatChat: HoatChat[];
  loading: boolean;
  loi: string | null;
  maHoatChatDangXuLy: number | null;
  onSua: (hoatChat: HoatChat) => void;
  onDoiTrangThai: (nhaSanXuat: HoatChat) => void;
};

function NhaSanXuatTable({
  danhSachHoatChat,
  loading,
  loi,
  maHoatChatDangXuLy,
  onSua,
  onDoiTrangThai,
}: HoatChatTableProps) {
  return (
    <div className="table-card">
      {loading ? (
        <p style={{ padding: "16px" }}>
          Đang tải danh sách hoạt chất...
        </p>
      ) : loi ? (
        <p style={{ padding: "16px" }}>{loi}</p>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên hoạt chất</th>
                <th>Đơn vị</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {danhSachHoatChat.map((hoatChat) => {
                const dangXuLy =
                  maHoatChatDangXuLy === hoatChat.maHoatChat;

                return (
                  <tr key={hoatChat.maHoatChat}>
                    <td>{hoatChat.maHoatChat}</td>

                    <td>
                      <strong>
                        {hoatChat.tenHoatChat}
                      </strong>
                    </td>

                    <td>
                      {hoatChat.donVi ||
                        "Chưa cập nhật"}
                    </td>

                    <td>
                      <div className="muted-text">
                        {hoatChat.moTa ||
                          "Chưa cập nhật"}
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
                        {hoatChat.trangThai
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
                            onSua(hoatChat)
                          }
                          disabled={dangXuLy}
                        >
                          Sửa
                        </button>

                        <button
                          type="button"
                          className="small-button"
                          onClick={() =>
                            onDoiTrangThai(hoatChat)
                          }
                          disabled={dangXuLy}
                        >
                          {dangXuLy
                            ? "Đang xử lý..."
                            : hoatChat.trangThai
                              ? "Ẩn"
                              : "Hiện"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {danhSachHoatChat.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="empty-cell"
                  >
                    Chưa có nhà sản xuất.
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
                {danhSachHoatChat.length}
              </strong>{" "}
              nhà sản xuất
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default NhaSanXuatTable;