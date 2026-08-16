import "../../styles/loading/DuocSiLoading.css";

type DuocSiLoadingProps = {
  noiDung?: string;
  cheToanManHinh?: boolean;
  gon?: boolean;
};

function DuocSiLoading({
  noiDung = "Đang tải dữ liệu...",
  cheToanManHinh = false,
  gon = false,
}: DuocSiLoadingProps) {
  return (
    <div
      className={[
        "duoc-si-loading",
        cheToanManHinh
          ? "duoc-si-loading--overlay"
          : "",
        gon
          ? "duoc-si-loading--compact"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
      aria-label={noiDung}
    >
      <div className="duoc-si-loading-content">
        <div className="duoc-si-loading-spinner" />

        <span>
          {noiDung}
        </span>
      </div>
    </div>
  );
}

export default DuocSiLoading;