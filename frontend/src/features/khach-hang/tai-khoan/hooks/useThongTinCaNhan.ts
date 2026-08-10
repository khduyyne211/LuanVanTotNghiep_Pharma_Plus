import axios from "axios";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  capNhatThongTinCaNhanApi,
  layThongTinCaNhanApi,
} from "../api/ThongTinCaNhanApi";

import type {
  CapNhatThongTinCaNhanRequest,
  ThongTinCaNhan,
} from "../types/ThongTinCaNhan";

export type LoiTruongThongTinCaNhan = Partial<
  Record<
    keyof CapNhatThongTinCaNhanRequest,
    string
  >
>;

interface ApiErrorResponse {
  message?: string;
  detail?: string;
  fieldErrors?: LoiTruongThongTinCaNhan;
}

const DU_LIEU_MAC_DINH: CapNhatThongTinCaNhanRequest = {
  hoTen: "",
  gioiTinh: null,
  ngaySinh: null,
};

function layNgayHienTai(): string {
  const ngayHienTai = new Date();
  const nam = ngayHienTai.getFullYear();
  const thang = String(
    ngayHienTai.getMonth() + 1,
  ).padStart(2, "0");
  const ngay = String(
    ngayHienTai.getDate(),
  ).padStart(2, "0");

  return `${nam}-${thang}-${ngay}`;
}

function layThongBaoLoi(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Không thể xử lý thông tin cá nhân."
    );
  }

  return "Đã xảy ra lỗi không xác định.";
}

function kiemTraDuLieu(
  duLieu: CapNhatThongTinCaNhanRequest,
): LoiTruongThongTinCaNhan {
  const loiMoi: LoiTruongThongTinCaNhan = {};
  const hoTen = duLieu.hoTen.trim();

  if (!hoTen) {
    loiMoi.hoTen =
      "Họ và tên không được để trống.";
  } else if (hoTen.length > 100) {
    loiMoi.hoTen =
      "Họ và tên không được vượt quá 100 ký tự.";
  }

  if (
    duLieu.ngaySinh &&
    duLieu.ngaySinh > layNgayHienTai()
  ) {
    loiMoi.ngaySinh =
      "Ngày sinh không được lớn hơn ngày hiện tại.";
  }

  return loiMoi;
}

export function useThongTinCaNhan() {
  const [
    thongTinCaNhan,
    setThongTinCaNhan,
  ] = useState<ThongTinCaNhan | null>(null);

  const [
    duLieuCapNhat,
    setDuLieuCapNhat,
  ] = useState<CapNhatThongTinCaNhanRequest>(
    DU_LIEU_MAC_DINH,
  );

  const [
    loiTruong,
    setLoiTruong,
  ] = useState<LoiTruongThongTinCaNhan>({});

  const [dangTai, setDangTai] = useState(true);
  const [dangLuu, setDangLuu] = useState(false);
  const [loiHeThong, setLoiHeThong] = useState("");

  const taiThongTinCaNhan =
    useCallback(async () => {
      try {
        setDangTai(true);
        setLoiHeThong("");

        const duLieu =
          await layThongTinCaNhanApi();

        setThongTinCaNhan(duLieu);
        setDuLieuCapNhat({
          hoTen: duLieu.hoTen,
          gioiTinh: duLieu.gioiTinh,
          ngaySinh: duLieu.ngaySinh,
        });
        setLoiTruong({});
      } catch (error) {
        setLoiHeThong(layThongBaoLoi(error));
      } finally {
        setDangTai(false);
      }
    }, []);

  useEffect(() => {
    void taiThongTinCaNhan();
  }, [taiThongTinCaNhan]);

  const thayDoiDuLieu = <
    K extends keyof CapNhatThongTinCaNhanRequest,
  >(
    tenTruong: K,
    giaTri: CapNhatThongTinCaNhanRequest[K],
  ) => {
    setDuLieuCapNhat((duLieuHienTai) => ({
      ...duLieuHienTai,
      [tenTruong]: giaTri,
    }));

    setLoiTruong((loiHienTai) => ({
      ...loiHienTai,
      [tenTruong]: undefined,
    }));
  };

  const luuThongTinCaNhan =
    async (): Promise<boolean> => {
      const loiMoi = kiemTraDuLieu(
        duLieuCapNhat,
      );

      setLoiTruong(loiMoi);

      if (Object.keys(loiMoi).length > 0) {
        return false;
      }

      try {
        setDangLuu(true);
        setLoiHeThong("");

        const duLieuDaCapNhat =
          await capNhatThongTinCaNhanApi({
            ...duLieuCapNhat,
            hoTen: duLieuCapNhat.hoTen.trim(),
          });

        setThongTinCaNhan(duLieuDaCapNhat);
        setDuLieuCapNhat({
          hoTen: duLieuDaCapNhat.hoTen,
          gioiTinh:
            duLieuDaCapNhat.gioiTinh,
          ngaySinh:
            duLieuDaCapNhat.ngaySinh,
        });
        setLoiTruong({});

        return true;
      } catch (error) {
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            const loiTruongTuBackend =
            error.response?.data?.fieldErrors;

            if (loiTruongTuBackend && Object.keys(loiTruongTuBackend).length > 0) {
            setLoiTruong(loiTruongTuBackend);
            return false;
            }
        }

        setLoiHeThong(layThongBaoLoi(error));
        return false;
        } finally {
            setDangLuu(false);
        }
    };

  const huyThayDoi = () => {
    if (!thongTinCaNhan) {
      return;
    }

    setDuLieuCapNhat({
      hoTen: thongTinCaNhan.hoTen,
      gioiTinh: thongTinCaNhan.gioiTinh,
      ngaySinh: thongTinCaNhan.ngaySinh,
    });

    setLoiTruong({});
  };

  const xoaLoiHeThong = useCallback(() => {
    setLoiHeThong("");
  }, []);

  return {
    thongTinCaNhan,
    duLieuCapNhat,
    loiTruong,
    dangTai,
    dangLuu,
    loiHeThong,
    thayDoiDuLieu,
    luuThongTinCaNhan,
    huyThayDoi,
    taiThongTinCaNhan,
    xoaLoiHeThong,
  };
}