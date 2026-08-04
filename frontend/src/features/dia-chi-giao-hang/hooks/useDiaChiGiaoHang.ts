import axios from "axios";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  capNhatDiaChiGiaoHangApi,
  layDanhSachDiaChiGiaoHangApi,
  themDiaChiGiaoHangApi,
  xoaDiaChiGiaoHangApi,
} from "../api/DiaChiGiaoHangApi";

import type {
  DiaChiGiaoHang,
  LoiApiDiaChiGiaoHang,
  LoiTruongDiaChiGiaoHang,
  LuuDiaChiGiaoHangRequest,
} from "../types/DiaChiGiaoHang";

const DU_LIEU_FORM_BAN_DAU: LuuDiaChiGiaoHangRequest = {
  tenNguoiNhan: "",
  soDienThoaiNhan: "",
  thanhPho: "",
  phuongKhuVuc: "",
  diaChiChiTiet: "",
  laMacDinh: false,
};

function layThongBaoLoi(error: unknown): string {
  if (axios.isAxiosError<LoiApiDiaChiGiaoHang>(error)) {
    return (
      error.response?.data?.detail ||
      error.response?.data?.message ||
      "Không thể xử lý địa chỉ giao hàng."
    );
  }

  return "Đã xảy ra lỗi không xác định.";
}

function kiemTraDuLieu(
  duLieu: LuuDiaChiGiaoHangRequest,
): LoiTruongDiaChiGiaoHang {
  const loiMoi: LoiTruongDiaChiGiaoHang = {};

  const tenNguoiNhan = duLieu.tenNguoiNhan.trim();
  const soDienThoai = duLieu.soDienThoaiNhan.trim();
  const thanhPho = duLieu.thanhPho.trim();
  const phuongKhuVuc = duLieu.phuongKhuVuc.trim();
  const diaChiChiTiet = duLieu.diaChiChiTiet.trim();

  if (!tenNguoiNhan) {
    loiMoi.tenNguoiNhan =
      "Họ tên người nhận không được để trống.";
  } else if (tenNguoiNhan.length > 100) {
    loiMoi.tenNguoiNhan =
      "Họ tên người nhận không được vượt quá 100 ký tự.";
  }

  if (!soDienThoai) {
    loiMoi.soDienThoaiNhan =
      "Số điện thoại người nhận không được để trống.";
  } else if (!/^0\d{9}$/.test(soDienThoai)) {
    loiMoi.soDienThoaiNhan =
      "Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0.";
  }

  if (!thanhPho) {
    loiMoi.thanhPho =
      "Thành phố không được để trống.";
  } else if (thanhPho.length > 100) {
    loiMoi.thanhPho =
      "Thành phố không được vượt quá 100 ký tự.";
  }

  if (!phuongKhuVuc) {
    loiMoi.phuongKhuVuc =
      "Phường hoặc khu vực không được để trống.";
  } else if (phuongKhuVuc.length > 150) {
    loiMoi.phuongKhuVuc =
      "Phường hoặc khu vực không được vượt quá 150 ký tự.";
  }

  if (!diaChiChiTiet) {
    loiMoi.diaChiChiTiet =
      "Địa chỉ chi tiết không được để trống.";
  } else if (diaChiChiTiet.length > 255) {
    loiMoi.diaChiChiTiet =
      "Địa chỉ chi tiết không được vượt quá 255 ký tự.";
  }

  return loiMoi;
}

