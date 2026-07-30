import { useCallback, useState } from "react";
import type { VaiTro } from "../types/VaiTro";

type UseFormVaiTroProps = {
  onTaiLaiDanhSach: () => void;
};

function useFormVaiTro({ onTaiLaiDanhSach }: UseFormVaiTroProps) {
  const [hienForm, setHienForm] = useState(false);
  const [VaiTroCanSua, setVaiTroCanSua] = useState<VaiTro | null>(null);

  const moFormThem = useCallback(() => {
    setVaiTroCanSua(null);
    setHienForm(true);
  }, []);

  const moFormSua = useCallback((VaiTro: VaiTro) => {
    setVaiTroCanSua(VaiTro);
    setHienForm(true);
  }, []);

  const dongForm = useCallback(() => {
    setHienForm(false);
    setVaiTroCanSua(null);
  }, []);

  const xuLyLuuThanhCong = useCallback(() => {
    onTaiLaiDanhSach();
    dongForm();
  }, [dongForm, onTaiLaiDanhSach]);

  return {
    hienForm,
    VaiTroCanSua,
    moFormThem,
    moFormSua,
    dongForm,
    xuLyLuuThanhCong,
  };
}

export default useFormVaiTro;