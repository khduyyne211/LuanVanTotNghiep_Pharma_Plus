import { useCallback, useEffect, useState } from "react";

import axiosClient from "../api/axiosClient";

import type {
  DonViSanPham,
  QuyDoiDonVi,
  SanPham,
} from "../types/SanPham";
import type { PhanTrangResponse } from "../types/PhanTrangResponse";

import SanPhamFormModal from "../components/SanPhamFormModal";
import DonViSanPhamFormModal from "../components/DonViSanPhamFormModal";
import QuyDoiDonViFormModal from "../components/QuyDoiDonViFormModal";

import SanPhamBoLoc from "../features/san-pham/components/SanPhamBoLoc";
import SanPhamTable from "../features/san-pham/components/SanPhamTable";
import SanPhamChiTietModal from "../features/san-pham/components/SanPhamChiTietModal";

type DanhMucSanPham = {
  maDanhMuc: number;
  tenDanhMuc: string;
  trangThaiHienThi: boolean;
};

type NhaSanXuat = {
  maNhaSanXuat: number;
  tenNhaSanXuat: string;
  trangThai: boolean;
};

function QuanLySanPham() {
  /*
   * State danh sách sản phẩm.
   */
  const [danhSachSanPham, setDanhSachSanPham] = useState<SanPham[]>([]);
  const [loading, setLoading] = useState(true);

  /*
   * State phân trang.
   */
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);

  /*
   * State tìm kiếm và bộ lọc.
   */
  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const [laThuocKeDonFilter, setLaThuocKeDonFilter] = useState("");
  const [trangThaiSanPhamFilter, setTrangThaiSanPhamFilter] = useState("");
  const [maDanhMucFilter, setMaDanhMucFilter] = useState("");
  const [maNhaSanXuatFilter, setMaNhaSanXuatFilter] = useState("");

  /*
   * Dữ liệu cho các ô chọn của bộ lọc.
   */
  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState<
    DanhMucSanPham[]
  >([]);

  const [danhSachNhaSanXuat, setDanhSachNhaSanXuat] = useState<
    NhaSanXuat[]
  >([]);

  /*
   * State xem chi tiết sản phẩm.
   */
  const [sanPhamChiTiet, setSanPhamChiTiet] =
    useState<SanPham | null>(null);

  const [dangTaiChiTiet, setDangTaiChiTiet] = useState(false);

  /*
   * State form thêm và sửa sản phẩm.
   */
  const [hienForm, setHienForm] = useState(false);
  const [sanPhamCanSua, setSanPhamCanSua] =
    useState<SanPham | null>(null);

  /*
   * State form đơn vị sản phẩm.
   */
  const [hienFormDonVi, setHienFormDonVi] = useState(false);

  const [donViCanSua, setDonViCanSua] =
    useState<DonViSanPham | null>(null);

  /*
   * State form quy đổi đơn vị.
   */
  const [hienFormQuyDoi, setHienFormQuyDoi] = useState(false);

  const [quyDoiCanSua, setQuyDoiCanSua] =
    useState<QuyDoiDonVi | null>(null);

  /*
   * Lấy danh sách sản phẩm theo phân trang và bộ lọc.
   */
  const layDanhSachSanPham = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axiosClient.get<
        PhanTrangResponse<SanPham>
      >("/san-pham/phan-trang", {
        params: {
          page,
          size,
          keyword: keyword || undefined,
          laThuocKeDon: laThuocKeDonFilter || undefined,
          trangThaiSanPham:
            trangThaiSanPhamFilter || undefined,
          maDanhMuc: maDanhMucFilter || undefined,
          maNhaSanXuat: maNhaSanXuatFilter || undefined,
        },
      });

      setDanhSachSanPham(response.data.content);
      setTotalElements(response.data.totalElements);
      setTotalPages(response.data.totalPages);
      setFirst(response.data.first);
      setLast(response.data.last);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      alert("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [
    page,
    size,
    keyword,
    laThuocKeDonFilter,
    trangThaiSanPhamFilter,
    maDanhMucFilter,
    maNhaSanXuatFilter,
  ]);

  /*
   * Lấy danh mục và nhà sản xuất cho bộ lọc.
   */
  const layDuLieuBoLoc = useCallback(async () => {
    try {
      const [danhMucResponse, nhaSanXuatResponse] =
        await Promise.all([
          axiosClient.get<DanhMucSanPham[]>(
            "/danh-muc-san-pham"
          ),
          axiosClient.get<NhaSanXuat[]>("/nha-san-xuat"),
        ]);

      setDanhSachDanhMuc(danhMucResponse.data);
      setDanhSachNhaSanXuat(nhaSanXuatResponse.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu bộ lọc:", error);
      alert("Không thể tải dữ liệu bộ lọc sản phẩm");
    }
  }, []);

  /*
   * Tải lại sản phẩm khi page, size hoặc bộ lọc thay đổi.
   */
  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void layDanhSachSanPham();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [layDanhSachSanPham]);

  /*
   * Tải dữ liệu danh mục và nhà sản xuất khi trang được mở.
   */
  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void layDuLieuBoLoc();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [layDuLieuBoLoc]);

  /*
   * Xử lý tìm kiếm.
   */
  const timKiemSanPham = () => {
    setPage(0);
    setKeyword(keywordInput.trim());
  };

  /*
   * Xóa toàn bộ bộ lọc.
   */
  const xoaTatCaBoLoc = () => {
    setKeywordInput("");
    setKeyword("");
    setLaThuocKeDonFilter("");
    setTrangThaiSanPhamFilter("");
    setMaDanhMucFilter("");
    setMaNhaSanXuatFilter("");
    setPage(0);
  };

  /*
   * Mở form thêm sản phẩm.
   */
  const moFormThem = () => {
    setSanPhamCanSua(null);
    setHienForm(true);
  };

  /*
   * Mở form sửa sản phẩm.
   */
  const moFormSua = (sanPham: SanPham) => {
    setSanPhamCanSua(sanPham);
    setHienForm(true);
  };

  /*
   * Đóng form sản phẩm.
   */
  const dongForm = () => {
    setHienForm(false);
    setSanPhamCanSua(null);
  };

  /*
   * Tải lại danh sách sau khi lưu sản phẩm.
   */
  const xuLyLuuThanhCong = async () => {
    await layDanhSachSanPham();
  };

  /*
   * Lấy chi tiết đầy đủ của một sản phẩm.
   */
  const xemChiTietSanPham = async (maSanPham: number) => {
    try {
      setDangTaiChiTiet(true);
      setSanPhamChiTiet(null);

      const response = await axiosClient.get<SanPham>(
        `/san-pham/${maSanPham}/chi-tiet-day-du`
      );

      setSanPhamChiTiet(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      alert("Không thể tải chi tiết sản phẩm");
    } finally {
      setDangTaiChiTiet(false);
    }
  };

  /*
   * Đóng modal chi tiết và các form con.
   */
  const dongChiTietSanPham = () => {
    setSanPhamChiTiet(null);

    setHienFormDonVi(false);
    setDonViCanSua(null);

    setHienFormQuyDoi(false);
    setQuyDoiCanSua(null);
  };

  /*
   * Tải lại chi tiết sản phẩm sau khi thay đổi đơn vị hoặc quy đổi.
   */
  const napLaiChiTietSanPham = async (
    maSanPham: number
  ) => {
    const response = await axiosClient.get<SanPham>(
      `/san-pham/${maSanPham}/chi-tiet-day-du`
    );

    setSanPhamChiTiet(response.data);
  };

  /*
   * Các hàm xử lý đơn vị sản phẩm.
   */
  const moFormThemDonVi = () => {
    if (!sanPhamChiTiet) {
      return;
    }

    setDonViCanSua(null);
    setHienFormDonVi(true);
  };

  const moFormSuaDonVi = (donVi: DonViSanPham) => {
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
      await axiosClient.put(
        `/don-vi-san-pham/${maDonViSanPham}/an`
      );

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
      await axiosClient.put(
        `/don-vi-san-pham/${maDonViSanPham}/hien`
      );

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

  /*
   * Các hàm xử lý quy đổi đơn vị.
   */
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
      await axiosClient.put(
        `/quy-doi-don-vi/${maQuyDoi}/an`
      );

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
      await axiosClient.put(
        `/quy-doi-don-vi/${maQuyDoi}/hien`
      );

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

  /*
   * Ẩn sản phẩm.
   */
  const anSanPham = async (maSanPham: number) => {
    const dongY = confirm(
      "Bạn có chắc muốn ẩn sản phẩm này không?"
    );

    if (!dongY) {
      return;
    }

    try {
      await axiosClient.put(
        `/san-pham/${maSanPham}/an`
      );

      await layDanhSachSanPham();
    } catch (error) {
      console.error("Lỗi khi ẩn sản phẩm:", error);
      alert("Ẩn sản phẩm thất bại");
    }
  };

  /*
   * Hiển thị lại sản phẩm.
   */
  const hienSanPham = async (maSanPham: number) => {
    try {
      await axiosClient.put(
        `/san-pham/${maSanPham}/hien`
      );

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
            Dược sĩ theo dõi thông tin sản phẩm, trạng thái
            kinh doanh, đơn vị bán và quy đổi đơn vị.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={moFormThem}
        >
          + Thêm sản phẩm
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
        trangThaiSanPhamFilter={trangThaiSanPhamFilter}
        maDanhMucFilter={maDanhMucFilter}
        maNhaSanXuatFilter={maNhaSanXuatFilter}
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

export default QuanLySanPham;