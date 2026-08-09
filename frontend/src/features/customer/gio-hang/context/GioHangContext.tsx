import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

import type { ChiTietGioHangLocal } from "../types/GioHangLocal";
import {
  layGioHangLocal,
  luuGioHangLocal,
  xoaGioHangLocal,
} from "../utils/gioHangLocalStorage";
import { kiemTraGioHangApi } from "../api/GioHangApi";
import { useXacThucContext } from "../../../xac-thuc/context/XacThucContext";

export type LyDoThemGioHang =
  | "THANH_CONG"
  | "CHUA_DANG_NHAP"
  | "VUOT_TON_KHO"
  | "LOI_KIEM_TRA"
  | "DANG_XU_LY";

export interface KetQuaThemGioHang {
  thanhCong: boolean;
  lyDo: LyDoThemGioHang;
}

interface GioHangContextValue {
  danhSachChiTietGioHangLocal: ChiTietGioHangLocal[];
  soDongChiTietGioHang: number;

  dangKiemTraThemGioHang: boolean;
  maDonViSanPhamDangKiemTra: number | null;

  themSanPhamLocal: (
    chiTietMoi: ChiTietGioHangLocal
  ) => Promise<KetQuaThemGioHang>;

  capNhatSoLuongLocal: (
    maDonViSanPham: number,
    soLuongMoi: number
  ) => void;

  xoaSanPhamLocal: (
    maDonViSanPham: number
  ) => void;

  thayTheDanhSachGioHangLocal: (
    danhSachMoi: ChiTietGioHangLocal[]
  ) => void;

  xoaToanBoGioHangLocal: () => void;
}

const GioHangContext =
  createContext<GioHangContextValue | undefined>(
    undefined
  );

interface GioHangProviderProps {
  children: ReactNode;
}

