import { useCallback, useState } from "react";

import type { LoaiThongBao } from "../components/thong-bao/ThongBaoHeThong";

interface TrangThaiThongBao {
  dangHien: boolean;
  tieuDe: string;
  noiDung: string;
  loai: LoaiThongBao;
}

const THONG_BAO_BAN_DAU: TrangThaiThongBao = {
  dangHien: false,
  tieuDe: "",
  noiDung: "",
  loai: "THANH_CONG",
};

export function useThongBaoHeThong() {
  const [thongBao, setThongBao] = useState<TrangThaiThongBao>(THONG_BAO_BAN_DAU);

  const hienThongBao = useCallback((
    noiDung: string,
    loai: LoaiThongBao = "THANH_CONG",
    tieuDe = ""
  ) => {
    setThongBao({
      dangHien: true,
      tieuDe,
      noiDung,
      loai,
    });
  }, []);

  const dongThongBao = useCallback(() => {
    setThongBao(THONG_BAO_BAN_DAU);
  }, []);

  return {
    ...thongBao,
    hienThongBao,
    dongThongBao,
  };
}