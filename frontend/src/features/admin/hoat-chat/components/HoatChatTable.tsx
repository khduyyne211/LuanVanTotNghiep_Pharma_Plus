import AdminLoading from "../../shared/components/loading/AdminLoading";
import type { HoatChat } from "../types/HoatChat";

type HoatChatTableProps = {
  danhSachHoatChat: HoatChat[];
  loading: boolean;
  maHoatChatDangXuLy: number | null;
  onSua: (hoatChat: HoatChat) => void;
  onDoiTrangThai: (hoatChat: HoatChat) => void;
};

function HoatChatTable({
  danhSachHoatChat,
  loading,
  maHoatChatDangXuLy,
  onSua,
  onDoiTrangThai,
}: HoatChatTableProps) {
  if (loading) {
    return <AdminLoading noiDung="Đang tải danh sách hoạt chất..." />;
  }

  return (
    <div className="ql-table-wrapper">
      <table className="ql-table">
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
          {danhSachHoatChat.length === 0 ? (
            <tr>
              <td colSpan={6} className="ql-table-message">
                Chưa có hoạt chất
              </td>
            </tr>
          ) : (
            danhSachHoatChat.map((hoatChat) => {
              const dangXuLy = maHoatChatDangXuLy === hoatChat.maHoatChat;

              return (
                <tr key={hoatChat.maHoatChat}>
                  <td>
                    <strong>#{hoatChat.maHoatChat}</strong>
                  </td>

                  <td>
                    <strong>{hoatChat.tenHoatChat}</strong>
                  </td>

                  <td>{hoatChat.donVi || "Chưa cập nhật"}</td>

                  <td>
                    <span className="ql-muted-text">
                      {hoatChat.moTa || "Chưa cập nhật"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        hoatChat.trangThai
                          ? "ql-status ql-status-active"
                          : "ql-status ql-status-inactive"
                      }
                    >
                      {hoatChat.trangThai ? "Hiện" : "Ẩn"}
                    </span>
                  </td>

                  <td>
                    <div className="ql-action-group">
                      <button
                        type="button"
                        className="ql-action-button"
                        onClick={() => onSua(hoatChat)}
                        disabled={dangXuLy}
                      >
                        <i className="bi bi-pencil-square" />
                        Sửa
                      </button>

                      <button
                        type="button"
                        className="ql-action-button"
                        onClick={() => onDoiTrangThai(hoatChat)}
                        disabled={dangXuLy}
                      >
                        <i
                          className={
                            hoatChat.trangThai ? "bi bi-eye-slash" : "bi bi-eye"
                          }
                        />

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
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default HoatChatTable;
