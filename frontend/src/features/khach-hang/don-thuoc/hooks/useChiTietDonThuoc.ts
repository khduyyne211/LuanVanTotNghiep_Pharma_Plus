import axios from "axios";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  layChiTietDonThuocCuaToiApi,
} from "../api/DonThuocKhachHangApi";

import type {
  DonThuocKhachHang,
} from "../types/DonThuocKhachHang";

interface PhanHoiLoiApi {
  message?: string;
  thongBao?: string;
}

function layThongBaoLoi(
  error: unknown
) {
  if (
    axios.isAxiosError<PhanHoiLoiApi>(
      error
    )
  ) {
    return (
      error.response?.data?.message ||
      error.response?.data?.thongBao ||
      "Không thể tải chi tiết đơn thuốc."
    );
  }

  return "Không thể tải chi tiết đơn thuốc.";
}

export function useChiTietDonThuoc() {
  const {
    maDonThuoc,
  } = useParams<{
    maDonThuoc: string;
  }>();

  const [
    donThuoc,
    setDonThuoc,
  ] = useState<
    DonThuocKhachHang | null
  >(null);

  const [
    dangTai,
    setDangTai,
  ] = useState(true);

  const [
    loi,
    setLoi,
  ] = useState("");

  const taiChiTietDonThuoc =
    useCallback(async () => {
      const maDon =
        Number(maDonThuoc);

      if (
        !Number.isInteger(maDon) ||
        maDon <= 0
      ) {
        setDonThuoc(null);

        setLoi(
          "Mã đơn thuốc không hợp lệ."
        );

        setDangTai(false);

        return;
      }

      setDangTai(true);

      setLoi("");

      try {
        const response =
          await layChiTietDonThuocCuaToiApi(
            maDon
          );

        setDonThuoc(
          response.data
        );
      } catch (error) {
        setDonThuoc(null);

        setLoi(
          layThongBaoLoi(
            error
          )
        );
      } finally {
        setDangTai(false);
      }
    }, [maDonThuoc]);

  useEffect(() => {
    void taiChiTietDonThuoc();
  }, [taiChiTietDonThuoc]);

  return {
    donThuoc,

    dangTai,

    loi,

    taiChiTietDonThuoc,
  };
}