import { useCallback, useEffect, useState } from "react";

import ThongBaoHeThong from "../../../../shared/components/thong-bao/ThongBaoHeThong";
import { useThongBaoHeThong } from "../../../../shared/hooks/useThongBaoHeThong";

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

import type { DanhMucSanPhamOption, NhaSanXuatOption } from "../types/SanPham";

import AdminXacNhan from "../../shared/components/xac-nhan/AdminXacNhan";
import KhungDanhSachQuanLy from "../../shared/components/quan-ly/KhungDanhSachQuanLy";
import NutThaoTacChinh from "../../shared/components/quan-ly/NutThaoTacChinh";
import PhanTrangQuanLy from "../../shared/components/quan-ly/PhanTrangQuanLy";
import TieuDeTrangQuanLy from "../../shared/components/quan-ly/TieuDeTrangQuanLy";

import "../../shared/styles/quan-ly/QuanLyCommon.css";

function QuanLySanPhamPage() {
  const thongBao = useThongBaoHeThong();

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
    maSanPhamChoAn,
    maSanPhamDangXuLy,
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
    dongXacNhanAnSanPham,
    xacNhanAnSanPham,
    hienSanPham,
  } = useDanhSachSanPham({
    onThongBao: thongBao.hienThongBao,
  });

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

      thongBao.hienThongBao(
        "Không thể tải dữ liệu bộ lọc sản phẩm.",
        "LOI",
        "Không thể tải dữ liệu",
      );
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
  } = useChiTietSanPham({
    onThongBao: thongBao.hienThongBao,
  });

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
    maDonViSanPhamChoAn,
    maDonViSanPhamDangXuLy,
    moFormThemDonVi,
    moFormSuaDonVi,
    dongFormDonVi,
    xuLyLuuDonViThanhCong,
    anDonViSanPham,
    hienDonViSanPham,
    dongXacNhanAnDonViSanPham,
    xacNhanAnDonViSanPham,
  } = useDonViSanPham({
    sanPhamChiTiet,
    napLaiChiTietSanPham,
    onThongBao: thongBao.hienThongBao,
  });

  const {
    hienFormQuyDoi,
    quyDoiCanSua,
    maQuyDoiChoAn,
    maQuyDoiDangXuLy,
    moFormThemQuyDoi,
    moFormSuaQuyDoi,
    dongFormQuyDoi,
    xuLyLuuQuyDoiThanhCong,
    anQuyDoiDonVi,
    hienQuyDoiDonVi,
    dongXacNhanAnQuyDoiDonVi,
    xacNhanAnQuyDoiDonVi,
  } = useQuyDoiDonVi({
    sanPhamChiTiet,
    napLaiChiTietSanPham,
    onThongBao: thongBao.hienThongBao,
  });

  const dongChiTietSanPham = () => {
    dongChiTietSanPhamCoBan();
    dongFormDonVi();
    dongFormQuyDoi();
  };

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
        dangHien={maSanPhamChoAn !== null}
        tieuDe="Xác nhận ẩn sản phẩm"
        noiDung={
          maSanPhamChoAn !== null
            ? `Bạn có chắc muốn ẩn sản phẩm #${maSanPhamChoAn} không?`
            : ""
        }
        nhanXacNhan="Ẩn sản phẩm"
        dangXuLy={maSanPhamDangXuLy === maSanPhamChoAn}
        onXacNhan={() => void xacNhanAnSanPham()}
        onHuy={dongXacNhanAnSanPham}
      />

      <AdminXacNhan
        dangHien={maDonViSanPhamChoAn !== null}
        tieuDe="Xác nhận ẩn đơn vị sản phẩm"
        noiDung={
          maDonViSanPhamChoAn !== null
            ? `Bạn có chắc muốn ẩn đơn vị sản phẩm #${maDonViSanPhamChoAn} không?`
            : ""
        }
        nhanXacNhan="Ẩn đơn vị"
        dangXuLy={maDonViSanPhamDangXuLy === maDonViSanPhamChoAn}
        onXacNhan={() => void xacNhanAnDonViSanPham()}
        onHuy={dongXacNhanAnDonViSanPham}
      />

      <AdminXacNhan
        dangHien={maQuyDoiChoAn !== null}
        tieuDe="Xác nhận ẩn quy đổi đơn vị"
        noiDung={
          maQuyDoiChoAn !== null
            ? `Bạn có chắc muốn ẩn quy đổi đơn vị #${maQuyDoiChoAn} không?`
            : ""
        }
        nhanXacNhan="Ẩn quy đổi"
        dangXuLy={maQuyDoiDangXuLy === maQuyDoiChoAn}
        onXacNhan={() => void xacNhanAnQuyDoiDonVi()}
        onHuy={dongXacNhanAnQuyDoiDonVi}
      />

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
            onThongBao={thongBao.hienThongBao}
          />

          <QuyDoiDonViFormModal
            isOpen={hienFormQuyDoi}
            maSanPham={sanPhamChiTiet.maSanPham}
            danhSachDonViSanPham={sanPhamChiTiet.danhSachDonViSanPham || []}
            quyDoiCanSua={quyDoiCanSua}
            onClose={dongFormQuyDoi}
            onSuccess={xuLyLuuQuyDoiThanhCong}
            onThongBao={thongBao.hienThongBao}
          />
        </>
      )}
    </div>
  );
}

export default QuanLySanPhamPage;
