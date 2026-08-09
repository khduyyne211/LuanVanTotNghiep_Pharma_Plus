import DanhMucSanPhamFormModal from "../components/DanhMucSanPhamFormModal";
import DanhMucSanPhamTable from "../components/DanhMucSanPhamTable";
import useDanhSachDanhMucSanPham from "../hooks/useDanhSachDanhMucSanPham";
import useFormDanhMucSanPham from "../hooks/useFormDanhMucSanPham";
import useTrangThaiDanhMucSanPham from "../hooks/useTrangThaiDanhMucSanPham";
import KhungDanhSachQuanLy from "../../../../shared/components/quan-ly/KhungDanhSachQuanLy";
import NutThaoTacChinh from "../../../../shared/components/quan-ly/NutThaoTacChinh";
import TieuDeTrangQuanLy from "../../../../shared/components/quan-ly/TieuDeTrangQuanLy";
import "../../../../shared/styles/quan-ly/QuanLyCommon.css";

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

  const {
    maDanhMucDangXuLy,
    xuLyDoiTrangThai,
  } = useTrangThaiDanhMucSanPham({
    onTaiLaiDanhSach: taiLaiDanhSach,
  });

  return (
    <div className="ql-page">
      <TieuDeTrangQuanLy
        tieuDe="Quản lý danh mục sản phẩm"
        moTa="Theo dõi danh mục cha, danh mục con, thứ tự hiển thị và trạng thái của danh mục sản phẩm"
      >
        <NutThaoTacChinh
          nhan="Thêm danh mục"
          onClick={moFormThem}
        />
      </TieuDeTrangQuanLy>

      <DanhMucSanPhamFormModal
        isOpen={hienForm}
        danhMucCanSua={danhMucCanSua}
        danhSachDanhMuc={danhSachDanhMuc}
        onClose={dongForm}
        onSuccess={xuLyLuuThanhCong}
      />

      <KhungDanhSachQuanLy
        thongBaoLoi={loi ?? undefined}
        phanTrang={
          <div className="ql-list-summary">
            Tổng cộng{" "}
            <strong>{danhSachDanhMuc.length}</strong>{" "}
            danh mục
          </div>
        }
      >
        {!loi && (
          <DanhMucSanPhamTable
            danhSachDanhMuc={danhSachDanhMuc}
            loading={loading}
            maDanhMucDangXuLy={maDanhMucDangXuLy}
            onSua={moFormSua}
            onDoiTrangThai={xuLyDoiTrangThai}
          />
        )}
      </KhungDanhSachQuanLy>
    </div>
  );
}

export default QuanLyDanhMucSanPhamPage;
