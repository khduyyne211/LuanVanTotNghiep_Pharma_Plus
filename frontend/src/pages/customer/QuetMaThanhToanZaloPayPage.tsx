import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { QRCodeSVG } from "qrcode.react";

import {
  layTrangThaiThanhToanZaloPayApi,
} from "../../features/thanh-toan/api/ThanhToanZaloPayApi";

import "../../features/thanh-toan/styles/QuetMaThanhToanZaloPay.css";

const KHOA_THANH_TOAN_ZALOPAY =
  "pharma_thanh_toan_zalopay_dang_cho";

const THOI_GIAN_HET_HAN_MILI_GIAY =
  15 * 60 * 1000;

const CHU_KY_KIEM_TRA_MILI_GIAY =
  3000;

interface DuLieuThanhToanZaloPayTam {
  maDonHang: number;
  appTransId: string;
  soTien: number;
  orderUrl: string;
  thoiDiemTao: number;
}

type TrangThaiTheoDoi =
  | "DANG_CHO"
  | "DA_THANH_TOAN"
  | "DA_HUY"
  | "HET_HAN"
  | "LOI_KET_NOI";

function docDuLieuThanhToan():
  DuLieuThanhToanZaloPayTam | null {
  const duLieuDangChuoi =
    sessionStorage.getItem(
      KHOA_THANH_TOAN_ZALOPAY
    );

  if (!duLieuDangChuoi) {
    return null;
  }

  try {
    const duLieu =
      JSON.parse(
        duLieuDangChuoi
      ) as Partial<DuLieuThanhToanZaloPayTam>;

    if (
      typeof duLieu.maDonHang !== "number" ||
      !Number.isInteger(duLieu.maDonHang) ||
      duLieu.maDonHang <= 0 ||
      typeof duLieu.appTransId !== "string" ||
      !duLieu.appTransId.trim() ||
      typeof duLieu.soTien !== "number" ||
      duLieu.soTien <= 0 ||
      typeof duLieu.orderUrl !== "string" ||
      !duLieu.orderUrl.trim() ||
      typeof duLieu.thoiDiemTao !== "number"
    ) {
      return null;
    }

    return {
      maDonHang: duLieu.maDonHang,
      appTransId: duLieu.appTransId,
      soTien: duLieu.soTien,
      orderUrl: duLieu.orderUrl,
      thoiDiemTao: duLieu.thoiDiemTao,
    };
  } catch {
    return null;
  }
}

function dinhDangTien(
  soTien: number
): string {
  return (
    new Intl.NumberFormat(
      "vi-VN"
    ).format(soTien) + " đ"
  );
}

function dinhDangThoiGian(
  tongSoGiay: number
): string {
  const soPhut =
    Math.floor(tongSoGiay / 60);

  const soGiay =
    tongSoGiay % 60;

  return (
    String(soPhut).padStart(2, "0") +
    ":" +
    String(soGiay).padStart(2, "0")
  );
}

function tinhSoGiayConLai(
  thoiDiemTao: number
): number {
  const thoiDiemHetHan =
    thoiDiemTao +
    THOI_GIAN_HET_HAN_MILI_GIAY;

  return Math.max(
    0,
    Math.ceil(
      (
        thoiDiemHetHan -
        Date.now()
      ) / 1000
    )
  );
}