export function useDiaChiGiaoHang() {
  const [
    danhSachDiaChi,
    setDanhSachDiaChi,
  ] = useState<DiaChiGiaoHang[]>([]);

  const [
    duLieuForm,
    setDuLieuForm,
  ] = useState<LuuDiaChiGiaoHangRequest>({
    ...DU_LIEU_FORM_BAN_DAU,
  });

  const [
    diaChiDangSua,
    setDiaChiDangSua,
  ] = useState<DiaChiGiaoHang | null>(null);

  const [
    loiTruong,
    setLoiTruong,
  ] = useState<LoiTruongDiaChiGiaoHang>({});

  const [dangTaiDuLieu, setDangTaiDuLieu] =
    useState(true);

  const [dangMoForm, setDangMoForm] =
    useState(false);

  const [dangLuu, setDangLuu] =
    useState(false);

  const [
    maDiaChiDangXoa,
    setMaDiaChiDangXoa,
  ] = useState<number | null>(null);

  const [thongBaoLoi, setThongBaoLoi] =
    useState("");

  const [loiHeThong, setLoiHeThong] =
    useState("");

  const [
    thongBaoThanhCong,
    setThongBaoThanhCong,
  ] = useState("");

  const layDanhSachDiaChi =
    useCallback(async () => {
      try {
        setDangTaiDuLieu(true);
        setThongBaoLoi("");

        const duLieu =
          await layDanhSachDiaChiGiaoHangApi();

        setDanhSachDiaChi(duLieu);
      } catch {
        setDanhSachDiaChi([]);
        setThongBaoLoi(
          "Không thể tải danh sách địa chỉ giao hàng.",
        );
      } finally {
        setDangTaiDuLieu(false);
      }
    }, []);

  useEffect(() => {
    void layDanhSachDiaChi();
  }, [layDanhSachDiaChi]);

  const moFormThemDiaChi = () => {
    setDiaChiDangSua(null);

    setDuLieuForm({
      ...DU_LIEU_FORM_BAN_DAU,
    });

    setLoiTruong({});
    setLoiHeThong("");
    setThongBaoThanhCong("");
    setDangMoForm(true);
  };

  const moFormSuaDiaChi = (
    diaChi: DiaChiGiaoHang,
  ) => {
    setDiaChiDangSua(diaChi);

    setDuLieuForm({
      tenNguoiNhan: diaChi.tenNguoiNhan,
      soDienThoaiNhan:
        diaChi.soDienThoaiNhan,
      thanhPho: diaChi.thanhPho,
      phuongKhuVuc:
        diaChi.phuongKhuVuc,
      diaChiChiTiet:
        diaChi.diaChiChiTiet,
      laMacDinh: diaChi.laMacDinh,
    });

    setLoiTruong({});
    setLoiHeThong("");
    setThongBaoThanhCong("");
    setDangMoForm(true);
  };

  const dongFormDiaChi = () => {
    if (dangLuu) {
      return;
    }

    setDangMoForm(false);
    setDiaChiDangSua(null);
    setLoiTruong({});
  };

  const thayDoiDuLieuForm = <
    K extends keyof LuuDiaChiGiaoHangRequest,
  >(
    tenTruong: K,
    giaTri: LuuDiaChiGiaoHangRequest[K],
  ) => {
    setDuLieuForm((duLieuHienTai) => ({
      ...duLieuHienTai,
      [tenTruong]: giaTri,
    }));

    setLoiTruong((loiHienTai) => ({
      ...loiHienTai,
      [tenTruong]: undefined,
    }));
  };

  const luuDiaChi =
    async (): Promise<boolean> => {
      const loiMoi =
        kiemTraDuLieu(duLieuForm);

      setLoiTruong(loiMoi);

      if (Object.keys(loiMoi).length > 0) {
        return false;
      }

      const request: LuuDiaChiGiaoHangRequest = {
        tenNguoiNhan:
          duLieuForm.tenNguoiNhan.trim(),

        soDienThoaiNhan:
          duLieuForm.soDienThoaiNhan.trim(),

        thanhPho:
          duLieuForm.thanhPho.trim(),

        phuongKhuVuc:
          duLieuForm.phuongKhuVuc.trim(),

        diaChiChiTiet:
          duLieuForm.diaChiChiTiet.trim(),

        laMacDinh:
          duLieuForm.laMacDinh,
      };

      const dangCapNhat =
        diaChiDangSua !== null;

      try {
        setDangLuu(true);
        setLoiHeThong("");
        setThongBaoThanhCong("");

        if (diaChiDangSua) {
          await capNhatDiaChiGiaoHangApi(
            diaChiDangSua.maDiaChi,
            request,
          );
        } else {
          await themDiaChiGiaoHangApi(
            request,
          );
        }

        await layDanhSachDiaChi();

        setDangMoForm(false);
        setDiaChiDangSua(null);
        setLoiTruong({});

        setThongBaoThanhCong(
          dangCapNhat
            ? "Cập nhật địa chỉ giao hàng thành công."
            : "Thêm địa chỉ giao hàng thành công.",
        );

        return true;
      } catch (error) {
        if (
          axios.isAxiosError<LoiApiDiaChiGiaoHang>(
            error,
          )
        ) {
          const loiTruongTuBackend =
            error.response?.data?.fieldErrors;

          if (
            loiTruongTuBackend &&
            Object.keys(loiTruongTuBackend)
              .length > 0
          ) {
            setLoiTruong(
              loiTruongTuBackend,
            );

            return false;
          }
        }

        setLoiHeThong(
          layThongBaoLoi(error),
        );

        return false;
      } finally {
        setDangLuu(false);
      }
    };

  const xoaDiaChi = async (
    maDiaChi: number,
  ): Promise<boolean> => {
    try {
      setMaDiaChiDangXoa(maDiaChi);
      setLoiHeThong("");
      setThongBaoThanhCong("");

      await xoaDiaChiGiaoHangApi(
        maDiaChi,
      );

      await layDanhSachDiaChi();

      if (
        diaChiDangSua?.maDiaChi ===
        maDiaChi
      ) {
        setDangMoForm(false);
        setDiaChiDangSua(null);
      }

      setThongBaoThanhCong(
        "Xóa địa chỉ giao hàng thành công.",
      );

      return true;
    } catch (error) {
      setLoiHeThong(
        layThongBaoLoi(error),
      );

      return false;
    } finally {
      setMaDiaChiDangXoa(null);
    }
  };

  const xoaThongBaoHeThong =
    useCallback(() => {
      setLoiHeThong("");
      setThongBaoThanhCong("");
    }, []);

  return {
    danhSachDiaChi,
    duLieuForm,
    diaChiDangSua,
    loiTruong,
    dangTaiDuLieu,
    dangMoForm,
    dangLuu,
    maDiaChiDangXoa,
    thongBaoLoi,
    loiHeThong,
    thongBaoThanhCong,
    layDanhSachDiaChi,
    moFormThemDiaChi,
    moFormSuaDiaChi,
    dongFormDiaChi,
    thayDoiDuLieuForm,
    luuDiaChi,
    xoaDiaChi,
    xoaThongBaoHeThong,
  };
}