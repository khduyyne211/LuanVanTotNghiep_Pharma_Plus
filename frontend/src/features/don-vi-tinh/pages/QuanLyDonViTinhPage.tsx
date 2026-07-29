import DonViTinhTable from "../components/DonViTinhTable";
import useDanhSachDonViTinh from "../hooks/useDanhSachDonViTinh";

function QuanLyDonViTinhPage() {
  const {
    danhSachDonViTinh,
    loading,
    loi,
  } = useDanhSachDonViTinh();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Quản lý đơn vị tính</h1>

          <p>
            Quản trị viên quản lý tên, ký hiệu,
            mô tả và trạng thái của các đơn vị tính
            được sử dụng cho sản phẩm.
          </p>
        </div>
      </div>

      <DonViTinhTable
        danhSachDonViTinh={danhSachDonViTinh}
        loading={loading}
        loi={loi}
      />
    </div>
  );
}

export default QuanLyDonViTinhPage;