import { useCallback, useState } from "react";
import type { NhaCungCap } from "../types/NhaCungCap";

type UseFormNhaCungCapProps = {
  onTaiLaiDanhSach: () => void;
};

function useFormNhaCungCap({ onTaiLaiDanhSach }: UseFormNhaCungCapProps) {
  const [hienForm, setHienForm] = useState(false);
  const [NhaCungCapCanSua, setNhaCungCapCanSua] = useState<NhaCungCap | null>(null);

  const moFormThem = useCallback(() => {
    setNhaCungCapCanSua(null);
    setHienForm(true);
  }, []);

  const moFormSua = useCallback((NhaCungCap: NhaCungCap) => {
    setNhaCungCapCanSua(NhaCungCap);
    setHienForm(true);
  }, []);

  const dongForm = useCallback(() => {
    setHienForm(false);
    setNhaCungCapCanSua(null);
  }, []);

  const xuLyLuuThanhCong = useCallback(() => {
    onTaiLaiDanhSach();
    dongForm();
  }, [dongForm, onTaiLaiDanhSach]);

  return {
    hienForm,
    NhaCungCapCanSua,
    moFormThem,
    moFormSua,
    dongForm,
    xuLyLuuThanhCong,
  };
}

export default useFormNhaCungCap;