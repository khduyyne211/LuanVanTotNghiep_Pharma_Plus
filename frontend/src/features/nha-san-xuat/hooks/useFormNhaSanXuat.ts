import {
  useCallback,
  useState,
} from "react";

import type { NhaSanXuat } from "../types/NhaSanXuat";

type UseFormNhaSanXuatProps = {
  onTaiLaiDanhSach: () => void;
};

function useFormNhaSanXuat({
  onTaiLaiDanhSach,
}: UseFormNhaSanXuatProps) {
  const [hienForm, setHienForm] = useState(false);

  const [nhaSanXuatCanSua, setNhaSanXuatCanSua] =
    useState<NhaSanXuat | null>(null);

  const moFormThem = useCallback(() => {
    setNhaSanXuatCanSua(null);
    setHienForm(true);
  }, []);

  const moFormSua = useCallback(
    (nhaSanXuat: NhaSanXuat) => {
      setNhaSanXuatCanSua(nhaSanXuat);
      setHienForm(true);
    },
    []
  );

  const dongForm = useCallback(() => {
    setHienForm(false);
    setNhaSanXuatCanSua(null);
  }, []);

  const xuLyLuuThanhCong = useCallback(() => {
    onTaiLaiDanhSach();
    dongForm();
  }, [dongForm, onTaiLaiDanhSach]);

  return {
    hienForm,
    nhaSanXuatCanSua,
    moFormThem,
    moFormSua,
    dongForm,
    xuLyLuuThanhCong,
  };
}

export default useFormNhaSanXuat;