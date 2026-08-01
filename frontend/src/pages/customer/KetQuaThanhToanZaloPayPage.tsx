import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import "../../features/thanh-toan/styles/KetQuaThanhToanZaloPay.css";

type LoaiKetQuaThanhToan =
  | "THANH_CONG"
  | "KHONG_THANH_CONG"
  | "DANG_XAC_NHAN";

function KetQuaThanhToanZaloPayPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const status = searchParams.get("status");
  const appId = searchParams.get("appid");
  const appTransId = searchParams.get("apptransid");
  const amount = searchParams.get("amount");
  const pmcId = searchParams.get("pmcid");

  const laThanhToanThanhCong = status === "1";
  const coDuLieuKetQua = Boolean(status || appId || appTransId || amount);

  let loaiKetQua: LoaiKetQuaThanhToan = "DANG_XAC_NHAN";

  if (laThanhToanThanhCong) {
    loaiKetQua = "THANH_CONG";
  } else if (coDuLieuKetQua) {
    loaiKetQua = "KHONG_THANH_CONG";
  }

  useEffect(() => {
    const boHenGio = window.setTimeout(() => {
      navigate("/tai-khoan/don-hang", {
        replace: true,
      });
    }, 5000);

    return () => {
      window.clearTimeout(boHenGio);
    };
  }, [navigate]);

  const noiDungKetQua = {
    THANH_CONG: {
      icon: "bi-check-circle-fill",
      tieuDe: "Thanh toán thành công",
      moTa:
        "ZaloPay đã ghi nhận giao dịch. Trạng thái đơn hàng được xác nhận và cập nhật an toàn bởi hệ thống Pharma+.",
    },

    KHONG_THANH_CONG: {
      icon: "bi-x-circle-fill",
      tieuDe: "Thanh toán chưa hoàn tất",
      moTa:
        "ZaloPay chưa trả về trạng thái thanh toán thành công. Đơn hàng vẫn có thể đang ở trạng thái chờ thanh toán.",
    },

    DANG_XAC_NHAN: {
      icon: "bi-clock-history",
      tieuDe: "Đang xác nhận thanh toán",
      moTa:
        "Hệ thống chưa nhận được đầy đủ thông tin giao dịch. Bạn có thể kiểm tra trạng thái trong danh sách đơn hàng.",
    },
  }[loaiKetQua];

  const classKetQua = loaiKetQua.toLowerCase().replaceAll("_", "-");

  const soTien = amount !== null ? Number(amount) : null;

  const soTienHienThi =
    soTien !== null && Number.isFinite(soTien)
      ? new Intl.NumberFormat("vi-VN").format(soTien) + " đ"
      : null;

  const tenKenhThanhToan = pmcId === "38" ? "Ví ZaloPay" : null;

  return (
    <main className="ket-qua-zalopay-trang">
      <div className="page-container">
        <div
          className={
            `ket-qua-zalopay-khoi ` +
            `ket-qua-zalopay-khoi--${classKetQua}`
          }
        >
          <div className="ket-qua-zalopay-bieu-tuong">
            <i className={`bi ${noiDungKetQua.icon}`}></i>
          </div>

          <h1>{noiDungKetQua.tieuDe}</h1>

          <p className="ket-qua-zalopay-mo-ta">
            {noiDungKetQua.moTa}
          </p>

          {appTransId && (
            <div className="ket-qua-zalopay-thong-tin">
              <span>Mã giao dịch</span>
              <strong>{appTransId}</strong>
            </div>
          )}

          {soTienHienThi && (
            <div className="ket-qua-zalopay-thong-tin">
              <span>Số tiền</span>
              <strong>{soTienHienThi}</strong>
            </div>
          )}

          {tenKenhThanhToan && (
            <div className="ket-qua-zalopay-thong-tin">
              <span>Phương thức</span>
              <strong>{tenKenhThanhToan}</strong>
            </div>
          )}

          <p className="ket-qua-zalopay-chuyen-trang">
            Hệ thống sẽ tự chuyển đến danh sách đơn hàng sau vài giây.
          </p>

          <Link
            to="/tai-khoan/don-hang"
            replace
            className="ket-qua-zalopay-nut"
          >
            Xem đơn hàng của tôi
            <i className="bi bi-chevron-right"></i>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default KetQuaThanhToanZaloPayPage;