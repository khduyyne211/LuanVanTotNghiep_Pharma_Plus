import type { PhuongThucThanhToan as LoaiPhuongThucThanhToan } from "../types/XacNhanDatHang";

interface PhuongThucThanhToanProps {
  phuongThucDangChon: LoaiPhuongThucThanhToan;
  thayDoiPhuongThuc: (
    phuongThuc: LoaiPhuongThucThanhToan
  ) => void;
}

function PhuongThucThanhToan({
  phuongThucDangChon,
  thayDoiPhuongThuc,
}: PhuongThucThanhToanProps) {
  return (
    <section className="xac-nhan-khu-vuc-thanh-toan">
      <h2 className="xac-nhan-tieu-de-khu-vuc">
        Chọn phương thức thanh toán
      </h2>

      <div className="xac-nhan-thanh-toan-danh-sach">
        <label className="xac-nhan-thanh-toan-muc">
          <input
            type="radio"
            name="phuongThucThanhToan"
            checked={phuongThucDangChon === "COD"}
            onChange={() => thayDoiPhuongThuc("COD")}
          />

          <span className="xac-nhan-thanh-toan-icon">
            <i className="bi bi-cash"></i>
          </span>

          <strong>
            Thanh toán tiền mặt khi nhận hàng
          </strong>
        </label>

        <label className="xac-nhan-thanh-toan-muc">
          <input
            type="radio"
            name="phuongThucThanhToan"
            checked={phuongThucDangChon === "QR"}
            onChange={() => thayDoiPhuongThuc("QR")}
          />

          <span className="xac-nhan-thanh-toan-icon">
            <i className="bi bi-qr-code"></i>
          </span>

          <strong>
            Thanh toán bằng chuyển khoản (QR Code)
          </strong>
        </label>
      </div>
    </section>
  );
}

export default PhuongThucThanhToan;