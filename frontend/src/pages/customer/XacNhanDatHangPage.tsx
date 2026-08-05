import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import DanhSachSanPhamXacNhan from "../../features/xac-nhan-dat-hang/components/DanhSachSanPhamXacNhan";
import DiaChiNhanHangXacNhan from "../../features/xac-nhan-dat-hang/components/DiaChiNhanHangXacNhan";
import FormDiaChiGiaoHang from "../../features/dia-chi-giao-hang/components/FormDiaChiGiaoHang";
import PhuongThucThanhToan from "../../features/xac-nhan-dat-hang/components/PhuongThucThanhToan";
import TongKetXacNhanDatHang from "../../features/xac-nhan-dat-hang/components/TongKetXacNhanDatHang";
import { useXacNhanDatHang } from "../../features/xac-nhan-dat-hang/hooks/useXacNhanDatHang";

import { useGioHangContext } from "../../features/gio-hang/context/GioHangContext";

import { taoThanhToanZaloPayApi } from "../../features/thanh-toan/api/ThanhToanZaloPayApi";

import ThongBaoHeThong from "../../shared/components/thong-bao/ThongBaoHeThong";
import { useThongBaoHeThong } from "../../shared/hooks/useThongBaoHeThong";

import "../../features/xac-nhan-dat-hang/styles/XacNhanDatHang.css";

