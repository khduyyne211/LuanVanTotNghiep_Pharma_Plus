import NhaCungCapFormModal from "../components/NhaCungCapFormModal";
import NhaCungCapTable from "../components/NhaCungCapTable";
import useDanhSachNhaCungCap from "../hooks/useDanhSachNhaCungCap";
import useFormNhaCungCap from "../hooks/useFormNhaCungCap";
import useTrangThaiNhaCungCap from "../hooks/useTrangThaiNhaCungCap";
import KhungDanhSachQuanLy from "../../../../shared/components/quan-ly/KhungDanhSachQuanLy";
import NutThaoTacChinh from "../../../../shared/components/quan-ly/NutThaoTacChinh";
import TieuDeTrangQuanLy from "../../../../shared/components/quan-ly/TieuDeTrangQuanLy";
import "../../../../shared/styles/quan-ly/QuanLyCommon.css";

function QuanLyNhaCungCapPage() {
  const {
    danhSachNhaCungCap,
    loading,
    loi,
    taiLaiDanhSach,
  } = useDanhSachNhaCungCap();

  const {
    hienForm,
    NhaCungCapCanSua,
    moFormThem,
    moFormSua,
    dongForm,
    xuLyLuuThanhCong,
  } = useFormNhaCungCap({
    onTaiLaiDanhSach: taiLaiDanhSach,
  });

  const {
    maNhaCungCapDangXuLy,
    xuLyDoiTrangThai,
  } = useTrangThaiNhaCungCap({
    onTaiLaiDanhSach: taiLaiDanhSach,
  });

  return (
    <div className="ql-page">
      <TieuDeTrangQuanLy
        tieuDe="Quản lý nhà cung cấp"
        moTa="Theo dõi tên, số điện thoại, địa chỉ, email và trạng thái hợp tác của nhà cung cấp"
      >
        <NutThaoTacChinh
          nhan="Thêm nhà cung cấp"
          onClick={moFormThem}
        />
      </TieuDeTrangQuanLy>

      <NhaCungCapFormModal
        isOpen={hienForm}
        NhaCungCapCanSua={NhaCungCapCanSua}
        onClose={dongForm}
        onSuccess={xuLyLuuThanhCong}
      />

      <KhungDanhSachQuanLy
        thongBaoLoi={loi ?? undefined}
        phanTrang={
          <div className="ql-list-summary">
            Tổng cộng{" "}
            <strong>{danhSachNhaCungCap.length}</strong>{" "}
            nhà cung cấp
          </div>
        }
      >
        {!loi && (
          <NhaCungCapTable
            danhSachNhaCungCap={danhSachNhaCungCap}
            loading={loading}
            maNhaCungCapDangXuLy={maNhaCungCapDangXuLy}
            onSua={moFormSua}
            onDoiTrangThai={xuLyDoiTrangThai}
          />
        )}
      </KhungDanhSachQuanLy>
    </div>
  );
}

export default QuanLyNhaCungCapPage;
