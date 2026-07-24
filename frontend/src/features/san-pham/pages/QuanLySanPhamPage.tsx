import { useCallback, useEffect, useState } from "react";
import {
  layChiTietSanPhamDayDu,
  layDanhSachDanhMucSanPham,
  layDanhSachNhaSanXuat,
} from "../api/sanPhamApi";
import DonViSanPhamFormModal from "../components/DonViSanPhamFormModal";
import QuyDoiDonViFormModal from "../components/QuyDoiDonViFormModal";
import SanPhamBoLoc from "../components/SanPhamBoLoc";
import SanPhamChiTietModal from "../components/SanPhamChiTietModal";
import SanPhamFormModal from "../components/SanPhamFormModal";
import SanPhamTable from "../components/SanPhamTable";
import useDanhSachSanPham from "../hooks/useDanhSachSanPham";
import useDonViSanPham from "../hooks/useDonViSanPham";
import useQuyDoiDonVi from "../hooks/useQuyDoiDonVi";
import type {
  DanhMucSanPhamOption,
  NhaSanXuatOption,
  SanPham,
} from "../types/SanPham";

function QuanLySanPhamPage() {
  const {
    danhSachSanPham,
    loading,

    page,
    size,
    totalElements,
    totalPages,
    first,
    last,

    keywordInput,
    laThuocKeDonFilter,
    trangThaiSanPhamFilter,
    maDanhMucFilter,
    maNhaSanXuatFilter,

    setPage,
    setSize,
    setKeywordInput,
    setLaThuocKeDonFilter,
    setTrangThaiSanPhamFilter,
    setMaDanhMucFilter,
    setMaNhaSanXuatFilter,

    layDanhSachSanPham,
    timKiemSanPham,
    xoaTatCaBoLoc,
    anSanPham,
    hienSanPham,
  } = useDanhSachSanPham();

  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState<
    DanhMucSanPhamOption[]
  >([]);
  const [danhSachNhaSanXuat, setDanhSachNhaSanXuat] =
    useState<NhaSanXuatOption[]>([]);

  const [sanPhamChiTiet, setSanPhamChiTiet] =
    useState<SanPham | null>(null);
  const [dangTaiChiTiet, setDangTaiChiTiet] =
    useState(false);

  const [hienForm, setHienForm] = useState(false);
  const [sanPhamCanSua, setSanPhamCanSua] =
    useState<SanPham | null>(null);
  const layDuLieuBoLoc = useCallback(async () => {
    try {
      const [danhMucResponse, nhaSanXuatResponse] =
        await Promise.all([
          layDanhSachDanhMucSanPham(),
          layDanhSachNhaSanXuat(),
        ]);

      setDanhSachDanhMuc(danhMucResponse.data);
      setDanhSachNhaSanXuat(nhaSanXuatResponse.data);
    } catch (error) {
      console.error(
        "Lỗi khi tải dữ liệu bộ lọc:",
        error
      );
      alert("Không thể tải dữ liệu bộ lọc sản phẩm");
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void layDuLieuBoLoc();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [layDuLieuBoLoc]);

  const moFormThem = () => {
    setSanPhamCanSua(null);
    setHienForm(true);
  };

  const moFormSua = (sanPham: SanPham) => {
    setSanPhamCanSua(sanPham);
    setHienForm(true);
  };

  const dongForm = () => {
    setHienForm(false);
    setSanPhamCanSua(null);
  };

  const napLaiChiTietSanPham = async (
    maSanPham: number
  ): Promise<SanPham> => {
    const response =
      await layChiTietSanPhamDayDu(maSanPham);

    setSanPhamChiTiet(response.data);
    return response.data;
  };
  const {
    hienFormDonVi,
    donViCanSua,

    moFormThemDonVi,
    moFormSuaDonVi,
    dongFormDonVi,
    xuLyLuuDonViThanhCong,
    anDonViSanPham,
    hienDonViSanPham,
  } = useDonViSanPham({
    sanPhamChiTiet,
    napLaiChiTietSanPham,
  });
  const {
    hienFormQuyDoi,
    quyDoiCanSua,

    moFormThemQuyDoi,
    moFormSuaQuyDoi,
    dongFormQuyDoi,
    xuLyLuuQuyDoiThanhCong,
    anQuyDoiDonVi,
    hienQuyDoiDonVi,
  } = useQuyDoiDonVi({
    sanPhamChiTiet,
    napLaiChiTietSanPham,
  });
  const xuLyLuuThanhCong = async (
    sanPhamDaLuu: SanPham,
    laThemMoi: boolean
  ) => {
    await layDanhSachSanPham();

    if (laThemMoi) {
      await napLaiChiTietSanPham(
        sanPhamDaLuu.maSanPham
      );
    }
  };

  const xemChiTietSanPham = async (
    maSanPham: number
  ) => {
    try {
      setDangTaiChiTiet(true);
      setSanPhamChiTiet(null);

      await napLaiChiTietSanPham(maSanPham);
    } catch (error) {
      console.error(
        "Lỗi khi lấy chi tiết sản phẩm:",
        error
      );
      alert("Không thể tải chi tiết sản phẩm");
    } finally {
      setDangTaiChiTiet(false);
    }
  };

  const dongChiTietSanPham = () => {
    setSanPhamChiTiet(null);

    dongFormDonVi();
    dongFormQuyDoi();
  };
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Quản lý sản phẩm</h1>
          <p>
            Quản trị viên theo dõi thông tin sản phẩm,
            trạng thái kinh doanh, đơn vị bán và quy đổi
            đơn vị.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={moFormThem}
        >
          <i className="bi bi-plus-circle" />
          Thêm sản phẩm
        </button>
      </div>

      <SanPhamFormModal
        isOpen={hienForm}
        sanPhamCanSua={sanPhamCanSua}
        onClose={dongForm}
        onSuccess={xuLyLuuThanhCong}
      />

      <SanPhamBoLoc
        keyWordInput={keywordInput}
        laThuocKeDonFilter={laThuocKeDonFilter}
        trangThaiSanPhamFilter={
          trangThaiSanPhamFilter
        }
        maDanhMucFilter={maDanhMucFilter}
        maNhaSanXuatFilter={
          maNhaSanXuatFilter
        }
        size={size}
        dsDanhmuc={danhSachDanhMuc}
        dsNSX={danhSachNhaSanXuat}
        onKeywordInputChange={setKeywordInput}
        onTimKiem={timKiemSanPham}
        onXoaBoLoc={xoaTatCaBoLoc}
        onLaThuocKeDonChange={(giaTri) => {
          setLaThuocKeDonFilter(giaTri);
          setPage(0);
        }}
        onTrangThaiSanPhamChange={(giaTri) => {
          setTrangThaiSanPhamFilter(giaTri);
          setPage(0);
        }}
        onMaDanhMucChange={(giaTri) => {
          setMaDanhMucFilter(giaTri);
          setPage(0);
        }}
        onMaNhaSanXuatChange={(giaTri) => {
          setMaNhaSanXuatFilter(giaTri);
          setPage(0);
        }}
        onSizeChange={(giaTri) => {
          setSize(giaTri);
          setPage(0);
        }}
      />

      <SanPhamTable
        danhSachSanPham={danhSachSanPham}
        loading={loading}
        page={page}
        totalElements={totalElements}
        totalPages={totalPages}
        first={first}
        last={last}
        onSua={moFormSua}
        onXemChiTiet={xemChiTietSanPham}
        onAn={anSanPham}
        onHien={hienSanPham}
        onPageChange={setPage}
      />

      <SanPhamChiTietModal
        sanPhamChiTiet={sanPhamChiTiet}
        dangTaiChiTiet={dangTaiChiTiet}
        onClose={dongChiTietSanPham}
        onThemDonVi={moFormThemDonVi}
        onSuaDonVi={moFormSuaDonVi}
        onAnDonVi={anDonViSanPham}
        onHienDonVi={hienDonViSanPham}
        onThemQuyDoi={moFormThemQuyDoi}
        onSuaQuyDoi={moFormSuaQuyDoi}
        onAnQuyDoi={anQuyDoiDonVi}
        onHienQuyDoi={hienQuyDoiDonVi}
      />

      {sanPhamChiTiet && (
        <>
          <DonViSanPhamFormModal
            isOpen={hienFormDonVi}
            maSanPham={sanPhamChiTiet.maSanPham}
            donViCanSua={donViCanSua}
            onClose={dongFormDonVi}
            onSuccess={xuLyLuuDonViThanhCong}
          />

          <QuyDoiDonViFormModal
            isOpen={hienFormQuyDoi}
            maSanPham={sanPhamChiTiet.maSanPham}
            danhSachDonViSanPham={
              sanPhamChiTiet.danhSachDonViSanPham ||
              []
            }
            quyDoiCanSua={quyDoiCanSua}
            onClose={dongFormQuyDoi}
            onSuccess={xuLyLuuQuyDoiThanhCong}
          />
        </>
      )}
    </div>
  );
}

export default QuanLySanPhamPage;
