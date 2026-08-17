import axios from "axios";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useXacThucContext } from "../../../xac-thuc/context/XacThucContext";
import type { ChiTietGioHangLocal } from "../../gio-hang/types/GioHangLocal";

import {
  apDungVoucherKhachHangApi,
} from "../api/VoucherDonHangApi";

import type {
  VoucherDaApDung,
} from "../types/VoucherDonHang";

import {
  layVoucherDaApDungSession,
  luuVoucherDaApDungSession,
  xoaVoucherDaApDungSession,
} from "../utils/voucherDonHangSessionStorage";

interface DuLieuLoiApi {
  detail?: string;
  message?: string;
}

function taoChuKyGioHang(
  danhSachChiTiet: ChiTietGioHangLocal[],
) {
  return [...danhSachChiTiet]
    .sort(
      (a, b) =>
        a.maDonViSanPham -
        b.maDonViSanPham,
    )
    .map(
      (chiTiet) =>
        `${chiTiet.maDonViSanPham}:${chiTiet.soLuong}`,
    )
    .join("|");
}

function layThongBaoLoi(
  error: unknown,
  thongBaoMacDinh: string,
) {
  if (
    axios.isAxiosError<DuLieuLoiApi>(
      error,
    )
  ) {
    return (
      error.response?.data?.detail ||
      error.response?.data?.message ||
      thongBaoMacDinh
    );
  }

  return thongBaoMacDinh;
}

export function useVoucherXacNhanDatHang(
  danhSachChiTietGioHangLocal: ChiTietGioHangLocal[],
) {
  const {
    nguoiDungDangNhap,
  } = useXacThucContext();

  const maKhachHang =
    nguoiDungDangNhap?.maKhachHang;

  const [
    voucherDaXacNhan,
    setVoucherDaXacNhan,
  ] = useState<VoucherDaApDung | null>(
    null,
  );

  const [
    dangKiemTraVoucher,
    setDangKiemTraVoucher,
  ] = useState(false);

  const [
    thongBaoVoucher,
    setThongBaoVoucher,
  ] = useState("");

  const chuKyGioHang = useMemo(
    () =>
      taoChuKyGioHang(
        danhSachChiTietGioHangLocal,
      ),
    [danhSachChiTietGioHangLocal],
  );

  const danhSachChiTietGuiBackend =
    useMemo(
      () =>
        danhSachChiTietGioHangLocal.map(
          (chiTiet) => ({
            maDonViSanPham:
              chiTiet.maDonViSanPham,
            soLuong:
              chiTiet.soLuong,
          }),
        ),
      [danhSachChiTietGioHangLocal],
    );

  useEffect(() => {
    let daHuyYeuCau = false;

    if (!maKhachHang) {
      setVoucherDaXacNhan(null);
      setDangKiemTraVoucher(false);
      setThongBaoVoucher("");

      return () => {
        daHuyYeuCau = true;
      };
    }

    if (
      danhSachChiTietGuiBackend.length ===
      0
    ) {
      setVoucherDaXacNhan(null);
      setDangKiemTraVoucher(false);
      setThongBaoVoucher("");

      return () => {
        daHuyYeuCau = true;
      };
    }

    const voucherDaApDung =
      layVoucherDaApDungSession(
        maKhachHang,
      );

    if (!voucherDaApDung) {
      setVoucherDaXacNhan(null);
      setDangKiemTraVoucher(false);
      setThongBaoVoucher("");

      return () => {
        daHuyYeuCau = true;
      };
    }

    /*
     * Voucher chỉ được mang từ giỏ hàng sang
     * nếu giỏ hàng vẫn đúng với thời điểm áp dụng.
     */
    if (
      voucherDaApDung.chuKyGioHang !==
      chuKyGioHang
    ) {
      xoaVoucherDaApDungSession(
        maKhachHang,
      );

      setVoucherDaXacNhan(null);
      setDangKiemTraVoucher(false);
      setThongBaoVoucher(
        "Giỏ hàng đã thay đổi nên voucher trước đó đã được gỡ.",
      );

      return () => {
        daHuyYeuCau = true;
      };
    }

    setDangKiemTraVoucher(true);
    setThongBaoVoucher("");

    apDungVoucherKhachHangApi(
      voucherDaApDung.maGiamGia,
      danhSachChiTietGuiBackend,
    )
      .then((ketQua) => {
        if (daHuyYeuCau) {
          return;
        }

        const voucherMoi: VoucherDaApDung = {
          ...ketQua,
          chuKyGioHang,
        };

        luuVoucherDaApDungSession(
          maKhachHang,
          voucherMoi,
        );

        setVoucherDaXacNhan(
          voucherMoi,
        );
      })
      .catch((error: unknown) => {
        if (daHuyYeuCau) {
          return;
        }

        xoaVoucherDaApDungSession(
          maKhachHang,
        );

        setVoucherDaXacNhan(null);

        setThongBaoVoucher(
          layThongBaoLoi(
            error,
            "Voucher không còn đủ điều kiện và đã được gỡ khỏi đơn hàng.",
          ),
        );
      })
      .finally(() => {
        if (!daHuyYeuCau) {
          setDangKiemTraVoucher(false);
        }
      });

    return () => {
      daHuyYeuCau = true;
    };
  }, [
    chuKyGioHang,
    danhSachChiTietGuiBackend,
    maKhachHang,
  ]);

  const xoaVoucherSauKhiTaoDon =
    useCallback(() => {
      if (maKhachHang) {
        xoaVoucherDaApDungSession(
          maKhachHang,
        );
      }

      setVoucherDaXacNhan(null);
      setThongBaoVoucher("");
    }, [maKhachHang]);

  return {
    voucherDaXacNhan,
    dangKiemTraVoucher,
    thongBaoVoucher,
    xoaVoucherSauKhiTaoDon,
  };
}