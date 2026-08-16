import axios from "axios";
import {
  useEffect,
  useState,
} from "react";

import type {
  DangNhapRequest,
} from "../types/XacThuc";

interface HopThoaiDangNhapProps {
  dangHien: boolean;
  dongHopThoai: () => void;

  dangNhap: (
    request: DangNhapRequest
  ) => Promise<void>;

  soDienThoaiMacDinh?: string;
}

interface DuLieuLoiApi {
  thongBao?: string;
  message?: string;
}

function HopThoaiDangNhap({
  dangHien,
  dongHopThoai,
  dangNhap,
  soDienThoaiMacDinh = "",
}: HopThoaiDangNhapProps) {
  const [
    soDienThoai,
    setSoDienThoai,
  ] = useState("");

  const [
    matKhau,
    setMatKhau,
  ] = useState("");

  const [
    dangXuLy,
    setDangXuLy,
  ] = useState(false);

  const [
    thongBaoLoi,
    setThongBaoLoi,
  ] = useState("");

  useEffect(() => {
    if (dangHien) {
      setSoDienThoai(
        soDienThoaiMacDinh
      );

      setMatKhau("");
      setThongBaoLoi("");

      return;
    }

    setSoDienThoai("");
    setMatKhau("");
    setThongBaoLoi("");
  }, [
    dangHien,
    soDienThoaiMacDinh,
  ]);

  if (!dangHien) {
    return null;
  }

  const xuLyDangNhap = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const soDienThoaiDaChuanHoa =
      soDienThoai.trim();

    if (!soDienThoaiDaChuanHoa) {
      setThongBaoLoi(
        "Vui lòng nhập số điện thoại."
      );
      return;
    }

    if (!matKhau) {
      setThongBaoLoi(
        "Vui lòng nhập mật khẩu."
      );
      return;
    }

    setDangXuLy(true);
    setThongBaoLoi("");

    try {
      await dangNhap({
        soDienThoai:
          soDienThoaiDaChuanHoa,
        matKhau,
      });
    } catch (error) {
      if (
        axios.isAxiosError<DuLieuLoiApi>(
          error
        )
      ) {
        setThongBaoLoi(
          error.response?.data
            ?.thongBao ||
            error.response?.data
              ?.message ||
            "Số điện thoại hoặc mật khẩu không đúng."
        );
      } else {
        setThongBaoLoi(
          "Không thể đăng nhập vào lúc này."
        );
      }
    } finally {
      setDangXuLy(false);
    }
  };

  const xuLyChuyenSangDangKy = () => {
    dongHopThoai();

    window.location.assign(
      "/dang-ky"
    );
  };

  return (
    <div
      className="xac-thuc-overlay"
      onMouseDown={dongHopThoai}
    >
      <div
        className="xac-thuc-hop-thoai"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <button
          type="button"
          className="xac-thuc-nut-dong"
          onClick={dongHopThoai}
          aria-label="Đóng"
        >
          ×
        </button>

        <div className="xac-thuc-bieu-tuong">
          <i className="bi bi-person-fill"></i>
        </div>

        <h2>Đăng nhập</h2>

        <p className="xac-thuc-mo-ta">
          Đăng nhập để sử dụng giỏ hàng
          và tiếp tục mua sắm.
        </p>

        <form
          className="xac-thuc-form"
          onSubmit={xuLyDangNhap}
        >
          <label htmlFor="soDienThoai">
            Số điện thoại
          </label>

          <input
            id="soDienThoai"
            type="tel"
            value={soDienThoai}
            onChange={(event) =>
              setSoDienThoai(
                event.target.value
              )
            }
            placeholder="Nhập số điện thoại"
            autoFocus
          />

          <label htmlFor="matKhau">
            Mật khẩu
          </label>

          <input
            id="matKhau"
            type="password"
            value={matKhau}
            onChange={(event) =>
              setMatKhau(
                event.target.value
              )
            }
            placeholder="Nhập mật khẩu"
          />

          {thongBaoLoi && (
            <p className="xac-thuc-thong-bao-loi">
              {thongBaoLoi}
            </p>
          )}

          <button
            type="submit"
            className="xac-thuc-nut-dang-nhap"
            disabled={dangXuLy}
          >
            {dangXuLy
              ? "Đang đăng nhập..."
              : "Đăng nhập"}
          </button>

          <div className="xac-thuc-hanh-dong-phu">
            <button
              type="button"
              className="xac-thuc-nut-dang-ky"
              onClick={xuLyChuyenSangDangKy}
              disabled={dangXuLy}
            >
              Đăng ký
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HopThoaiDangNhap;