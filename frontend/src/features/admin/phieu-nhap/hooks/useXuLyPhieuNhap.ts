import { useCallback, useState } from "react";
import { isAxiosError } from "axios";

import type { LoaiThongBao } from "../../../../shared/components/thong-bao/ThongBaoHeThong";

import {
  huyPhieuNhap,
  xacNhanNhapKho,
} from "../api/phieuNhapApi";

type ApiErrorResponse = {
  message?: string;
};

type HienThongBao = (
  noiDung: string,
  loai?: LoaiThongBao,
  tieuDe?: string,
) => void;

type LoaiThaoTacPhieuNhap =
  | "XAC_NHAN_NHAP_KHO"
  | "HUY_PHIEU";

type PhieuNhapChoXuLy = {
  maPhieuNhap: number;
  loaiThaoTac: LoaiThaoTacPhieuNhap;
};

type UseXuLyPhieuNhapProps = {
  onTaiLaiDanhSach: () => void;
  onTaiLaiChiTiet: (
    maPhieuNhap: number,
  ) => Promise<void>;
  onThongBao: HienThongBao;
};

function useXuLyPhieuNhap({
  onTaiLaiDanhSach,
  onTaiLaiChiTiet,
  onThongBao,
}: UseXuLyPhieuNhapProps) {
  const [
    maPhieuNhapDangXuLy,
    setMaPhieuNhapDangXuLy,
  ] = useState<number | null>(null);

  const [
    phieuNhapChoXuLy,
    setPhieuNhapChoXuLy,
  ] = useState<PhieuNhapChoXuLy | null>(
    null,
  );

  const moXacNhanNhapKho = useCallback(
    (maPhieuNhap: number) => {
      setPhieuNhapChoXuLy({
        maPhieuNhap,
        loaiThaoTac: "XAC_NHAN_NHAP_KHO",
      });
    },
    [],
  );

  const moXacNhanHuyPhieu = useCallback(
    (maPhieuNhap: number) => {
      setPhieuNhapChoXuLy({
        maPhieuNhap,
        loaiThaoTac: "HUY_PHIEU",
      });
    },
    [],
  );

  const dongXacNhanThaoTac =
    useCallback(() => {
      if (maPhieuNhapDangXuLy !== null) {
        return;
      }

      setPhieuNhapChoXuLy(null);
    }, [maPhieuNhapDangXuLy]);

  const xacNhanThaoTac = useCallback(
    async () => {
      if (!phieuNhapChoXuLy) {
        return;
      }

      const {
        maPhieuNhap,
        loaiThaoTac,
      } = phieuNhapChoXuLy;

      try {
        setMaPhieuNhapDangXuLy(
          maPhieuNhap,
        );

        if (
          loaiThaoTac ===
          "XAC_NHAN_NHAP_KHO"
        ) {
          await xacNhanNhapKho(
            maPhieuNhap,
          );
        } else {
          await huyPhieuNhap(
            maPhieuNhap,
          );
        }

        onTaiLaiDanhSach();

        await onTaiLaiChiTiet(
          maPhieuNhap,
        );

        setPhieuNhapChoXuLy(null);

        if (
          loaiThaoTac ===
          "XAC_NHAN_NHAP_KHO"
        ) {
          onThongBao(
            "Xác nhận nhập kho thành công.",
            "THANH_CONG",
            "Thành công",
          );
        } else {
          onThongBao(
            "Hủy phiếu nhập thành công.",
            "THANH_CONG",
            "Thành công",
          );
        }
      } catch (error) {
        console.error(
          loaiThaoTac ===
            "XAC_NHAN_NHAP_KHO"
            ? "Không thể xác nhận phiếu nhập:"
            : "Không thể hủy phiếu nhập:",
          error,
        );

        const message =
          isAxiosError<ApiErrorResponse>(
            error,
          )
            ? error.response?.data
                ?.message
            : null;

        onThongBao(
          message ??
            (loaiThaoTac ===
            "XAC_NHAN_NHAP_KHO"
              ? "Không thể xác nhận phiếu nhập."
              : "Không thể hủy phiếu nhập."),
          "LOI",
          "Không thể thực hiện thao tác",
        );
      } finally {
        setMaPhieuNhapDangXuLy(null);
      }
    },
    [
      onTaiLaiChiTiet,
      onTaiLaiDanhSach,
      onThongBao,
      phieuNhapChoXuLy,
    ],
  );

  return {
    maPhieuNhapDangXuLy,
    phieuNhapChoXuLy,
    moXacNhanNhapKho,
    moXacNhanHuyPhieu,
    dongXacNhanThaoTac,
    xacNhanThaoTac,
  };
}

export default useXuLyPhieuNhap;