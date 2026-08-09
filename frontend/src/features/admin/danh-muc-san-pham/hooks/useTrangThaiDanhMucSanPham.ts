import { useState } from "react";
import { isAxiosError } from "axios";

import {
  anDanhMucSanPham,
  hienDanhMucSanPham,
} from "../api/danhMucSanPhamApi";
import type { DanhMucSanPham } from "../types/DanhMucSanPham";

type UseTrangThaiDanhMucSanPhamProps = {
  onTaiLaiDanhSach: () => void;
};

type ApiErrorResponse = {
  message?: string;
};

function useTrangThaiDanhMucSanPham({
  onTaiLaiDanhSach,
}: UseTrangThaiDanhMucSanPhamProps) {
  const [maDanhMucDangXuLy, setMaDanhMucDangXuLy] =
    useState<number | null>(null);

  const xuLyDoiTrangThai = async (
    danhMuc: DanhMucSanPham
  ) => {
    const hanhDong = danhMuc.trangThaiHienThi
      ? "ẩn"
      : "hiển thị";

    const daXacNhan = window.confirm(
      `Bạn có chắc muốn ${hanhDong} danh mục "${danhMuc.tenDanhMuc}"?`
    );

    if (!daXacNhan) {
      return;
    }

    try {
      setMaDanhMucDangXuLy(danhMuc.maDanhMuc);

      if (danhMuc.trangThaiHienThi) {
        await anDanhMucSanPham(danhMuc.maDanhMuc);
      } else {
        await hienDanhMucSanPham(danhMuc.maDanhMuc);
      }

      onTaiLaiDanhSach();
    } catch (error) {
      console.error(
        "Không thể cập nhật trạng thái danh mục:",
        error
      );

      const message = isAxiosError<ApiErrorResponse>(error)
        ? error.response?.data?.message
        : null;

      alert(
        message ??
          "Không thể cập nhật trạng thái danh mục sản phẩm."
      );
    } finally {
      setMaDanhMucDangXuLy(null);
    }
  };

  return {
    maDanhMucDangXuLy,
    xuLyDoiTrangThai,
  };
}

export default useTrangThaiDanhMucSanPham;