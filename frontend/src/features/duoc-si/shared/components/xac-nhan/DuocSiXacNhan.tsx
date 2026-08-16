import "../../styles/xac-nhan/DuocSiXacNhan.css";

type DuocSiXacNhanProps = {
  dangHien: boolean;
  tieuDe?: string;
  noiDung: string;
  nhanXacNhan?: string;
  nhanHuy?: string;
  dangXuLy?: boolean;
  loai?: "BINH_THUONG" | "NGUY_HIEM";
  onXacNhan: () => void;
  onHuy: () => void;
};

function DuocSiXacNhan({
  dangHien,
  tieuDe = "Xác nhận thao tác",
  noiDung,
  nhanXacNhan = "Xác nhận",
  nhanHuy = "Hủy",
  dangXuLy = false,
  loai = "BINH_THUONG",
  onXacNhan,
  onHuy,
}: DuocSiXacNhanProps) {
  if (!dangHien) {
    return null;
  }

  return (
    <div
      className="duoc-si-xac-nhan-overlay"
      onMouseDown={() => {
        if (!dangXuLy) {
          onHuy();
        }
      }}
    >
      <div
        className="duoc-si-xac-nhan-hop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="duoc-si-xac-nhan-tieu-de"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div
          className={[
            "duoc-si-xac-nhan-icon",
            loai === "NGUY_HIEM" ? "duoc-si-xac-nhan-icon--nguy-hiem" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <i className="bi bi-exclamation-lg" />
        </div>

        <h2 id="duoc-si-xac-nhan-tieu-de">{tieuDe}</h2>

        <p>{noiDung}</p>

        <div className="duoc-si-xac-nhan-actions">
          <button
            type="button"
            className="duoc-si-xac-nhan-button duoc-si-xac-nhan-button--huy"
            onClick={onHuy}
            disabled={dangXuLy}
          >
            {nhanHuy}
          </button>

          <button
            type="button"
            className={[
              "duoc-si-xac-nhan-button",
              loai === "NGUY_HIEM"
                ? "duoc-si-xac-nhan-button--nguy-hiem"
                : "duoc-si-xac-nhan-button--dong-y",
            ].join(" ")}
            onClick={onXacNhan}
            disabled={dangXuLy}
          >
            {dangXuLy ? "Đang xử lý..." : nhanXacNhan}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DuocSiXacNhan;
