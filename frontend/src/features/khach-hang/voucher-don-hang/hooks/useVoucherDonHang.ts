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
  apDungVoucherTheoMaKhachHangApi,
  layDanhSachVoucherKhachHangApi,
} from "../api/VoucherDonHangApi";
import type {
  ApDungVoucherResponse,
  VoucherDaApDung,
  VoucherKhachHang,
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

export function useVoucherDonHang(
  danhSachChiTietGioHangLocal: ChiTietGioHangLocal[],
) {
  const {
    nguoiDungDangNhap,
  } = useXacThucContext();

  const maKhachHang =
    nguoiDungDangNhap?.maKhachHang;

  const [
    danhSachVoucher,
    setDanhSachVoucher,
  ] = useState<VoucherKhachHang[]>([]);

  const [
    voucherDaApDung,
    setVoucherDaApDung,
  ] = useState<VoucherDaApDung | null>(
    null,
  );

  const [
    maGiamGiaDangNhap,
    setMaGiamGiaDangNhap,
  ] = useState("");

  const [
    dangMoDanhSachVoucher,
    setDangMoDanhSachVoucher,
  ] = useState(false);

  const [
    dangTaiDanhSach,
    setDangTaiDanhSach,
  ] = useState(false);

  const [
    dangApDung,
    setDangApDung,
  ] = useState(false);

  const [
    loiVoucher,
    setLoiVoucher,
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
            soLuong: chiTiet.soLuong,
          }),
        ),
      [danhSachChiTietGioHangLocal],
    );

  useEffect(() => {
    if (!maKhachHang) {
      setVoucherDaApDung(null);
      return;
    }

    setVoucherDaApDung(
      layVoucherDaApDungSession(
        maKhachHang,
      ),
    );
  }, [maKhachHang]);

  /*
   * Voucher chỉ đúng với cấu trúc/số lượng
   * giỏ hàng tại thời điểm được áp dụng.
   *
   * Nếu khách đổi số lượng, đơn vị hoặc xóa
   * sản phẩm thì bỏ voucher cũ để tránh hiển thị
   * một mức giảm đã không còn đúng.
   */
  useEffect(() => {
    if (
      !voucherDaApDung ||
      !maKhachHang
    ) {
      return;
    }

    if (
      voucherDaApDung.chuKyGioHang ===
      chuKyGioHang
    ) {
      return;
    }

    xoaVoucherDaApDungSession(
      maKhachHang,
    );

    setVoucherDaApDung(null);
    setMaGiamGiaDangNhap("");
    setDanhSachVoucher([]);
    setDangMoDanhSachVoucher(false);
    setLoiVoucher("");
  }, [
    chuKyGioHang,
    maKhachHang,
    voucherDaApDung,
  ]);

  const moDanhSachVoucher =
    useCallback(async () => {
      if (
        danhSachChiTietGuiBackend.length ===
        0
      ) {
        setLoiVoucher(
          "Giỏ hàng không có sản phẩm.",
        );
        setDangMoDanhSachVoucher(true);
        return;
      }

      try {
        setDangMoDanhSachVoucher(true);
        setDangTaiDanhSach(true);
        setLoiVoucher("");

        const ketQua =
          await layDanhSachVoucherKhachHangApi(
            danhSachChiTietGuiBackend,
          );

        setDanhSachVoucher(
          ketQua,
        );
      } catch (error: unknown) {
        setDanhSachVoucher([]);
        setLoiVoucher(
          layThongBaoLoi(
            error,
            "Không thể tải danh sách voucher.",
          ),
        );
      } finally {
        setDangTaiDanhSach(false);
      }
    }, [danhSachChiTietGuiBackend]);

  const dongDanhSachVoucher =
    useCallback(() => {
      if (dangApDung) {
        return;
      }

      setDangMoDanhSachVoucher(false);
      setLoiVoucher("");
    }, [dangApDung]);

  const apDungVoucher =
    useCallback(async (): Promise<ApDungVoucherResponse | null> => {
      const maGiamGia =
        maGiamGiaDangNhap.trim();

      if (!maGiamGia) {
        setLoiVoucher(
          "Vui lòng nhập mã voucher.",
        );
        return null;
      }

      if (!maKhachHang) {
        setLoiVoucher(
          "Không xác định được khách hàng đang đăng nhập.",
        );
        return null;
      }

      try {
        setDangApDung(true);
        setLoiVoucher("");

        const ketQua =
          await apDungVoucherKhachHangApi(
            maGiamGia,
            danhSachChiTietGuiBackend,
          );

        const voucherMoi: VoucherDaApDung = {
          ...ketQua,
          chuKyGioHang,
        };

        luuVoucherDaApDungSession(
          maKhachHang,
          voucherMoi,
        );

        setVoucherDaApDung(
          voucherMoi,
        );
        setMaGiamGiaDangNhap("");
        setDangMoDanhSachVoucher(false);

        return ketQua;
      } catch (error: unknown) {
        setLoiVoucher(
          layThongBaoLoi(
            error,
            "Không thể áp dụng voucher.",
          ),
        );

        return null;
      } finally {
        setDangApDung(false);
      }
    }, [
      chuKyGioHang,
      danhSachChiTietGuiBackend,
      maGiamGiaDangNhap,
      maKhachHang,
    ]);

  const apDungVoucherTheoMaVoucher =
    useCallback(
      async (
        maVoucher: number,
      ): Promise<ApDungVoucherResponse | null> => {
        if (
          !Number.isInteger(maVoucher) ||
          maVoucher <= 0
        ) {
          setLoiVoucher(
            "Mã voucher không hợp lệ.",
          );
          return null;
        }

        if (!maKhachHang) {
          setLoiVoucher(
            "Không xác định được khách hàng đang đăng nhập.",
          );
          return null;
        }

        try {
          setDangApDung(true);
          setLoiVoucher("");

          const ketQua =
            await apDungVoucherTheoMaKhachHangApi(
              maVoucher,
              danhSachChiTietGuiBackend,
            );

          const voucherMoi: VoucherDaApDung = {
            ...ketQua,
            chuKyGioHang,
          };

          luuVoucherDaApDungSession(
            maKhachHang,
            voucherMoi,
          );

          setVoucherDaApDung(
            voucherMoi,
          );
          setMaGiamGiaDangNhap("");
          setDangMoDanhSachVoucher(false);

          return ketQua;
        } catch (error: unknown) {
          setLoiVoucher(
            layThongBaoLoi(
              error,
              "Không thể áp dụng voucher.",
            ),
          );

          return null;
        } finally {
          setDangApDung(false);
        }
      },
      [
        chuKyGioHang,
        danhSachChiTietGuiBackend,
        maKhachHang,
      ],
    );

  const boVoucher =
    useCallback(() => {
      if (maKhachHang) {
        xoaVoucherDaApDungSession(
          maKhachHang,
        );
      }

      setVoucherDaApDung(null);
      setMaGiamGiaDangNhap("");
      setLoiVoucher("");
    }, [maKhachHang]);

  return {
    danhSachVoucher,
    voucherDaApDung,
    maGiamGiaDangNhap,
    dangMoDanhSachVoucher,
    dangTaiDanhSach,
    dangApDung,
    loiVoucher,

    setMaGiamGiaDangNhap,
    moDanhSachVoucher,
    dongDanhSachVoucher,
    apDungVoucher,
    apDungVoucherTheoMaVoucher,
    boVoucher,
  };
}