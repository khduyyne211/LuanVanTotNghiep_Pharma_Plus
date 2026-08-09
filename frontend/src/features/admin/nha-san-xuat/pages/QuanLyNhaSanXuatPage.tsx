import NhaSanXuatFormModal from "../components/NhaSanXuatFormModal";
import NhaSanXuatTable from "../components/NhaSanXuatTable";
import useDanhSachNhaSanXuat from "../hooks/useDanhSachNhaSanXuat";
import useFormNhaSanXuat from "../hooks/useFormNhaSanXuat";
import useTrangThaiNhaSanXuat from "../hooks/useTrangThaiNhaSanXuat";
import KhungDanhSachQuanLy from "../../../../shared/components/quan-ly/KhungDanhSachQuanLy";
import NutThaoTacChinh from "../../../../shared/components/quan-ly/NutThaoTacChinh";
import TieuDeTrangQuanLy from "../../../../shared/components/quan-ly/TieuDeTrangQuanLy";
import "../../../../shared/styles/quan-ly/QuanLyCommon.css";

function QuanLyNhaSanXuatPage() {
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
    xuLyDoiTrangThai,
  } = useTrangThaiNhaSanXuat({
    onTaiLaiDanhSach: taiLaiDanhSach,
  });

  return (
    <div className="ql-page">
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
            onDoiTrangThai={xuLyDoiTrangThai}
          />
        )}
      </KhungDanhSachQuanLy>
    </div>
  );
}

export default QuanLyNhaSanXuatPage;
