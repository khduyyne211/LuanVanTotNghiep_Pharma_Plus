import NhaCungCapFormModal from "../components/NhaCungCapFormModal";
import NhaCungCapTable from "../components/NhaCungCapTable";
import useDanhSachNhaCungCap from "../hooks/useDanhSachNhaCungCap";
import useFormNhaCungCap from "../hooks/useFormNhaCungCap";
import useTrangThaiNhaCungCap from "../hooks/useTrangThaiNhaCungCap";

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
    <div>
      <div className="page-header">
        <div>
          <h1>Quản lý nhà cung cấp</h1>

          <p>
            Quản trị viên quản lý tên, số điện thoại, địa chỉ,
            email và trạng thái của nhà cung cấp.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={moFormThem}
        >
          <i className="bi bi-plus-circle" />
          Thêm nhà cung cấp
        </button>
      </div>

      <NhaCungCapFormModal
        isOpen={hienForm}
        NhaCungCapCanSua={NhaCungCapCanSua}
        onClose={dongForm}
        onSuccess={xuLyLuuThanhCong}
      />

      <NhaCungCapTable
        danhSachNhaCungCap={danhSachNhaCungCap}
        loading={loading}
        loi={loi}
        maNhaCungCapDangXuLy={maNhaCungCapDangXuLy}
        onSua={moFormSua}
        onDoiTrangThai={xuLyDoiTrangThai}
      />
    </div>
  );
}

export default QuanLyNhaCungCapPage;