export function GioHangProvider({
  children,
}: GioHangProviderProps) {
  const {
    nguoiDungDangNhap,
    daDangNhap,
  } = useXacThucContext();

  const maKhachHang =
    nguoiDungDangNhap?.maKhachHang;

  const [
    danhSachChiTietGioHangLocal,
    setDanhSachChiTietGioHangLocal,
  ] = useState<ChiTietGioHangLocal[]>([]);

  const [daTaiGioHangLocal, setDaTaiGioHangLocal] =
    useState(false);

  const [
    maDonViSanPhamDangKiemTra,
    setMaDonViSanPhamDangKiemTra,
  ] = useState<number | null>(null);

  const dangKiemTraThemGioHang =
    maDonViSanPhamDangKiemTra !== null;

  /**
   * Ref giữ danh sách mới nhất để hàm bất đồng bộ không dùng
   * phải dữ liệu cũ do closure.
   */
  const danhSachGioHangRef =
    useRef<ChiTietGioHangLocal[]>([]);

  /**
   * Khóa ngay lập tức, tránh hai lần bấm liên tiếp trước khi
   * React kịp cập nhật state dangKiemTraThemGioHang.
   */
  const dangKiemTraThemGioHangRef =
    useRef(false);

  const soDongChiTietGioHang =
    danhSachChiTietGioHangLocal.length;

  const ganDanhSachGioHangLocal = (
    danhSachMoi: ChiTietGioHangLocal[]
  ) => {
    danhSachGioHangRef.current = danhSachMoi;
    setDanhSachChiTietGioHangLocal(danhSachMoi);
  };

  const capNhatDanhSachGioHangLocal = (
    taoDanhSachMoi: (
      danhSachCu: ChiTietGioHangLocal[]
    ) => ChiTietGioHangLocal[]
  ) => {
    setDanhSachChiTietGioHangLocal(
      (danhSachCu) => {
        const danhSachMoi =
          taoDanhSachMoi(danhSachCu);

        danhSachGioHangRef.current =
          danhSachMoi;

        return danhSachMoi;
      }
    );
  };

  useEffect(() => {
    setDaTaiGioHangLocal(false);

    if (!daDangNhap || maKhachHang == null) {
      ganDanhSachGioHangLocal([]);
      return;
    }

    const danhSachDaLuu =
      layGioHangLocal(maKhachHang);

    ganDanhSachGioHangLocal(danhSachDaLuu);
    setDaTaiGioHangLocal(true);
  }, [daDangNhap, maKhachHang]);

  useEffect(() => {
    if (
      !daTaiGioHangLocal ||
      maKhachHang == null
    ) {
      return;
    }

    if (
      danhSachChiTietGioHangLocal.length === 0
    ) {
      xoaGioHangLocal(maKhachHang);
      return;
    }

    luuGioHangLocal(
      maKhachHang,
      danhSachChiTietGioHangLocal
    );
  }, [
    daTaiGioHangLocal,
    danhSachChiTietGioHangLocal,
    maKhachHang,
  ]);

  const taoDanhSachGioHangDuKien = (
    chiTietMoi: ChiTietGioHangLocal
  ): ChiTietGioHangLocal[] => {
    const soLuongThem =
      Number.isFinite(chiTietMoi.soLuong)
        ? Math.max(
            1,
            Math.floor(chiTietMoi.soLuong)
          )
        : 1;

    const danhSachCu =
      danhSachGioHangRef.current;

    const chiTietDaCo =
      danhSachCu.find(
        (chiTiet) =>
          chiTiet.maDonViSanPham ===
          chiTietMoi.maDonViSanPham
      );

    if (!chiTietDaCo) {
      return [
        ...danhSachCu,
        {
          ...chiTietMoi,
          soLuong: soLuongThem,
        },
      ];
    }

    return danhSachCu.map((chiTiet) =>
      chiTiet.maDonViSanPham ===
      chiTietMoi.maDonViSanPham
        ? {
            ...chiTiet,
            ...chiTietMoi,
            soLuong:
              chiTiet.soLuong +
              soLuongThem,
          }
        : chiTiet
    );
  };

  const themSanPhamLocal = async (
    chiTietMoi: ChiTietGioHangLocal
  ): Promise<KetQuaThemGioHang> => {
    if (
      !daDangNhap ||
      maKhachHang == null
    ) {
      return {
        thanhCong: false,
        lyDo: "CHUA_DANG_NHAP",
      };
    }

    if (
      dangKiemTraThemGioHangRef.current
    ) {
      return {
        thanhCong: false,
        lyDo: "DANG_XU_LY",
      };
    }

    const danhSachDuKien =
      taoDanhSachGioHangDuKien(
        chiTietMoi
      );

    const danhSachGuiBackend =
      danhSachDuKien.map((chiTiet) => ({
        maDonViSanPham:
          chiTiet.maDonViSanPham,
        soLuong: chiTiet.soLuong,
      }));

    try {
      dangKiemTraThemGioHangRef.current =
        true;

      setMaDonViSanPhamDangKiemTra(
        chiTietMoi.maDonViSanPham
      );

      const ketQua =
        await kiemTraGioHangApi(
          danhSachGuiBackend
        );

      if (!ketQua.hopLe) {
        return {
          thanhCong: false,
          lyDo: "VUOT_TON_KHO",
        };
      }

      /**
       * Chỉ cập nhật state sau khi toàn bộ giỏ dự kiến
       * đã được backend xác nhận hợp lệ.
       */
      ganDanhSachGioHangLocal(
        danhSachDuKien
      );

      return {
        thanhCong: true,
        lyDo: "THANH_CONG",
      };
    } catch {
      return {
        thanhCong: false,
        lyDo: "LOI_KIEM_TRA",
      };
    } finally {
      dangKiemTraThemGioHangRef.current =
        false;

      setMaDonViSanPhamDangKiemTra(null);
    }
  };

  const capNhatSoLuongLocal = (
    maDonViSanPham: number,
    soLuongMoi: number
  ) => {
    if (!Number.isFinite(soLuongMoi)) {
      return;
    }

    capNhatDanhSachGioHangLocal(
      (danhSachCu) =>
        danhSachCu.map((chiTiet) =>
          chiTiet.maDonViSanPham ===
          maDonViSanPham
            ? {
                ...chiTiet,
                soLuong: Math.max(
                  1,
                  Math.floor(soLuongMoi)
                ),
              }
            : chiTiet
        )
    );
  };

  const xoaSanPhamLocal = (
    maDonViSanPham: number
  ) => {
    capNhatDanhSachGioHangLocal(
      (danhSachCu) =>
        danhSachCu.filter(
          (chiTiet) =>
            chiTiet.maDonViSanPham !==
            maDonViSanPham
        )
    );
  };

  const thayTheDanhSachGioHangLocal = (
    danhSachMoi: ChiTietGioHangLocal[]
  ) => {
    const danhSachDaChuanHoa =
      danhSachMoi
        .filter(
          (chiTiet) =>
            chiTiet.soLuong > 0
        )
        .map((chiTiet) => ({
          ...chiTiet,
          soLuong: Math.max(
            1,
            Math.floor(chiTiet.soLuong)
          ),
        }));

    ganDanhSachGioHangLocal(
      danhSachDaChuanHoa
    );
  };

  const xoaToanBoGioHangLocal = () => {
    if (maKhachHang != null) {
      xoaGioHangLocal(maKhachHang);
    }

    ganDanhSachGioHangLocal([]);
  };

  return (
    <GioHangContext.Provider
      value={{
        danhSachChiTietGioHangLocal,
        soDongChiTietGioHang,
        dangKiemTraThemGioHang,
        maDonViSanPhamDangKiemTra,
        themSanPhamLocal,
        capNhatSoLuongLocal,
        xoaSanPhamLocal,
        thayTheDanhSachGioHangLocal,
        xoaToanBoGioHangLocal,
      }}
    >
      {children}
    </GioHangContext.Provider>
  );
}

export function useGioHangContext() {
  const context = useContext(
    GioHangContext
  );

  if (!context) {
    throw new Error(
      "useGioHangContext phải được dùng trong GioHangProvider"
    );
  }

  return context;
}