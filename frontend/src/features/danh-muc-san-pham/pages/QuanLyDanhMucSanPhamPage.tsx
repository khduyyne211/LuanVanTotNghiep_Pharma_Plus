import DanhMucSanPhamTable from "../components/DanhMucSanPhamTable";
import useDanhSachDanhMucSanPham from "../hooks/useDanhSachDanhMucSanPham";

function QuanLyDanhMucSanPhamPage() {
  const {
    danhSachDanhMuc,
    loading,
    loi,
  } = useDanhSachDanhMucSanPham();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Quản lý danh mục sản phẩm</h1>

          <p>
            Quản trị viên theo dõi danh mục cha,
            danh mục con, thứ tự hiển thị và trạng
            thái của danh mục sản phẩm.
          </p>
        </div>
      </div>

      <DanhMucSanPhamTable
        danhSachDanhMuc={danhSachDanhMuc}
        loading={loading}
        loi={loi}
      />
    </div>
  );
}

export default QuanLyDanhMucSanPhamPage;