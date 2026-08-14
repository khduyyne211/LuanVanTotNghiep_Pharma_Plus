import ThongBaoHeThong from "../../../../shared/components/thong-bao/ThongBaoHeThong";
import { useThongBaoHeThong } from "../../../../shared/hooks/useThongBaoHeThong";

import AdminXacNhan from "../../shared/components/xac-nhan/AdminXacNhan";
import KhungDanhSachQuanLy from "../../shared/components/quan-ly/KhungDanhSachQuanLy";
import NutThaoTacChinh from "../../shared/components/quan-ly/NutThaoTacChinh";
import TieuDeTrangQuanLy from "../../shared/components/quan-ly/TieuDeTrangQuanLy";

import DonViTinhFormModal from "../components/DonViTinhFormModal";
import DonViTinhTable from "../components/DonViTinhTable";

import useDanhSachDonViTinh from "../hooks/useDanhSachDonViTinh";
import useFormDonViTinh from "../hooks/useFormDonViTinh";
import useTrangThaiDonViTinh from "../hooks/useTrangThaiDonViTinh";

import "../../shared/styles/quan-ly/QuanLyCommon.css";

function QuanLyDonViTinhPage() {
  const thongBao = useThongBaoHeThong();

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
    donViTinhChoXuLy,
    moXacNhanDoiTrangThai,
    dongXacNhanDoiTrangThai,
    xacNhanDoiTrangThai,
  } = useTrangThaiDonViTinh({
    onTaiLaiDanhSach: taiLaiDanhSach,
    onThongBao: thongBao.hienThongBao,
  });

  const noiDungXacNhan = donViTinhChoXuLy
    ? `Bạn có chắc muốn ${
        donViTinhChoXuLy.trangThai
          ? "ẩn"
          : "hiển thị"
      } đơn vị tính "${donViTinhChoXuLy.tenDonViTinh}"?`
    : "";

  const nhanXacNhan = donViTinhChoXuLy?.trangThai
    ? "Ẩn đơn vị tính"
    : "Hiển thị đơn vị tính";

  return (
    <div className="ql-page">
      <ThongBaoHeThong
        dangHien={thongBao.dangHien}
        noiDung={thongBao.noiDung}
        tieuDe={thongBao.tieuDe}
        loai={thongBao.loai}
        dongThongBao={thongBao.dongThongBao}
      />

      <AdminXacNhan
        dangHien={donViTinhChoXuLy !== null}
        tieuDe="Xác nhận thay đổi trạng thái"
        noiDung={noiDungXacNhan}
        nhanXacNhan={nhanXacNhan}
        dangXuLy={maDonViTinhDangXuLy !== null}
        onHuy={dongXacNhanDoiTrangThai}
        onXacNhan={() => {
          void xacNhanDoiTrangThai();
        }}
      />

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
        onThongBao={thongBao.hienThongBao}
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
            onDoiTrangThai={moXacNhanDoiTrangThai}
          />
        )}
      </KhungDanhSachQuanLy>
    </div>
  );
}

export default QuanLyDonViTinhPage;
