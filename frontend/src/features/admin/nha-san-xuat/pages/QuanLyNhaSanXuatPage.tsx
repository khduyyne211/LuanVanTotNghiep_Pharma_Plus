import ThongBaoHeThong from "../../../../shared/components/thong-bao/ThongBaoHeThong";
import { useThongBaoHeThong } from "../../../../shared/hooks/useThongBaoHeThong";

import AdminXacNhan from "../../shared/components/xac-nhan/AdminXacNhan";
import KhungDanhSachQuanLy from "../../shared/components/quan-ly/KhungDanhSachQuanLy";
import NutThaoTacChinh from "../../shared/components/quan-ly/NutThaoTacChinh";
import TieuDeTrangQuanLy from "../../shared/components/quan-ly/TieuDeTrangQuanLy";

import NhaSanXuatFormModal from "../components/NhaSanXuatFormModal";
import NhaSanXuatTable from "../components/NhaSanXuatTable";

import useDanhSachNhaSanXuat from "../hooks/useDanhSachNhaSanXuat";
import useFormNhaSanXuat from "../hooks/useFormNhaSanXuat";
import useTrangThaiNhaSanXuat from "../hooks/useTrangThaiNhaSanXuat";

import "../../shared/styles/quan-ly/QuanLyCommon.css";

function QuanLyNhaSanXuatPage() {
  const thongBao = useThongBaoHeThong();

  const {
    danhSachNhaSanXuat,
    loading,
    loi,
    taiLaiDanhSach,
  } = useDanhSachNhaSanXuat();

  const {
    hienForm,
    nhaSanXuatCanSua,
    moFormThem,
    moFormSua,
    dongForm,
    xuLyLuuThanhCong,
  } = useFormNhaSanXuat({
    onTaiLaiDanhSach: taiLaiDanhSach,
  });

  const {
    maNhaSanXuatDangXuLy,
    nhaSanXuatChoXuLy,
    moXacNhanDoiTrangThai,
    dongXacNhanDoiTrangThai,
    xacNhanDoiTrangThai,
  } = useTrangThaiNhaSanXuat({
    onTaiLaiDanhSach: taiLaiDanhSach,
    onThongBao: thongBao.hienThongBao,
  });

  const noiDungXacNhan = nhaSanXuatChoXuLy
    ? `Bạn có chắc muốn ${
        nhaSanXuatChoXuLy.trangThai
          ? "ẩn"
          : "hiển thị"
      } nhà sản xuất "${nhaSanXuatChoXuLy.tenNhaSanXuat}"?`
    : "";

  const nhanXacNhan = nhaSanXuatChoXuLy?.trangThai
    ? "Ẩn nhà sản xuất"
    : "Hiển thị nhà sản xuất";

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
        dangHien={nhaSanXuatChoXuLy !== null}
        tieuDe="Xác nhận thay đổi trạng thái"
        noiDung={noiDungXacNhan}
        nhanXacNhan={nhanXacNhan}
        dangXuLy={maNhaSanXuatDangXuLy !== null}
        onHuy={dongXacNhanDoiTrangThai}
        onXacNhan={() => {
          void xacNhanDoiTrangThai();
        }}
      />

      <TieuDeTrangQuanLy
        tieuDe="Quản lý nhà sản xuất"
        moTa="Theo dõi thông tin, quốc gia, địa chỉ và trạng thái của nhà sản xuất"
      >
        <NutThaoTacChinh
          nhan="Thêm nhà sản xuất"
          onClick={moFormThem}
        />
      </TieuDeTrangQuanLy>

      <NhaSanXuatFormModal
        isOpen={hienForm}
        nhaSanXuatCanSua={nhaSanXuatCanSua}
        onClose={dongForm}
        onSuccess={xuLyLuuThanhCong}
        onThongBao={thongBao.hienThongBao}
      />

      <KhungDanhSachQuanLy
        thongBaoLoi={loi ?? undefined}
        phanTrang={
          <div className="ql-list-summary">
            Tổng cộng{" "}
            <strong>{danhSachNhaSanXuat.length}</strong>{" "}
            nhà sản xuất
          </div>
        }
      >
        {!loi && (
          <NhaSanXuatTable
            danhSachNhaSanXuat={danhSachNhaSanXuat}
            loading={loading}
            maNhaSanXuatDangXuLy={maNhaSanXuatDangXuLy}
            onSua={moFormSua}
            onDoiTrangThai={moXacNhanDoiTrangThai}
          />
        )}
      </KhungDanhSachQuanLy>
    </div>
  );
}

export default QuanLyNhaSanXuatPage;
