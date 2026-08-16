import axios from "axios";

import {
  useEffect,
  useState,
} from "react";

import {
  guiDonThuocApi,
} from "../api/DonThuocKhachHangApi";

import type {
  DonThuocKhachHang,
} from "../types/DonThuocKhachHang";

interface PhanHoiLoiApi {
  message?: string;
  thongBao?: string;
}

const KICH_THUOC_ANH_TOI_DA =
  5 * 1024 * 1024;

const LOAI_ANH_HOP_LE = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function layThongBaoLoi(
  error: unknown
) {
  if (
    axios.isAxiosError<PhanHoiLoiApi>(
      error
    )
  ) {
    return (
      error.response?.data?.message ||
      error.response?.data?.thongBao ||
      "Không thể gửi đơn thuốc."
    );
  }

  return "Không thể gửi đơn thuốc.";
}

export function useGuiDonThuoc() {
  const [
    tepAnh,
    setTepAnh,
  ] = useState<File | null>(
    null
  );

  const [
    urlXemTruoc,
    setUrlXemTruoc,
  ] = useState("");

  const [
    loiAnh,
    setLoiAnh,
  ] = useState("");

  const [
    loiGui,
    setLoiGui,
  ] = useState("");

  const [
    dangGui,
    setDangGui,
  ] = useState(false);

  useEffect(() => {
    return () => {
      if (urlXemTruoc) {
        URL.revokeObjectURL(
          urlXemTruoc
        );
      }
    };
  }, [urlXemTruoc]);

  const chonAnh = (
    file: File | null
  ) => {
    setLoiAnh("");

    setLoiGui("");

    if (!file) {
      return;
    }

    if (
      !LOAI_ANH_HOP_LE.includes(
        file.type
      )
    ) {
      setLoiAnh(
        "Ảnh đơn thuốc chỉ hỗ trợ JPG, JPEG, PNG hoặc WEBP."
      );

      return;
    }

    if (
      file.size >
      KICH_THUOC_ANH_TOI_DA
    ) {
      setLoiAnh(
        "Ảnh đơn thuốc không được vượt quá 5 MB."
      );

      return;
    }

    if (urlXemTruoc) {
      URL.revokeObjectURL(
        urlXemTruoc
      );
    }

    const urlMoi =
      URL.createObjectURL(
        file
      );

    setTepAnh(
      file
    );

    setUrlXemTruoc(
      urlMoi
    );
  };

  const xoaAnh = () => {
    if (urlXemTruoc) {
      URL.revokeObjectURL(
        urlXemTruoc
      );
    }

    setTepAnh(null);

    setUrlXemTruoc("");

    setLoiAnh("");

    setLoiGui("");
  };

  const guiDonThuoc =
    async (): Promise<
      DonThuocKhachHang | null
    > => {
      if (!tepAnh) {
        setLoiAnh(
          "Vui lòng chọn ảnh đơn thuốc."
        );

        return null;
      }

      setDangGui(true);

      setLoiGui("");

      try {
        const response =
          await guiDonThuocApi(
            tepAnh
          );

        return response.data;
      } catch (error) {
        setLoiGui(
          layThongBaoLoi(
            error
          )
        );

        return null;
      } finally {
        setDangGui(false);
      }
    };

  return {
    tepAnh,

    urlXemTruoc,

    loiAnh,

    loiGui,

    dangGui,

    chonAnh,

    xoaAnh,

    guiDonThuoc,
  };
}