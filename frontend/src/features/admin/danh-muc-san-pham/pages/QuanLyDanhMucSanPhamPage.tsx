import ThongBaoHeThong from "../../../../shared/components/thong-bao/ThongBaoHeThong";
import { useThongBaoHeThong } from "../../../../shared/hooks/useThongBaoHeThong";

import AdminXacNhan from "../../shared/components/xac-nhan/AdminXacNhan";
import KhungDanhSachQuanLy from "../../shared/components/quan-ly/KhungDanhSachQuanLy";
import NutThaoTacChinh from "../../shared/components/quan-ly/NutThaoTacChinh";
import TieuDeTrangQuanLy from "../../shared/components/quan-ly/TieuDeTrangQuanLy";

import DanhMucSanPhamFormModal from "../components/DanhMucSanPhamFormModal";
import DanhMucSanPhamTable from "../components/DanhMucSanPhamTable";

import useDanhSachDanhMucSanPham from "../hooks/useDanhSachDanhMucSanPham";
import useFormDanhMucSanPham from "../hooks/useFormDanhMucSanPham";
import useTrangThaiDanhMucSanPham from "../hooks/useTrangThaiDanhMucSanPham";

import "../../shared/styles/quan-ly/QuanLyCommon.css";

function QuanLyDanhMucSanPhamPage() {
  const thongBao = useThongBaoHeThong();

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
    danhMucChoXuLy,
    moXacNhanDoiTrangThai,
    dongXacNhanDoiTrangThai,
    xacNhanDoiTrangThai,
  } = useTrangThaiDanhMucSanPham({
    onTaiLaiDanhSach: taiLaiDanhSach,
    onThongBao: thongBao.hienThongBao,
  });

  const noiDungXacNhan = danhMucChoXuLy
    ? `Bạn có chắc muốn ${
        danhMucChoXuLy.trangThaiHienThi
          ? "ẩn"
          : "hiển thị"
      } danh mục "${danhMucChoXuLy.tenDanhMuc}"?`
    : "";

  const nhanXacNhan = danhMucChoXuLy?.trangThaiHienThi
    ? "Ẩn danh mục"
    : "Hiển thị danh mục";

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
        dangHien={danhMucChoXuLy !== null}
        tieuDe="Xác nhận thay đổi trạng thái"
        noiDung={noiDungXacNhan}
        nhanXacNhan={nhanXacNhan}
        dangXuLy={maDanhMucDangXuLy !== null}
        onHuy={dongXacNhanDoiTrangThai}
        onXacNhan={() => {
          void xacNhanDoiTrangThai();
        }}
      />

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
        onThongBao={thongBao.hienThongBao}
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
            onDoiTrangThai={moXacNhanDoiTrangThai}
          />
        )}
      </KhungDanhSachQuanLy>
    </div>
  );
}

export default QuanLyDanhMucSanPhamPage;