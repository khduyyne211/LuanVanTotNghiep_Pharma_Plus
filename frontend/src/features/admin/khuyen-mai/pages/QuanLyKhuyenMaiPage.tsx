import KhuyenMaiFormModal from "../components/KhuyenMaiFormModal";
import KhuyenMaiTable from "../components/KhuyenMaiTable";
import { useDanhSachKhuyenMai } from "../hooks/useDanhSachKhuyenMai";
import useFormKhuyenMai from "../hooks/useFormKhuyenMai";
import KhungDanhSachQuanLy from "../../shared/components/quan-ly/KhungDanhSachQuanLy";
import NutThaoTacChinh from "../../shared/components/quan-ly/NutThaoTacChinh";
import TieuDeTrangQuanLy from "../../shared/components/quan-ly/TieuDeTrangQuanLy";
import "../../shared/styles/quan-ly/QuanLyCommon.css";

function QuanLyKhuyenMaiPage() {
  const {
    danhSachKhuyenMai,
    dangTai,
    loi,
    taiDanhSachKhuyenMai,
  } = useDanhSachKhuyenMai();

  const {
    hienForm,
    khuyenMaiCanSua,
    moFormThem,
    moFormSua,
    dongForm,
    xuLyLuuThanhCong,
  } = useFormKhuyenMai({
    onTaiLaiDanhSach: taiDanhSachKhuyenMai,
  });

  return (
    <div className="ql-page">
      <TieuDeTrangQuanLy
        tieuDe="Quản lý khuyến mãi"
        moTa="Theo dõi các chương trình giảm giá theo phần trăm hoặc số tiền trong từng khoảng thời gian"
      >
        <NutThaoTacChinh
          nhan="Thêm khuyến mãi"
          onClick={moFormThem}
        />
      </TieuDeTrangQuanLy>

      <KhuyenMaiFormModal
        isOpen={hienForm}
        khuyenMaiCanSua={khuyenMaiCanSua}
        onClose={dongForm}
        onSuccess={xuLyLuuThanhCong}
      />

      <KhungDanhSachQuanLy
        thongBaoLoi={loi ?? undefined}
        phanTrang={
          <div className="ql-list-summary">
            Tổng cộng{" "}
            <strong>{danhSachKhuyenMai.length}</strong>{" "}
            chương trình khuyến mãi
          </div>
        }
      >
        {!loi && (
          <KhuyenMaiTable
            danhSachKhuyenMai={danhSachKhuyenMai}
            loading={dangTai}
            onSua={moFormSua}
          />
        )}
      </KhungDanhSachQuanLy>
    </div>
  );
}

export default QuanLyKhuyenMaiPage;
