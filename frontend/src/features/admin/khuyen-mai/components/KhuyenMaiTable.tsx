import AdminLoading from "../../shared/components/loading/AdminLoading";
import type { KhuyenMai } from "../types/KhuyenMai";

type KhuyenMaiTableProps = {
  danhSachKhuyenMai: KhuyenMai[];
  loading: boolean;
  onSua: (khuyenMai: KhuyenMai) => void;
};

const dinhDangTien = (giaTri: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(giaTri);
};

const dinhDangThoiGian = (thoiGian: string) => {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(thoiGian));
};

const layTenLoaiKhuyenMai = (khuyenMai: KhuyenMai) => {
  return khuyenMai.loaiKhuyenMai === "PHAN_TRAM"
    ? "Giảm theo phần trăm"
    : "Giảm theo số tiền";
};

const layGiaTriKhuyenMai = (khuyenMai: KhuyenMai) => {
  if (khuyenMai.loaiKhuyenMai === "PHAN_TRAM") {
    return khuyenMai.giamGia !== null
      ? `${khuyenMai.giamGia}%`
      : "Chưa cập nhật";
  }

  return khuyenMai.giaTriGiam !== null
    ? dinhDangTien(khuyenMai.giaTriGiam)
    : "Chưa cập nhật";
};

const layThongTinTrangThai = (trangThai: KhuyenMai["trangThaiKhuyenMai"]) => {
  if (trangThai === "DANG_DIEN_RA") {
    return {
      tenTrangThai: "Đang diễn ra",
      className: "ql-status ql-status-active",
    };
  }

  if (trangThai === "DA_KET_THUC") {
    return {
      tenTrangThai: "Đã kết thúc",
      className: "ql-status ql-status-inactive",
    };
  }

  return {
    tenTrangThai: "Chưa bắt đầu",
    className: "ql-status ql-status-pending",
  };
};

function KhuyenMaiTable({
  danhSachKhuyenMai,
  loading,
  onSua,
}: KhuyenMaiTableProps) {
  if (loading) {
    return <AdminLoading noiDung="Đang tải danh sách khuyến mãi..." />;
  }

  return (
    <div className="ql-table-wrapper">
      <table className="ql-table">
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên chương trình</th>
            <th>Loại khuyến mãi</th>
            <th>Giá trị giảm</th>
            <th>Thời gian bắt đầu</th>
            <th>Thời gian kết thúc</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {danhSachKhuyenMai.length === 0 ? (
            <tr>
              <td colSpan={8} className="ql-table-message">
                Chưa có chương trình khuyến mãi
              </td>
            </tr>
          ) : (
            danhSachKhuyenMai.map((khuyenMai) => {
              const thongTinTrangThai = layThongTinTrangThai(
                khuyenMai.trangThaiKhuyenMai,
              );

              return (
                <tr key={khuyenMai.maKhuyenMai}>
                  <td>
                    <strong>#{khuyenMai.maKhuyenMai}</strong>
                  </td>

                  <td>
                    <strong>{khuyenMai.tenChuongTrinh}</strong>
                  </td>

                  <td>{layTenLoaiKhuyenMai(khuyenMai)}</td>

                  <td>{layGiaTriKhuyenMai(khuyenMai)}</td>

                  <td>{dinhDangThoiGian(khuyenMai.thoiGianBatDau)}</td>

                  <td>{dinhDangThoiGian(khuyenMai.thoiGianKetThuc)}</td>

                  <td>
                    <span className={thongTinTrangThai.className}>
                      {thongTinTrangThai.tenTrangThai}
                    </span>
                  </td>

                  <td>
                    <div className="ql-action-group">
                      <button
                        type="button"
                        className="ql-action-button"
                        onClick={() => onSua(khuyenMai)}
                      >
                        <i className="bi bi-pencil-square" />
                        Sửa
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

export default KhuyenMaiTable;
