import { useCallback, useState } from "react";

import type { DonViTinh } from "../types/DonViTinh";

type UseFormDonViTinhProps = {
  onTaiLaiDanhSach: () => void;
};

function useFormDonViTinh({
  onTaiLaiDanhSach,
}: UseFormDonViTinhProps) {
  const [hienForm, setHienForm] = useState(false);
  const [donViTinhCanSua, setDonViTinhCanSua] = useState<DonViTinh | null>(null);

  const moFormThem = useCallback(() => {
    setDonViTinhCanSua(null);
    setHienForm(true);
  }, []);

  const moFormSua = useCallback((donViTinh: DonViTinh) => {
    setDonViTinhCanSua(donViTinh);
    setHienForm(true);
  }, []);

  const dongForm = useCallback(() => {
    setHienForm(false);
    setDonViTinhCanSua(null);
  }, []);

  const xuLyLuuThanhCong = useCallback(() => {
    onTaiLaiDanhSach();
    dongForm();
  }, [dongForm, onTaiLaiDanhSach]);

  return {
    hienForm,
    donViTinhCanSua,
    moFormThem,
    moFormSua,
    dongForm,
    xuLyLuuThanhCong,
  };
}

export default useFormDonViTinh;