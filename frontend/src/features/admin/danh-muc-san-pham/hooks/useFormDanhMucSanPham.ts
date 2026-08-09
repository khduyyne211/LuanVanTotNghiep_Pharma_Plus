import {
  useCallback,
  useState,
} from "react";

import type { DanhMucSanPham } from "../types/DanhMucSanPham";

type UseFormDanhMucSanPhamProps = {
  onTaiLaiDanhSach: () => void;
};

function useFormDanhMucSanPham({
  onTaiLaiDanhSach,
}: UseFormDanhMucSanPhamProps) {
  const [hienForm, setHienForm] = useState(false);

  const [danhMucCanSua, setDanhMucCanSua] =
    useState<DanhMucSanPham | null>(null);

  const moFormThem = useCallback(() => {
    setDanhMucCanSua(null);
    setHienForm(true);
  }, []);

  const moFormSua = useCallback(
    (danhMuc: DanhMucSanPham) => {
      setDanhMucCanSua(danhMuc);
      setHienForm(true);
    },
    []
  );

  const dongForm = useCallback(() => {
    setHienForm(false);
    setDanhMucCanSua(null);
  }, []);

  const xuLyLuuThanhCong = useCallback(() => {
    onTaiLaiDanhSach();
    dongForm();
  }, [dongForm, onTaiLaiDanhSach]);

  return {
    hienForm,
    danhMucCanSua,
    moFormThem,
    moFormSua,
    dongForm,
    xuLyLuuThanhCong,
  };
}

export default useFormDanhMucSanPham;