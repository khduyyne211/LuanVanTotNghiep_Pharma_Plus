export const DANH_SACH_TINH_THANH_GIAO_HANG = [
  "TP. Hồ Chí Minh",
] as const;

export const TINH_THANH_GIAO_HANG_MAC_DINH =
  DANH_SACH_TINH_THANH_GIAO_HANG[0];

export type TinhThanhGiaoHang =
  (typeof DANH_SACH_TINH_THANH_GIAO_HANG)[number];

export function laTinhThanhGiaoHangDuocHoTro(
  giaTri: string | null | undefined,
): boolean {
  if (!giaTri?.trim()) {
    return false;
  }

  const giaTriDaChuanHoa = giaTri.trim();

  return DANH_SACH_TINH_THANH_GIAO_HANG.some(
    (tinhThanh) => tinhThanh === giaTriDaChuanHoa,
  );
}