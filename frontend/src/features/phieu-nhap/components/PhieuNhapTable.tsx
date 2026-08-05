import type { PhieuNhap, TrangThaiPhieuNhap } from "../types/PhieuNhap";

type PhieuNhapTableProps = {
  danhSachPhieuNhap: PhieuNhap[];
  loading: boolean;
  onXemChiTiet: (maPhieuNhap: number) => void;
};

const dinhDangTien = (giaTri: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(giaTri);
};

const dinhDangNgayGio = (giaTri: string) => {
  return new Date(giaTri).toLocaleString("vi-VN");
};

const layThongTinTrangThai = (trangThai: TrangThaiPhieuNhap) => {
  switch (trangThai) {
    case "CHO_XAC_NHAN":
      return {
        nhan: "Chờ xác nhận",
        className: "ql-status ql-status-pending",
      };

    case "DA_NHAP":
      return {
        nhan: "Đã nhập",
        className: "ql-status ql-status-active",
      };

    case "DA_HUY":
      return {
        nhan: "Đã hủy",
        className: "ql-status ql-status-inactive",
      };
  }
};

function PhieuNhapTable({
  danhSachPhieuNhap,
  loading,
  onXemChiTiet,
}: PhieuNhapTableProps) {
  return (
    <div className="ql-table-wrapper">
      <table className="ql-table">
        <thead>
          <tr>
            <th>Mã phiếu</th>
            <th>Nhà cung cấp</th>
            <th>Nhân viên lập</th>
            <th>Ngày nhập</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={7} className="ql-table-message">
                Đang tải danh sách phiếu nhập...
              </td>
            </tr>
          ) : danhSachPhieuNhap.length === 0 ? (
            <tr>
              <td colSpan={6} className="ql-table-message">
                Chưa có phiếu nhập phù hợp
              </td>
            </tr>
          ) : (
            danhSachPhieuNhap.map((phieuNhap) => {
              const thongTinTrangThai = layThongTinTrangThai(
                phieuNhap.trangThaiPhieuNhap,
              );

              return (
                <tr key={phieuNhap.maPhieuNhap}>
                  <td>
                    <strong>#{phieuNhap.maPhieuNhap}</strong>
                  </td>

                  <td>
                    <strong>{phieuNhap.tenNhaCungCap}</strong>

                    {phieuNhap.ghiChu && (
                      <div className="ql-muted-text">{phieuNhap.ghiChu}</div>
                    )}
                  </td>

                  <td>{phieuNhap.tenNhanVienLap}</td>

                  <td>{dinhDangNgayGio(phieuNhap.ngayNhap)}</td>

                  <td>
                    <strong>{dinhDangTien(phieuNhap.tongTien)}</strong>
                  </td>

                  <td>
                    <span className={thongTinTrangThai.className}>
                      {thongTinTrangThai.nhan}
                    </span>
                  </td>
                  <td>
                    <div className="ql-action-group">
                      <button
                        type="button"
                        className="ql-action-button"
                        onClick={() => onXemChiTiet(phieuNhap.maPhieuNhap)}
                      >
                        <i className="bi bi-eye" />
                        Xem chi tiết
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PhieuNhapTable;
