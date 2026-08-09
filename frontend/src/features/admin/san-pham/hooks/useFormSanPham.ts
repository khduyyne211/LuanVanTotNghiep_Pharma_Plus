import { useState } from "react";
import type { SanPham } from "../types/SanPham";

type UseFormSanPhamProps = {
  layDanhSachSanPham: () => Promise<void>;
  napLaiChiTietSanPham: (
    maSanPham: number
  ) => Promise<SanPham>;
};

function useFormSanPham({
  layDanhSachSanPham,
  napLaiChiTietSanPham,
}: UseFormSanPhamProps) {
  const [hienForm, setHienForm] = useState(false);
  const [sanPhamCanSua, setSanPhamCanSua] =
    useState<SanPham | null>(null);

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

  return {
    hienForm,
    sanPhamCanSua,

    moFormThem,
    moFormSua,
    dongForm,
    xuLyLuuThanhCong,
  };
}

export default useFormSanPham;