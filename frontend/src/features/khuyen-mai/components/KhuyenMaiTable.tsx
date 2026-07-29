import type { KhuyenMai } from "../types/KhuyenMai";

type KhuyenMaiTableProps = {
  danhSachKhuyenMai: KhuyenMai[];
  loading: boolean;
  loi: string;
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

const layThongTinTrangThai = (
  trangThai: KhuyenMai["trangThaiKhuyenMai"],
) => {
  if (trangThai === "DANG_DIEN_RA") {
    return {
      tenTrangThai: "Đang diễn ra",
      className: "status-active",
    };
  }

  if (trangThai === "DA_KET_THUC") {
    return {
      tenTrangThai: "Đã kết thúc",
      className: "status-inactive",
    };
  }

  return {
    tenTrangThai: "Chưa bắt đầu",
    className: "status-pending",
  };
};

function KhuyenMaiTable({
  danhSachKhuyenMai,
  loading,
  loi,
  onSua,
}: KhuyenMaiTableProps) {
  return (
    <div className="table-card">
      {loading ? (
        <p style={{ padding: "16px" }}>
          Đang tải danh sách khuyến mãi...
        </p>
      ) : loi ? (
        <p style={{ padding: "16px" }}>{loi}</p>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
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
                {danhSachKhuyenMai.map((khuyenMai) => {
                  const thongTinTrangThai = layThongTinTrangThai(
                    khuyenMai.trangThaiKhuyenMai,
                  );

                  return (
                    <tr key={khuyenMai.maKhuyenMai}>
                      <td>{khuyenMai.maKhuyenMai}</td>

                      <td>
                        <strong>{khuyenMai.tenChuongTrinh}</strong>
                      </td>

                      <td>{layTenLoaiKhuyenMai(khuyenMai)}</td>

                      <td>{layGiaTriKhuyenMai(khuyenMai)}</td>

                      <td>
                        {dinhDangThoiGian(
                          khuyenMai.thoiGianBatDau,
                        )}
                      </td>

                      <td>
                        {dinhDangThoiGian(
                          khuyenMai.thoiGianKetThuc,
                        )}
                      </td>

                      <td>
                        <span className={thongTinTrangThai.className}>
                          {thongTinTrangThai.tenTrangThai}
                        </span>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="small-button"
                            onClick={() => onSua(khuyenMai)}
                          >
                            Sửa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {danhSachKhuyenMai.length === 0 && (
                  <tr>
                    <td colSpan={8} className="empty-cell">
                      Chưa có chương trình khuyến mãi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div
            className="pagination-row"
            style={{ padding: "0 16px 16px" }}
          >
            <div>
              Tổng cộng{" "}
              <strong>{danhSachKhuyenMai.length}</strong>{" "}
              chương trình khuyến mãi
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default KhuyenMaiTable;