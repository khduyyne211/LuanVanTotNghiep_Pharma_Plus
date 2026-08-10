import axios from "axios";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { layDanhSachYeuCauTuVanApi } from "../api/YeuCauTuVanApi";
import type { YeuCauTuVanDanhSach } from "../types/YeuCauTuVan";

const SO_YEU_CAU_MOI_LAN_TAI = 10;

function layThongBaoLoi(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      "Không thể tải danh sách yêu cầu tư vấn."
    );
  }

  return "Không thể tải danh sách yêu cầu tư vấn.";
}

export function useDanhSachYeuCauTuVan() {
  const [
    danhSachYeuCau,
    setDanhSachYeuCau,
  ] = useState<YeuCauTuVanDanhSach[]>([]);

  const [dangTaiDuLieu, setDangTaiDuLieu] =
    useState(false);

  const [dangTaiThem, setDangTaiThem] =
    useState(false);

  const [loiTaiDuLieu, setLoiTaiDuLieu] =
    useState("");

  const [trangHienTai, setTrangHienTai] =
    useState(0);

  const [laTrangCuoi, setLaTrangCuoi] =
    useState(false);

  const [tongSoPhanTu, setTongSoPhanTu] =
    useState(0);

  const layTrangYeuCau = useCallback(
    async (
      page: number,
      laTaiThem: boolean
    ) => {
      if (laTaiThem) {
        setDangTaiThem(true);
      } else {
        setDangTaiDuLieu(true);
      }

      setLoiTaiDuLieu("");

      try {
        const response =
          await layDanhSachYeuCauTuVanApi(
            page,
            SO_YEU_CAU_MOI_LAN_TAI
          );

        const duLieuPhanTrang = response.data;

        if (laTaiThem) {
          setDanhSachYeuCau(
            (danhSachCu) => [
              ...danhSachCu,
              ...duLieuPhanTrang.danhSachNoiDung,
            ]
          );
        } else {
          setDanhSachYeuCau(
            duLieuPhanTrang.danhSachNoiDung
          );
        }

        setTrangHienTai(
          duLieuPhanTrang.trangHienTai
        );

        setLaTrangCuoi(
          duLieuPhanTrang.laTrangCuoi
        );

        setTongSoPhanTu(
          duLieuPhanTrang.tongSoPhanTu
        );
      } catch (error) {
        setLoiTaiDuLieu(
          layThongBaoLoi(error)
        );
      } finally {
        setDangTaiDuLieu(false);
        setDangTaiThem(false);
      }
    },
    []
  );

  useEffect(() => {
    void layTrangYeuCau(0, false);
  }, [layTrangYeuCau]);

  const xemThemYeuCau = () => {
    if (
      dangTaiDuLieu ||
      dangTaiThem ||
      laTrangCuoi
    ) {
      return;
    }

    void layTrangYeuCau(
      trangHienTai + 1,
      true
    );
  };

  const taiLaiDanhSach = () => {
    setDanhSachYeuCau([]);
    setTrangHienTai(0);
    setLaTrangCuoi(false);
    setTongSoPhanTu(0);

    void layTrangYeuCau(0, false);
  };

  const khongCoDuLieu =
    !dangTaiDuLieu &&
    !loiTaiDuLieu &&
    danhSachYeuCau.length === 0;

  const conYeuCauDeXemThem =
    !laTrangCuoi &&
    danhSachYeuCau.length < tongSoPhanTu;

  return {
    danhSachYeuCau,

    dangTaiDuLieu,
    dangTaiThem,
    loiTaiDuLieu,
    khongCoDuLieu,

    trangHienTai,
    laTrangCuoi,
    tongSoPhanTu,

    conYeuCauDeXemThem,
    xemThemYeuCau,
    taiLaiDanhSach,
  };
}