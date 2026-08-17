import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import { TEN_TRANG_THAI_DON_HANG } from "../../don-hang/constants/TrangThaiDonHang";
import { TEN_TRANG_THAI_THANH_TOAN } from "../../don-hang/constants/TrangThaiThanhToan";
import { useChiTietDonHang } from "../../don-hang/hooks/useChiTietDonHang";

import ThongBaoHeThong from "../../../../shared/components/thong-bao/ThongBaoHeThong";
import { useThongBaoHeThong } from "../../../../shared/hooks/useThongBaoHeThong";

import "../../don-hang/styles/ChiTietDonHang.css";
import "../../don-hang/styles/TrangThaiDonHang.css";
import "../../don-hang/styles/TrangThaiThanhToan.css";

const KHOA_THANH_TOAN_ZALOPAY =
  "pharma_thanh_toan_zalopay_dang_cho";

function dinhDangTien(soTien: number) {
  return soTien.toLocaleString("vi-VN") + "đ";
}

function dinhDangSoTienGiam(soTien: number) {
  if (soTien <= 0) {
    return "0đ";
  }

  return `-${dinhDangTien(soTien)}`;
}

function dinhDangNgay(ngay: string) {
  return new Date(ngay).toLocaleDateString("vi-VN");
}

function hienThiPhuongThucThanhToan(
  phuongThuc: string | null
) {
  if (phuongThuc === "COD") {
    return "Thanh toán khi nhận hàng";
  }

  if (phuongThuc === "ZALOPAY") {
    return "Thanh toán ZaloPay (QR)";
  }

  if (phuongThuc === "TIEN_MAT") {
    return "Tiền mặt tại quầy";
  }

  return phuongThuc || "Chưa cập nhật";
}

