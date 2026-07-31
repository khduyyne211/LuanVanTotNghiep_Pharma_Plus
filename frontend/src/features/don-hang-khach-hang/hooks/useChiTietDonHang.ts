import axios from "axios";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router-dom";

import { layChiTietDonHangApi } from "../api/DonHangApi";
import type { DonHangResponse } from "../types/DonHang";

interface DuLieuLoiApi {
  detail?: string;
  message?: string;
}

export function useChiTietDonHang() {
  const { maDonHang } = useParams<{
    maDonHang: string;
  }>();

  const [chiTietDonHang, setChiTietDonHang] = useState<DonHangResponse | undefined>(undefined);

  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");

  const taiChiTietDonHang = useCallback(async () => {
    const maDonHangSo = Number(maDonHang);

    if (
      !maDonHang ||
      !Number.isInteger(maDonHangSo) ||
      maDonHangSo <= 0
    ) {
      setChiTietDonHang(undefined);
      setLoi("Mã đơn hàng không hợp lệ.");
      setDangTai(false);
      return;
    }

    try {
      setDangTai(true);
      setLoi("");

      const duLieu = await layChiTietDonHangApi(maDonHangSo);

      setChiTietDonHang(duLieu);
    } catch (error: unknown) {
      setChiTietDonHang(undefined);

      if (axios.isAxiosError<DuLieuLoiApi>(error)) {
        const noiDungLoi =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Không thể tải chi tiết đơn hàng.";

        setLoi(noiDungLoi);
        return;
      }

      setLoi("Không thể tải chi tiết đơn hàng.");
    } finally {
      setDangTai(false);
    }
  }, [maDonHang]);

  useEffect(() => {
    void taiChiTietDonHang();
  }, [taiChiTietDonHang]);

  return {
    chiTietDonHang,
    dangTai,
    loi,
    taiChiTietDonHang,
  };
}