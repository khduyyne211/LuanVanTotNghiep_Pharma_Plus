import { useCallback, useState } from "react";
import { isAxiosError } from "axios";

import {
  huyPhieuNhap,
  xacNhanNhapKho,
} from "../api/phieuNhapApi";

type ApiErrorResponse = {
  message?: string;
};

type UseXuLyPhieuNhapProps = {
  onTaiLaiDanhSach: () => void;
  onTaiLaiChiTiet: (maPhieuNhap: number) => Promise<void>;
};

function useXuLyPhieuNhap({
  onTaiLaiDanhSach,
  onTaiLaiChiTiet,
}: UseXuLyPhieuNhapProps) {
  const [maPhieuNhapDangXuLy, setMaPhieuNhapDangXuLy] =
    useState<number | null>(null);

  const xuLyXacNhan = useCallback(
    async (maPhieuNhap: number) => {
      const dongY = window.confirm(
        `Xác nhận nhập kho cho phiếu #${maPhieuNhap}? Sau khi xác nhận, số lượng sản phẩm sẽ được tính vào tồn kho.`
      );

      if (!dongY) {
        return;
      }

      try {
        setMaPhieuNhapDangXuLy(maPhieuNhap);

        await xacNhanNhapKho(maPhieuNhap);

        onTaiLaiDanhSach();
        await onTaiLaiChiTiet(maPhieuNhap);
      } catch (error) {
        console.error(
          "Không thể xác nhận phiếu nhập:",
          error
        );

        const message =
          isAxiosError<ApiErrorResponse>(error)
            ? error.response?.data?.message
            : null;

        alert(
          message ?? "Không thể xác nhận phiếu nhập."
        );
      } finally {
        setMaPhieuNhapDangXuLy(null);
      }
    },
    [onTaiLaiChiTiet, onTaiLaiDanhSach]
  );

  const xuLyHuy = useCallback(
    async (maPhieuNhap: number) => {
      const dongY = window.confirm(
        `Hủy phiếu nhập #${maPhieuNhap}? Phiếu đã hủy sẽ không được tính vào tồn kho.`
      );

      if (!dongY) {
        return;
      }

      try {
        setMaPhieuNhapDangXuLy(maPhieuNhap);

        await huyPhieuNhap(maPhieuNhap);

        onTaiLaiDanhSach();
        await onTaiLaiChiTiet(maPhieuNhap);
      } catch (error) {
        console.error(
          "Không thể hủy phiếu nhập:",
          error
        );

        const message =
          isAxiosError<ApiErrorResponse>(error)
            ? error.response?.data?.message
            : null;

        alert(
          message ?? "Không thể hủy phiếu nhập."
        );
      } finally {
        setMaPhieuNhapDangXuLy(null);
      }
    },
    [onTaiLaiChiTiet, onTaiLaiDanhSach]
  );

  return {
    maPhieuNhapDangXuLy,
    xuLyXacNhan,
    xuLyHuy,
  };
}

export default useXuLyPhieuNhap;