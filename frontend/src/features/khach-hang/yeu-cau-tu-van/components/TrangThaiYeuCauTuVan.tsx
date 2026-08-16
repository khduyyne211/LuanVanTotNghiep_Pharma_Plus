interface TrangThaiYeuCauTuVanProps {
  trangThai: string;
}

const TEN_TRANG_THAI_YEU_CAU: Record<
  string,
  string
> = {
  CHO_TIEP_NHAN: "Chờ tư vấn",
  DA_TU_VAN: "Đã tư vấn",
  KHONG_THE_LIEN_HE: "Chưa thể liên lạc",
  DA_HUY: "Đã hủy",
};

export default function TrangThaiYeuCauTuVan({
  trangThai,
}: TrangThaiYeuCauTuVanProps) {
  const classTrangThai = trangThai
    .toLowerCase()
    .replaceAll("_", "-");

  return (
    <span
      className={
        `trang-thai-yeu-cau-tu-van ` +
        `trang-thai-yeu-cau-tu-van--${classTrangThai}`
      }
    >
      <span className="trang-thai-yeu-cau-tu-van-cham" />

      {TEN_TRANG_THAI_YEU_CAU[
        trangThai
      ] || trangThai}
    </span>
  );
}