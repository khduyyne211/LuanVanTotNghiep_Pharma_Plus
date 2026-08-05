import { useCallback, useState } from "react";

import type { PhieuNhap } from "../types/PhieuNhap";

type UseFormPhieuNhapProps = {
  onTaiLaiDanhSach: () => void;
  onMoChiTiet: (maPhieuNhap: number) => Promise<void>;
};

function useFormPhieuNhap({
  onTaiLaiDanhSach,
  onMoChiTiet,
}: UseFormPhieuNhapProps) {
  const [hienForm, setHienForm] = useState(false);

  const moForm = useCallback(() => {
    setHienForm(true);
  }, []);

  const dongForm = useCallback(() => {
    setHienForm(false);
  }, []);

  const xuLyTaoThanhCong = useCallback(
    async (phieuNhap: PhieuNhap) => {
      setHienForm(false);
      onTaiLaiDanhSach();
      await onMoChiTiet(phieuNhap.maPhieuNhap);
    },
    [onMoChiTiet, onTaiLaiDanhSach]
  );

  return {
    hienForm,
    moForm,
    dongForm,
    xuLyTaoThanhCong,
  };
}

export default useFormPhieuNhap;