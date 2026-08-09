import { useCallback, useEffect, useState } from "react";
import {
  anSanPham as anSanPhamApi,
  hienSanPham as hienSanPhamApi,
  layDanhSachSanPhamPhanTrang,
} from "../api/sanPhamApi";
import type { SanPham } from "../types/SanPham";

function useDanhSachSanPham() {
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
        error
      );
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
      await anSanPhamApi(maSanPham);
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
      await hienSanPhamApi(maSanPham);
      await layDanhSachSanPham();
    } catch (error) {
      console.error("Lỗi khi hiện sản phẩm:", error);
      alert("Hiện sản phẩm thất bại");
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
  };  
}

export default useDanhSachSanPham;
