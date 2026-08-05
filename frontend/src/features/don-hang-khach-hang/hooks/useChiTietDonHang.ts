import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { huyDonHangApi, layChiTietDonHangApi } from "../api/DonHangApi";

import {
  taoThanhToanZaloPayApi,
  type TaoThanhToanZaloPayResponse,
} from "../../thanh-toan/api/ThanhToanZaloPayApi";

import type { DonHangResponse } from "../types/DonHang";

interface DuLieuLoiApi {
  detail?: string;
  message?: string;
}

function layNoiDungLoi(error: unknown, noiDungMacDinh: string): string {
  if (axios.isAxiosError<DuLieuLoiApi>(error)) {
    return (
      error.response?.data?.detail ||
      error.response?.data?.message ||
      noiDungMacDinh
    );
  }

  return noiDungMacDinh;
}

export function useChiTietDonHang() {
  const { maDonHang } = useParams<{
    maDonHang: string;
  }>();

  const [chiTietDonHang, setChiTietDonHang] = useState<
    DonHangResponse | undefined
  >(undefined);

  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");

  const [dangHuyDonHang, setDangHuyDonHang] = useState(false);

  const [dangTaoThanhToanLai, setDangTaoThanhToanLai] = useState(false);

  const [loiThaoTac, setLoiThaoTac] = useState("");

  const taiChiTietDonHang = useCallback(async () => {
    const maDonHangSo = Number(maDonHang);

    if (!maDonHang || !Number.isInteger(maDonHangSo) || maDonHangSo <= 0) {
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

      setLoi(layNoiDungLoi(error, "Không thể tải chi tiết đơn hàng."));
    } finally {
      setDangTai(false);
    }
  }, [maDonHang]);

  useEffect(() => {
    void taiChiTietDonHang();
  }, [taiChiTietDonHang]);

  const coTheThanhToanLai =
    chiTietDonHang?.phuongThucThanhToan === "ZALOPAY" &&
    chiTietDonHang.trangThaiDonHang === "CHO_THANH_TOAN" &&
    chiTietDonHang.trangThaiThanhToan === "CHO_THANH_TOAN";

  const coTheHuyDonCod =
    chiTietDonHang?.phuongThucThanhToan === "COD" &&
    chiTietDonHang.trangThaiDonHang === "CHO_XU_LY" &&
    chiTietDonHang.trangThaiThanhToan === "CHUA_THANH_TOAN";

  const coTheHuyDonZaloPay =
    chiTietDonHang?.phuongThucThanhToan === "ZALOPAY" &&
    chiTietDonHang.trangThaiDonHang === "CHO_THANH_TOAN" &&
    chiTietDonHang.trangThaiThanhToan === "CHO_THANH_TOAN";

  const coTheHuyDonHang = coTheHuyDonCod || coTheHuyDonZaloPay;

  const dangXuLyThaoTac = dangHuyDonHang || dangTaoThanhToanLai;

  const huyDonHang = useCallback(async (): Promise<boolean> => {
    if (!chiTietDonHang) {
      setLoiThaoTac("Không tìm thấy thông tin đơn hàng.");
      return false;
    }

    if (!coTheHuyDonHang) {
      setLoiThaoTac("Đơn hàng không còn ở trạng thái cho phép hủy.");
      return false;
    }

    if (dangXuLyThaoTac) {
      return false;
    }

    try {
      setDangHuyDonHang(true);
      setLoiThaoTac("");

      await huyDonHangApi(chiTietDonHang.maDonHang);

      await taiChiTietDonHang();

      return true;
    } catch (error: unknown) {
      setLoiThaoTac(layNoiDungLoi(error, "Không thể hủy đơn hàng."));

      return false;
    } finally {
      setDangHuyDonHang(false);
    }
  }, [chiTietDonHang, coTheHuyDonHang, dangXuLyThaoTac, taiChiTietDonHang]);

  const taoThanhToanLai =
    useCallback(async (): Promise<TaoThanhToanZaloPayResponse | null> => {
      if (!chiTietDonHang) {
        setLoiThaoTac("Không tìm thấy thông tin đơn hàng.");
        return null;
      }

      if (!coTheThanhToanLai) {
        setLoiThaoTac(
          "Đơn hàng không còn ở trạng thái cho phép thanh toán lại.",
        );
        return null;
      }

      if (dangXuLyThaoTac) {
        return null;
      }

      try {
        setDangTaoThanhToanLai(true);
        setLoiThaoTac("");

        return await taoThanhToanZaloPayApi(chiTietDonHang.maDonHang);
      } catch (error: unknown) {
        setLoiThaoTac(
          layNoiDungLoi(error, "Không thể tạo lại mã thanh toán ZaloPay."),
        );

        return null;
      } finally {
        setDangTaoThanhToanLai(false);
      }
    }, [chiTietDonHang, coTheThanhToanLai, dangXuLyThaoTac]);

  const xoaLoiThaoTac = useCallback(() => {
    setLoiThaoTac("");
  }, []);

  return {
    chiTietDonHang,
    dangTai,
    loi,
    taiChiTietDonHang,

    coTheHuyDonHang,
    coTheThanhToanLai,

    dangHuyDonHang,
    dangTaoThanhToanLai,
    dangXuLyThaoTac,

    loiThaoTac,
    huyDonHang,
    taoThanhToanLai,
    xoaLoiThaoTac,
  };
}
