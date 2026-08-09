import { useNavigate } from "react-router-dom";
import ThanhLocDonHang from "../../features/customer/don-hang/components/ThanhLocDonHang";
import TheDonHang from "../../features/customer/don-hang/components/TheDonHang";
import { useDanhSachDonHang } from "../../features/customer/don-hang/hooks/useDanhSachDonHang";

import "../../features/customer/don-hang/styles/DonHangCuaToi.css";

export default function DonHangCuaToiPage() {
  const navigate = useNavigate();

  const {
    danhSachDonHang,
    danhSachDonHangHienThi,
    boLocDangChon,
    dangTai,
    loi,
    setBoLocDangChon,
    taiDanhSachDonHang,
  } = useDanhSachDonHang();

  function xuLyXemChiTiet(maDonHang: number) {
  navigate(`/tai-khoan/don-hang/${maDonHang}`);
}

  function hienThiNoiDungDanhSach() {
    if (dangTai) {
      return (
        <div className="don-hang-thong-bao">
          <div className="don-hang-dang-tai" />
          <p>Đang tải danh sách đơn hàng...</p>
        </div>
      );
    }

    if (loi) {
      return (
        <div className="don-hang-thong-bao don-hang-thong-bao--loi">
          <p>{loi}</p>

          <button
            type="button"
            className="don-hang-thu-lai"
            onClick={() => void taiDanhSachDonHang()}
          >
            Thử lại
          </button>
        </div>
      );
    }

    if (danhSachDonHangHienThi.length === 0) {
      const chuaCoDonHang = danhSachDonHang.length === 0;

      return (
        <div className="don-hang-thong-bao don-hang-thong-bao--rong">
          <div className="don-hang-rong-bieu-tuong">📦</div>

          <p className="don-hang-rong-tieu-de">
            {chuaCoDonHang
              ? "Bạn chưa có đơn hàng nào"
              : "Không có đơn hàng ở trạng thái này"}
          </p>

          <p className="don-hang-rong-mo-ta">
            {chuaCoDonHang
              ? "Các đơn hàng đã đặt sẽ được hiển thị tại đây."
              : "Hãy chọn trạng thái khác để xem các đơn hàng của bạn."}
          </p>
        </div>
      );
    }

    return (
      <div className="don-hang-danh-sach">
        {danhSachDonHangHienThi.map((donHang) => (
          <TheDonHang
            key={donHang.maDonHang}
            donHang={donHang}
            onXemChiTiet={xuLyXemChiTiet}
          />
        ))}
      </div>
    );
  }

  return (
    <section className="don-hang-trang">
      <div className="don-hang-tieu-de-khu-vuc">
        <h1>Đơn hàng của tôi</h1>

        {!dangTai && !loi && (
          <span>{danhSachDonHang.length} đơn hàng</span>
        )}
      </div>

      <ThanhLocDonHang
        boLocDangChon={boLocDangChon}
        onThayDoiBoLoc={setBoLocDangChon}
      />

      {hienThiNoiDungDanhSach()}
    </section>
  );
}