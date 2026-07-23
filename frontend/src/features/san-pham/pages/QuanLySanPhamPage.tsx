import { useCallback, useEffect, useState } from "react";
import {
  anDonViSanPham as anDonViSanPhamAPI,
  anQuyDoiDonVi as anQuyDoiDonViAPI,
  anSanPham as anSanPhamAPI,
  hienDonViSanPham as hienDonViSanPhamAPI,
  hienQuyDoiDonVi as hienQuyDoiDonViAPI,
  hienSanPham as hienSanPhamAPI,
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
import type {
  DanhMucSanPhamOption,
  DonViSanPham,
  NhaSanXuatOption,
  QuyDoiDonVi,
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

  const [hienFormDonVi, setHienFormDonVi] =
    useState(false);
  const [donViCanSua, setDonViCanSua] =
    useState<DonViSanPham | null>(null);

  const [hienFormQuyDoi, setHienFormQuyDoi] =
    useState(false);
  const [quyDoiCanSua, setQuyDoiCanSua] =
    useState<QuyDoiDonVi | null>(null);

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

    setHienFormDonVi(false);
    setDonViCanSua(null);

    setHienFormQuyDoi(false);
    setQuyDoiCanSua(null);
  };

  const moFormThemDonVi = () => {
    if (!sanPhamChiTiet) {
      return;
    }

    setDonViCanSua(null);
    setHienFormDonVi(true);
  };

  const moFormSuaDonVi = (
    donVi: DonViSanPham
  ) => {
    setDonViCanSua(donVi);
    setHienFormDonVi(true);
  };

  const dongFormDonVi = () => {
    setHienFormDonVi(false);
    setDonViCanSua(null);
  };

  const xuLyLuuDonViThanhCong = async () => {
    if (!sanPhamChiTiet) {
      return;
    }

    await napLaiChiTietSanPham(
      sanPhamChiTiet.maSanPham
    );
  };

  const anDonViSanPham = async (
    maDonViSanPham: number
  ) => {
    if (!sanPhamChiTiet) {
      return;
    }

    const dongY = confirm(
      "Bạn có chắc muốn ẩn đơn vị sản phẩm này không?"
    );

    if (!dongY) {
      return;
    }

    try {
      await anDonViSanPhamAPI(maDonViSanPham);

      await napLaiChiTietSanPham(
        sanPhamChiTiet.maSanPham
      );
    } catch (error) {
      console.error(
        "Lỗi khi ẩn đơn vị sản phẩm:",
        error
      );
      alert("Ẩn đơn vị sản phẩm thất bại");
    }
  };

  const hienDonViSanPham = async (
    maDonViSanPham: number
  ) => {
    if (!sanPhamChiTiet) {
      return;
    }

    try {
      await hienDonViSanPhamAPI(maDonViSanPham);

      await napLaiChiTietSanPham(
        sanPhamChiTiet.maSanPham
      );
    } catch (error) {
      console.error(
        "Lỗi khi hiện đơn vị sản phẩm:",
        error
      );
      alert("Hiện đơn vị sản phẩm thất bại");
    }
  };

  const moFormThemQuyDoi = () => {
    if (!sanPhamChiTiet) {
      return;
    }

    setQuyDoiCanSua(null);
    setHienFormQuyDoi(true);
  };

  const moFormSuaQuyDoi = (
    quyDoi: QuyDoiDonVi
  ) => {
    setQuyDoiCanSua(quyDoi);
    setHienFormQuyDoi(true);
  };

  const dongFormQuyDoi = () => {
    setHienFormQuyDoi(false);
    setQuyDoiCanSua(null);
  };

  const xuLyLuuQuyDoiThanhCong = async () => {
    if (!sanPhamChiTiet) {
      return;
    }

    await napLaiChiTietSanPham(
      sanPhamChiTiet.maSanPham
    );
  };

  const anQuyDoiDonVi = async (
    maQuyDoi: number
  ) => {
    if (!sanPhamChiTiet) {
      return;
    }

    const dongY = confirm(
      "Bạn có chắc muốn ẩn quy đổi đơn vị này không?"
    );

    if (!dongY) {
      return;
    }

    try {
      await anQuyDoiDonViAPI(maQuyDoi);

      await napLaiChiTietSanPham(
        sanPhamChiTiet.maSanPham
      );
    } catch (error) {
      console.error(
        "Lỗi khi ẩn quy đổi đơn vị:",
        error
      );
      alert("Ẩn quy đổi đơn vị thất bại");
    }
  };

  const hienQuyDoiDonVi = async (
    maQuyDoi: number
  ) => {
    if (!sanPhamChiTiet) {
      return;
    }

    try {
      await hienQuyDoiDonViAPI(maQuyDoi);

      await napLaiChiTietSanPham(
        sanPhamChiTiet.maSanPham
      );
    } catch (error) {
      console.error(
        "Lỗi khi hiện quy đổi đơn vị:",
        error
      );
      alert("Hiện quy đổi đơn vị thất bại");
    }
  };

  const anSanPham = async (
    maSanPham: number
  ) => {
    const dongY = confirm(
      "Bạn có chắc muốn ẩn sản phẩm này không?"
    );

    if (!dongY) {
      return;
    }

    try {
      await anSanPhamAPI(maSanPham);
      await layDanhSachSanPham();
    } catch (error) {
      console.error("Lỗi khi ẩn sản phẩm:", error);
      alert("Ẩn sản phẩm thất bại");
    }
  };

  const hienSanPham = async (
    maSanPham: number
  ) => {
    try {
      await hienSanPhamAPI(maSanPham);
      await layDanhSachSanPham();
    } catch (error) {
      console.error("Lỗi khi hiện sản phẩm:", error);
      alert("Hiện sản phẩm thất bại");
    }
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
