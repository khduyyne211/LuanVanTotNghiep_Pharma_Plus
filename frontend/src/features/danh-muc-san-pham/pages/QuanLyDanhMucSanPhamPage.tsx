import DanhMucSanPhamFormModal from "../components/DanhMucSanPhamFormModal";
import DanhMucSanPhamTable from "../components/DanhMucSanPhamTable";
import useDanhSachDanhMucSanPham from "../hooks/useDanhSachDanhMucSanPham";
import useFormDanhMucSanPham from "../hooks/useFormDanhMucSanPham";

function QuanLyDanhMucSanPhamPage() {
  const {
    danhSachDanhMuc,
    loading,
    loi,
    taiLaiDanhSach,
  } = useDanhSachDanhMucSanPham();

  const {
    hienForm,
    danhMucCanSua,
    moFormThem,
    moFormSua,
    dongForm,
    xuLyLuuThanhCong,
  } = useFormDanhMucSanPham({
    onTaiLaiDanhSach: taiLaiDanhSach,
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Quản lý danh mục sản phẩm</h1>

          <p>
            Quản trị viên theo dõi danh mục cha,
            danh mục con, thứ tự hiển thị và trạng thái
            của danh mục sản phẩm.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={moFormThem}
        >
          <i className="bi bi-plus-circle" />
          Thêm danh mục
        </button>
      </div>

      <DanhMucSanPhamFormModal
        isOpen={hienForm}
        danhMucCanSua={danhMucCanSua}
        danhSachDanhMuc={danhSachDanhMuc}
        onClose={dongForm}
        onSuccess={xuLyLuuThanhCong}
      />

      <DanhMucSanPhamTable
        danhSachDanhMuc={danhSachDanhMuc}
        loading={loading}
        loi={loi}
        onSua={moFormSua}
      />
    </div>
  );
}

export default QuanLyDanhMucSanPhamPage;