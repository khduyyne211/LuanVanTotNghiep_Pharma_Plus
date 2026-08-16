import type {
  TrangThaiDonThuocKhachHang,
} from "../types/DonThuocKhachHang";

interface TrangThaiDonThuocProps {
  trangThai:
    TrangThaiDonThuocKhachHang;
}

const TEN_TRANG_THAI:
  Record<
    TrangThaiDonThuocKhachHang,
    string
  > = {
    CHO_DUYET:
      "Chờ duyệt",

    DA_DUYET:
      "Đã duyệt",

    TU_CHOI:
      "Từ chối",
  };

export default function TrangThaiDonThuoc({
  trangThai,
}: TrangThaiDonThuocProps) {
  const classTrangThai =
    trangThai
      .toLowerCase()
      .replaceAll(
        "_",
        "-"
      );

  return (
    <span
      className={
        `don-thuoc-trang-thai ` +
        `don-thuoc-trang-thai--${classTrangThai}`
      }
    >
      <span className="don-thuoc-trang-thai-cham" />

      {
        TEN_TRANG_THAI[
          trangThai
        ]
      }
    </span>
  );
}