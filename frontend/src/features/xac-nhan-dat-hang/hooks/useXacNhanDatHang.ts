import axios from "axios";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  capNhatDiaChiGiaoHangApi,
  layDanhSachDiaChiGiaoHangApi,
  themDiaChiGiaoHangApi,
} from "../../customer/dia-chi-giao-hang/api/DiaChiGiaoHangApi";

import {
  TINH_THANH_GIAO_HANG_MAC_DINH,
  laTinhThanhGiaoHangDuocHoTro,
} from "../../customer/dia-chi-giao-hang/constants/DiaChiGiaoHangConstants";

import type {
  DiaChiGiaoHang,
  LoiApiDiaChiGiaoHang,
  LoiTruongDiaChiGiaoHang,
  LuuDiaChiGiaoHangRequest,
} from "../../customer/dia-chi-giao-hang/types/DiaChiGiaoHang";

import {
  taoDonHangApi,
} from "../../don-hang-khach-hang/api/DonHangApi";

import type {
  DonHangResponse,
} from "../../don-hang-khach-hang/types/DonHang";

import {
  layGioHangApi,
} from "../../gio-hang/api/GioHangApi";

import type {
  GioHang,
} from "../../gio-hang/types/GioHang";

import type {
  PhuongThucThanhToan,
} from "../types/XacNhanDatHang";

interface DuLieuLoiApi {
  detail?: string;
  message?: string;
}

const DU_LIEU_DIA_CHI_BAN_DAU:
  LuuDiaChiGiaoHangRequest = {
    tenNguoiNhan: "",
    soDienThoaiNhan: "",
    thanhPho: TINH_THANH_GIAO_HANG_MAC_DINH,
    phuongKhuVuc: "",
    diaChiChiTiet: "",
    laMacDinh: false,
  };

function kiemTraDuLieuDiaChi(
  duLieu: LuuDiaChiGiaoHangRequest,
): LoiTruongDiaChiGiaoHang {
  const loiMoi: LoiTruongDiaChiGiaoHang = {};

  const tenNguoiNhan =
    duLieu.tenNguoiNhan.trim();

  const soDienThoaiNhan =
    duLieu.soDienThoaiNhan.trim();

  const thanhPho =
    duLieu.thanhPho.trim();

  const phuongKhuVuc =
    duLieu.phuongKhuVuc.trim();

  const diaChiChiTiet =
    duLieu.diaChiChiTiet.trim();

  if (!tenNguoiNhan) {
    loiMoi.tenNguoiNhan =
      "Họ tên người nhận không được để trống.";
  } else if (tenNguoiNhan.length > 100) {
    loiMoi.tenNguoiNhan =
      "Họ tên người nhận không được vượt quá 100 ký tự.";
  }

  if (!soDienThoaiNhan) {
    loiMoi.soDienThoaiNhan =
      "Số điện thoại người nhận không được để trống.";
  } else if (
    !/^0\d{9}$/.test(soDienThoaiNhan)
  ) {
    loiMoi.soDienThoaiNhan =
      "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.";
  }

  if (!thanhPho) {
    loiMoi.thanhPho =
      "Tỉnh/Thành phố không được để trống.";
  } else if (
    !laTinhThanhGiaoHangDuocHoTro(
      thanhPho,
    )
  ) {
    loiMoi.thanhPho =
      "Hiện hệ thống chưa hỗ trợ giao hàng tại tỉnh/thành phố này.";
  }

  if (!phuongKhuVuc) {
    loiMoi.phuongKhuVuc =
      "Phường hoặc khu vực không được để trống.";
  } else if (
    phuongKhuVuc.length > 150
  ) {
    loiMoi.phuongKhuVuc =
      "Phường hoặc khu vực không được vượt quá 150 ký tự.";
  }

  if (!diaChiChiTiet) {
    loiMoi.diaChiChiTiet =
      "Địa chỉ chi tiết không được để trống.";
  } else if (
    diaChiChiTiet.length > 255
  ) {
    loiMoi.diaChiChiTiet =
      "Địa chỉ chi tiết không được vượt quá 255 ký tự.";
  }

  return loiMoi;
}

function locDanhSachDiaChiDuocGiaoHang(
  danhSachDiaChi: DiaChiGiaoHang[],
): DiaChiGiaoHang[] {
  return danhSachDiaChi.filter(
    (diaChi) =>
      laTinhThanhGiaoHangDuocHoTro(
        diaChi.thanhPho,
      ),
  );
}

