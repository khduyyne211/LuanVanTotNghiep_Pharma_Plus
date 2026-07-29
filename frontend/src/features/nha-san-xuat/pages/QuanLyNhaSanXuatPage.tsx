import NhaSanXuatFormModal from "../components/NhaSanXuatFormModal";
import NhaSanXuatTable from "../components/NhaSanXuatTable";
import useDanhSachNhaSanXuat from "../hooks/useDanhSachNhaSanXuat";
import useFormNhaSanXuat from "../hooks/useFormNhaSanXuat";

function QuanLyNhaSanXuatPage() {
  const {
    danhSachNhaSanXuat,
    loading,
    loi,
    taiLaiDanhSach,
  } = useDanhSachNhaSanXuat();

  const {
    hienForm,
    nhaSanXuatCanSua,
    moFormThem,
    moFormSua,
    dongForm,
    xuLyLuuThanhCong,
  } = useFormNhaSanXuat({
    onTaiLaiDanhSach: taiLaiDanhSach,
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Quản lý nhà sản xuất</h1>

          <p>
            Quản trị viên theo dõi thông tin, quốc gia, địa chỉ và trạng thái
            của nhà sản xuất.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={moFormThem}
        >
          <i className="bi bi-plus-circle" />
          Thêm nhà sản xuất
        </button>
      </div>

      <NhaSanXuatFormModal
        isOpen={hienForm}
        nhaSanXuatCanSua={nhaSanXuatCanSua}
        onClose={dongForm}
        onSuccess={xuLyLuuThanhCong}
      />

      <NhaSanXuatTable
        danhSachNhaSanXuat={danhSachNhaSanXuat}
        loading={loading}
        loi={loi}
        onSua={moFormSua}
      />
    </div>
  );
}

export default QuanLyNhaSanXuatPage;