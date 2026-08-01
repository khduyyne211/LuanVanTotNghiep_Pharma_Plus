import { useCallback, useEffect, useState } from "react";
import { layDanhSachDiaChiGiaoHangApi } from "../api/DiaChiGiaoHangApi";
import type { DiaChiGiaoHang } from "../types/DiaChiGiaoHang";

export function useDiaChiGiaoHang() {
  const [danhSachDiaChi, setDanhSachDiaChi] = useState<DiaChiGiaoHang[]>([]);
  const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
  const [thongBaoLoi, setThongBaoLoi] = useState("");

  const layDanhSachDiaChi = useCallback(async () => {
    setDangTaiDuLieu(true);
    setThongBaoLoi("");

    try {
      const duLieu = await layDanhSachDiaChiGiaoHangApi();
      setDanhSachDiaChi(duLieu);
    } catch {
      setDanhSachDiaChi([]);
      setThongBaoLoi("Không thể tải danh sách địa chỉ giao hàng.");
    } finally {
      setDangTaiDuLieu(false);
    }
  }, []);

  useEffect(() => {
    let daHuyYeuCau = false;

    layDanhSachDiaChiGiaoHangApi()
      .then((duLieu) => {
        if (!daHuyYeuCau) setDanhSachDiaChi(duLieu);
      })
      .catch(() => {
        if (!daHuyYeuCau) {
          setDanhSachDiaChi([]);
          setThongBaoLoi("Không thể tải danh sách địa chỉ giao hàng.");
        }
      })
      .finally(() => {
        if (!daHuyYeuCau) setDangTaiDuLieu(false);
      });

    return () => {
      daHuyYeuCau = true;
    };
  }, []);

  return {
    danhSachDiaChi,
    dangTaiDuLieu,
    thongBaoLoi,
    layDanhSachDiaChi,
  };
}