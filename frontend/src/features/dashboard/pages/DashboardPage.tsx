import TieuDeTrangQuanLy from "../../../shared/components/quan-ly/TieuDeTrangQuanLy";
import useDashboard from "../hooks/useDashboard";
import type { MucCanhBaoHetHan } from "../types/Dashboard";
import "../styles/Dashboard.css";

const dinhDangTien = (giaTri: number | null | undefined) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(giaTri ?? 0);
};

const dinhDangSoLuong = (giaTri: number | null | undefined) => {
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 3,
  }).format(giaTri ?? 0);
};

const dinhDangNgay = (giaTri: string) => {
  if (!giaTri) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN").format(
    new Date(`${giaTri}T00:00:00`),
  );
};

const hienThiMucCanhBao = (mucCanhBao: MucCanhBaoHetHan) => {
  switch (mucCanhBao) {
    case "NGUY_CAP":
      return "Nguy cấp";

    case "SAP_HET_HAN":
      return "Sắp hết hạn";

    case "CAN_THEO_DOI":
      return "Cần theo dõi";

    default:
      return mucCanhBao;
  }
};

function DashboardPage() {
  const {
    tongQuan,
    doanhThuTheoKhoang,

    danhSachTonKhoThap,
    danhSachLoSapHetHan,

    tuNgay,
    denNgay,

    dangTaiTongQuan,
    dangTaiDoanhThu,
    dangTaiCanhBao,

    loiTongQuan,
    loiDoanhThu,
    loiCanhBao,

    setTuNgay,
    setDenNgay,

    lamMoiDashboard,
    xemDoanhThuTheoKhoang,

    nguongTonKhoMacDinh,
    soNgayCanhBaoHetHan,
  } = useDashboard();

  return (
    <div className="ql-page dashboard-page">
      <TieuDeTrangQuanLy
        tieuDe="Dashboard"
        moTa="Theo dõi nhanh tình hình hoạt động của hệ thống Pharma+"
      />

      <div className="dashboard-heading-actions">
        <button
          type="button"
          className="ql-button ql-button-ghost"
          onClick={() => void lamMoiDashboard()}
          disabled={dangTaiTongQuan || dangTaiCanhBao}
        >
          <i className="bi bi-arrow-clockwise" />

          {dangTaiTongQuan || dangTaiCanhBao ? "Đang tải..." : "Làm mới"}
        </button>
      </div>

      {loiTongQuan && (
        <div className="dashboard-error">
          <i className="bi bi-exclamation-circle-fill" />

          <span>{loiTongQuan}</span>
        </div>
      )}

      <section className="dashboard-summary-grid">
        <article className="dashboard-summary-card">
          <div className="dashboard-summary-icon">
            <i className="bi bi-capsule-pill" />
          </div>

          <div>
            <span>Tổng sản phẩm</span>

            <strong>
              {dangTaiTongQuan ? "..." : (tongQuan?.tongSanPham ?? 0)}
            </strong>
          </div>
        </article>

        <article className="dashboard-summary-card">
          <div className="dashboard-summary-icon">
            <i className="bi bi-people" />
          </div>

          <div>
            <span>Tổng khách hàng</span>

            <strong>
              {dangTaiTongQuan ? "..." : (tongQuan?.tongKhachHang ?? 0)}
            </strong>
          </div>
        </article>

        <article className="dashboard-summary-card">
          <div className="dashboard-summary-icon">
            <i className="bi bi-person-badge" />
          </div>

          <div>
            <span>Tổng nhân viên</span>

            <strong>
              {dangTaiTongQuan ? "..." : (tongQuan?.tongNhanVien ?? 0)}
            </strong>
          </div>
        </article>

        <article className="dashboard-summary-card">
          <div className="dashboard-summary-icon">
            <i className="bi bi-receipt" />
          </div>

          <div>
            <span>Đơn mới hôm nay</span>

            <strong>
              {dangTaiTongQuan ? "..." : (tongQuan?.donMoiHomNay ?? 0)}
            </strong>
          </div>
        </article>

        <article className="dashboard-summary-card">
          <div className="dashboard-summary-icon">
            <i className="bi bi-hourglass-split" />
          </div>

          <div>
            <span>Đơn đang xử lý</span>

            <strong>
              {dangTaiTongQuan ? "..." : (tongQuan?.donDangXuLy ?? 0)}
            </strong>
          </div>
        </article>

        <article className="dashboard-summary-card dashboard-revenue-card">
          <div className="dashboard-summary-icon">
            <i className="bi bi-cash-coin" />
          </div>

          <div>
            <span>Doanh thu hôm nay</span>

            <strong>
              {dangTaiTongQuan ? "..." : dinhDangTien(tongQuan?.doanhThuHomNay)}
            </strong>
          </div>
        </article>

        <article className="dashboard-summary-card dashboard-revenue-card">
          <div className="dashboard-summary-icon">
            <i className="bi bi-calendar-check" />
          </div>

          <div>
            <span>Doanh thu tháng này</span>

            <strong>
              {dangTaiTongQuan
                ? "..."
                : dinhDangTien(tongQuan?.doanhThuThangNay)}
            </strong>
          </div>
        </article>
      </section>

      <section className="dashboard-report-section">
        <div className="dashboard-section-header">
          <div>
            <h2>Doanh thu theo khoảng ngày</h2>

            <p>Chỉ tính các đơn hàng đã hoàn thành và đã thanh toán.</p>
          </div>
        </div>

        <div className="dashboard-date-filter">
          <div className="form-group">
            <label htmlFor="dashboardTuNgay">Từ ngày</label>

            <input
              id="dashboardTuNgay"
              type="date"
              value={tuNgay}
              onChange={(event) => setTuNgay(event.target.value)}
              disabled={dangTaiDoanhThu}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dashboardDenNgay">Đến ngày</label>

            <input
              id="dashboardDenNgay"
              type="date"
              value={denNgay}
              onChange={(event) => setDenNgay(event.target.value)}
              disabled={dangTaiDoanhThu}
            />
          </div>

          <button
            type="button"
            className="ql-button ql-button-primary"
            onClick={() => void xemDoanhThuTheoKhoang()}
            disabled={dangTaiDoanhThu}
          >
            <i className="bi bi-bar-chart-line" />

            {dangTaiDoanhThu ? "Đang thống kê..." : "Xem doanh thu"}
          </button>
        </div>

        {loiDoanhThu && (
          <div className="dashboard-error dashboard-error-spacing">
            <i className="bi bi-exclamation-circle-fill" />

            <span>{loiDoanhThu}</span>
          </div>
        )}

        <div className="dashboard-revenue-result">
          <div className="dashboard-revenue-result-icon">
            <i className="bi bi-wallet2" />
          </div>

          <div>
            <span>Doanh thu trong khoảng</span>

            <strong>
              {doanhThuTheoKhoang
                ? dinhDangTien(doanhThuTheoKhoang.doanhThu)
                : dinhDangTien(0)}
            </strong>

            <small>
              {doanhThuTheoKhoang
                ? `${dinhDangNgay(doanhThuTheoKhoang.tuNgay)} - ${dinhDangNgay(
                    doanhThuTheoKhoang.denNgay,
                  )}`
                : "Chọn khoảng ngày và bấm Xem doanh thu"}
            </small>
          </div>
        </div>
      </section>

      {loiCanhBao && (
        <div className="dashboard-error dashboard-warning-error">
          <i className="bi bi-exclamation-circle-fill" />

          <span>{loiCanhBao}</span>
        </div>
      )}

      <section className="dashboard-warning-grid">
        <div className="dashboard-warning-section">
          <div className="dashboard-warning-header">
            <div>
              <h2>Sản phẩm tồn kho thấp</h2>

              <p>
                Các sản phẩm có tổng tồn quy đổi không vượt quá{" "}
                <strong>{nguongTonKhoMacDinh}</strong>.
              </p>
            </div>

            <span className="dashboard-count-badge">
              {danhSachTonKhoThap.length}
            </span>
          </div>

          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Mã SP</th>
                  <th>Sản phẩm</th>
                  <th>Tồn quy đổi</th>
                  <th>Ngưỡng</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>

              <tbody>
                {dangTaiCanhBao ? (
                  <tr>
                    <td colSpan={5} className="dashboard-table-message">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : danhSachTonKhoThap.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="dashboard-table-message">
                      Không có sản phẩm tồn kho thấp
                    </td>
                  </tr>
                ) : (
                  danhSachTonKhoThap.slice(0, 10).map((sanPham) => (
                    <tr key={sanPham.maSanPham}>
                      <td>#{sanPham.maSanPham}</td>

                      <td>
                        <strong>{sanPham.tenSanPham}</strong>
                      </td>

                      <td>
                        <strong>
                          {dinhDangSoLuong(sanPham.tongSoLuongTon)}
                        </strong>
                      </td>

                      <td>{dinhDangSoLuong(sanPham.nguongTon)}</td>

                      <td>
                        <span className="dashboard-status dashboard-status-low-stock">
                          Sắp hết hàng
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dashboard-warning-section">
          <div className="dashboard-warning-header">
            <div>
              <h2>Lô hàng sắp hết hạn</h2>

              <p>
                Các lô đang sử dụng sẽ hết hạn trong{" "}
                <strong>{soNgayCanhBaoHetHan}</strong> ngày tới.
              </p>
            </div>

            <span className="dashboard-count-badge">
              {danhSachLoSapHetHan.length}
            </span>
          </div>

          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Phiếu nhập</th>
                  <th>Tồn quy đổi</th>
                  <th>Hạn sử dụng</th>
                  <th>Còn lại</th>
                  <th>Mức cảnh báo</th>
                </tr>
              </thead>

              <tbody>
                {dangTaiCanhBao ? (
                  <tr>
                    <td colSpan={6} className="dashboard-table-message">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : danhSachLoSapHetHan.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="dashboard-table-message">
                      Không có lô hàng sắp hết hạn
                    </td>
                  </tr>
                ) : (
                  danhSachLoSapHetHan.slice(0, 10).map((loHang) => (
                    <tr key={loHang.maChiTietPhieuNhap}>
                      <td>
                        <strong>{loHang.tenSanPham}</strong>

                        <small className="dashboard-table-subtext">
                          {loHang.tenDonViTinh}
                        </small>
                      </td>

                      <td>#{loHang.maPhieuNhap}</td>

                      <td>{dinhDangSoLuong(loHang.soLuongConLai)}</td>

                      <td>{dinhDangNgay(loHang.hanSuDung)}</td>

                      <td>
                        <strong>{loHang.soNgayConLai} ngày</strong>
                      </td>

                      <td>
                        <span
                          className={`dashboard-status dashboard-status-${loHang.mucCanhBao.toLowerCase()}`}
                        >
                          {hienThiMucCanhBao(loHang.mucCanhBao)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
