import axios from "axios";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  layChiTietSanPhamKhachHangApi,
} from "../../san-pham/api/SanPhamApi";

import {
  layThongTinTaoYeuCauTuVanApi,
  taoYeuCauTuVanApi,
} from "../api/YeuCauTuVanApi";

import type {
  SanPhamTuVan,
  TaoYeuCauTuVanRequest,
  YeuCauTuVanDanhSach,
} from "../types/YeuCauTuVan";

interface PhanHoiLoiApi {
  message?: string;
}

const DU_LIEU_FORM_MAC_DINH:
  TaoYeuCauTuVanRequest = {
    tenKhachHang: "",
    soDienThoai: "",
    noiDungCanTuVan: "",
    hinhThucLienHe: "GOI_DIEN",
    maSanPham: null,
  };

function layThongBaoLoi(
  error: unknown,
  thongBaoMacDinh: string
) {
  if (
    axios.isAxiosError<PhanHoiLoiApi>(
      error
    )
  ) {
    return (
      error.response?.data?.message ||
      thongBaoMacDinh
    );
  }

  return thongBaoMacDinh;
}

export function useTaoYeuCauTuVan() {
  const [searchParams] =
    useSearchParams();

  const maSanPhamTuDuongDan =
    searchParams.get("maSanPham");

  const [
    duLieuForm,
    setDuLieuForm,
  ] = useState<TaoYeuCauTuVanRequest>(
    DU_LIEU_FORM_MAC_DINH
  );

  const [
    sanPhamDaChon,
    setSanPhamDaChon,
  ] = useState<SanPhamTuVan | null>(
    null
  );

  const [
    dangTaiThongTin,
    setDangTaiThongTin,
  ] = useState(true);

  const [
    dangTaiSanPhamTuVan,
    setDangTaiSanPhamTuVan,
  ] = useState(false);

  const [
    dangGuiYeuCau,
    setDangGuiYeuCau,
  ] = useState(false);

  const [
    loiTaiThongTin,
    setLoiTaiThongTin,
  ] = useState("");

  const [
    loiTaiSanPhamTuVan,
    setLoiTaiSanPhamTuVan,
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

        setDuLieuForm(
          (duLieuCu) => ({
            ...duLieuCu,

            tenKhachHang:
              response.data
                .tenKhachHang || "",

            soDienThoai:
              response.data
                .soDienThoai || "",
          })
        );
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

  const taiSanPhamTuDuongDan =
    useCallback(async () => {
      if (!maSanPhamTuDuongDan) {
        return;
      }

      const maSanPham =
        Number(maSanPhamTuDuongDan);

      if (
        !Number.isInteger(maSanPham) ||
        maSanPham <= 0
      ) {
        setLoiTaiSanPhamTuVan(
          "Mã sản phẩm cần tư vấn không hợp lệ."
        );

        return;
      }

      setDangTaiSanPhamTuVan(true);
      setLoiTaiSanPhamTuVan("");

      try {
        const response =
          await layChiTietSanPhamKhachHangApi(
            maSanPham
          );

        const sanPham =
          response.data;

        const sanPhamTuVan:
          SanPhamTuVan = {
            maSanPham:
              sanPham.maSanPham,

            tenSanPham:
              sanPham.tenSanPham,

            hinhAnh:
              sanPham.hinhAnh,

            laThuocKeDon:
              sanPham.laThuocKeDon,
          };

        setSanPhamDaChon(
          sanPhamTuVan
        );

        setDuLieuForm(
          (duLieuCu) => ({
            ...duLieuCu,

            maSanPham:
              sanPham.maSanPham,
          })
        );
      } catch (error) {
        setSanPhamDaChon(null);

        setDuLieuForm(
          (duLieuCu) => ({
            ...duLieuCu,
            maSanPham: null,
          })
        );

        setLoiTaiSanPhamTuVan(
          layThongBaoLoi(
            error,
            "Không thể tải sản phẩm cần tư vấn."
          )
        );
      } finally {
        setDangTaiSanPhamTuVan(
          false
        );
      }
    }, [maSanPhamTuDuongDan]);

  useEffect(() => {
    void taiThongTinTaoMoi();
  }, [taiThongTinTaoMoi]);

  useEffect(() => {
    void taiSanPhamTuDuongDan();
  }, [taiSanPhamTuDuongDan]);

  const capNhatTruong = <
    K extends keyof TaoYeuCauTuVanRequest,
  >(
    tenTruong: K,
    giaTri:
      TaoYeuCauTuVanRequest[K]
  ) => {
    setDuLieuForm(
      (duLieuCu) => ({
        ...duLieuCu,
        [tenTruong]: giaTri,
      })
    );

    if (loiGuiYeuCau) {
      setLoiGuiYeuCau("");
    }
  };

  const chonSanPhamTuVan = (
    sanPham: SanPhamTuVan
  ) => {
    setSanPhamDaChon(
      sanPham
    );

    setDuLieuForm(
      (duLieuCu) => ({
        ...duLieuCu,

        maSanPham:
          sanPham.maSanPham,
      })
    );

    setLoiTaiSanPhamTuVan("");

    if (loiGuiYeuCau) {
      setLoiGuiYeuCau("");
    }
  };

  const xoaSanPhamTuVan = () => {
    setSanPhamDaChon(null);

    setDuLieuForm(
      (duLieuCu) => ({
        ...duLieuCu,
        maSanPham: null,
      })
    );

    setLoiTaiSanPhamTuVan("");
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
      const request:
        TaoYeuCauTuVanRequest = {
          tenKhachHang:
            duLieuForm
              .tenKhachHang
              .trim()
              .replace(/\s+/g, " "),

          soDienThoai:
            duLieuForm
              .soDienThoai
              .trim()
              .replace(
                /[\s.-]/g,
                ""
              ),

          noiDungCanTuVan:
            duLieuForm
              .noiDungCanTuVan
              .trim(),

          hinhThucLienHe:
            duLieuForm
              .hinhThucLienHe,

          maSanPham:
            sanPhamDaChon
              ?.maSanPham ??
            null,
        };

      const loiDuLieu =
        kiemTraDuLieuForm(
          request
        );

      if (loiDuLieu) {
        setLoiGuiYeuCau(
          loiDuLieu
        );

        return null;
      }

      setDangGuiYeuCau(true);
      setLoiGuiYeuCau("");

      try {
        const response =
          await taoYeuCauTuVanApi(
            request
          );

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

    sanPhamDaChon,

    dangTaiThongTin,
    dangTaiSanPhamTuVan,
    dangGuiYeuCau,

    loiTaiThongTin,
    loiTaiSanPhamTuVan,
    loiGuiYeuCau,

    capNhatTruong,

    chonSanPhamTuVan,
    xoaSanPhamTuVan,

    taiThongTinTaoMoi,
    guiYeuCauTuVan,
  };
}