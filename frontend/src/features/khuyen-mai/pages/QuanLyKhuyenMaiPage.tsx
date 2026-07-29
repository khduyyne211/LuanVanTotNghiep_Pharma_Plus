import KhuyenMaiTable from "../components/KhuyenMaiTable";
import KhuyenMaiFormModal from "../components/KhuyenMaiFormModal";
import { useDanhSachKhuyenMai } from "../hooks/useDanhSachKhuyenMai";
import useFormKhuyenMai from "../hooks/useFormKhuyenMai"
function QuanLyKhuyenMaiPage() {
  const {
    danhSachKhuyenMai,
    dangTai,
    loi,
    taiDanhSachKhuyenMai
  } = useDanhSachKhuyenMai();
  const {
    hienForm,
    khuyenMaiCanSua,
    moFormThem,
    moFormSua,
    dongForm,
    xuLyLuuThanhCong,
  } = useFormKhuyenMai({onTaiLaiDanhSach:taiDanhSachKhuyenMai});
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Quản lý khuyến mãi</h1>

          <p>
            Quản trị viên quản lý chương trình giảm giá theo phần trăm hoặc số
            tiền trong từng khoảng thời gian.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={moFormThem}
        >
          <i className="bi bi-plus-circle" />
          Thêm khuyến mãi
        </button>
      </div>
      <KhuyenMaiFormModal
        isOpen={hienForm}
        khuyenMaiCanSua={khuyenMaiCanSua}
        onClose={dongForm}
        onSuccess={xuLyLuuThanhCong}
      />
      <KhuyenMaiTable
        danhSachKhuyenMai={danhSachKhuyenMai}
        loading={dangTai}
        loi={loi}
        onSua={moFormSua}
      />
    </div>
  );
}

export default QuanLyKhuyenMaiPage;