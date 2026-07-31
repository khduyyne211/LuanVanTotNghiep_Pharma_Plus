import axios from "axios";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  layThongTinTaoYeuCauTuVanApi,
  taoYeuCauTuVanApi,
} from "../api/YeuCauTuVanApi";

import type {
  TaoYeuCauTuVanRequest,
  YeuCauTuVanDanhSach,
} from "../types/YeuCauTuVan";

interface PhanHoiLoiApi {
  message?: string;
}

const DU_LIEU_FORM_MAC_DINH: TaoYeuCauTuVanRequest = {
  tenKhachHang: "",
  soDienThoai: "",
  noiDungCanTuVan: "",
  hinhThucLienHe: "GOI_DIEN",
};

function layThongBaoLoi(
  error: unknown,
  thongBaoMacDinh: string
) {
  if (
    axios.isAxiosError<PhanHoiLoiApi>(error)
  ) {
    return (
      error.response?.data?.message ||
      thongBaoMacDinh
    );
  }

  return thongBaoMacDinh;
}

export function useTaoYeuCauTuVan() {
  const [duLieuForm, setDuLieuForm] =
    useState<TaoYeuCauTuVanRequest>(
      DU_LIEU_FORM_MAC_DINH
    );

  const [
    dangTaiThongTin,
    setDangTaiThongTin,
  ] = useState(true);

  const [dangGuiYeuCau, setDangGuiYeuCau] =
    useState(false);

  const [
    loiTaiThongTin,
    setLoiTaiThongTin,
  ] = useState("");

  const [
    loiGuiYeuCau,
    setLoiGuiYeuCau,
  ] = useState("");

  const taiThongTinTaoMoi =
    useCallback(async () => {
      setDangTaiThongTin(true);
      setLoiTaiThongTin("");

      try {
        const response =
          await layThongTinTaoYeuCauTuVanApi();

        setDuLieuForm((duLieuCu) => ({
          ...duLieuCu,
          tenKhachHang:
            response.data.tenKhachHang || "",
          soDienThoai:
            response.data.soDienThoai || "",
        }));
      } catch (error) {
        setLoiTaiThongTin(
          layThongBaoLoi(
            error,
            "Không thể tải thông tin khách hàng."
          )
        );
      } finally {
        setDangTaiThongTin(false);
      }
    }, []);

  useEffect(() => {
    void taiThongTinTaoMoi();
  }, [taiThongTinTaoMoi]);

  const capNhatTruong = <
    K extends keyof TaoYeuCauTuVanRequest,
  >(
    tenTruong: K,
    giaTri: TaoYeuCauTuVanRequest[K]
  ) => {
    setDuLieuForm((duLieuCu) => ({
      ...duLieuCu,
      [tenTruong]: giaTri,
    }));

    if (loiGuiYeuCau) {
      setLoiGuiYeuCau("");
    }
  };

  const kiemTraDuLieuForm = (
    request: TaoYeuCauTuVanRequest
  ) => {
    if (!request.tenKhachHang) {
      return "Vui lòng nhập họ và tên.";
    }

    if (
      !/^\+?[0-9]{9,15}$/.test(
        request.soDienThoai
      )
    ) {
      return "Số điện thoại không hợp lệ.";
    }

    if (!request.noiDungCanTuVan) {
      return "Vui lòng nhập nội dung cần tư vấn.";
    }

    return "";
  };

  const guiYeuCauTuVan =
    async (): Promise<
      YeuCauTuVanDanhSach | null
    > => {
      const request: TaoYeuCauTuVanRequest = {
        tenKhachHang:
          duLieuForm.tenKhachHang
            .trim()
            .replace(/\s+/g, " "),

        soDienThoai:
          duLieuForm.soDienThoai
            .trim()
            .replace(/[\s.-]/g, ""),

        noiDungCanTuVan:
          duLieuForm.noiDungCanTuVan.trim(),

        hinhThucLienHe:
          duLieuForm.hinhThucLienHe,
      };

      const loiDuLieu =
        kiemTraDuLieuForm(request);

      if (loiDuLieu) {
        setLoiGuiYeuCau(loiDuLieu);
        return null;
      }

      setDangGuiYeuCau(true);
      setLoiGuiYeuCau("");

      try {
        const response =
          await taoYeuCauTuVanApi(request);

        return response.data;
      } catch (error) {
        setLoiGuiYeuCau(
          layThongBaoLoi(
            error,
            "Không thể gửi yêu cầu tư vấn."
          )
        );

        return null;
      } finally {
        setDangGuiYeuCau(false);
      }
    };

  return {
    duLieuForm,

    dangTaiThongTin,
    dangGuiYeuCau,

    loiTaiThongTin,
    loiGuiYeuCau,

    capNhatTruong,
    taiThongTinTaoMoi,
    guiYeuCauTuVan,
  };
}