function XacNhanDatHangPage() {
  const KHOA_THANH_TOAN_ZALOPAY = "pharma_thanh_toan_zalopay_dang_cho";

  const navigate = useNavigate();

  const xacNhanDatHang = useXacNhanDatHang();

  const thongBao = useThongBaoHeThong();

  const { xoaToanBoGioHangLocal } = useGioHangContext();

  const [dangMoThanhToanZaloPay, setDangMoThanhToanZaloPay] = useState(false);

  const chuyenSangDanhSachDonHangSauThongBaoRef = useRef(false);

  const moDanhSachDiaChiSauThongBaoRef = useRef(false);

  useEffect(() => {
    if (xacNhanDatHang.thongBaoThemDiaChiThanhCong) {
      chuyenSangDanhSachDonHangSauThongBaoRef.current = false;

      moDanhSachDiaChiSauThongBaoRef.current = true;

      thongBao.hienThongBao(
        xacNhanDatHang.thongBaoThemDiaChiThanhCong,
        "THANH_CONG",
        "Thao tác địa chỉ thành công",
      );

      xacNhanDatHang.xoaThongBaoThemDiaChi();

      return;
    }

    if (xacNhanDatHang.loiThemDiaChi) {
      chuyenSangDanhSachDonHangSauThongBaoRef.current = false;

      thongBao.hienThongBao(
        xacNhanDatHang.loiThemDiaChi,
        "LOI",
        "Không thể xử lý địa chỉ",
      );

      xacNhanDatHang.xoaThongBaoThemDiaChi();
    }
  }, [
    xacNhanDatHang.thongBaoThemDiaChiThanhCong,
    xacNhanDatHang.loiThemDiaChi,
    xacNhanDatHang.xoaThongBaoThemDiaChi,
    thongBao.hienThongBao,
  ]);

  /*
   * Luồng COD:
   * hoanTatDatHang()
   * → tạo đơn COD
   * → xóa giỏ hàng local
   * → hiển thị thông báo thành công
   * → chuyển sang danh sách đơn hàng
   *
   * Luồng QR:
   * hoanTatDatHang()
   * → tạo đơn QR ở trạng thái CHO_THANH_TOAN
   * → xóa giỏ hàng local
   * → gọi taoThanhToanZaloPayApi(maDonHang)
   * → nhận orderUrl
   * → chuyển trình duyệt sang ZaloPay Gateway
   */
  async function xuLyHoanTatMuaHang() {
    if (dangMoThanhToanZaloPay) {
      return;
    }

    const laThanhToanQr = xacNhanDatHang.phuongThucThanhToan === "ZALOPAY";

    if (laThanhToanQr) {
      setDangMoThanhToanZaloPay(true);
    }

    const donHangDaTao = await xacNhanDatHang.hoanTatDatHang();

    if (!donHangDaTao) {
      if (laThanhToanQr) {
        setDangMoThanhToanZaloPay(false);
      }

      return;
    }

    /*
     * Backend đã xóa giỏ hàng trong database
     * sau khi tạo đơn thành công.
     *
     * Frontend cần xóa giỏ local để đồng bộ
     * số lượng hiển thị trên biểu tượng giỏ hàng.
     */
    xoaToanBoGioHangLocal();

    if (donHangDaTao.phuongThucThanhToan === "COD") {
      moDanhSachDiaChiSauThongBaoRef.current = false;

      chuyenSangDanhSachDonHangSauThongBaoRef.current = true;

      thongBao.hienThongBao(
        "Đơn hàng đã được tạo thành công.",
        "THANH_CONG",
        "Đặt hàng thành công",
      );

      return;
    }

    try {
      const thanhToanZaloPay = await taoThanhToanZaloPayApi(
        donHangDaTao.maDonHang,
      );

      const orderUrl = thanhToanZaloPay.orderUrl?.trim();

      if (!orderUrl) {
        throw new Error("ZaloPay không trả về đường dẫn thanh toán.");
      }

      /*
       * Không chuyển trình duyệt sang
       * ZaloPay Gateway.
       *
       * Lưu dữ liệu giao dịch tạm thời để
       * trang Pharma+ tự hiển thị mã QR.
       */
      sessionStorage.setItem(
        KHOA_THANH_TOAN_ZALOPAY,
        JSON.stringify({
          maDonHang: thanhToanZaloPay.maDonHang,

          appTransId: thanhToanZaloPay.appTransId,

          soTien: thanhToanZaloPay.soTien,

          orderUrl,

          thoiGianHieuLucGiay: thanhToanZaloPay.thoiGianHieuLucGiay,

          thoiDiemTao: Date.now(),
        }),
      );

      navigate("/thanh-toan/zalopay/quet-ma", {
        replace: true,
      });
    } catch (error) {
      console.error("Không thể mở thanh toán ZaloPay:", error);

      setDangMoThanhToanZaloPay(false);

      window.alert(
        `Đơn hàng mã ${donHangDaTao.maDonHang} đã được tạo, ` +
          "nhưng chưa thể mở trang thanh toán ZaloPay. " +
          "Bạn có thể vào danh sách đơn hàng để thanh toán lại.",
      );

      window.location.replace("/tai-khoan/don-hang");
    }
  }

  function dongThongBaoVaXuLyDieuHuong() {
    const canMoDanhSachDiaChi = moDanhSachDiaChiSauThongBaoRef.current;

    const canChuyenTrang = chuyenSangDanhSachDonHangSauThongBaoRef.current;

    moDanhSachDiaChiSauThongBaoRef.current = false;

    chuyenSangDanhSachDonHangSauThongBaoRef.current = false;

    thongBao.dongThongBao();

    if (canMoDanhSachDiaChi) {
      xacNhanDatHang.setDangMoDanhSachDiaChi(true);

      return;
    }

    if (canChuyenTrang) {
      navigate("/tai-khoan/don-hang", {
        replace: true,
      });
    }
  }

  if (xacNhanDatHang.dangTaiDuLieu) {
    return (
      <main className="xac-nhan-trang">
        <div className="page-container">
          <div className="xac-nhan-trang-thong-bao">
            Đang tải thông tin đặt hàng...
          </div>
        </div>
      </main>
    );
  }

  if (xacNhanDatHang.thongBaoLoi) {
    return (
      <main className="xac-nhan-trang">
        <div className="page-container">
          <div className="xac-nhan-trang-thong-bao xac-nhan-trang-loi">
            {xacNhanDatHang.thongBaoLoi}
          </div>
        </div>
      </main>
    );
  }

  if (!xacNhanDatHang.gioHang || xacNhanDatHang.gioHangRong) {
    return (
      <main className="xac-nhan-trang">
        <div className="page-container">
          <div className="xac-nhan-gio-hang-rong">
            <i className="bi bi-cart-x"></i>

            <h1>Giỏ hàng đang trống</h1>

            <p>Vui lòng thêm sản phẩm trước khi tiến hành đặt hàng.</p>

            <Link to="/san-pham">Tiếp tục mua sắm</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="xac-nhan-trang">
      <div className="page-container">
        <Link to="/gio-hang" className="xac-nhan-quay-lai-gio-hang">
          ← Quay lại giỏ hàng
        </Link>

        <div className="xac-nhan-bo-cuc">
          <div className="xac-nhan-ben-trai">
            <DanhSachSanPhamXacNhan
              danhSachChiTietGioHang={
                xacNhanDatHang.gioHang.danhSachChiTietGioHang
              }
            />

            <DiaChiNhanHangXacNhan
              danhSachDiaChi={xacNhanDatHang.danhSachDiaChi}
              diaChiDangChon={xacNhanDatHang.diaChiDangChon}
              dangMoDanhSachDiaChi={xacNhanDatHang.dangMoDanhSachDiaChi}
              ghiChu={xacNhanDatHang.ghiChu}
              moDanhSachDiaChi={() =>
                xacNhanDatHang.setDangMoDanhSachDiaChi(true)
              }
              dongDanhSachDiaChi={() =>
                xacNhanDatHang.setDangMoDanhSachDiaChi(false)
              }
              themDiaChiMoi={xacNhanDatHang.moFormThemDiaChi}
              suaDiaChi={xacNhanDatHang.moFormSuaDiaChi}
              chonDiaChi={xacNhanDatHang.chonDiaChi}
              thayDoiGhiChu={xacNhanDatHang.setGhiChu}
            />

            <PhuongThucThanhToan
              phuongThucDangChon={xacNhanDatHang.phuongThucThanhToan}
              thayDoiPhuongThuc={xacNhanDatHang.setPhuongThucThanhToan}
            />
          </div>

          <TongKetXacNhanDatHang
            tongTienHang={xacNhanDatHang.gioHang.tongTien}
            coTheHoanTat={xacNhanDatHang.coTheHoanTat}
            dangTaoDonHang={
              xacNhanDatHang.dangTaoDonHang || dangMoThanhToanZaloPay
            }
            loiTaoDonHang={xacNhanDatHang.loiTaoDonHang}
            hoanTatMuaHang={() => void xuLyHoanTatMuaHang()}
          />

          <ThongBaoHeThong
            dangHien={thongBao.dangHien}
            tieuDe={thongBao.tieuDe}
            noiDung={thongBao.noiDung}
            loai={thongBao.loai}
            dongThongBao={dongThongBaoVaXuLyDieuHuong}
          />
        </div>
      </div>
      <FormDiaChiGiaoHang
        dangMoForm={xacNhanDatHang.dangMoFormThemDiaChi}
        diaChiDangSua={xacNhanDatHang.diaChiDangSua}
        duLieuForm={xacNhanDatHang.duLieuFormDiaChi}
        loiTruong={xacNhanDatHang.loiTruongDiaChi}
        dangLuu={xacNhanDatHang.dangLuuDiaChi}
        thayDoiDuLieuForm={xacNhanDatHang.thayDoiDuLieuFormDiaChi}
        dongForm={xacNhanDatHang.dongFormThemDiaChi}
        luuDiaChi={() => {
          void xacNhanDatHang.luuDiaChiMoi();
        }}
      />
    </main>
  );
}

export default XacNhanDatHangPage;
