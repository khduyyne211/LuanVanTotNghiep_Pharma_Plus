import ThongBaoHeThong from "../../../../shared/components/thong-bao/ThongBaoHeThong";
import { useThongBaoHeThong } from "../../../../shared/hooks/useThongBaoHeThong";

import PhieuNhapChiTietModal from "../components/PhieuNhapChiTietModal";
import PhieuNhapFormModal from "../components/PhieuNhapFormModal";
import PhieuNhapTable from "../components/PhieuNhapTable";

import useChiTietPhieuNhap from "../hooks/useChiTietPhieuNhap";
import useDanhSachPhieuNhap from "../hooks/useDanhSachPhieuNhap";
import useFormPhieuNhap from "../hooks/useFormPhieuNhap";
import useXuLyPhieuNhap from "../hooks/useXuLyPhieuNhap";

import type { TrangThaiPhieuNhap } from "../types/PhieuNhap";

import AdminXacNhan from "../../shared/components/xac-nhan/AdminXacNhan";
import KhungDanhSachQuanLy from "../../shared/components/quan-ly/KhungDanhSachQuanLy";
import NutThaoTacChinh from "../../shared/components/quan-ly/NutThaoTacChinh";
import PhanTrangQuanLy from "../../shared/components/quan-ly/PhanTrangQuanLy";
import TieuDeTrangQuanLy from "../../shared/components/quan-ly/TieuDeTrangQuanLy";

import "../../shared/styles/quan-ly/QuanLyCommon.css";

function QuanLyPhieuNhapPage() {
  const thongBao =
    useThongBaoHeThong();

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
    onTaiLaiDanhSach:
      taiLaiDanhSach,
    onMoChiTiet:
      moChiTiet,
  });

  const {
    maPhieuNhapDangXuLy,
    phieuNhapChoXuLy,
    moXacNhanNhapKho,
    moXacNhanHuyPhieu,
    dongXacNhanThaoTac,
    xacNhanThaoTac,
  } = useXuLyPhieuNhap({
    onTaiLaiDanhSach:
      taiLaiDanhSach,
    onTaiLaiChiTiet:
      moChiTiet,
    onThongBao:
      thongBao.hienThongBao,
  });

  const dangXuLyPhieuDangXem =
    phieuNhapChiTiet !== null
    && maPhieuNhapDangXuLy
      === phieuNhapChiTiet.maPhieuNhap;

  const laXacNhanNhapKho =
    phieuNhapChoXuLy?.loaiThaoTac
      === "XAC_NHAN_NHAP_KHO";

  const noiDungXacNhan =
    phieuNhapChoXuLy
      ? laXacNhanNhapKho
        ? `Xác nhận nhập kho cho phiếu #${phieuNhapChoXuLy.maPhieuNhap}? Sau khi xác nhận, số lượng sản phẩm sẽ được tính vào tồn kho.`
        : `Hủy phiếu nhập #${phieuNhapChoXuLy.maPhieuNhap}? Phiếu đã hủy sẽ không được tính vào tồn kho.`
      : "";

  return (
    <div className="ql-page">
      <ThongBaoHeThong
        dangHien={thongBao.dangHien}
        noiDung={thongBao.noiDung}
        tieuDe={thongBao.tieuDe}
        loai={thongBao.loai}
        dongThongBao={
          thongBao.dongThongBao
        }
      />

      <AdminXacNhan
        dangHien={
          phieuNhapChoXuLy !== null
        }
        tieuDe={
          laXacNhanNhapKho
            ? "Xác nhận nhập kho"
            : "Xác nhận hủy phiếu"
        }
        noiDung={noiDungXacNhan}
        nhanXacNhan={
          laXacNhanNhapKho
            ? "Xác nhận nhập kho"
            : "Hủy phiếu"
        }
        dangXuLy={
          maPhieuNhapDangXuLy !== null
        }
        onXacNhan={() =>
          void xacNhanThaoTac()
        }
        onHuy={
          dongXacNhanThaoTac
        }
      />

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
        onSuccess={
          xuLyTaoThanhCong
        }
        onThongBao={
          thongBao.hienThongBao
        }
      />

      <PhieuNhapChiTietModal
        isOpen={hienChiTiet}
        phieuNhap={
          phieuNhapChiTiet
        }
        loading={
          dangTaiChiTiet
        }
        loi={loiChiTiet}
        dangXuLy={
          dangXuLyPhieuDangXem
        }
        onClose={dongChiTiet}
        onXacNhan={
          moXacNhanNhapKho
        }
        onHuy={
          moXacNhanHuyPhieu
        }
      />

      <KhungDanhSachQuanLy
        thongBaoLoi={
          loi ?? undefined
        }
        thanhCongCu={
          <div className="ql-filter-grid">
            <div className="ql-filter-search">
              <input
                type="text"
                className="ql-filter-control"
                value={tuKhoa}
                onChange={(event) =>
                  doiTuKhoa(
                    event.target.value,
                  )
                }
                placeholder="Tìm theo mã phiếu, nhà cung cấp, nhân viên..."
              />
            </div>

            <select
              className="ql-filter-control"
              value={trangThai}
              onChange={(event) =>
                doiTrangThai(
                  event.target
                    .value as
                    | TrangThaiPhieuNhap
                    | "",
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
            totalElements={
              totalElements
            }
            totalPages={
              totalPages
            }
            first={first}
            last={last}
            tenDonVi="phiếu nhập"
            onDoiTrang={doiTrang}
            onDoiKichThuoc={
              doiKichThuoc
            }
          />
        }
      >
        {!loi && (
          <PhieuNhapTable
            danhSachPhieuNhap={
              danhSachPhieuNhap
            }
            loading={loading}
            onXemChiTiet={
              moChiTiet
            }
          />
        )}
      </KhungDanhSachQuanLy>
    </div>
  );
}

export default QuanLyPhieuNhapPage;