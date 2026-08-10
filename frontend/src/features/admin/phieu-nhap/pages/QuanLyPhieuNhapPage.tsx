import PhieuNhapChiTietModal from "../components/PhieuNhapChiTietModal";
import PhieuNhapFormModal from "../components/PhieuNhapFormModal";
import PhieuNhapTable from "../components/PhieuNhapTable";

import useChiTietPhieuNhap from "../hooks/useChiTietPhieuNhap";
import useDanhSachPhieuNhap from "../hooks/useDanhSachPhieuNhap";
import useFormPhieuNhap from "../hooks/useFormPhieuNhap";
import useXuLyPhieuNhap from "../hooks/useXuLyPhieuNhap";

import type { TrangThaiPhieuNhap } from "../types/PhieuNhap";

import KhungDanhSachQuanLy from "../../shared/components/quan-ly/KhungDanhSachQuanLy";
import NutThaoTacChinh from "../../shared/components/quan-ly/NutThaoTacChinh";
import PhanTrangQuanLy from "../../shared/components/quan-ly/PhanTrangQuanLy";
import TieuDeTrangQuanLy from "../../shared/components/quan-ly/TieuDeTrangQuanLy";

import "../../shared/styles/quan-ly/QuanLyCommon.css";

function QuanLyPhieuNhapPage() {
  const {
    danhSachPhieuNhap,
    loading,
    loi,
    tuKhoa,
    trangThai,
    page,
    size,
    totalElements,
    totalPages,
    first,
    last,
    taiLaiDanhSach,
    doiTuKhoa,
    doiTrangThai,
    doiTrang,
    doiKichThuoc,
    xoaBoLoc,
  } = useDanhSachPhieuNhap();

  const {
    hienChiTiet,
    phieuNhapChiTiet,
    dangTaiChiTiet,
    loiChiTiet,
    moChiTiet,
    dongChiTiet,
  } = useChiTietPhieuNhap();

  const {
    hienForm,
    moForm,
    dongForm,
    xuLyTaoThanhCong,
  } = useFormPhieuNhap({
    onTaiLaiDanhSach: taiLaiDanhSach,
    onMoChiTiet: moChiTiet,
  });

  const {
    maPhieuNhapDangXuLy,
    xuLyXacNhan,
    xuLyHuy,
  } = useXuLyPhieuNhap({
    onTaiLaiDanhSach: taiLaiDanhSach,
    onTaiLaiChiTiet: moChiTiet,
  });

  const dangXuLyPhieuDangXem =
    phieuNhapChiTiet !== null
    && maPhieuNhapDangXuLy
      === phieuNhapChiTiet.maPhieuNhap;

  return (
    <div className="ql-page">
      <TieuDeTrangQuanLy
        tieuDe="Quản lý phiếu nhập"
        moTa="Theo dõi phiếu nhập, nhà cung cấp, giá trị nhập kho và trạng thái xử lý"
      >
        <NutThaoTacChinh
          nhan="Tạo phiếu nhập"
          icon="bi bi-plus-lg"
          onClick={moForm}
        />
      </TieuDeTrangQuanLy>

      <PhieuNhapFormModal
        isOpen={hienForm}
        onClose={dongForm}
        onSuccess={xuLyTaoThanhCong}
      />

      <PhieuNhapChiTietModal
        isOpen={hienChiTiet}
        phieuNhap={phieuNhapChiTiet}
        loading={dangTaiChiTiet}
        loi={loiChiTiet}
        dangXuLy={dangXuLyPhieuDangXem}
        onClose={dongChiTiet}
        onXacNhan={xuLyXacNhan}
        onHuy={xuLyHuy}
      />

      <KhungDanhSachQuanLy
        thongBaoLoi={loi ?? undefined}
        thanhCongCu={
          <div className="ql-filter-grid">
            <div className="ql-filter-search">
              <input
                type="text"
                className="ql-filter-control"
                value={tuKhoa}
                onChange={(event) =>
                  doiTuKhoa(event.target.value)
                }
                placeholder="Tìm theo mã phiếu, nhà cung cấp, nhân viên..."
              />
            </div>

            <select
              className="ql-filter-control"
              value={trangThai}
              onChange={(event) =>
                doiTrangThai(
                  event.target.value as
                    | TrangThaiPhieuNhap
                    | ""
                )
              }
            >
              <option value="">
                Tất cả trạng thái
              </option>

              <option value="CHO_XAC_NHAN">
                Chờ xác nhận
              </option>

              <option value="DA_NHAP">
                Đã nhập
              </option>

              <option value="DA_HUY">
                Đã hủy
              </option>
            </select>

            <div className="ql-filter-actions">
              <button
                type="button"
                className="ql-button ql-button-ghost"
                onClick={xoaBoLoc}
              >
                <i className="bi bi-arrow-counterclockwise" />
                Gỡ bộ lọc
              </button>
            </div>
          </div>
        }
        phanTrang={
          <PhanTrangQuanLy
            page={page}
            size={size}
            totalElements={totalElements}
            totalPages={totalPages}
            first={first}
            last={last}
            tenDonVi="phiếu nhập"
            onDoiTrang={doiTrang}
            onDoiKichThuoc={doiKichThuoc}
          />
        }
      >
        {!loi && (
          <PhieuNhapTable
            danhSachPhieuNhap={danhSachPhieuNhap}
            loading={loading}
            onXemChiTiet={moChiTiet}
          />
        )}
      </KhungDanhSachQuanLy>
    </div>
  );
}

export default QuanLyPhieuNhapPage;