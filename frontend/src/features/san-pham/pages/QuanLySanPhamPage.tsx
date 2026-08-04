import { useCallback, useEffect, useState } from "react";

import {
  layDanhSachDanhMucSanPham,
  layDanhSachNhaSanXuat,
} from "../api/sanPhamApi";
import DonViSanPhamFormModal from "../components/DonViSanPhamFormModal";
import QuyDoiDonViFormModal from "../components/QuyDoiDonViFormModal";
import SanPhamBoLoc from "../components/SanPhamBoLoc";
import SanPhamChiTietModal from "../components/SanPhamChiTietModal";
import SanPhamFormModal from "../components/SanPhamFormModal";
import SanPhamTable from "../components/SanPhamTable";
import useChiTietSanPham from "../hooks/useChiTietSanPham";
import useDanhSachSanPham from "../hooks/useDanhSachSanPham";
import useDonViSanPham from "../hooks/useDonViSanPham";
import useFormSanPham from "../hooks/useFormSanPham";
import useQuyDoiDonVi from "../hooks/useQuyDoiDonVi";
import type {
  DanhMucSanPhamOption,
  NhaSanXuatOption,
} from "../types/SanPham";

import KhungDanhSachQuanLy from "../../../shared/components/quan-ly/KhungDanhSachQuanLy";
import NutThaoTacChinh from "../../../shared/components/quan-ly/NutThaoTacChinh";
import PhanTrangQuanLy from "../../../shared/components/quan-ly/PhanTrangQuanLy";
import TieuDeTrangQuanLy from "../../../shared/components/quan-ly/TieuDeTrangQuanLy";

import "../../../shared/styles/quan-ly/QuanLyCommon.css";

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

  const [danhSachNhaSanXuat, setDanhSachNhaSanXuat] = useState<
    NhaSanXuatOption[]
  >([]);

  const layDuLieuBoLoc = useCallback(async () => {
    try {
      const [danhMucResponse, nhaSanXuatResponse] = await Promise.all([
        layDanhSachDanhMucSanPham(),
        layDanhSachNhaSanXuat(),
      ]);

      setDanhSachDanhMuc(danhMucResponse.data);
      setDanhSachNhaSanXuat(nhaSanXuatResponse.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu bộ lọc:", error);
      alert("Không thể tải dữ liệu bộ lọc sản phẩm");
    }
  }, []);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void layDuLieuBoLoc();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [layDuLieuBoLoc]);

  const {
    sanPhamChiTiet,
    dangTaiChiTiet,
    napLaiChiTietSanPham,
    xemChiTietSanPham,
    dongChiTietSanPhamCoBan,
  } = useChiTietSanPham();

  const {
    hienForm,
    sanPhamCanSua,
    moFormThem,
    moFormSua,
    dongForm,
    xuLyLuuThanhCong,
  } = useFormSanPham({
    layDanhSachSanPham,
    napLaiChiTietSanPham,
  });

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

  const dongChiTietSanPham = () => {
    dongChiTietSanPhamCoBan();
    dongFormDonVi();
    dongFormQuyDoi();
  };

  return (
    <div className="ql-page">
      <TieuDeTrangQuanLy
        tieuDe="Quản lý sản phẩm"
        moTa="Theo dõi thông tin sản phẩm, trạng thái kinh doanh, đơn vị bán và quy đổi đơn vị"
      >
        <NutThaoTacChinh
          nhan="Thêm sản phẩm"
          icon="bi bi-plus-circle"
          onClick={moFormThem}
        />
      </TieuDeTrangQuanLy>

      <KhungDanhSachQuanLy
        thanhCongCu={
          <SanPhamBoLoc
            keyWordInput={keywordInput}
            laThuocKeDonFilter={laThuocKeDonFilter}
            trangThaiSanPhamFilter={trangThaiSanPhamFilter}
            maDanhMucFilter={maDanhMucFilter}
            maNhaSanXuatFilter={maNhaSanXuatFilter}
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
          />
        }
        phanTrang={
          <PhanTrangQuanLy
            page={page}
            size={size}
            totalElements={totalElements}
            totalPages={totalPages}
            first={first}
            last={last}
            tenDonVi="sản phẩm"
            danhSachKichThuoc={[5, 10, 20, 50]}
            onDoiTrang={setPage}
            onDoiKichThuoc={(giaTri) => {
              setSize(giaTri);
              setPage(0);
            }}
          />
        }
      >
        <SanPhamTable
          danhSachSanPham={danhSachSanPham}
          loading={loading}
          onSua={moFormSua}
          onXemChiTiet={xemChiTietSanPham}
          onAn={anSanPham}
          onHien={hienSanPham}
        />
      </KhungDanhSachQuanLy>

      <SanPhamFormModal
        isOpen={hienForm}
        sanPhamCanSua={sanPhamCanSua}
        onClose={dongForm}
        onSuccess={xuLyLuuThanhCong}
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
              sanPhamChiTiet.danhSachDonViSanPham || []
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