function ChiTietDonHangPage() {
  const navigate = useNavigate();
  const thongBao = useThongBaoHeThong();

  const {
    chiTietDonHang: donHang,
    dangTai,
    loi,
    coTheHuyDonHang,
    coTheThanhToanLai,
    dangHuyDonHang,
    dangTaoThanhToanLai,
    dangXuLyThaoTac,
    loiThaoTac,
    huyDonHang,
    taoThanhToanLai,
    xoaLoiThaoTac,
  } = useChiTietDonHang();

  useEffect(() => {
    if (!loiThaoTac) {
      return;
    }

    thongBao.hienThongBao(
      loiThaoTac,
      "LOI",
      "Không thể thực hiện thao tác"
    );

    xoaLoiThaoTac();
  }, [
    loiThaoTac,
    thongBao.hienThongBao,
    xoaLoiThaoTac,
  ]);

  async function xuLyHuyDonHang() {
    const daXacNhan = window.confirm(
      "Bạn có chắc chắn muốn hủy đơn hàng này không?"
    );

    if (!daXacNhan) {
      return;
    }

    const daHuyThanhCong =
      await huyDonHang();

    if (!daHuyThanhCong) {
      return;
    }

    thongBao.hienThongBao(
      "Đơn hàng đã được hủy thành công.",
      "THANH_CONG",
      "Hủy đơn thành công"
    );
  }

  async function xuLyThanhToanLai() {
    const duLieuThanhToan =
      await taoThanhToanLai();

    if (!duLieuThanhToan) {
      return;
    }

    const orderUrl =
      duLieuThanhToan.orderUrl?.trim();

    if (!orderUrl) {
      thongBao.hienThongBao(
        "ZaloPay không trả về đường dẫn thanh toán.",
        "LOI",
        "Không thể tạo mã thanh toán"
      );

      return;
    }

    try {
      sessionStorage.setItem(
        KHOA_THANH_TOAN_ZALOPAY,
        JSON.stringify({
          maDonHang:
            duLieuThanhToan.maDonHang,

          appTransId:
            duLieuThanhToan.appTransId,

          soTien:
            duLieuThanhToan.soTien,

          orderUrl,

          thoiGianHieuLucGiay:
            duLieuThanhToan
              .thoiGianHieuLucGiay,

          thoiDiemTao:
            Date.now(),
        })
      );

      navigate(
        "/thanh-toan/zalopay/quet-ma"
      );
    } catch {
      thongBao.hienThongBao(
        "Không thể lưu thông tin thanh toán ZaloPay.",
        "LOI",
        "Không thể mở mã thanh toán"
      );
    }
  }

  if (dangTai) {
    return (
      <section className="chi-tiet-don-hang-trang">
        <div className="chi-tiet-don-hang-thong-bao">
          Đang tải chi tiết đơn hàng...
        </div>
      </section>
    );
  }

  if (loi) {
    return (
      <section className="chi-tiet-don-hang-trang">
        <div className="chi-tiet-don-hang-thong-bao chi-tiet-don-hang-thong-bao-loi">
          {loi}
        </div>
      </section>
    );
  }

  if (!donHang) {
    return (
      <section className="chi-tiet-don-hang-trang">
        <div className="chi-tiet-don-hang-thong-bao">
          Không tìm thấy đơn hàng.
        </div>
      </section>
    );
  }

  const maDonHangHienThi =
    `#${String(
      donHang.maDonHang
    ).padStart(6, "0")}`;

  const tenPhuongThucThanhToan =
    hienThiPhuongThucThanhToan(
      donHang.phuongThucThanhToan
    );

  const laDonTaiQuay =
    donHang.phuongThucThanhToan === "TIEN_MAT";

  const classTrangThai =
    donHang.trangThaiDonHang
      .toLowerCase()
      .replaceAll("_", "-");

  const classTrangThaiThanhToan =
    donHang.trangThaiThanhToan
      .toLowerCase()
      .replaceAll("_", "-");

  const diaChiNhanHang = [
    donHang.diaChiChiTiet,
    donHang.phuongKhuVuc,
    donHang.thanhPho,
  ]
    .filter(Boolean)
    .join(", ");

  /*
   * Giảm giá trực tiếp:
   * tổng khuyến mãi sản phẩm đã được
   * snapshot trong từng chi tiết đơn hàng.
   */
  const tongGiamGiaTrucTiep =
    donHang.danhSachChiTietDonHang.reduce(
      (tong, chiTiet) =>
        tong +
        (chiTiet.giamGia ?? 0),
      0
    );

  /*
   * don_hang.giam_gia hiện dành cho
   * giảm cấp đơn hàng / voucher.
   */
  const giamGiaVoucher =
    donHang.giamGia ?? 0;

  const tietKiemDuoc =
    tongGiamGiaTrucTiep +
    giamGiaVoucher;

  return (
    <section className="chi-tiet-don-hang-trang">
      <div className="chi-tiet-don-hang-header">
        <Link
          to="/tai-khoan/don-hang"
          className="chi-tiet-don-hang-quay-lai"
        >
          ← Quay lại danh sách đơn hàng
        </Link>
      </div>

      <div className="chi-tiet-don-hang-khoi">
        <div className="chi-tiet-don-hang-khoi-dau">
          <div>
            <p className="chi-tiet-don-hang-label">
              Ngày đặt hàng
            </p>

            <h1 className="chi-tiet-don-hang-tieu-de">
              {dinhDangNgay(
                donHang.ngayDatHang
              )}
            </h1>
          </div>

          <div className="chi-tiet-don-hang-thong-tin-ngang">
            <div>
              <p className="chi-tiet-don-hang-label">
                Mã đơn hàng
              </p>

              <p className="chi-tiet-don-hang-gia-tri-chinh">
                {maDonHangHienThi}
              </p>
            </div>

            <div>
              <p className="chi-tiet-don-hang-label">
                Trạng thái đơn hàng
              </p>

              <span
                className={
                  `trang-thai-don-hang ` +
                  `trang-thai-don-hang--${classTrangThai}`
                }
              >
                <span className="trang-thai-don-hang-cham" />

                {
                  TEN_TRANG_THAI_DON_HANG[
                    donHang.trangThaiDonHang
                  ]
                }
              </span>
            </div>
          </div>
        </div>

        {(coTheThanhToanLai ||
          coTheHuyDonHang) && (
          <div className="chi-tiet-don-hang-thao-tac">
            {coTheThanhToanLai && (
              <button
                type="button"
                className="chi-tiet-don-hang-nut chi-tiet-don-hang-nut--thanh-toan"
                disabled={
                  dangXuLyThaoTac
                }
                onClick={() =>
                  void xuLyThanhToanLai()
                }
              >
                {dangTaoThanhToanLai
                  ? "Đang tạo mã thanh toán..."
                  : "Thanh toán lại"}
              </button>
            )}

            {coTheHuyDonHang && (
              <button
                type="button"
                className="chi-tiet-don-hang-nut chi-tiet-don-hang-nut--huy"
                disabled={
                  dangXuLyThaoTac
                }
                onClick={() =>
                  void xuLyHuyDonHang()
                }
              >
                {dangHuyDonHang
                  ? "Đang hủy đơn..."
                  : "Hủy đơn hàng"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="chi-tiet-don-hang-khoi">
        <h2 className="chi-tiet-don-hang-khoi-tieu-de">
          Thông tin thanh toán
        </h2>

        <div className="chi-tiet-don-hang-thanh-toan">
          <div className="chi-tiet-don-hang-dong">
            <span>
              Tổng tiền hàng
            </span>

            <strong>
              {dinhDangTien(
                donHang.tongTienHang
              )}
            </strong>
          </div>

          <div className="chi-tiet-don-hang-dong">
            <span>
              Giảm giá trực tiếp
            </span>

            <strong className="chi-tiet-don-hang-gia-tri-khuyen-mai">
              {dinhDangSoTienGiam(
                tongGiamGiaTrucTiep
              )}
            </strong>
          </div>

          <div className="chi-tiet-don-hang-dong">
            <span>
              Giảm giá voucher
            </span>

            <strong className="chi-tiet-don-hang-gia-tri-khuyen-mai">
              {dinhDangSoTienGiam(
                giamGiaVoucher
              )}
            </strong>
          </div>

          <div className="chi-tiet-don-hang-dong">
            <span>
              Tiết kiệm được
            </span>

            <strong className="chi-tiet-don-hang-gia-tri-khuyen-mai">
              {dinhDangTien(
                tietKiemDuoc
              )}
            </strong>
          </div>

          <div className="chi-tiet-don-hang-dong">
            <span>
              Phí giao hàng
            </span>

            <strong>
              {dinhDangTien(
                donHang.phiGiaoHang
              )}
            </strong>
          </div>

          <div className="chi-tiet-don-hang-dong">
            <span>
              Phương thức thanh toán
            </span>

            <strong>
              {tenPhuongThucThanhToan}
            </strong>
          </div>

          <div className="chi-tiet-don-hang-dong chi-tiet-don-hang-dong-thanh-tien">
            <span>
              Thành tiền
            </span>

            <strong>
              {dinhDangTien(
                donHang.tongThanhToan
              )}
            </strong>
          </div>

          <div className="chi-tiet-don-hang-dong">
            <span>
              Trạng thái thanh toán
            </span>

            <span
              className={
                `trang-thai-thanh-toan ` +
                `trang-thai-thanh-toan--${classTrangThaiThanhToan}`
              }
            >
              <span className="trang-thai-thanh-toan-cham" />

              {
                TEN_TRANG_THAI_THANH_TOAN[
                  donHang.trangThaiThanhToan
                ]
              }
            </span>
          </div>

          <div className="chi-tiet-don-hang-ghi-chu">
            <p className="chi-tiet-don-hang-label">
              Ghi chú đơn hàng
            </p>

            <p>
              {donHang.ghiChu ||
                "Không có ghi chú."}
            </p>
          </div>
        </div>
      </div>

      {laDonTaiQuay ? (
        <div className="chi-tiet-don-hang-thong-tin-giao-hang">
          <div className="chi-tiet-don-hang-khoi">
            <h2 className="chi-tiet-don-hang-khoi-tieu-de">
              Hình thức nhận hàng
            </h2>

            <div className="chi-tiet-don-hang-noi-dung">
              <p>
                Mua và nhận hàng trực tiếp tại quầy.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="chi-tiet-don-hang-thong-tin-giao-hang">
          <div className="chi-tiet-don-hang-khoi">
            <h2 className="chi-tiet-don-hang-khoi-tieu-de">
              Thông tin người nhận
            </h2>

            <div className="chi-tiet-don-hang-noi-dung">
              <p className="chi-tiet-don-hang-ten-nguoi-nhan">
                {donHang.tenNguoiNhan ||
                  "Không có thông tin người nhận"}
              </p>

              <p>
                {donHang.soDienThoaiNhan ||
                  "Không có số điện thoại"}
              </p>
            </div>
          </div>

          <div className="chi-tiet-don-hang-khoi">
            <h2 className="chi-tiet-don-hang-khoi-tieu-de">
              Địa chỉ nhận hàng
            </h2>

            <div className="chi-tiet-don-hang-noi-dung">
              <p>
                {diaChiNhanHang ||
                  "Không có thông tin địa chỉ."}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="chi-tiet-don-hang-khoi">
        <h2 className="chi-tiet-don-hang-khoi-tieu-de">
          Danh sách sản phẩm
        </h2>

        <div className="chi-tiet-don-hang-danh-sach-san-pham">
          {donHang.danhSachChiTietDonHang.map(
            (chiTiet) => (
              <div
                key={
                  chiTiet.maChiTietDonHang
                }
                className="chi-tiet-don-hang-san-pham"
              >
                <div className="chi-tiet-don-hang-san-pham-ben-trai">
                  <div className="chi-tiet-don-hang-san-pham-anh">
                    {chiTiet.hinhAnh ? (
                      <img
                        src={
                          chiTiet.hinhAnh
                        }
                        alt={
                          chiTiet.tenSanPham
                        }
                      />
                    ) : (
                      <div className="chi-tiet-don-hang-san-pham-khong-anh">
                        Chưa có ảnh
                      </div>
                    )}
                  </div>

                  <div className="chi-tiet-don-hang-san-pham-thong-tin">
                    <p className="chi-tiet-don-hang-san-pham-ten">
                      {
                        chiTiet.tenSanPham
                      }
                    </p>

                    <p className="chi-tiet-don-hang-san-pham-don-vi">
                      Đơn vị:{" "}
                      {
                        chiTiet.tenDonViTinh
                      }
                    </p>
                  </div>
                </div>

                <div className="chi-tiet-don-hang-san-pham-ben-phai">
                  <p className="chi-tiet-don-hang-san-pham-gia">
                    {dinhDangTien(
                      chiTiet.thanhTien
                    )}
                  </p>

                  <p className="chi-tiet-don-hang-san-pham-so-luong">
                    x{chiTiet.soLuong}{" "}
                    {
                      chiTiet.tenDonViTinh
                    }
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <ThongBaoHeThong
        dangHien={
          thongBao.dangHien
        }
        tieuDe={
          thongBao.tieuDe
        }
        noiDung={
          thongBao.noiDung
        }
        loai={
          thongBao.loai
        }
        dongThongBao={
          thongBao.dongThongBao
        }
      />
    </section>
  );
}

export default ChiTietDonHangPage;
