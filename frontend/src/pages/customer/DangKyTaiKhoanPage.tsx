import axios from "axios";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { dangKyApi } from "../../features/xac-thuc/api/DangKyTaiKhoanApi";
import { useXacThucContext } from "../../features/xac-thuc/context/XacThucContext";
import "../../features/xac-thuc/styles/DangKyTaiKhoan.css";

import ThongBaoHeThong from "../../shared/components/thong-bao/ThongBaoHeThong";
import { useThongBaoHeThong } from "../../shared/hooks/useThongBaoHeThong";

interface DuLieuLoiApi {
  detail?: string;
  thongBao?: string;
  message?: string;
}

interface LoiTruongDangKy {
  soDienThoai?: string;
  hoTen?: string;
  matKhau?: string;
  xacNhanMatKhau?: string;
  chung?: string;
}

type TenTruongDangKy =
  | "soDienThoai"
  | "hoTen"
  | "matKhau"
  | "xacNhanMatKhau";

function layThongBaoLoi(error: unknown): string {
  if (axios.isAxiosError<DuLieuLoiApi>(error)) {
    return (
      error.response?.data?.detail ||
      error.response?.data?.thongBao ||
      error.response?.data?.message ||
      error.message ||
      "Không thể kết nối đến backend."
    );
  }

  if (error instanceof Error) return error.message;
  return "Đã xảy ra lỗi không xác định.";
}

function chuyenThongBaoLoiSangTruong(thongBao: string): LoiTruongDangKy {
  if (
    thongBao === "Tài khoản đã tồn tại." ||
    thongBao.includes("Số điện thoại")
  ) {
    return { soDienThoai: thongBao };
  }

  if (thongBao.includes("Họ tên")) {
    return { hoTen: thongBao };
  }

  if (thongBao.includes("Mật khẩu phải")) {
    return { matKhau: thongBao };
  }

  if (
    thongBao.includes("Nhập lại mật khẩu") ||
    thongBao.includes("Xác nhận mật khẩu")
  ) {
    return { xacNhanMatKhau: thongBao };
  }

  return { chung: thongBao };
}

