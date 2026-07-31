interface TongKetXacNhanDatHangProps {
  tongTienHang: number;
  coTheHoanTat: boolean;
  dangTaoDonHang: boolean;
  loiTaoDonHang: string;
  hoanTatMuaHang: () => void;
}

function dinhDangTien(soTien: number) {
  return soTien.toLocaleString("vi-VN") + "đ";
}

function TongKetXacNhanDatHang({tongTienHang, coTheHoanTat, dangTaoDonHang, loiTaoDonHang, hoanTatMuaHang,}: TongKetXacNhanDatHangProps) {
  const phiGiaoHang = 0;
  const giamGia = 0;

  const tongThanhToan = tongTienHang + phiGiaoHang - giamGia;

  return (
    <aside className="xac-nhan-tong-ket">
      <h2>Thông tin thanh toán</h2>

      <div className="xac-nhan-tong-ket-dong">
        <span>Tổng tiền hàng</span>
        <strong>{dinhDangTien(tongTienHang)}</strong>
      </div>

      <div className="xac-nhan-tong-ket-dong">
        <span>Phí giao hàng</span>
        <strong>{dinhDangTien(phiGiaoHang)}</strong>
      </div>

      <div className="xac-nhan-tong-ket-dong">
        <span>Giảm giá</span>
        <strong>{dinhDangTien(giamGia)}</strong>
      </div>

      <div className="xac-nhan-tong-ket-thanh-tien">
        <span>Thành tiền</span>
        <strong>{dinhDangTien(tongThanhToan)}</strong>
      </div>

      <button
        type="button"
        className="xac-nhan-nut-hoan-tat"
        disabled={!coTheHoanTat || dangTaoDonHang}
        onClick={hoanTatMuaHang}
      >
        {dangTaoDonHang
          ? "Đang tạo đơn hàng..."
          : "Hoàn tất mua hàng"}
      </button>

      {!coTheHoanTat && (
        <p className="xac-nhan-tong-ket-luu-y">
          Vui lòng chọn địa chỉ nhận hàng trước khi tiếp tục.
        </p>
      )}

      {loiTaoDonHang && (
        <p className="xac-nhan-loi-tao-don">
          {loiTaoDonHang}
        </p>
      )}
    </aside>
  );
}

export default TongKetXacNhanDatHang;