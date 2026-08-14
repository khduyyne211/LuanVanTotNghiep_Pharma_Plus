import ThongBaoHeThong from "../../../../shared/components/thong-bao/ThongBaoHeThong";
import { useThongBaoHeThong } from "../../../../shared/hooks/useThongBaoHeThong";

import AdminXacNhan from "../../shared/components/xac-nhan/AdminXacNhan";
import KhungDanhSachQuanLy from "../../shared/components/quan-ly/KhungDanhSachQuanLy";
import NutThaoTacChinh from "../../shared/components/quan-ly/NutThaoTacChinh";
import TieuDeTrangQuanLy from "../../shared/components/quan-ly/TieuDeTrangQuanLy";

import HoatChatFormModal from "../components/HoatChatFormModal";
import HoatChatTable from "../components/HoatChatTable";

import useDanhSachHoatChat from "../hooks/useDanhSachHoatChat";
import useFormHoatChat from "../hooks/useFormHoatChat";
import useTrangThaiHoatChat from "../hooks/useTrangThaiHoatChat";

import "../../shared/styles/quan-ly/QuanLyCommon.css";

function QuanLyHoatChatPage() {
  const thongBao = useThongBaoHeThong();

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
    hoatChatChoXuLy,
    moXacNhanDoiTrangThai,
    dongXacNhanDoiTrangThai,
    xacNhanDoiTrangThai,
  } = useTrangThaiHoatChat({
    onTaiLaiDanhSach: taiLaiDanhSach,
    onThongBao: thongBao.hienThongBao,
  });

  const noiDungXacNhan = hoatChatChoXuLy
    ? `Bạn có chắc muốn ${
        hoatChatChoXuLy.trangThai
          ? "ẩn"
          : "hiển thị"
      } hoạt chất "${hoatChatChoXuLy.tenHoatChat}"?`
    : "";

  const nhanXacNhan = hoatChatChoXuLy?.trangThai
    ? "Ẩn hoạt chất"
    : "Hiển thị hoạt chất";

  return (
    <div className="ql-page">
      <ThongBaoHeThong
        dangHien={thongBao.dangHien}
        noiDung={thongBao.noiDung}
        tieuDe={thongBao.tieuDe}
        loai={thongBao.loai}
        dongThongBao={thongBao.dongThongBao}
      />

      <AdminXacNhan
        dangHien={hoatChatChoXuLy !== null}
        tieuDe="Xác nhận thay đổi trạng thái"
        noiDung={noiDungXacNhan}
        nhanXacNhan={nhanXacNhan}
        dangXuLy={maHoatChatDangXuLy !== null}
        onHuy={dongXacNhanDoiTrangThai}
        onXacNhan={() => {
          void xacNhanDoiTrangThai();
        }}
      />

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
        onThongBao={thongBao.hienThongBao}
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
            onDoiTrangThai={moXacNhanDoiTrangThai}
          />
        )}
      </KhungDanhSachQuanLy>
    </div>
  );
}

export default QuanLyHoatChatPage;
