import NhaSanXuatTable from "../components/NhaSanXuatTable";
import useDanhSachNhaSanXuat from "../hooks/useDanhSachNhaSanXuat";

function QuanLyNhaSanXuatPage() {
  const {
    danhSachNhaSanXuat,
    loading,
    loi,
  } = useDanhSachNhaSanXuat();

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Quản lý nhà sản xuất</h1>

          <p>
            Quản trị viên theo dõi thông tin, quốc gia,
            địa chỉ và trạng thái của nhà sản xuất.
          </p>
        </div>
      </div>

      <NhaSanXuatTable
        danhSachNhaSanXuat={danhSachNhaSanXuat}
        loading={loading}
        loi={loi}
      />
    </div>
  );
}

export default QuanLyNhaSanXuatPage;