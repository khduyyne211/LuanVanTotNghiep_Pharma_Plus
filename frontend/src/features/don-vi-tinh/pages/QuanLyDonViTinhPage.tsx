import DonViTinhFormModal from "../components/DonViTinhFormModal";
import DonViTinhTable from "../components/DonViTinhTable";
import useDanhSachDonViTinh from "../hooks/useDanhSachDonViTinh";
import useFormDonViTinh from "../hooks/useFormDonViTinh";

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

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Quản lý đơn vị tính</h1>

          <p>
            Quản trị viên quản lý tên, ký hiệu, mô tả và trạng thái của các
            đơn vị tính được sử dụng cho sản phẩm.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={moFormThem}
        >
          <i className="bi bi-plus-circle" />
          Thêm đơn vị tính
        </button>
      </div>

      <DonViTinhFormModal
        isOpen={hienForm}
        donViTinhCanSua={donViTinhCanSua}
        onClose={dongForm}
        onSuccess={xuLyLuuThanhCong}
      />

      <DonViTinhTable
        danhSachDonViTinh={danhSachDonViTinh}
        loading={loading}
        loi={loi}
        onSua={moFormSua}
      />
    </div>
  );
}

export default QuanLyDonViTinhPage;