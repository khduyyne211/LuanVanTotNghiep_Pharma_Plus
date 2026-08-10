import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { SanPham } from "../types/SanPham";
import {
  layDanhSachSanPhamApi,
  type LayDanhSachSanPhamParams,
} from "../api/SanPhamApi";

const SO_SAN_PHAM_MOI_LAN_TAI = 12;

interface UseSanPhamParams {
  tuKhoa?: string;
  sapXep?: string;
  giaTu?: number;
  giaDen?: number;
  maNhaSanXuat?: number;
  maDanhMuc?: number;
}

export function useSanPham(
  thamSoBenNgoai: UseSanPhamParams = {}
) {
  const [
    danhSachSanPham,
    setDanhSachSanPham,
  ] = useState<SanPham[]>([]);

  const [
    dangTaiDuLieu,
    setDangTaiDuLieu,
  ] = useState(false);

  const [
    dangTaiThem,
    setDangTaiThem,
  ] = useState(false);

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

  const [sapXep, setSapXep] = useState(
    thamSoBenNgoai.sapXep || ""
  );

  const [giaTu, setGiaTu] = useState<
    number | undefined
  >(thamSoBenNgoai.giaTu);

  const [giaDen, setGiaDen] = useState<
    number | undefined
  >(thamSoBenNgoai.giaDen);

  const [
    maNhaSanXuat,
    setMaNhaSanXuat,
  ] = useState<number | undefined>(
    thamSoBenNgoai.maNhaSanXuat
  );

  const [
    tenNhaSanXuatDangChon,
    setTenNhaSanXuatDangChon,
  ] = useState("");

  const maDanhMuc =
    thamSoBenNgoai.maDanhMuc;

  const tuKhoa =
    thamSoBenNgoai.tuKhoa?.trim() ||
    undefined;

  const khoaYeuCauHienTai = JSON.stringify({
    tuKhoa: tuKhoa || "",
    sapXep,
    giaTu: giaTu ?? null,
    giaDen: giaDen ?? null,
    maNhaSanXuat: maNhaSanXuat ?? null,
    maDanhMuc: maDanhMuc ?? null,
  });

  const khoaYeuCauMoiNhatRef =
    useRef(khoaYeuCauHienTai);

  const [
    khoaYeuCauDaTaiXong,
    setKhoaYeuCauDaTaiXong,
  ] = useState<string | null>(null);

  const taoParamsApi = (
    page: number
  ): LayDanhSachSanPhamParams => {
    const paramsApi:
      LayDanhSachSanPhamParams = {
        page,
        size: SO_SAN_PHAM_MOI_LAN_TAI,
      };

    if (tuKhoa) {
      paramsApi.tuKhoa = tuKhoa;
    }

    if (sapXep) {
      paramsApi.sapXep = sapXep;
    }

    if (giaTu !== undefined) {
      paramsApi.giaTu = giaTu;
    }

    if (giaDen !== undefined) {
      paramsApi.giaDen = giaDen;
    }

    if (maNhaSanXuat !== undefined) {
      paramsApi.maNhaSanXuat =
        maNhaSanXuat;
    }

    if (maDanhMuc !== undefined) {
      paramsApi.maDanhMuc = maDanhMuc;
    }

    return paramsApi;
  };

  const layTrangSanPham = (
    page: number,
    laTaiThem: boolean,
    khoaYeuCau: string
  ) => {
    if (laTaiThem) {
      setDangTaiThem(true);
    } else {
      setDangTaiDuLieu(true);
    }

    const paramsApi = taoParamsApi(page);

    layDanhSachSanPhamApi(paramsApi)
      .then((response) => {
        if (
          khoaYeuCau !==
          khoaYeuCauMoiNhatRef.current
        ) {
          return;
        }

        const duLieuPhanTrang =
          response.data;

        if (laTaiThem) {
          setDanhSachSanPham(
            (danhSachCu) => [
              ...danhSachCu,
              ...duLieuPhanTrang
                .danhSachNoiDung,
            ]
          );
        } else {
          setDanhSachSanPham(
            duLieuPhanTrang.danhSachNoiDung
          );

          setKhoaYeuCauDaTaiXong(
            khoaYeuCau
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
      })
      .finally(() => {
        if (
          khoaYeuCau !==
          khoaYeuCauMoiNhatRef.current
        ) {
          return;
        }

        setDangTaiDuLieu(false);
        setDangTaiThem(false);
      });
  };

  useEffect(() => {
    khoaYeuCauMoiNhatRef.current =
      khoaYeuCauHienTai;

    setKhoaYeuCauDaTaiXong(null);
    setTrangHienTai(0);
    setLaTrangCuoi(false);
    setTongSoPhanTu(0);
    setDanhSachSanPham([]);

    layTrangSanPham(
      0,
      false,
      khoaYeuCauHienTai
    );
  }, [khoaYeuCauHienTai]);

  const xemThemSanPham = () => {
    if (
      dangTaiDuLieu ||
      dangTaiThem ||
      laTrangCuoi
    ) {
      return;
    }

    layTrangSanPham(
      trangHienTai + 1,
      true,
      khoaYeuCauHienTai
    );
  };

  const boLocDuoi100 = () => {
    setGiaTu(undefined);
    setGiaDen(100000);
  };

  const boLocTu100Den300 = () => {
    setGiaTu(100000);
    setGiaDen(300000);
  };

  const boLocTu300Den500 = () => {
    setGiaTu(300000);
    setGiaDen(500000);
  };

  const boLocTren500 = () => {
    setGiaTu(500000);
    setGiaDen(undefined);
  };

  const chonNhaSanXuat = (
    maNhaSanXuatMoi: number,
    tenNhaSanXuat: string
  ) => {
    setMaNhaSanXuat(maNhaSanXuatMoi);

    setTenNhaSanXuatDangChon(
      tenNhaSanXuat
    );
  };

  const xoaTatCaBoLoc = () => {
    setGiaTu(undefined);
    setGiaDen(undefined);
    setMaNhaSanXuat(undefined);
    setTenNhaSanXuatDangChon("");
  };

  const layTenBoLocGia = () => {
    if (
      giaTu === undefined &&
      giaDen === undefined
    ) {
      return "";
    }

    if (
      giaTu === undefined &&
      giaDen === 100000
    ) {
      return "Dưới 100.000đ";
    }

    if (
      giaTu === 100000 &&
      giaDen === 300000
    ) {
      return "100.000đ đến 300.000đ";
    }

    if (
      giaTu === 300000 &&
      giaDen === 500000
    ) {
      return "300.000đ đến 500.000đ";
    }

    if (
      giaTu === 500000 &&
      giaDen === undefined
    ) {
      return "Trên 500.000đ";
    }

    return "";
  };

  const xoaBoLocGia = () => {
    setGiaTu(undefined);
    setGiaDen(undefined);
  };

  const xoaBoLocNhaSanXuat = () => {
    setMaNhaSanXuat(undefined);
    setTenNhaSanXuatDangChon("");
  };

  const danhSachBoLocDangChon: {
    id: string;
    ten: string;
    xoaBoLoc: () => void;
  }[] = [];

  const tenBoLocGia = layTenBoLocGia();

  if (tenBoLocGia) {
    danhSachBoLocDangChon.push({
      id: "gia",
      ten: tenBoLocGia,
      xoaBoLoc: xoaBoLocGia,
    });
  }

  if (tenNhaSanXuatDangChon) {
    danhSachBoLocDangChon.push({
      id: "nhaSanXuat",
      ten: tenNhaSanXuatDangChon,
      xoaBoLoc: xoaBoLocNhaSanXuat,
    });
  }

  const danhSachDangHienThi =
    danhSachSanPham;

  const conSanPhamDeXemThem =
    !laTrangCuoi &&
    danhSachSanPham.length <
      tongSoPhanTu;

  const daTaiXongYeuCauHienTai =
    khoaYeuCauDaTaiXong ===
    khoaYeuCauHienTai;

  const khongCoSanPham =
    daTaiXongYeuCauHienTai &&
    !dangTaiDuLieu &&
    danhSachSanPham.length === 0;

  return {
    tuKhoa,

    sapXep,
    setSapXep,

    boLocDuoi100,
    boLocTu100Den300,
    boLocTu300Den500,
    boLocTren500,

    chonNhaSanXuat,
    xoaTatCaBoLoc,

    danhSachBoLocDangChon,

    danhSachDangHienThi,
    danhSachSanPham,

    conSanPhamDeXemThem,
    xemThemSanPham,

    dangTaiDuLieu,
    dangTaiThem,
    khongCoSanPham,

    trangHienTai,
    laTrangCuoi,
    tongSoPhanTu,
    daTaiXongYeuCauHienTai,
  };
}