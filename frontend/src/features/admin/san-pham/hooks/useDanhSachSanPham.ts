import { useCallback, useEffect, useRef, useState } from "react";

import type { LoaiThongBao } from "../../../../shared/components/thong-bao/ThongBaoHeThong";

import {
  anSanPham as anSanPhamApi,
  hienSanPham as hienSanPhamApi,
  layDanhSachSanPhamPhanTrang,
} from "../api/sanPhamApi";

import type { SanPham } from "../types/SanPham";

type HienThongBao = (
  noiDung: string,
  loai?: LoaiThongBao,
  tieuDe?: string,
) => void;

type UseDanhSachSanPhamProps = {
  onThongBao: HienThongBao;
};

function useDanhSachSanPham({
  onThongBao,
}: UseDanhSachSanPhamProps) {
  const onThongBaoRef = useRef(onThongBao);

  useEffect(() => {
    onThongBaoRef.current = onThongBao;
  }, [onThongBao]);

  const [danhSachSanPham, setDanhSachSanPham] =
    useState<SanPham[]>([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);

  const [keywordInput, setKeywordInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const [laThuocKeDonFilter, setLaThuocKeDonFilter] =
    useState("");

  const [
    trangThaiSanPhamFilter,
    setTrangThaiSanPhamFilter,
  ] = useState("");

  const [maDanhMucFilter, setMaDanhMucFilter] =
    useState("");

  const [maNhaSanXuatFilter, setMaNhaSanXuatFilter] =
    useState("");

  const [
    maSanPhamChoAn,
    setMaSanPhamChoAn,
  ] = useState<number | null>(null);

  const [
    maSanPhamDangXuLy,
    setMaSanPhamDangXuLy,
  ] = useState<number | null>(null);

  const layDanhSachSanPham = useCallback(async () => {
    try {
      setLoading(true);

      const response = await layDanhSachSanPhamPhanTrang({
        page,
        size,

        keyword: keyword || undefined,

        laThuocKeDon:
          laThuocKeDonFilter === ""
            ? undefined
            : laThuocKeDonFilter === "true",

        trangThaiSanPham:
          trangThaiSanPhamFilter === ""
            ? undefined
            : trangThaiSanPhamFilter === "true",

        maDanhMuc:
          maDanhMucFilter === ""
            ? undefined
            : Number(maDanhMucFilter),

        maNhaSanXuat:
          maNhaSanXuatFilter === ""
            ? undefined
            : Number(maNhaSanXuatFilter),
      });

      setDanhSachSanPham(response.data.content);
      setTotalElements(response.data.totalElements);
      setTotalPages(response.data.totalPages);
      setFirst(response.data.first);
      setLast(response.data.last);
    } catch (error) {
      console.error(
        "Lỗi khi lấy danh sách sản phẩm:",
        error,
      );

      onThongBaoRef.current(
        "Không thể tải danh sách sản phẩm.",
        "LOI",
        "Không thể tải dữ liệu",
      );
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

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void layDanhSachSanPham();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [layDanhSachSanPham]);

  const timKiemSanPham = () => {
    setPage(0);
    setKeyword(keywordInput.trim());
  };

  const xoaTatCaBoLoc = () => {
    setKeywordInput("");
    setKeyword("");
    setLaThuocKeDonFilter("");
    setTrangThaiSanPhamFilter("");
    setMaDanhMucFilter("");
    setMaNhaSanXuatFilter("");
    setPage(0);
  };

  const anSanPham = (maSanPham: number) => {
    setMaSanPhamChoAn(maSanPham);
  };

  const dongXacNhanAnSanPham = () => {
    if (maSanPhamDangXuLy !== null) {
      return;
    }

    setMaSanPhamChoAn(null);
  };

  const xacNhanAnSanPham = async () => {
    if (maSanPhamChoAn === null) {
      return;
    }

    const maSanPham = maSanPhamChoAn;

    try {
      setMaSanPhamDangXuLy(maSanPham);

      await anSanPhamApi(maSanPham);
      await layDanhSachSanPham();

      setMaSanPhamChoAn(null);

      onThongBaoRef.current(
        "Ẩn sản phẩm thành công.",
        "THANH_CONG",
        "Thành công",
      );
    } catch (error) {
      console.error(
        "Lỗi khi ẩn sản phẩm:",
        error,
      );

      onThongBaoRef.current(
        "Ẩn sản phẩm thất bại.",
        "LOI",
        "Không thể ẩn sản phẩm",
      );
    } finally {
      setMaSanPhamDangXuLy(null);
    }
  };

  const hienSanPham = async (
    maSanPham: number,
  ) => {
    try {
      setMaSanPhamDangXuLy(maSanPham);

      await hienSanPhamApi(maSanPham);
      await layDanhSachSanPham();

      onThongBaoRef.current(
        "Hiện sản phẩm thành công.",
        "THANH_CONG",
        "Thành công",
      );
    } catch (error) {
      console.error(
        "Lỗi khi hiện sản phẩm:",
        error,
      );

      onThongBaoRef.current(
        "Hiện sản phẩm thất bại.",
        "LOI",
        "Không thể hiện sản phẩm",
      );
    } finally {
      setMaSanPhamDangXuLy(null);
    }
  };

  return {
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
  };
}

export default useDanhSachSanPham;
