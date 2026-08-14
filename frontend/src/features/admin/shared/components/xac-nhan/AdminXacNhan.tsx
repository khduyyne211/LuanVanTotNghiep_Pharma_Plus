import "../../styles/xac-nhan/AdminXacNhan.css";

type AdminXacNhanProps = {
  dangHien: boolean;
  tieuDe?: string;
  noiDung: string;
  nhanXacNhan?: string;
  nhanHuy?: string;
  dangXuLy?: boolean;
  onXacNhan: () => void;
  onHuy: () => void;
};

function AdminXacNhan({
  dangHien,
  tieuDe = "Xác nhận thao tác",
  noiDung,
  nhanXacNhan = "Xác nhận",
  nhanHuy = "Hủy",
  dangXuLy = false,
  onXacNhan,
  onHuy,
}: AdminXacNhanProps) {
  if (!dangHien) {
    return null;
  }

  return (
    <div
      className="admin-xac-nhan-overlay"
      onMouseDown={() => {
        if (!dangXuLy) {
          onHuy();
        }
      }}
    >
      <div
        className="admin-xac-nhan-hop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-xac-nhan-tieu-de"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="admin-xac-nhan-icon">
          <i className="bi bi-exclamation-lg" />
        </div>

        <h2 id="admin-xac-nhan-tieu-de">
          {tieuDe}
        </h2>

        <p>{noiDung}</p>

        <div className="admin-xac-nhan-actions">
          <button
            type="button"
            className="admin-xac-nhan-button admin-xac-nhan-button-huy"
            onClick={onHuy}
            disabled={dangXuLy}
          >
            {nhanHuy}
          </button>

          <button
            type="button"
            className="admin-xac-nhan-button admin-xac-nhan-button-dong-y"
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

export default AdminXacNhan;