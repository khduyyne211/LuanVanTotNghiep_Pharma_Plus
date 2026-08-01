import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { layDanhSachDiaChiGiaoHangApi } from "../../dia-chi-giao-hang/api/DiaChiGiaoHangApi";
import type { DiaChiGiaoHang } from "../../dia-chi-giao-hang/types/DiaChiGiaoHang";
import { taoDonHangApi } from "../../don-hang-khach-hang/api/DonHangApi";
import type { DonHangResponse } from "../../don-hang-khach-hang/types/DonHang";
import { layGioHangApi } from "../../gio-hang/api/GioHangApi";
import type { GioHang } from "../../gio-hang/types/GioHang";
import type { PhuongThucThanhToan } from "../types/XacNhanDatHang";

interface DuLieuLoiApi {
  detail?: string;
  message?: string;
}

export function useXacNhanDatHang() {
  const [gioHang, setGioHang] = useState<GioHang | undefined>(undefined);
  const [danhSachDiaChi, setDanhSachDiaChi] = useState<DiaChiGiaoHang[]>([]);
  const [maDiaChiDangChon, setMaDiaChiDangChon] = useState<number | undefined>(undefined);
  const [phuongThucThanhToan, setPhuongThucThanhToan] = useState<PhuongThucThanhToan>("COD");
  const [ghiChu, setGhiChu] = useState("");
  const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
  const [thongBaoLoi, setThongBaoLoi] = useState("");
  const [dangMoDanhSachDiaChi, setDangMoDanhSachDiaChi] = useState(false);
  const [dangTaoDonHang, setDangTaoDonHang] = useState(false);
  const [loiTaoDonHang, setLoiTaoDonHang] = useState("");

  const taiDuLieuXacNhanDatHang = useCallback(async () => {
    setDangTaiDuLieu(true);
    setThongBaoLoi("");

    try {
      const [gioHangResponse, danhSachDiaChiMoi] = await Promise.all([
        layGioHangApi(),
        layDanhSachDiaChiGiaoHangApi(),
      ]);

      setGioHang(gioHangResponse.data);
      setDanhSachDiaChi(danhSachDiaChiMoi);

      const diaChiMacDinh = danhSachDiaChiMoi.find(
        (diaChi) => diaChi.laMacDinh,
      );

      setMaDiaChiDangChon(diaChiMacDinh?.maDiaChi);
    } catch {
      setGioHang(undefined);
      setDanhSachDiaChi([]);
      setMaDiaChiDangChon(undefined);
      setThongBaoLoi("Không thể tải thông tin xác nhận đặt hàng.");
    } finally {
      setDangTaiDuLieu(false);
    }
  }, []);

  useEffect(() => {
    let daHuyYeuCau = false;

    Promise.all([
      layGioHangApi(),
      layDanhSachDiaChiGiaoHangApi(),
    ])
      .then(([gioHangResponse, danhSachDiaChiMoi]) => {
        if (daHuyYeuCau) return;

        setGioHang(gioHangResponse.data);
        setDanhSachDiaChi(danhSachDiaChiMoi);

        const diaChiMacDinh = danhSachDiaChiMoi.find(
          (diaChi) => diaChi.laMacDinh,
        );

        setMaDiaChiDangChon(diaChiMacDinh?.maDiaChi);
      })
      .catch(() => {
        if (daHuyYeuCau) return;

        setGioHang(undefined);
        setDanhSachDiaChi([]);
        setMaDiaChiDangChon(undefined);
        setThongBaoLoi("Không thể tải thông tin xác nhận đặt hàng.");
      })
      .finally(() => {
        if (!daHuyYeuCau) {
          setDangTaiDuLieu(false);
        }
      });

    return () => {
      daHuyYeuCau = true;
    };
  }, []);

  const diaChiDangChon = useMemo(() => {
    return danhSachDiaChi.find(
      (diaChi) => diaChi.maDiaChi === maDiaChiDangChon,
    );
  }, [danhSachDiaChi, maDiaChiDangChon]);

  const gioHangRong =
    !gioHang || gioHang.danhSachChiTietGioHang.length === 0;

  const coTheHoanTat =
    !gioHangRong && diaChiDangChon !== undefined;

  const chonDiaChi = (maDiaChi: number) => {
    setMaDiaChiDangChon(maDiaChi);
    setDangMoDanhSachDiaChi(false);
  };

  async function hoanTatDatHang(): Promise<DonHangResponse | null> {
    if (dangTaoDonHang) return null;

    if (maDiaChiDangChon === undefined) {
      setLoiTaoDonHang("Vui lòng chọn địa chỉ nhận hàng.");
      return null;
    }

    try {
      setDangTaoDonHang(true);
      setLoiTaoDonHang("");

      return await taoDonHangApi({
        maDiaChi: maDiaChiDangChon,
        phuongThucThanhToan,
        ghiChu: ghiChu.trim() || null,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError<DuLieuLoiApi>(error)) {
        const noiDungLoi =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Không thể tạo đơn hàng. Vui lòng thử lại.";

        setLoiTaoDonHang(noiDungLoi);
        return null;
      }

      setLoiTaoDonHang("Không thể tạo đơn hàng. Vui lòng thử lại.");
      return null;
    } finally {
      setDangTaoDonHang(false);
    }
  }

  return {
    gioHang,
    danhSachDiaChi,
    diaChiDangChon,
    phuongThucThanhToan,
    ghiChu,
    dangTaiDuLieu,
    thongBaoLoi,
    dangMoDanhSachDiaChi,
    gioHangRong,
    coTheHoanTat,
    dangTaoDonHang,
    loiTaoDonHang,
    setPhuongThucThanhToan,
    setGhiChu,
    setDangMoDanhSachDiaChi,
    chonDiaChi,
    taiDuLieuXacNhanDatHang,
    hoanTatDatHang,
  };
}