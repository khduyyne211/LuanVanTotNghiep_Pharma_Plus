import { createPortal } from "react-dom";

import "./ThongBaoHeThong.css";

export type LoaiThongBao =
  | "THANH_CONG"
  | "LOI"
  | "CANH_BAO"
  | "THONG_TIN";

interface ThongBaoHeThongProps {
  dangHien: boolean;
  noiDung: string;
  tieuDe?: string;
  loai?: LoaiThongBao;
  dongThongBao: () => void;
}

const CAU_HINH_THONG_BAO = {
  THANH_CONG: {
    icon: "bi bi-check-lg",
    className: "thanh-cong",
  },

  LOI: {
    icon: "bi bi-x-lg",
    className: "loi",
  },

  CANH_BAO: {
    icon: "bi bi-exclamation-lg",
    className: "canh-bao",
  },

  THONG_TIN: {
    icon: "bi bi-info-lg",
    className: "thong-tin",
  },
};

function ThongBaoHeThong({
  dangHien,
  noiDung,
  tieuDe,
  loai = "THANH_CONG",
  dongThongBao,
}: ThongBaoHeThongProps) {
  if (!dangHien) {
    return null;
  }

  const cauHinh =
    CAU_HINH_THONG_BAO[loai];

  const noiDungThongBao = (
    <div
      className="thong-bao-he-thong-overlay"
      onClick={() => {
        dongThongBao();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="thong-bao-he-thong-hop"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          aria-label="Đóng thông báo"
          className="thong-bao-he-thong-nut-dong"
          onClick={
            dongThongBao
          }
        >
          ×
        </button>

        <div
          className={
            `thong-bao-he-thong-icon ` +
            `thong-bao-he-thong-icon--${cauHinh.className}`
          }
        >
          <i
            className={
              cauHinh.icon
            }
          ></i>
        </div>

        {tieuDe && (
          <h2>
            {tieuDe}
          </h2>
        )}

        <p>
          {noiDung}
        </p>
      </div>
    </div>
  );

  /*
   * Render thông báo trực tiếp vào document.body
   * thay vì giữ nó bên trong component gọi.
   *
   * Nhờ đó popup không bị giới hạn bởi:
   * - thẻ sản phẩm
   * - carousel
   * - overflow
   * - stacking context của component cha
   */
  return createPortal(
    noiDungThongBao,
    document.body
  );
}

export default ThongBaoHeThong;