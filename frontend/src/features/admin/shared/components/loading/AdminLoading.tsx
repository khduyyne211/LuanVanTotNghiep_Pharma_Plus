import "../../styles/loading/AdminLoading.css";

type AdminLoadingProps = {
  noiDung?: string;
  cheToanManHinh?: boolean;
  gon?: boolean;
};

function AdminLoading({
  noiDung = "Đang tải dữ liệu...",
  cheToanManHinh = false,
  gon = false,
}: AdminLoadingProps) {
  return (
    <div
      className={[
        "admin-loading",
        cheToanManHinh ? "admin-loading-overlay" : "",
        gon ? "admin-loading-compact" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
      aria-live="polite"
      aria-label={noiDung}
    >
      <div className="admin-loading-content">
        <div className="admin-loading-spinner" />

        <span>{noiDung}</span>
      </div>
    </div>
  );
}

export default AdminLoading;