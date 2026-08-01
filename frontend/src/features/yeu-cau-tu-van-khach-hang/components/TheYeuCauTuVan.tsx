import type { YeuCauTuVanDanhSach } from "../types/YeuCauTuVan";
import TrangThaiYeuCauTuVan from "./TrangThaiYeuCauTuVan";

interface TheYeuCauTuVanProps {
  yeuCau: YeuCauTuVanDanhSach;
  onXemChiTiet: (
    maYeuCauTuVan: number
  ) => void;
}

const dinhDangNgay = new Intl.DateTimeFormat(
  "vi-VN",
  {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }
);

const dinhDangGio = new Intl.DateTimeFormat(
  "vi-VN",
  {
    hour: "2-digit",
    minute: "2-digit",
  }
);

export default function TheYeuCauTuVan({
  yeuCau,
  onXemChiTiet,
}: TheYeuCauTuVanProps) {
  const ngayTao = new Date(yeuCau.ngayTao);

  const ngayTaoHienThi =
    dinhDangNgay.format(ngayTao);

  const gioTaoHienThi =
    dinhDangGio.format(ngayTao);

  return (
    <article className="yeu-cau-tu-van-the">
      <div className="yeu-cau-tu-van-the-dau">
        <div className="yeu-cau-tu-van-the-dau-ben-trai">
          <strong>
            Yêu cầu tư vấn {ngayTaoHienThi}
          </strong>

          <span className="yeu-cau-tu-van-dau-ngan-cach">
            •
          </span>

          <span className="yeu-cau-tu-van-gio">
            {gioTaoHienThi}
          </span>
        </div>

        <TrangThaiYeuCauTuVan
          trangThai={yeuCau.trangThaiTuVan}
        />
      </div>

      <div className="yeu-cau-tu-van-the-cuoi">
        <button
          type="button"
          className="yeu-cau-tu-van-xem-chi-tiet"
          onClick={() =>
            onXemChiTiet(
              yeuCau.maYeuCauTuVan
            )
          }
        >
          Xem chi tiết

          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </article>
  );
}