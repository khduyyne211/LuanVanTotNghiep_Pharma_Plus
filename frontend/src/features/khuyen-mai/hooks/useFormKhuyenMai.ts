import {
  useCallback,
  useState,
} from "react";

import type { KhuyenMai } from "../types/KhuyenMai";

type UseFormKhuyenMaiProps = {
  onTaiLaiDanhSach: () => void;
};

function useFormKhuyenMai({
  onTaiLaiDanhSach,
}: UseFormKhuyenMaiProps) {
  const [hienForm, setHienForm] = useState(false);

  const [khuyenMaiCanSua, setKhuyenMaiCanSua] =
    useState<KhuyenMai | null>(null);

  const moFormThem = useCallback(() => {
    setKhuyenMaiCanSua(null);
    setHienForm(true);
  }, []);

  const moFormSua = useCallback(
    (khuyenMai: KhuyenMai) => {
      setKhuyenMaiCanSua(khuyenMai);
      setHienForm(true);
    },
    []
  );

  const dongForm = useCallback(() => {
    setHienForm(false);
    setKhuyenMaiCanSua(null);
  }, []);

  const xuLyLuuThanhCong = useCallback(() => {
    onTaiLaiDanhSach();
    dongForm();
  }, [dongForm, onTaiLaiDanhSach]);

  return {
    hienForm,
    khuyenMaiCanSua,
    moFormThem,
    moFormSua,
    dongForm,
    xuLyLuuThanhCong,
  };
}

export default useFormKhuyenMai;