function DangKyTaiKhoanPage() {
  const navigate = useNavigate();
  const { moHopThoaiDangNhap } = useXacThucContext();
  const thongBaoHeThong = useThongBaoHeThong();

  const [soDienThoai, setSoDienThoai] = useState("");
  const [hoTen, setHoTen] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState("");
  const [soDienThoaiVuaDangKy, setSoDienThoaiVuaDangKy] = useState("");
  const [dangXuLy, setDangXuLy] = useState(false);
  const [loiTruong, setLoiTruong] = useState<LoiTruongDangKy>({});

  const xoaLoiTruong = (tenTruong: TenTruongDangKy) => {
    setLoiTruong((loiHienTai) => ({
      ...loiHienTai,
      [tenTruong]: undefined,
      chung: undefined,
    }));
  };

  const xuLyDangKy = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const soDienThoaiDaChuanHoa = soDienThoai.trim();
    const hoTenDaChuanHoa = hoTen.trim().replace(/\s+/g, " ");
    const loiMoi: LoiTruongDangKy = {};

    if (!/^0\d{9}$/.test(soDienThoaiDaChuanHoa)) {
      loiMoi.soDienThoai =
        "Số điện thoại phải gồm đúng 10 chữ số và bắt đầu bằng số 0.";
    }

    if (!hoTenDaChuanHoa) {
      loiMoi.hoTen = "Vui lòng nhập họ tên.";
    } else if (hoTenDaChuanHoa.length > 100) {
      loiMoi.hoTen = "Họ tên không được vượt quá 100 ký tự.";
    }

    if (matKhau.length < 6) {
      loiMoi.matKhau = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (matKhau !== xacNhanMatKhau) {
      loiMoi.xacNhanMatKhau = "Nhập lại mật khẩu không khớp.";
    }

    if (Object.keys(loiMoi).length > 0) {
      setLoiTruong(loiMoi);
      return;
    }

    setDangXuLy(true);
    setLoiTruong({});

    try {
      await dangKyApi({
        soDienThoai: soDienThoaiDaChuanHoa,
        hoTen: hoTenDaChuanHoa,
        matKhau,
        xacNhanMatKhau,
      });

      setSoDienThoaiVuaDangKy(soDienThoaiDaChuanHoa);

      thongBaoHeThong.hienThongBao(
        "Tài khoản của bạn đã được tạo thành công.",
        "THANH_CONG",
        "Đăng ký thành công",
      );
    } catch (error: unknown) {
      const thongBaoLoi = layThongBaoLoi(error);
      setLoiTruong(chuyenThongBaoLoiSangTruong(thongBaoLoi));
    } finally {
      setDangXuLy(false);
    }
  };

  const dongThongBaoDangKyThanhCong = () => {
    thongBaoHeThong.dongThongBao();

    moHopThoaiDangNhap({
      soDienThoaiMacDinh: soDienThoaiVuaDangKy,
    });

    navigate("/", { replace: true });
  };

  return (
    <main className="dang-ky-trang">
      <div className="dang-ky-khung">
        <section className="dang-ky-the">
          <header className="dang-ky-dau-trang">
            <div className="dang-ky-bieu-tuong">
              <i className="bi bi-person-plus-fill"></i>
            </div>

            <h1>Đăng ký tài khoản</h1>

            <p>
              Tạo tài khoản khách hàng để mua sắm và sử dụng các dịch vụ của
              Pharma+.
            </p>
          </header>

          <form
            className="dang-ky-form dang-ky-form-ngan dang-ky-form-truc-tiep"
            onSubmit={xuLyDangKy}
            noValidate
          >
            <div className="dang-ky-truong">
              <label htmlFor="soDienThoaiDangKy">
                Số điện thoại
                <span className="dang-ky-bat-buoc" aria-hidden="true">
                  *
                </span>
              </label>

              <input
                id="soDienThoaiDangKy"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={soDienThoai}
                onChange={(event) => {
                  setSoDienThoai(event.target.value.replace(/\D/g, ""));
                  xoaLoiTruong("soDienThoai");
                }}
                placeholder="Ví dụ 0321234567"
                autoComplete="tel"
                disabled={dangXuLy}
                autoFocus
                required
                aria-invalid={Boolean(loiTruong.soDienThoai)}
                aria-describedby={
                  loiTruong.soDienThoai ? "loiSoDienThoaiDangKy" : undefined
                }
                className={loiTruong.soDienThoai ? "dang-ky-input-loi" : ""}
              />

              {loiTruong.soDienThoai && (
                <p
                  id="loiSoDienThoaiDangKy"
                  className="dang-ky-loi-truong"
                >
                  {loiTruong.soDienThoai}
                </p>
              )}
            </div>

            <div className="dang-ky-truong">
              <label htmlFor="hoTenDangKy">
                Họ tên
                <span className="dang-ky-bat-buoc" aria-hidden="true">
                  *
                </span>
              </label>

              <input
                id="hoTenDangKy"
                type="text"
                maxLength={100}
                value={hoTen}
                onChange={(event) => {
                  setHoTen(event.target.value);
                  xoaLoiTruong("hoTen");
                }}
                placeholder="Nhập họ và tên"
                autoComplete="name"
                disabled={dangXuLy}
                required
                aria-invalid={Boolean(loiTruong.hoTen)}
                aria-describedby={
                  loiTruong.hoTen ? "loiHoTenDangKy" : undefined
                }
                className={loiTruong.hoTen ? "dang-ky-input-loi" : ""}
              />

              {loiTruong.hoTen && (
                <p id="loiHoTenDangKy" className="dang-ky-loi-truong">
                  {loiTruong.hoTen}
                </p>
              )}
            </div>

            <div className="dang-ky-truong">
              <label htmlFor="matKhauDangKy">
                Mật khẩu
                <span className="dang-ky-bat-buoc" aria-hidden="true">
                  *
                </span>
              </label>

              <input
                id="matKhauDangKy"
                type="password"
                value={matKhau}
                onChange={(event) => {
                  setMatKhau(event.target.value);
                  xoaLoiTruong("matKhau");

                  if (loiTruong.xacNhanMatKhau) {
                    xoaLoiTruong("xacNhanMatKhau");
                  }
                }}
                placeholder="Nhập ít nhất 6 ký tự"
                autoComplete="new-password"
                disabled={dangXuLy}
                required
                aria-invalid={Boolean(loiTruong.matKhau)}
                aria-describedby={
                  loiTruong.matKhau ? "loiMatKhauDangKy" : undefined
                }
                className={loiTruong.matKhau ? "dang-ky-input-loi" : ""}
              />

              {loiTruong.matKhau && (
                <p id="loiMatKhauDangKy" className="dang-ky-loi-truong">
                  {loiTruong.matKhau}
                </p>
              )}
            </div>

            <div className="dang-ky-truong">
              <label htmlFor="xacNhanMatKhau">
                Nhập lại mật khẩu
                <span className="dang-ky-bat-buoc" aria-hidden="true">
                  *
                </span>
              </label>

              <input
                id="xacNhanMatKhau"
                type="password"
                value={xacNhanMatKhau}
                onChange={(event) => {
                  setXacNhanMatKhau(event.target.value);
                  xoaLoiTruong("xacNhanMatKhau");
                }}
                placeholder="Nhập lại mật khẩu"
                autoComplete="new-password"
                disabled={dangXuLy}
                required
                aria-invalid={Boolean(loiTruong.xacNhanMatKhau)}
                aria-describedby={
                  loiTruong.xacNhanMatKhau ? "loiXacNhanMatKhau" : undefined
                }
                className={
                  loiTruong.xacNhanMatKhau ? "dang-ky-input-loi" : ""
                }
              />

              {loiTruong.xacNhanMatKhau && (
                <p id="loiXacNhanMatKhau" className="dang-ky-loi-truong">
                  {loiTruong.xacNhanMatKhau}
                </p>
              )}
            </div>

            {loiTruong.chung && (
              <div className="dang-ky-thong-bao dang-ky-thong-bao-loi">
                <i className="bi bi-exclamation-circle-fill"></i>
                <span>{loiTruong.chung}</span>
              </div>
            )}

            <button
              type="submit"
              className="dang-ky-nut-chinh"
              disabled={dangXuLy}
            >
              {dangXuLy ? "Đang tạo tài khoản..." : "Đăng ký"}
            </button>
          </form>
        </section>
      </div>

      <ThongBaoHeThong
        dangHien={thongBaoHeThong.dangHien}
        tieuDe={thongBaoHeThong.tieuDe}
        noiDung={thongBaoHeThong.noiDung}
        loai={thongBaoHeThong.loai}
        dongThongBao={dongThongBaoDangKyThanhCong}
      />
    </main>
  );
}

export default DangKyTaiKhoanPage;