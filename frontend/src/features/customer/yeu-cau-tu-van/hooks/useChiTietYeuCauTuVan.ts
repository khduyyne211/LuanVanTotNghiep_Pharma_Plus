import axios from "axios";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useParams } from "react-router-dom";

import { layChiTietYeuCauTuVanApi } from "../api/YeuCauTuVanApi";
import type { YeuCauTuVanChiTiet } from "../types/YeuCauTuVan";

interface PhanHoiLoiApi {
  message?: string;
}

function layThongBaoLoi(error: unknown) {
  if (
    axios.isAxiosError<PhanHoiLoiApi>(error)
  ) {
    return (
      error.response?.data?.message ||
      "Không thể tải chi tiết yêu cầu tư vấn."
    );
  }

  return "Không thể tải chi tiết yêu cầu tư vấn.";
}

export function useChiTietYeuCauTuVan() {
  const { maYeuCauTuVan } = useParams<{
    maYeuCauTuVan: string;
  }>();

  const [
    chiTietYeuCau,
    setChiTietYeuCau,
  ] = useState<YeuCauTuVanChiTiet | null>(
    null
  );

  const [dangTai, setDangTai] =
    useState(true);

  const [loi, setLoi] =
    useState("");

  const taiChiTietYeuCau =
    useCallback(async () => {
      const maYeuCau =
        Number(maYeuCauTuVan);

      if (
        !Number.isInteger(maYeuCau) ||
        maYeuCau <= 0
      ) {
        setChiTietYeuCau(null);
        setLoi(
          "Mã yêu cầu tư vấn không hợp lệ."
        );
        setDangTai(false);
        return;
      }

      setDangTai(true);
      setLoi("");

      try {
        const response =
          await layChiTietYeuCauTuVanApi(
            maYeuCau
          );

        setChiTietYeuCau(response.data);
      } catch (error) {
        setChiTietYeuCau(null);
        setLoi(layThongBaoLoi(error));
      } finally {
        setDangTai(false);
      }
    }, [maYeuCauTuVan]);

  useEffect(() => {
    void taiChiTietYeuCau();
  }, [taiChiTietYeuCau]);

  return {
    chiTietYeuCau,
    dangTai,
    loi,
    taiChiTietYeuCau,
  };
}