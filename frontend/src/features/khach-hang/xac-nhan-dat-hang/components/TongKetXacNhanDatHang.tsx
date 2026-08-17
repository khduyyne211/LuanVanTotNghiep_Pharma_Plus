interface TongKetXacNhanDatHangProps {
  tongTienGoc: number;
  tongGiamGiaTrucTiep: number;
  giamGiaVoucher: number;
  maGiamGiaVoucher: string | null;
  dangKiemTraVoucher: boolean;
  thongBaoVoucher: string;
  phiGiaoHang: number;

  coTheHoanTat: boolean;
  dangTaoDonHang: boolean;
  loiTaoDonHang: string;

  hoanTatMuaHang: () => void;
}

function dinhDangTien(soTien: number) {
  return soTien.toLocaleString("vi-VN") + "đ";
}

function dinhDangTienGiam(soTien: number) {
  if (soTien <= 0) {
    return "0đ";
  }

  return `-${dinhDangTien(soTien)}`;
}

function TongKetXacNhanDatHang({
  tongTienGoc,
  tongGiamGiaTrucTiep,
  giamGiaVoucher,
  maGiamGiaVoucher,
  dangKiemTraVoucher,
  thongBaoVoucher,
  phiGiaoHang,
  coTheHoanTat,
  dangTaoDonHang,
  loiTaoDonHang,
  hoanTatMuaHang,
}: TongKetXacNhanDatHangProps) {
  const tietKiemDuoc =
    tongGiamGiaTrucTiep +
    giamGiaVoucher;

  const tongThanhToan =
    tongTienGoc +
    phiGiaoHang -
    tongGiamGiaTrucTiep -
    giamGiaVoucher;

  return (
    <aside className="xac-nhan-tong-ket">
      <h2>Thông tin thanh toán</h2>

      <div className="xac-nhan-tong-ket-dong">
        <span>Tổng tiền hàng</span>

        <strong>
          {dinhDangTien(
            tongTienGoc
          )}
        </strong>
      </div>

      <div className="xac-nhan-tong-ket-dong">
        <span>Giảm giá trực tiếp</span>

        <strong className="xac-nhan-gia-tri-khuyen-mai">
          {dinhDangTienGiam(
            tongGiamGiaTrucTiep
          )}
        </strong>
      </div>

      {maGiamGiaVoucher && (
        <div className="xac-nhan-tong-ket-dong">
          <span>Voucher đã áp dụng</span>

          <strong>
            {maGiamGiaVoucher}
          </strong>
        </div>
      )}

      <div className="xac-nhan-tong-ket-dong">
        <span>Giảm giá voucher</span>

        <strong className="xac-nhan-gia-tri-khuyen-mai">
          {dinhDangTienGiam(
            giamGiaVoucher
          )}
        </strong>
      </div>

      <div className="xac-nhan-tong-ket-dong">
        <span>Tiết kiệm được</span>

        <strong className="xac-nhan-gia-tri-khuyen-mai">
          {dinhDangTien(
            tietKiemDuoc
          )}
        </strong>
      </div>

      <div className="xac-nhan-tong-ket-dong">
        <span>Phí giao hàng</span>

        <strong>
          {dinhDangTien(
            phiGiaoHang
          )}
        </strong>
      </div>

      <div className="xac-nhan-tong-ket-thanh-tien">
        <span>Thành tiền</span>

        <strong>
          {dinhDangTien(
            tongThanhToan
          )}
        </strong>
      </div>

      {dangKiemTraVoucher && (
        <p className="xac-nhan-tong-ket-luu-y">
          Đang kiểm tra lại voucher...
        </p>
      )}

      {thongBaoVoucher && (
        <p className="xac-nhan-loi-tao-don">
          {thongBaoVoucher}
        </p>
      )}

      <button
        type="button"
        className="xac-nhan-nut-hoan-tat"
        disabled={
          !coTheHoanTat ||
          dangTaoDonHang ||
          dangKiemTraVoucher
        }
        onClick={hoanTatMuaHang}
      >
        {dangTaoDonHang
          ? "Đang tạo đơn hàng..."
          : "Hoàn tất mua hàng"}
      </button>

      {loiTaoDonHang && (
        <p className="xac-nhan-loi-tao-don">
          {loiTaoDonHang}
        </p>
      )}
    </aside>
  );
}

export default TongKetXacNhanDatHang;