import type { ReactNode } from "react";

type KhungDanhSachQuanLyProps = {
  thanhCongCu?: ReactNode;
  children: ReactNode;
  phanTrang?: ReactNode;
  thongBaoLoi?: string;
};

export default function KhungDanhSachQuanLy({
  thanhCongCu,
  children,
  phanTrang,
  thongBaoLoi,
}: KhungDanhSachQuanLyProps) {
  return (
    <section className="ql-list-panel">
      {thanhCongCu && (
        <div className="ql-list-toolbar">
          {thanhCongCu}
        </div>
      )}

      {thongBaoLoi && (
        <div className="ql-error-message">
          <i className="bi bi-exclamation-circle-fill" />
          <span>{thongBaoLoi}</span>
        </div>
      )}

      <div className="ql-list-content">
        {children}
      </div>

      {phanTrang && (
        <div className="ql-list-pagination">
          {phanTrang}
        </div>
      )}
    </section>
  );
}