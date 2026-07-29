import HoatChatTable from "../components/HoatChatTable";
import useDanhSachHoatChat from "../hooks/useDanhSachHoatChat";

function QuanLyHoatChatPage() {
  const {
    danhSachHoatChat,
    loading,
    loi,
  } = useDanhSachHoatChat();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Quản lý hoạt chất</h1>

          <p>
            Quản trị viên quản lý tên, đơn vị mặc định,
            mô tả và trạng thái của hoạt chất.
          </p>
        </div>
      </div>

      <HoatChatTable
        danhSachHoatChat={danhSachHoatChat}
        loading={loading}
        loi={loi}
      />
    </div>
  );
}

export default QuanLyHoatChatPage;