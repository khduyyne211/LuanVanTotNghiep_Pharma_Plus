import HoatChatFormModal from "../components/HoatChatFormModal";
import HoatChatTable from "../components/HoatChatTable";
import useDanhSachHoatChat from "../hooks/useDanhSachHoatChat";
import useFormHoatChat from "../hooks/useFormHoatChat";
import useTrangThaiHoatChat from "../hooks/useTrangThaiHoatChat";

function QuanLyHoatChatPage() {
  const {
    danhSachHoatChat,
    loading,
    loi,
    taiLaiDanhSach,
  } = useDanhSachHoatChat();

  const {
    hienForm,
    hoatChatCanSua,
    moFormThem,
    moFormSua,
    dongForm,
    xuLyLuuThanhCong,
  } = useFormHoatChat({
    onTaiLaiDanhSach: taiLaiDanhSach,
  });

  const {
    maHoatChatDangXuLy,
    xuLyDoiTrangThai,
  } = useTrangThaiHoatChat({
    onTaiLaiDanhSach: taiLaiDanhSach,
  });

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

        <button
          type="button"
          className="primary-button"
          onClick={moFormThem}
        >
          <i className="bi bi-plus-circle" />
          Thêm hoạt chất
        </button>
      </div>

      <HoatChatFormModal
        isOpen={hienForm}
        hoatChatCanSua={hoatChatCanSua}
        onClose={dongForm}
        onSuccess={xuLyLuuThanhCong}
      />

      <HoatChatTable
        danhSachHoatChat={danhSachHoatChat}
        loading={loading}
        loi={loi}
        maHoatChatDangXuLy={maHoatChatDangXuLy}
        onSua={moFormSua}
        onDoiTrangThai={xuLyDoiTrangThai}
      />
    </div>
  );
}

export default QuanLyHoatChatPage;