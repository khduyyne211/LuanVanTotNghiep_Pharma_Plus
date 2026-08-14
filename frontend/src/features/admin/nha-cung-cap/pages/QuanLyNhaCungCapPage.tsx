import ThongBaoHeThong from "../../../../shared/components/thong-bao/ThongBaoHeThong";
import { useThongBaoHeThong } from "../../../../shared/hooks/useThongBaoHeThong";

import AdminXacNhan from "../../shared/components/xac-nhan/AdminXacNhan";
import KhungDanhSachQuanLy from "../../shared/components/quan-ly/KhungDanhSachQuanLy";
import NutThaoTacChinh from "../../shared/components/quan-ly/NutThaoTacChinh";
import TieuDeTrangQuanLy from "../../shared/components/quan-ly/TieuDeTrangQuanLy";

import NhaCungCapFormModal from "../components/NhaCungCapFormModal";
import NhaCungCapTable from "../components/NhaCungCapTable";

import useDanhSachNhaCungCap from "../hooks/useDanhSachNhaCungCap";
import useFormNhaCungCap from "../hooks/useFormNhaCungCap";
import useTrangThaiNhaCungCap from "../hooks/useTrangThaiNhaCungCap";

import "../../shared/styles/quan-ly/QuanLyCommon.css";

function QuanLyNhaCungCapPage() {
  const thongBao = useThongBaoHeThong();

  const {
    danhSachNhaCungCap,
    loading,
    loi,
    taiLaiDanhSach,
  } = useDanhSachNhaCungCap();

  const {
    hienForm,
    NhaCungCapCanSua,
    moFormThem,
    moFormSua,
    dongForm,
    xuLyLuuThanhCong,
  } = useFormNhaCungCap({
    onTaiLaiDanhSach: taiLaiDanhSach,
  });

  const {
    maNhaCungCapDangXuLy,
    nhaCungCapChoXuLy,
    moXacNhanDoiTrangThai,
    dongXacNhanDoiTrangThai,
    xacNhanDoiTrangThai,
  } = useTrangThaiNhaCungCap({
    onTaiLaiDanhSach: taiLaiDanhSach,
    onThongBao: thongBao.hienThongBao,
  });

  const noiDungXacNhan = nhaCungCapChoXuLy
    ? nhaCungCapChoXuLy.trangThaiHopTac
      ? `Bạn có chắc muốn ngừng hợp tác với nhà cung cấp "${nhaCungCapChoXuLy.tenNhaCungCap}"?`
      : `Bạn có chắc muốn hợp tác lại với nhà cung cấp "${nhaCungCapChoXuLy.tenNhaCungCap}"?`
    : "";

  const nhanXacNhan = nhaCungCapChoXuLy?.trangThaiHopTac
    ? "Ngừng hợp tác"
    : "Hợp tác lại";

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
        dangHien={nhaCungCapChoXuLy !== null}
        tieuDe="Xác nhận thay đổi trạng thái"
        noiDung={noiDungXacNhan}
        nhanXacNhan={nhanXacNhan}
        dangXuLy={maNhaCungCapDangXuLy !== null}
        onHuy={dongXacNhanDoiTrangThai}
        onXacNhan={() => {
          void xacNhanDoiTrangThai();
        }}
      />

      <TieuDeTrangQuanLy
        tieuDe="Quản lý nhà cung cấp"
        moTa="Theo dõi tên, số điện thoại, địa chỉ, email và trạng thái hợp tác của nhà cung cấp"
      >
        <NutThaoTacChinh
          nhan="Thêm nhà cung cấp"
          onClick={moFormThem}
        />
      </TieuDeTrangQuanLy>

      <NhaCungCapFormModal
        isOpen={hienForm}
        NhaCungCapCanSua={NhaCungCapCanSua}
        onClose={dongForm}
        onSuccess={xuLyLuuThanhCong}
        onThongBao={thongBao.hienThongBao}
      />

      <KhungDanhSachQuanLy
        thongBaoLoi={loi ?? undefined}
        phanTrang={
          <div className="ql-list-summary">
            Tổng cộng{" "}
            <strong>{danhSachNhaCungCap.length}</strong>{" "}
            nhà cung cấp
          </div>
        }
      >
        {!loi && (
          <NhaCungCapTable
            danhSachNhaCungCap={danhSachNhaCungCap}
            loading={loading}
            maNhaCungCapDangXuLy={maNhaCungCapDangXuLy}
            onSua={moFormSua}
            onDoiTrangThai={moXacNhanDoiTrangThai}
          />
        )}
      </KhungDanhSachQuanLy>
    </div>
  );
}

export default QuanLyNhaCungCapPage;