function layMaDiaChiBanDau(
  danhSachDiaChi: DiaChiGiaoHang[],
): number | undefined {
  const diaChiMacDinh =
    danhSachDiaChi.find(
      (diaChi) => diaChi.laMacDinh,
    );

  if (diaChiMacDinh) {
    return diaChiMacDinh.maDiaChi;
  }

  return danhSachDiaChi[0]?.maDiaChi;
}

export function useXacNhanDatHang() {
  const [gioHang, setGioHang] =
    useState<GioHang | undefined>(
      undefined,
    );

  const [
    danhSachDiaChi,
    setDanhSachDiaChi,
  ] = useState<DiaChiGiaoHang[]>([]);

  const [
    maDiaChiDangChon,
    setMaDiaChiDangChon,
  ] = useState<number | undefined>(
    undefined,
  );

  const [
    phuongThucThanhToan,
    setPhuongThucThanhToan,
  ] =
    useState<PhuongThucThanhToan>(
      "COD",
    );

  const [ghiChu, setGhiChu] =
    useState("");

  const [
    dangTaiDuLieu,
    setDangTaiDuLieu,
  ] = useState(true);

  const [
    thongBaoLoi,
    setThongBaoLoi,
  ] = useState("");

  const [
    dangMoDanhSachDiaChi,
    setDangMoDanhSachDiaChi,
  ] = useState(false);

  const [
    dangTaoDonHang,
    setDangTaoDonHang,
  ] = useState(false);

  const [
    loiTaoDonHang,
    setLoiTaoDonHang,
  ] = useState("");

  const [
    dangMoFormThemDiaChi,
    setDangMoFormThemDiaChi,
  ] = useState(false);

  const [
    diaChiDangSua,
    setDiaChiDangSua,
  ] =
    useState<DiaChiGiaoHang | null>(
      null,
    );

  const [
    duLieuFormDiaChi,
    setDuLieuFormDiaChi,
  ] =
    useState<LuuDiaChiGiaoHangRequest>({
      ...DU_LIEU_DIA_CHI_BAN_DAU,
    });

  const [
    loiTruongDiaChi,
    setLoiTruongDiaChi,
  ] =
    useState<LoiTruongDiaChiGiaoHang>(
      {},
    );

  const [
    dangLuuDiaChi,
    setDangLuuDiaChi,
  ] = useState(false);

  const [
    loiThemDiaChi,
    setLoiThemDiaChi,
  ] = useState("");

  const [
    thongBaoThemDiaChiThanhCong,
    setThongBaoThemDiaChiThanhCong,
  ] = useState("");

  const taiDuLieuXacNhanDatHang =
    useCallback(async () => {
      setDangTaiDuLieu(true);
      setThongBaoLoi("");

      try {
        const [
          gioHangResponse,
          danhSachDiaChiMoi,
        ] = await Promise.all([
          layGioHangApi(),
          layDanhSachDiaChiGiaoHangApi(),
        ]);

        const danhSachDiaChiHopLe =
          locDanhSachDiaChiDuocGiaoHang(
            danhSachDiaChiMoi,
          );

        setGioHang(
          gioHangResponse.data,
        );

        setDanhSachDiaChi(
          danhSachDiaChiHopLe,
        );

        setMaDiaChiDangChon(
          layMaDiaChiBanDau(
            danhSachDiaChiHopLe,
          ),
        );
      } catch {
        setGioHang(undefined);
        setDanhSachDiaChi([]);
        setMaDiaChiDangChon(
          undefined,
        );

        setThongBaoLoi(
          "Không thể tải thông tin xác nhận đặt hàng.",
        );
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
      .then(
        ([
          gioHangResponse,
          danhSachDiaChiMoi,
        ]) => {
          if (daHuyYeuCau) {
            return;
          }

          const danhSachDiaChiHopLe =
            locDanhSachDiaChiDuocGiaoHang(
              danhSachDiaChiMoi,
            );

          setGioHang(
            gioHangResponse.data,
          );

          setDanhSachDiaChi(
            danhSachDiaChiHopLe,
          );

          setMaDiaChiDangChon(
            layMaDiaChiBanDau(
              danhSachDiaChiHopLe,
            ),
          );
        },
      )
      .catch(() => {
        if (daHuyYeuCau) {
          return;
        }

        setGioHang(undefined);
        setDanhSachDiaChi([]);
        setMaDiaChiDangChon(
          undefined,
        );

        setThongBaoLoi(
          "Không thể tải thông tin xác nhận đặt hàng.",
        );
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

  const diaChiDangChon =
    useMemo(() => {
      return danhSachDiaChi.find(
        (diaChi) =>
          diaChi.maDiaChi
          === maDiaChiDangChon,
      );
    }, [
      danhSachDiaChi,
      maDiaChiDangChon,
    ]);

  const gioHangRong =
    !gioHang
    || gioHang
      .danhSachChiTietGioHang
      .length === 0;

  const coTheHoanTat =
    !gioHangRong
    && diaChiDangChon !== undefined
    && laTinhThanhGiaoHangDuocHoTro(
      diaChiDangChon.thanhPho,
    );

  const chonDiaChi = (
    maDiaChi: number,
  ) => {
    const diaChi =
      danhSachDiaChi.find(
        (item) =>
          item.maDiaChi === maDiaChi,
      );

    if (
      !diaChi
      || !laTinhThanhGiaoHangDuocHoTro(
        diaChi.thanhPho,
      )
    ) {
      setLoiTaoDonHang(
        "Địa chỉ này nằm ngoài khu vực giao hàng được hỗ trợ.",
      );

      return;
    }

    setLoiTaoDonHang("");
    setMaDiaChiDangChon(maDiaChi);
    setDangMoDanhSachDiaChi(false);
  };

  const moFormThemDiaChi = () => {
    setDangMoDanhSachDiaChi(false);

    setDiaChiDangSua(null);

    setDuLieuFormDiaChi({
      ...DU_LIEU_DIA_CHI_BAN_DAU,
    });

    setLoiTruongDiaChi({});
    setLoiThemDiaChi("");

    setThongBaoThemDiaChiThanhCong(
      "",
    );

    setDangMoFormThemDiaChi(true);
  };

  const moFormSuaDiaChi = (
    diaChi: DiaChiGiaoHang,
  ) => {
    setDangMoDanhSachDiaChi(false);

    setDiaChiDangSua(diaChi);

    setDuLieuFormDiaChi({
      tenNguoiNhan:
        diaChi.tenNguoiNhan,

      soDienThoaiNhan:
        diaChi.soDienThoaiNhan,

      thanhPho:
        laTinhThanhGiaoHangDuocHoTro(
          diaChi.thanhPho,
        )
          ? diaChi.thanhPho
          : TINH_THANH_GIAO_HANG_MAC_DINH,

      phuongKhuVuc:
        diaChi.phuongKhuVuc,

      diaChiChiTiet:
        diaChi.diaChiChiTiet,

      laMacDinh:
        diaChi.laMacDinh,
    });

    setLoiTruongDiaChi({});
    setLoiThemDiaChi("");

    setThongBaoThemDiaChiThanhCong(
      "",
    );

    setDangMoFormThemDiaChi(true);
  };

  const dongFormThemDiaChi = () => {
    if (dangLuuDiaChi) {
      return;
    }

    setDangMoFormThemDiaChi(false);
    setDiaChiDangSua(null);
    setLoiTruongDiaChi({});
    setLoiThemDiaChi("");
  };

  const thayDoiDuLieuFormDiaChi = <
    K extends keyof LuuDiaChiGiaoHangRequest,
  >(
    tenTruong: K,
    giaTri:
      LuuDiaChiGiaoHangRequest[K],
  ) => {
    setDuLieuFormDiaChi(
      (duLieuHienTai) => ({
        ...duLieuHienTai,
        [tenTruong]: giaTri,
      }),
    );

    setLoiTruongDiaChi(
      (loiHienTai) => ({
        ...loiHienTai,
        [tenTruong]: undefined,
      }),
    );
  };

  const luuDiaChiMoi =
    async (): Promise<boolean> => {
      const loiMoi =
        kiemTraDuLieuDiaChi(
          duLieuFormDiaChi,
        );

      setLoiTruongDiaChi(
        loiMoi,
      );

      if (
        Object.keys(loiMoi).length > 0
      ) {
        return false;
      }

      const request:
        LuuDiaChiGiaoHangRequest = {
          tenNguoiNhan:
            duLieuFormDiaChi
              .tenNguoiNhan
              .trim(),

          soDienThoaiNhan:
            duLieuFormDiaChi
              .soDienThoaiNhan
              .trim(),

          thanhPho:
            duLieuFormDiaChi
              .thanhPho
              .trim(),

          phuongKhuVuc:
            duLieuFormDiaChi
              .phuongKhuVuc
              .trim(),

          diaChiChiTiet:
            duLieuFormDiaChi
              .diaChiChiTiet
              .trim(),

          laMacDinh:
            duLieuFormDiaChi
              .laMacDinh,
        };

      const dangCapNhat =
        diaChiDangSua !== null;

      try {
        setDangLuuDiaChi(true);
        setLoiThemDiaChi("");

        setThongBaoThemDiaChiThanhCong(
          "",
        );

        const diaChiDaLuu =
          diaChiDangSua
            ? await capNhatDiaChiGiaoHangApi(
                diaChiDangSua.maDiaChi,
                request,
              )
            : await themDiaChiGiaoHangApi(
                request,
              );

        const danhSachDiaChiMoi =
          await layDanhSachDiaChiGiaoHangApi();

        const danhSachDiaChiHopLe =
          locDanhSachDiaChiDuocGiaoHang(
            danhSachDiaChiMoi,
          );

        setDanhSachDiaChi(
          danhSachDiaChiHopLe,
        );

        setMaDiaChiDangChon(
          diaChiDaLuu.maDiaChi,
        );

        setDangMoFormThemDiaChi(
          false,
        );

        setDiaChiDangSua(null);

        setLoiTruongDiaChi({});

        setThongBaoThemDiaChiThanhCong(
          dangCapNhat
            ? "Cập nhật địa chỉ nhận hàng thành công."
            : "Thêm địa chỉ nhận hàng thành công.",
        );

        return true;
      } catch (error) {
        if (
          axios.isAxiosError<LoiApiDiaChiGiaoHang>(
            error,
          )
        ) {
          const loiTruongBackend =
            error.response?.data
              ?.fieldErrors;

          if (
            loiTruongBackend
            && Object.keys(
              loiTruongBackend,
            ).length > 0
          ) {
            setLoiTruongDiaChi(
              loiTruongBackend,
            );

            return false;
          }

          setLoiThemDiaChi(
            error.response?.data
              ?.detail
              || error.response?.data
                ?.message
              || (
                dangCapNhat
                  ? "Không thể cập nhật địa chỉ nhận hàng."
                  : "Không thể thêm địa chỉ nhận hàng."
              ),
          );

          return false;
        }

        setLoiThemDiaChi(
          dangCapNhat
            ? "Không thể cập nhật địa chỉ nhận hàng."
            : "Không thể thêm địa chỉ nhận hàng.",
        );

        return false;
      } finally {
        setDangLuuDiaChi(false);
      }
    };

  const xoaThongBaoThemDiaChi =
    useCallback(() => {
      setLoiThemDiaChi("");

      setThongBaoThemDiaChiThanhCong(
        "",
      );
    }, []);

  async function hoanTatDatHang():
    Promise<DonHangResponse | null> {
    if (dangTaoDonHang) {
      return null;
    }

    if (
      maDiaChiDangChon === undefined
      || !diaChiDangChon
    ) {
      setLoiTaoDonHang(
        "Vui lòng chọn địa chỉ nhận hàng.",
      );

      return null;
    }

    if (
      !laTinhThanhGiaoHangDuocHoTro(
        diaChiDangChon.thanhPho,
      )
    ) {
      setLoiTaoDonHang(
        "Địa chỉ nhận hàng nằm ngoài khu vực giao hàng được hỗ trợ.",
      );

      return null;
    }

    try {
      setDangTaoDonHang(true);
      setLoiTaoDonHang("");

      return await taoDonHangApi({
        maDiaChi:
          maDiaChiDangChon,

        phuongThucThanhToan,

        ghiChu:
          ghiChu.trim()
          || null,
      });
    } catch (
      error: unknown
    ) {
      if (
        axios.isAxiosError<DuLieuLoiApi>(
          error,
        )
      ) {
        const noiDungLoi =
          error.response?.data
            ?.detail
            || error.response?.data
              ?.message
            || "Không thể tạo đơn hàng. Vui lòng thử lại.";

        setLoiTaoDonHang(
          noiDungLoi,
        );

        return null;
      }

      setLoiTaoDonHang(
        "Không thể tạo đơn hàng. Vui lòng thử lại.",
      );

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

    dangMoFormThemDiaChi,
    diaChiDangSua,
    duLieuFormDiaChi,
    loiTruongDiaChi,
    dangLuuDiaChi,
    loiThemDiaChi,
    thongBaoThemDiaChiThanhCong,

    setPhuongThucThanhToan,
    setGhiChu,
    setDangMoDanhSachDiaChi,
    chonDiaChi,

    moFormThemDiaChi,
    moFormSuaDiaChi,
    dongFormThemDiaChi,
    thayDoiDuLieuFormDiaChi,
    luuDiaChiMoi,
    xoaThongBaoThemDiaChi,

    taiDuLieuXacNhanDatHang,
    hoanTatDatHang,
  };
}