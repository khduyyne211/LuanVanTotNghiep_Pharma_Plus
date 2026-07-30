import VaiTroFormModal from "../components/VaiTroFormModal";
import VaiTroTable from "../components/VaiTroTable";
import useDanhSachVaiTro from "../hooks/useDanhSachVaiTro";
import useFormVaiTro from "../hooks/useFormVaiTro";
import useTrangThaiVaiTro from "../hooks/useTrangThai";

function QuanLyVaiTroPage() {
  const {
    danhSachVaiTro,
    loading,
    loi,
    taiLaiDanhSach,
  } = useDanhSachVaiTro();

  const {
    hienForm,
    VaiTroCanSua,
    moFormThem,
    moFormSua,
    dongForm,
    xuLyLuuThanhCong,
  } = useFormVaiTro({
    onTaiLaiDanhSach: taiLaiDanhSach,
  });

  const {
    maVaiTroDangXuLy,
    xuLyDoiTrangThai,
  } = useTrangThaiVaiTro({
    onTaiLaiDanhSach: taiLaiDanhSach,
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Quản lý vai trò</h1>

          <p>
            Quản trị viên quản lý tên, mô tả và trạng thái của vai trò.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={moFormThem}
        >
          <i className="bi bi-plus-circle" />
          Thêm vai trò
        </button>
      </div>

      <VaiTroFormModal
        isOpen={hienForm}
        VaiTroCanSua={VaiTroCanSua}
        onClose={dongForm}
        onSuccess={xuLyLuuThanhCong}
      />

      <VaiTroTable
        danhSachVaiTro={danhSachVaiTro}
        loading={loading}
        loi={loi}
        maVaiTroDangXuLy={maVaiTroDangXuLy}
        onSua={moFormSua}
        onDoiTrangThai={xuLyDoiTrangThai}
      />
    </div>
  );
}

export default QuanLyVaiTroPage;