import TieuDeTrangQuanLy from "../../../shared/components/quan-ly/TieuDeTrangQuanLy";
import useDashboard from "../hooks/useDashboard";
import "../styles/Dashboard.css";

const dinhDangTien = (giaTri: number | null | undefined) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
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

function DashboardPage() {
  const {
    tongQuan,
    doanhThuTheoKhoang,
    tuNgay,
    denNgay,
    dangTaiTongQuan,
    dangTaiDoanhThu,
    loiTongQuan,
    loiDoanhThu,
    setTuNgay,
    setDenNgay,
    taiTongQuan,
    xemDoanhThuTheoKhoang,
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
          onClick={() => void taiTongQuan()}
          disabled={dangTaiTongQuan}
        >
          <i className="bi bi-arrow-clockwise" />

          {dangTaiTongQuan ? "Đang tải..." : "Làm mới"}
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
              {dangTaiTongQuan
                ? "..."
                : dinhDangTien(tongQuan?.doanhThuHomNay)}
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

            <p>
              Chỉ tính các đơn hàng đã hoàn thành và đã thanh toán.
            </p>
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
          <div className="dashboard-error">
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
                ? `${dinhDangNgay(
                    doanhThuTheoKhoang.tuNgay,
                  )} - ${dinhDangNgay(doanhThuTheoKhoang.denNgay)}`
                : "Chọn khoảng ngày và bấm Xem doanh thu"}
            </small>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;