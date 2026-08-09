import DonViTinhFormModal from "../components/DonViTinhFormModal";
import DonViTinhTable from "../components/DonViTinhTable";
import useDanhSachDonViTinh from "../hooks/useDanhSachDonViTinh";
import useFormDonViTinh from "../hooks/useFormDonViTinh";
import useTrangThaiDonViTinh from "../hooks/useTrangThaiDonViTinh";
import KhungDanhSachQuanLy from "../../../shared/components/quan-ly/KhungDanhSachQuanLy";
import NutThaoTacChinh from "../../../shared/components/quan-ly/NutThaoTacChinh";
import TieuDeTrangQuanLy from "../../../shared/components/quan-ly/TieuDeTrangQuanLy";
import "../../../shared/styles/quan-ly/QuanLyCommon.css";

function QuanLyDonViTinhPage() {
  const {
    danhSachDonViTinh,
    loading,
    loi,
    taiLaiDanhSach,
  } = useDanhSachDonViTinh();

  const {
    hienForm,
    donViTinhCanSua,
    moFormThem,
    moFormSua,
    dongForm,
    xuLyLuuThanhCong,
  } = useFormDonViTinh({
    onTaiLaiDanhSach: taiLaiDanhSach,
  });

  const {
    maDonViTinhDangXuLy,
    xuLyDoiTrangThai,
  } = useTrangThaiDonViTinh({
    onTaiLaiDanhSach: taiLaiDanhSach,
  });

  return (
    <div className="ql-page">
      <TieuDeTrangQuanLy
        tieuDe="Quản lý đơn vị tính"
        moTa="Theo dõi tên, ký hiệu, mô tả và trạng thái của các đơn vị tính được sử dụng cho sản phẩm"
      >
        <NutThaoTacChinh
          nhan="Thêm đơn vị tính"
          onClick={moFormThem}
        />
      </TieuDeTrangQuanLy>

      <DonViTinhFormModal
        isOpen={hienForm}
        donViTinhCanSua={donViTinhCanSua}
        onClose={dongForm}
        onSuccess={xuLyLuuThanhCong}
      />

      <KhungDanhSachQuanLy
        thongBaoLoi={loi ?? undefined}
        phanTrang={
          <div className="ql-list-summary">
            Tổng cộng{" "}
            <strong>{danhSachDonViTinh.length}</strong>{" "}
            đơn vị tính
          </div>
        }
      >
        {!loi && (
          <DonViTinhTable
            danhSachDonViTinh={danhSachDonViTinh}
            loading={loading}
            maDonViTinhDangXuLy={maDonViTinhDangXuLy}
            onSua={moFormSua}
            onDoiTrangThai={xuLyDoiTrangThai}
          />
        )}
      </KhungDanhSachQuanLy>
    </div>
  );
}

export default QuanLyDonViTinhPage;
