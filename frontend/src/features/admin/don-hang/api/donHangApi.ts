import axiosClient from "../../../../shared/api/axiosClient";

import type {
  DonHangBoLoc,
  DonHangChiTiet,
  DonHangDanhSach,
} from "../types/DonHang";

import type { PhanTrangResponse } from "../../../../shared/types/PhanTrangResponse";

const TRANG_THAI_DON_HANG_HOP_LE = new Set([
  "CHO_XU_LY",
  "DANG_XU_LY",
  "DANG_GIAO",
  "HOAN_THANH",
  "DA_HUY",
]);

const TRANG_THAI_THANH_TOAN_HOP_LE = new Set([
  "CHUA_THANH_TOAN",
  "CHO_THANH_TOAN",
  "DA_THANH_TOAN",
  "THANH_TOAN_THAT_BAI",
  "DA_HUY",
]);

const TRANG_THAI_KIEM_DUYET_HOP_LE = new Set([
  "KHONG_CAN_DUYET",
  "CHO_DUYET",
  "DA_DUYET",
  "TU_CHOI",
]);

const layGiaTriBoLocHopLe = (
  giaTri: string | undefined,
  danhSachHopLe: ReadonlySet<string>,
) => {
  if (!giaTri || !danhSachHopLe.has(giaTri)) {
    return undefined;
  }

  return giaTri;
};

export const layDanhSachDonHang = async (
  boLoc: DonHangBoLoc,
) => {
  const response = await axiosClient.get<
    PhanTrangResponse<DonHangDanhSach>
  >("/don-hang/phan-trang", {
    params: {
      page: boLoc.page,
      size: boLoc.size,

      keyword:
        boLoc.keyword?.trim()
        || undefined,

      trangThaiDonHang:
        layGiaTriBoLocHopLe(
          boLoc.trangThaiDonHang,
          TRANG_THAI_DON_HANG_HOP_LE,
        ),

      trangThaiThanhToan:
        layGiaTriBoLocHopLe(
          boLoc.trangThaiThanhToan,
          TRANG_THAI_THANH_TOAN_HOP_LE,
        ),

      trangThaiKiemDuyet:
        layGiaTriBoLocHopLe(
          boLoc.trangThaiKiemDuyet,
          TRANG_THAI_KIEM_DUYET_HOP_LE,
        ),
    },
  });

  return response.data;
};

export const layChiTietDonHang = async (
  maDonHang: number,
) => {
  const response =
    await axiosClient.get<DonHangChiTiet>(
      `/don-hang/${maDonHang}`,
    );

  return response.data;
};