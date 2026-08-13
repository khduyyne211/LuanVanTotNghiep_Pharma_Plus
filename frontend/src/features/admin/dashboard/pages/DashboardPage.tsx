import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import AdminLoading from "../../shared/components/loading/AdminLoading";
import TieuDeTrangQuanLy from "../../shared/components/quan-ly/TieuDeTrangQuanLy";

import useDashboard from "../hooks/useDashboard";

import type {
  MucCanhBaoHetHan,
  TrangThaiDonHangDashboard,
} from "../types/Dashboard";

import "../styles/Dashboard.css";

const MAU_TRANG_THAI_DON_HANG: Record<TrangThaiDonHangDashboard, string> = {
  CHO_XU_LY: "#94a3b8",
  DANG_XU_LY: "#2563eb",
  DANG_GIAO: "#0ea5e9",
  HOAN_THANH: "#16a34a",
  DA_HUY: "#dc2626",
};

const dinhDangTien = (giaTri: number | null | undefined) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(giaTri ?? 0);
};

const dinhDangTienRutGon = (giaTri: number | null | undefined) => {
  const soTien = giaTri ?? 0;

  if (soTien >= 1_000_000_000) {
    return `${new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 1,
    }).format(soTien / 1_000_000_000)} tỷ`;
  }

  if (soTien >= 1_000_000) {
    return `${new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 1,
    }).format(soTien / 1_000_000)} tr`;
  }

  if (soTien >= 1_000) {
    return `${new Intl.NumberFormat("vi-VN", {
      maximumFractionDigits: 0,
    }).format(soTien / 1_000)} nghìn`;
  }

  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(soTien);
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

const dinhDangNgayNgan = (giaTri: string) => {
  if (!giaTri) {
    return "";
  }

  const [, thang, ngay] = giaTri.split("-");

  return `${ngay}/${thang}`;
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

const hienThiTrangThaiDonHang = (trangThai: TrangThaiDonHangDashboard) => {
  switch (trangThai) {
    case "CHO_XU_LY":
      return "Chờ xử lý";

    case "DANG_XU_LY":
      return "Đang xử lý";

    case "DANG_GIAO":
      return "Đang giao";

    case "HOAN_THANH":
      return "Hoàn thành";

    case "DA_HUY":
      return "Đã hủy";

    default:
      return trangThai;
  }
};

function DashboardPage() {
  const {
    tongQuan,
    doanhThuTheoKhoang,
    doanhThu7Ngay,
    thongKeTrangThaiDonHang,

    danhSachTonKhoThap,
    danhSachLoSapHetHan,

    tuNgay,
    denNgay,

    dangTaiTongQuan,
    dangTaiDoanhThu,
    dangTaiBieuDo,
    dangTaiCanhBao,

    loiTongQuan,
    loiDoanhThu,
    loiBieuDo,
    loiCanhBao,

    setTuNgay,
    setDenNgay,

    lamMoiDashboard,
    xemDoanhThuTheoKhoang,

    nguongTonKhoMacDinh,
    soNgayCanhBaoHetHan,
  } = useDashboard();

  const dangTaiDashboard = dangTaiTongQuan || dangTaiBieuDo || dangTaiCanhBao;

  const duLieuBieuDoDoanhThu = doanhThu7Ngay.map((item) => ({
    ...item,
    ngayHienThi: dinhDangNgayNgan(item.ngay),
  }));

  const tongSoDonTheoTrangThai = thongKeTrangThaiDonHang.reduce(
    (tong, item) => tong + item.soLuong,
    0,
  );

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
          disabled={dangTaiDashboard}
        >
          <i className="bi bi-arrow-clockwise" />

          {dangTaiDashboard ? "Đang tải..." : "Làm mới"}
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

          <div className="dashboard-summary-content">
            <span>Tổng sản phẩm</span>

            <strong>
              {dangTaiTongQuan ? "..." : dinhDangSoLuong(tongQuan?.tongSanPham)}
            </strong>

            <small>Sản phẩm trong hệ thống</small>
          </div>
        </article>

        <article className="dashboard-summary-card">
          <div className="dashboard-summary-icon">
            <i className="bi bi-people" />
          </div>

          <div className="dashboard-summary-content">
            <span>Tổng khách hàng</span>

            <strong>
              {dangTaiTongQuan
                ? "..."
                : dinhDangSoLuong(tongQuan?.tongKhachHang)}
            </strong>

            <small>Khách hàng đã ghi nhận</small>
          </div>
        </article>

        <article className="dashboard-summary-card">
          <div className="dashboard-summary-icon">
            <i className="bi bi-person-badge" />
          </div>

          <div className="dashboard-summary-content">
            <span>Tổng nhân viên</span>

            <strong>
              {dangTaiTongQuan
                ? "..."
                : dinhDangSoLuong(tongQuan?.tongNhanVien)}
            </strong>

            <small>Nhân viên nội bộ</small>
          </div>
        </article>

        <article className="dashboard-summary-card">
          <div className="dashboard-summary-icon">
            <i className="bi bi-receipt" />
          </div>

          <div className="dashboard-summary-content">
            <span>Đơn mới hôm nay</span>

            <strong>
              {dangTaiTongQuan
                ? "..."
                : dinhDangSoLuong(tongQuan?.donMoiHomNay)}
            </strong>

            <small>Đơn phát sinh trong ngày</small>
          </div>
        </article>
      </section>

      {loiBieuDo && (
        <div className="dashboard-error">
          <i className="bi bi-exclamation-circle-fill" />

          <span>{loiBieuDo}</span>
        </div>
      )}

      <section className="dashboard-chart-grid">
        <article className="dashboard-chart-card dashboard-chart-card-revenue">
          <div className="dashboard-chart-header">
            <div>
              <h2>Doanh thu 7 ngày gần nhất</h2>

              <p>Chỉ tính đơn đã hoàn thành và đã thanh toán.</p>
            </div>

            <div className="dashboard-chart-header-icon">
              <i className="bi bi-graph-up-arrow" />
            </div>
          </div>

          <div className="dashboard-chart-content">
            {dangTaiBieuDo ? (
              <AdminLoading noiDung="Đang tải dữ liệu biểu đồ..." />
            ) : duLieuBieuDoDoanhThu.length === 0 ? (
              <div className="dashboard-chart-message">
                Chưa có dữ liệu doanh thu.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={duLieuBieuDoDoanhThu}
                  margin={{
                    top: 10,
                    right: 12,
                    bottom: 0,
                    left: 0,
                  }}
                >
                  <CartesianGrid
                    stroke="#eef1f5"
                    strokeDasharray="4 4"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="ngayHienThi"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#667085",
                      fontSize: 12,
                    }}
                    dy={8}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={72}
                    tick={{
                      fill: "#667085",
                      fontSize: 12,
                    }}
                    tickFormatter={(value) => dinhDangTienRutGon(Number(value))}
                  />

                  <Tooltip
                    formatter={(value) => [
                      dinhDangTien(Number(value)),
                      "Doanh thu",
                    ]}
                    labelFormatter={(label) => `Ngày ${String(label)}`}
                    cursor={{
                      stroke: "#cbd5e1",
                      strokeDasharray: "4 4",
                    }}
                    contentStyle={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="doanhThu"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#ffffff",
                      stroke: "#2563eb",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 6,
                      fill: "#2563eb",
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </article>

        <article className="dashboard-chart-card dashboard-chart-card-orders">
          <div className="dashboard-chart-header">
            <div>
              <h2>Trạng thái đơn hàng</h2>

              <p>Phân bố số lượng đơn theo trạng thái hiện tại.</p>
            </div>

            <div className="dashboard-chart-header-icon">
              <i className="bi bi-pie-chart" />
            </div>
          </div>

          <div className="dashboard-order-processing">
            <div>
              <span>Đơn đang xử lý</span>

              <strong>
                {dangTaiTongQuan
                  ? "..."
                  : dinhDangSoLuong(tongQuan?.donDangXuLy)}
              </strong>
            </div>

            <i className="bi bi-hourglass-split" />
          </div>

          <div className="dashboard-donut-layout">
            <div className="dashboard-donut-wrapper">
              {dangTaiBieuDo ? (
                <AdminLoading noiDung="Đang tải trạng thái đơn hàng..." />
              ) : tongSoDonTheoTrangThai === 0 ? (
                <div className="dashboard-chart-message">Chưa có đơn hàng.</div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip
                        formatter={(value, name) => [
                          dinhDangSoLuong(Number(value)),
                          hienThiTrangThaiDonHang(
                            name as TrangThaiDonHangDashboard,
                          ),
                        ]}
                        contentStyle={{
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
                        }}
                      />

                      <Pie
                        data={thongKeTrangThaiDonHang}
                        dataKey="soLuong"
                        nameKey="trangThai"
                        innerRadius="66%"
                        outerRadius="88%"
                        paddingAngle={3}
                        stroke="#ffffff"
                        strokeWidth={2}
                      >
                        {thongKeTrangThaiDonHang.map((item) => (
                          <Cell
                            key={item.trangThai}
                            fill={MAU_TRANG_THAI_DON_HANG[item.trangThai]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="dashboard-donut-center">
                    <strong>{dinhDangSoLuong(tongSoDonTheoTrangThai)}</strong>

                    <span>Tổng đơn</span>
                  </div>
                </>
              )}
            </div>

            <div className="dashboard-order-legend">
              {thongKeTrangThaiDonHang.map((item) => (
                <div
                  key={item.trangThai}
                  className="dashboard-order-legend-item"
                >
                  <span
                    className="dashboard-order-legend-dot"
                    style={{
                      backgroundColor: MAU_TRANG_THAI_DON_HANG[item.trangThai],
                    }}
                  />

                  <span className="dashboard-order-legend-label">
                    {hienThiTrangThaiDonHang(item.trangThai)}
                  </span>

                  <strong>{dinhDangSoLuong(item.soLuong)}</strong>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="dashboard-revenue-section">
        <div className="dashboard-section-header">
          <div>
            <h2>Thống kê doanh thu</h2>

            <p>Tổng hợp doanh thu đã hoàn thành và đã thanh toán.</p>
          </div>
        </div>

        <div className="dashboard-revenue-summary-grid">
          <article className="dashboard-revenue-summary-card">
            <div className="dashboard-revenue-summary-icon">
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

          <article className="dashboard-revenue-summary-card">
            <div className="dashboard-revenue-summary-icon">
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

          <article className="dashboard-revenue-summary-card">
            <div className="dashboard-revenue-summary-icon">
              <i className="bi bi-wallet2" />
            </div>

            <div>
              <span>Doanh thu khoảng đã chọn</span>

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
                  : "Chưa thực hiện thống kê"}
              </small>
            </div>
          </article>
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
                      <AdminLoading
                        noiDung="Đang tải dữ liệu tồn kho..."
                        gon
                      />
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
                      <AdminLoading
                        noiDung="Đang tải dữ liệu lô sắp hết hạn..."
                        gon
                      />
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