function QuetMaThanhToanZaloPayPage() {
  const navigate =
    useNavigate();

  const [
    duLieuThanhToan,
  ] = useState<DuLieuThanhToanZaloPayTam | null>(
    docDuLieuThanhToan
  );

  const [
    trangThaiTheoDoi,
    setTrangThaiTheoDoi,
  ] = useState<TrangThaiTheoDoi>(
    "DANG_CHO"
  );

  const [
    soGiayConLai,
    setSoGiayConLai,
  ] = useState(() =>
    duLieuThanhToan
      ? tinhSoGiayConLai(
          duLieuThanhToan.thoiDiemTao
        )
      : 0
  );

  const [
    dangKiemTra,
    setDangKiemTra,
  ] = useState(false);

  const dangGoiApiRef =
    useRef(false);

  const daKetThucTheoDoiRef =
    useRef(false);

  const maHenGioChuyenTrangRef =
    useRef<number | null>(null);

  const chuyenSangTrangKetQua =
    useCallback(() => {
      if (!duLieuThanhToan) {
        return;
      }

      sessionStorage.removeItem(
        KHOA_THANH_TOAN_ZALOPAY
      );

      const thamSo =
        new URLSearchParams({
          amount:
            String(
              duLieuThanhToan.soTien
            ),

          apptransid:
            duLieuThanhToan.appTransId,

          pmcid: "38",

          status: "1",

          nguon:
            "kiem-tra-trang-thai-pharma",
        });

      navigate(
        `/thanh-toan/zalopay/ket-qua?${thamSo.toString()}`,
        {
          replace: true,
        }
      );
    }, [
      duLieuThanhToan,
      navigate,
    ]);

  const kiemTraTrangThai =
    useCallback(async () => {
      if (
        !duLieuThanhToan ||
        dangGoiApiRef.current ||
        daKetThucTheoDoiRef.current
      ) {
        return;
      }

      dangGoiApiRef.current = true;
      setDangKiemTra(true);

      try {
        const ketQua =
          await layTrangThaiThanhToanZaloPayApi(
            duLieuThanhToan.maDonHang
          );

        if (
          ketQua.trangThaiThanhToan ===
          "DA_THANH_TOAN"
        ) {
          daKetThucTheoDoiRef.current =
            true;

          setTrangThaiTheoDoi(
            "DA_THANH_TOAN"
          );

          sessionStorage.removeItem(
            KHOA_THANH_TOAN_ZALOPAY
          );

          maHenGioChuyenTrangRef.current =
            window.setTimeout(
              chuyenSangTrangKetQua,
              1200
            );

          return;
        }

        if (
          ketQua.trangThaiDonHang ===
          "DA_HUY"
        ) {
          daKetThucTheoDoiRef.current =
            true;

          setTrangThaiTheoDoi(
            "DA_HUY"
          );

          return;
        }

        setTrangThaiTheoDoi(
          "DANG_CHO"
        );
      } catch (error) {
        console.error(
          "Không thể kiểm tra trạng thái ZaloPay:",
          error
        );

        setTrangThaiTheoDoi(
          "LOI_KET_NOI"
        );
      } finally {
        dangGoiApiRef.current = false;
        setDangKiemTra(false);
      }
    }, [
      chuyenSangTrangKetQua,
      duLieuThanhToan,
    ]);

  /*
   * Cập nhật bộ đếm thời gian mỗi giây.
   */
  useEffect(() => {
    if (!duLieuThanhToan) {
      return;
    }

    const capNhatBoDem = () => {
      const soGiayMoi =
        tinhSoGiayConLai(
          duLieuThanhToan.thoiDiemTao
        );

      setSoGiayConLai(
        soGiayMoi
      );

      if (
        soGiayMoi <= 0 &&
        !daKetThucTheoDoiRef.current
      ) {
        daKetThucTheoDoiRef.current =
          true;

        setTrangThaiTheoDoi(
          "HET_HAN"
        );
      }
    };

    capNhatBoDem();

    const maBoDem =
      window.setInterval(
        capNhatBoDem,
        1000
      );

    return () => {
      window.clearInterval(
        maBoDem
      );
    };
  }, [duLieuThanhToan]);

  /*
   * Gọi kiểm tra ngay khi mở trang,
   * sau đó gọi lại mỗi 3 giây.
   */
  useEffect(() => {
    if (!duLieuThanhToan) {
      return;
    }

    void kiemTraTrangThai();

    const maKiemTra =
      window.setInterval(
        () => {
          void kiemTraTrangThai();
        },
        CHU_KY_KIEM_TRA_MILI_GIAY
      );

    return () => {
      window.clearInterval(
        maKiemTra
      );
    };
  }, [
    duLieuThanhToan,
    kiemTraTrangThai,
  ]);

  useEffect(() => {
    return () => {
      if (
        maHenGioChuyenTrangRef.current !==
        null
      ) {
        window.clearTimeout(
          maHenGioChuyenTrangRef.current
        );
      }
    };
  }, []);

  function xoaDuLieuThanhToanTam() {
    sessionStorage.removeItem(
      KHOA_THANH_TOAN_ZALOPAY
    );
  }

  if (!duLieuThanhToan) {
    return (
      <main className="quet-ma-zalopay-trang">
        <div className="page-container">
          <section className="quet-ma-zalopay-khong-du-lieu">
            <div className="quet-ma-zalopay-khong-du-lieu-icon">
              <i className="bi bi-qr-code"></i>
            </div>

            <h1>
              Không tìm thấy giao dịch
            </h1>

            <p>
              Thông tin thanh toán không tồn tại
              hoặc phiên thanh toán đã kết thúc.
            </p>

            <Link
              to="/tai-khoan/don-hang"
              replace
              className="quet-ma-zalopay-nut-chinh"
            >
              Xem đơn hàng của tôi

              <i className="bi bi-chevron-right"></i>
            </Link>
          </section>
        </div>
      </main>
    );
  }

  const thongTinTrangThai = {
    DANG_CHO: {
      icon: "bi-hourglass-split",
      tieuDe: "Đang chờ thanh toán",
      moTa:
        "Hệ thống đang tự động kiểm tra kết quả giao dịch.",
    },

    DA_THANH_TOAN: {
      icon: "bi-check-circle-fill",
      tieuDe: "Thanh toán thành công",
      moTa:
        "Đơn hàng đã được xác nhận. Đang chuyển sang trang kết quả.",
    },

    DA_HUY: {
      icon: "bi-x-circle-fill",
      tieuDe: "Đơn hàng đã bị hủy",
      moTa:
        "Phiên thanh toán không thể tiếp tục vì đơn hàng đã bị hủy.",
    },

    HET_HAN: {
      icon: "bi-clock-history",
      tieuDe: "Mã thanh toán đã hết hạn",
      moTa:
        "Phiên thanh toán đã quá thời gian cho phép. Bạn có thể thanh toán lại từ đơn hàng.",
    },

    LOI_KET_NOI: {
      icon: "bi-wifi-off",
      tieuDe: "Chưa thể kiểm tra kết quả",
      moTa:
        "Kết nối đến hệ thống đang bị gián đoạn. Mã QR vẫn có thể được sử dụng.",
    },
  }[trangThaiTheoDoi];

  const classTrangThai =
    trangThaiTheoDoi
      .toLowerCase()
      .replaceAll("_", "-");

  const daDungQuetMa =
    trangThaiTheoDoi ===
      "DA_THANH_TOAN" ||
    trangThaiTheoDoi ===
      "DA_HUY" ||
    trangThaiTheoDoi ===
      "HET_HAN";

  return (
    <main className="quet-ma-zalopay-trang">
      <div className="page-container">
        <header className="quet-ma-zalopay-dau-trang">
          <Link
            to="/tai-khoan/don-hang"
            onClick={xoaDuLieuThanhToanTam}
            className="quet-ma-zalopay-quay-lai"
          >
            <i className="bi bi-arrow-left"></i>
            Quay lại đơn hàng
          </Link>

          <div className="quet-ma-zalopay-thuong-hieu">
            <i className="bi bi-shield-check"></i>
            Thanh toán an toàn
          </div>
        </header>

        <section className="quet-ma-zalopay-khung">
          <div className="quet-ma-zalopay-ben-trai">
            <div className="quet-ma-zalopay-tieu-de">
              <div className="quet-ma-zalopay-logo">
                <i className="bi bi-wallet2"></i>
              </div>

              <div>
                <span>
                  ZaloPay Sandbox
                </span>

                <h1>
                  Quét mã để thanh toán
                </h1>
              </div>
            </div>

            <p className="quet-ma-zalopay-huong-dan-chinh">
              Mở ứng dụng ZaloPay Sandbox trên
              điện thoại, chọn chức năng quét mã
              và xác nhận giao dịch.
            </p>

            <div
              className={
                `quet-ma-zalopay-trang-thai ` +
                `quet-ma-zalopay-trang-thai--${classTrangThai}`
              }
              aria-live="polite"
            >
              <i
                className={
                  `bi ${thongTinTrangThai.icon}`
                }
              ></i>

              <div>
                <strong>
                  {thongTinTrangThai.tieuDe}
                </strong>

                <span>
                  {thongTinTrangThai.moTa}
                </span>
              </div>
            </div>

            <div
              className={
                daDungQuetMa
                  ? "quet-ma-zalopay-ma-qr quet-ma-zalopay-ma-qr--vo-hieu"
                  : "quet-ma-zalopay-ma-qr"
              }
            >
              <div className="quet-ma-zalopay-ma-qr-noi-dung">
                <QRCodeSVG
                  value={
                    duLieuThanhToan.orderUrl
                  }
                  size={270}
                  level="M"
                  title="Mã QR thanh toán ZaloPay"
                />
              </div>
            </div>

            <div className="quet-ma-zalopay-thoi-gian">
              <i className="bi bi-clock"></i>

              <span>
                Mã QR còn hiệu lực
              </span>

              <strong>
                {dinhDangThoiGian(
                  soGiayConLai
                )}
              </strong>
            </div>
          </div>

          <aside className="quet-ma-zalopay-ben-phai">
            <div className="quet-ma-zalopay-tom-tat-dau">
              <span>
                Thông tin thanh toán
              </span>

              <strong>
                DH{duLieuThanhToan.maDonHang}
              </strong>
            </div>

            <div className="quet-ma-zalopay-so-tien">
              <span>
                Tổng thanh toán
              </span>

              <strong>
                {dinhDangTien(
                  duLieuThanhToan.soTien
                )}
              </strong>
            </div>

            <div className="quet-ma-zalopay-thong-tin">
              <div>
                <span>
                  Phương thức
                </span>

                <strong>
                  Ví ZaloPay
                </strong>
              </div>

              <div>
                <span>
                  Mã giao dịch
                </span>

                <strong className="quet-ma-zalopay-ma-giao-dich">
                  {
                    duLieuThanhToan
                      .appTransId
                  }
                </strong>
              </div>
            </div>

            <div className="quet-ma-zalopay-cac-buoc">
              <h2>
                Hướng dẫn thanh toán
              </h2>

              <div className="quet-ma-zalopay-buoc">
                <span>1</span>

                <p>
                  Mở ứng dụng ZaloPay Sandbox
                  trên điện thoại.
                </p>
              </div>

              <div className="quet-ma-zalopay-buoc">
                <span>2</span>

                <p>
                  Chọn quét mã QR và hướng camera
                  vào mã bên cạnh.
                </p>
              </div>

              <div className="quet-ma-zalopay-buoc">
                <span>3</span>

                <p>
                  Kiểm tra số tiền và xác nhận
                  thanh toán.
                </p>
              </div>
            </div>

            <div className="quet-ma-zalopay-luu-y">
              <i className="bi bi-info-circle-fill"></i>

              <p>
                Không đóng trang trong khi đang
                thanh toán. Hệ thống sẽ tự động
                chuyển trang khi nhận được kết quả.
              </p>
            </div>

            {trangThaiTheoDoi ===
              "LOI_KET_NOI" && (
              <button
                type="button"
                className="quet-ma-zalopay-nut-kiem-tra"
                disabled={dangKiemTra}
                onClick={() =>
                  void kiemTraTrangThai()
                }
              >
                <i className="bi bi-arrow-clockwise"></i>

                {dangKiemTra
                  ? "Đang kiểm tra..."
                  : "Kiểm tra lại"}
              </button>
            )}

            <Link
              to="/tai-khoan/don-hang"
              replace
              onClick={xoaDuLieuThanhToanTam}
              className="quet-ma-zalopay-nut-phu"
            >
              Xem đơn hàng của tôi
            </Link>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default QuetMaThanhToanZaloPayPage;