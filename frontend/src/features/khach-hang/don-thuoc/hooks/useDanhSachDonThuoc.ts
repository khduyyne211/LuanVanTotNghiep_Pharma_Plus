import axios from "axios";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  layDanhSachDonThuocCuaToiApi,
} from "../api/DonThuocKhachHangApi";

import type {
  DonThuocKhachHang,
} from "../types/DonThuocKhachHang";

const SO_DON_THUOC_MOI_LAN_TAI =
  10;

interface PhanHoiLoiApi {
  message?: string;
  thongBao?: string;
}

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
      "Không thể tải danh sách đơn thuốc."
    );
  }

  return "Không thể tải danh sách đơn thuốc.";
}

export function useDanhSachDonThuoc() {
  const [
    danhSachDonThuoc,
    setDanhSachDonThuoc,
  ] = useState<DonThuocKhachHang[]>(
    []
  );

  const [
    dangTaiDuLieu,
    setDangTaiDuLieu,
  ] = useState(false);

  const [
    dangTaiThem,
    setDangTaiThem,
  ] = useState(false);

  const [
    loiTaiDuLieu,
    setLoiTaiDuLieu,
  ] = useState("");

  const [
    trangHienTai,
    setTrangHienTai,
  ] = useState(0);

  const [
    laTrangCuoi,
    setLaTrangCuoi,
  ] = useState(false);

  const [
    tongSoPhanTu,
    setTongSoPhanTu,
  ] = useState(0);

  const layTrangDonThuoc =
    useCallback(
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
            await layDanhSachDonThuocCuaToiApi(
              page,
              SO_DON_THUOC_MOI_LAN_TAI
            );

          const duLieuPhanTrang =
            response.data;

          if (laTaiThem) {
            setDanhSachDonThuoc(
              (danhSachCu) => [
                ...danhSachCu,
                ...duLieuPhanTrang
                  .danhSachNoiDung,
              ]
            );
          } else {
            setDanhSachDonThuoc(
              duLieuPhanTrang
                .danhSachNoiDung
            );
          }

          setTrangHienTai(
            duLieuPhanTrang
              .trangHienTai
          );

          setLaTrangCuoi(
            duLieuPhanTrang
              .laTrangCuoi
          );

          setTongSoPhanTu(
            duLieuPhanTrang
              .tongSoPhanTu
          );
        } catch (error) {
          setLoiTaiDuLieu(
            layThongBaoLoi(
              error
            )
          );
        } finally {
          setDangTaiDuLieu(false);
          setDangTaiThem(false);
        }
      },
      []
    );

  useEffect(() => {
    void layTrangDonThuoc(
      0,
      false
    );
  }, [layTrangDonThuoc]);

  const xemThemDonThuoc = () => {
    if (
      dangTaiDuLieu ||
      dangTaiThem ||
      laTrangCuoi
    ) {
      return;
    }

    void layTrangDonThuoc(
      trangHienTai + 1,
      true
    );
  };

  const taiLaiDanhSach = () => {
    setDanhSachDonThuoc([]);

    setTrangHienTai(0);

    setLaTrangCuoi(false);

    setTongSoPhanTu(0);

    void layTrangDonThuoc(
      0,
      false
    );
  };

  const khongCoDuLieu =
    !dangTaiDuLieu &&
    !loiTaiDuLieu &&
    danhSachDonThuoc.length === 0;

  const conDonThuocDeXemThem =
    !laTrangCuoi &&
    danhSachDonThuoc.length <
      tongSoPhanTu;

  return {
    danhSachDonThuoc,

    dangTaiDuLieu,
    dangTaiThem,

    loiTaiDuLieu,

    khongCoDuLieu,

    tongSoPhanTu,

    conDonThuocDeXemThem,

    xemThemDonThuoc,
    taiLaiDanhSach,
  };
}