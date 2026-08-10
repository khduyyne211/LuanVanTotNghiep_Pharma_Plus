import HoatChatFormModal from "../components/HoatChatFormModal";
import HoatChatTable from "../components/HoatChatTable";
import useDanhSachHoatChat from "../hooks/useDanhSachHoatChat";
import useFormHoatChat from "../hooks/useFormHoatChat";
import useTrangThaiHoatChat from "../hooks/useTrangThaiHoatChat";
import KhungDanhSachQuanLy from "../../shared/components/quan-ly/KhungDanhSachQuanLy";
import NutThaoTacChinh from "../../shared/components/quan-ly/NutThaoTacChinh";
import TieuDeTrangQuanLy from "../../shared/components/quan-ly/TieuDeTrangQuanLy";
import "../../shared/styles/quan-ly/QuanLyCommon.css";

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
    <div className="ql-page">
      <TieuDeTrangQuanLy
        tieuDe="Quản lý hoạt chất"
        moTa="Theo dõi tên, đơn vị mặc định, mô tả và trạng thái của hoạt chất"
      >
        <NutThaoTacChinh
          nhan="Thêm hoạt chất"
          onClick={moFormThem}
        />
      </TieuDeTrangQuanLy>

      <HoatChatFormModal
        isOpen={hienForm}
        hoatChatCanSua={hoatChatCanSua}
        onClose={dongForm}
        onSuccess={xuLyLuuThanhCong}
      />

      <KhungDanhSachQuanLy
        thongBaoLoi={loi ?? undefined}
        phanTrang={
          <div className="ql-list-summary">
            Tổng cộng{" "}
            <strong>{danhSachHoatChat.length}</strong>{" "}
            hoạt chất
          </div>
        }
      >
        {!loi && (
          <HoatChatTable
            danhSachHoatChat={danhSachHoatChat}
            loading={loading}
            maHoatChatDangXuLy={maHoatChatDangXuLy}
            onSua={moFormSua}
            onDoiTrangThai={xuLyDoiTrangThai}
          />
        )}
      </KhungDanhSachQuanLy>
    </div>
  );
}

export default QuanLyHoatChatPage;
