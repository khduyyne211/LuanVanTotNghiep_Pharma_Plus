import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

import { layDanhSachDonHangApi } from "../api/DonHangApi";
import type { DonHangDanhSach } from "../types/DonHang";
import type { BoLocTrangThaiDonHang } from "../constants/TrangThaiDonHang";

interface DuLieuLoiApi {
  message?: string;
  detail?: string;
}

export function useDanhSachDonHang() {
  const [danhSachDonHang, setDanhSachDonHang] = useState<DonHangDanhSach[]>([]);
  const [boLocDangChon, setBoLocDangChon] =
    useState<BoLocTrangThaiDonHang>("TAT_CA");
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");

  const taiDanhSachDonHang = useCallback(async () => {
    try {
      setDangTai(true);
      setLoi("");

      const duLieu = await layDanhSachDonHangApi();
      setDanhSachDonHang(duLieu);
    } catch (error: unknown) {
      setDanhSachDonHang([]);

      if (axios.isAxiosError<DuLieuLoiApi>(error)) {
        const noiDungLoi =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Không thể tải danh sách đơn hàng.";

        setLoi(noiDungLoi);
        return;
      }

      setLoi("Không thể tải danh sách đơn hàng.");
    } finally {
      setDangTai(false);
    }
  }, []);

  useEffect(() => {
    void taiDanhSachDonHang();
  }, [taiDanhSachDonHang]);

  const danhSachDonHangHienThi = useMemo(() => {
    if (boLocDangChon === "TAT_CA") {
      return danhSachDonHang;
    }

    return danhSachDonHang.filter(
      (donHang) => donHang.trangThaiDonHang === boLocDangChon
    );
  }, [boLocDangChon, danhSachDonHang]);

  return {
    danhSachDonHang,
    danhSachDonHangHienThi,
    boLocDangChon,
    dangTai,
    loi,
    setBoLocDangChon,
    taiDanhSachDonHang,
  };
}