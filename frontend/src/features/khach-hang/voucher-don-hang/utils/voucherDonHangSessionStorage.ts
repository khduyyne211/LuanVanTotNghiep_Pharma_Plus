import type { VoucherDaApDung } from "../types/VoucherDonHang";

const TIEN_TO_KHOA_VOUCHER =
  "pharma_voucher_don_hang";

function taoKhoaVoucher(
  maKhachHang: number,
) {
  return `${TIEN_TO_KHOA_VOUCHER}_${maKhachHang}`;
}

export function layVoucherDaApDungSession(
  maKhachHang: number,
): VoucherDaApDung | null {
  try {
    const duLieu = sessionStorage.getItem(
      taoKhoaVoucher(maKhachHang),
    );

    if (!duLieu) {
      return null;
    }

    const voucher = JSON.parse(
      duLieu,
    ) as VoucherDaApDung;

    if (
      !voucher ||
      typeof voucher.maVoucher !== "number" ||
      typeof voucher.maGiamGia !== "string" ||
      typeof voucher.soTienGiam !== "number" ||
      typeof voucher.chuKyGioHang !== "string"
    ) {
      sessionStorage.removeItem(
        taoKhoaVoucher(maKhachHang),
      );

      return null;
    }

    return voucher;
  } catch {
    sessionStorage.removeItem(
      taoKhoaVoucher(maKhachHang),
    );

    return null;
  }
}

export function luuVoucherDaApDungSession(
  maKhachHang: number,
  voucher: VoucherDaApDung,
) {
  sessionStorage.setItem(
    taoKhoaVoucher(maKhachHang),
    JSON.stringify(voucher),
  );
}

export function xoaVoucherDaApDungSession(
  maKhachHang: number,
) {
  sessionStorage.removeItem(
    taoKhoaVoucher(maKhachHang),
  );
}