import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { kiemTraGioHangApi } from "../api/GioHangApi";
import { useGioHangContext } from "../context/GioHangContext";
import { useXacThucContext } from "../../../xac-thuc/context/XacThucContext";

import type { ChiTietGioHangLocal } from "../types/GioHangLocal";
import type {
  KiemTraGioHangResponse,
  ThongTinKiemTraGioHang,
} from "../types/KiemTraGioHang";
import type { ChiTietGioHangHienThi } from "../types/GioHangHienThi";

/*
 * Chữ ký chỉ phản ánh cấu trúc giỏ hàng:
 * - khách hàng;
 * - những đơn vị sản phẩm đang có.
 *
 * Cố ý không chứa số lượng để thao tác
 * tăng/giảm không tự gọi lại backend.
 */
function taoChuKyCauTrucGioHang(
  maKhachHang: number,
  danhSachChiTiet: ChiTietGioHangLocal[]
) {
  const danhSachMaDonVi =
    danhSachChiTiet
      .map(
        (chiTiet) =>
          chiTiet.maDonViSanPham
      )
      .sort(
        (maThuNhat, maThuHai) =>
          maThuNhat - maThuHai
      );

  return (
    `${maKhachHang}:` +
    danhSachMaDonVi.join("|")
  );
}

export function useKiemTraGioHangLocal() {
  const {
    nguoiDungDangNhap,
    daDangNhap,
  } = useXacThucContext();

  const {
    danhSachChiTietGioHangLocal,
  } = useGioHangContext();

  const [
    ketQuaKiemTra,
    setKetQuaKiemTra,
  ] = useState<KiemTraGioHangResponse | null>(
    null
  );

  const [
    dangTaiDuLieu,
    setDangTaiDuLieu,
  ] = useState(false);

  const [
    thongBaoLoi,
    setThongBaoLoi,
  ] = useState("");

  /*
   * Ghi nhớ cấu trúc giỏ đã được
   * backend kiểm tra.
   */
  const chuKyGioHangDaTuDongKiemTra =
    useRef<string | null>(null);

  const kiemTraDanhSachGioHang =
    useCallback(
      async (
        danhSachChiTiet: ChiTietGioHangLocal[]
      ): Promise<KiemTraGioHangResponse | null> => {
        const maKhachHang =
          nguoiDungDangNhap?.maKhachHang;

        /*
         * maKhachHang trong project có thể
         * là number | null | undefined.
         *
         * Dùng == null để loại cả null
         * và undefined.
         */
        if (
          !daDangNhap ||
          maKhachHang == null
        ) {
          setKetQuaKiemTra(null);

          return null;
        }

        if (
          danhSachChiTiet.length === 0
        ) {
          const ketQuaRong:
            KiemTraGioHangResponse = {
              hopLe: true,
              danhSachThongTin: [],
            };

          setKetQuaKiemTra(
            ketQuaRong
          );

          setThongBaoLoi("");

          chuKyGioHangDaTuDongKiemTra.current =
            taoChuKyCauTrucGioHang(
              maKhachHang,
              danhSachChiTiet
            );

          return ketQuaRong;
        }

        try {
          setDangTaiDuLieu(true);
          setThongBaoLoi("");

          const danhSachGuiBackend =
            danhSachChiTiet.map(
              (chiTiet) => ({
                maDonViSanPham:
                  chiTiet.maDonViSanPham,

                soLuong:
                  chiTiet.soLuong,
              })
            );

          const response =
            await kiemTraGioHangApi(
              danhSachGuiBackend
            );

          setKetQuaKiemTra(
            response
          );

          /*
           * Ghi nhận cấu trúc vừa được
           * backend kiểm tra thành công.
           */
          chuKyGioHangDaTuDongKiemTra.current =
            taoChuKyCauTrucGioHang(
              maKhachHang,
              danhSachChiTiet
            );

          return response;
        } catch {
          setKetQuaKiemTra(null);

          setThongBaoLoi(
            "Không thể kiểm tra giá và số lượng tồn kho của giỏ hàng."
          );

          return null;
        } finally {
          setDangTaiDuLieu(false);
        }
      },
      [
        daDangNhap,
        nguoiDungDangNhap,
      ]
    );

  /*
   * Kiểm tra thủ công khi thực sự cần
   * dữ liệu mới nhất từ backend.
   */
  const kiemTraLaiGioHang =
    useCallback(() => {
      return kiemTraDanhSachGioHang(
        danhSachChiTietGioHangLocal
      );
    }, [
      kiemTraDanhSachGioHang,
      danhSachChiTietGioHangLocal,
    ]);

  /*
   * Tự kiểm tra khi:
   * - vừa vào giỏ;
   * - thêm/xóa dòng;
   * - đổi đơn vị sản phẩm.
   *
   * Chỉ đổi số lượng sẽ không làm
   * chữ ký thay đổi.
   */
  useEffect(() => {
    const maKhachHang =
      nguoiDungDangNhap?.maKhachHang;

    if (
      !daDangNhap ||
      maKhachHang == null
    ) {
      chuKyGioHangDaTuDongKiemTra.current =
        null;

      setKetQuaKiemTra(null);
      setThongBaoLoi("");

      return;
    }

    if (
      danhSachChiTietGioHangLocal.length ===
      0
    ) {
      chuKyGioHangDaTuDongKiemTra.current =
        taoChuKyCauTrucGioHang(
          maKhachHang,
          []
        );

      setKetQuaKiemTra({
        hopLe: true,
        danhSachThongTin: [],
      });

      setThongBaoLoi("");

      return;
    }

    const chuKyGioHang =
      taoChuKyCauTrucGioHang(
        maKhachHang,
        danhSachChiTietGioHangLocal
      );

    if (
      chuKyGioHangDaTuDongKiemTra.current ===
      chuKyGioHang
    ) {
      return;
    }

    /*
     * Đánh dấu trước khi request để
     * tránh gọi trùng trong render.
     */
    chuKyGioHangDaTuDongKiemTra.current =
      chuKyGioHang;

    void kiemTraDanhSachGioHang(
      danhSachChiTietGioHangLocal
    );
  }, [
    daDangNhap,
    nguoiDungDangNhap,
    danhSachChiTietGioHangLocal,
    kiemTraDanhSachGioHang,
  ]);

  const thongTinTheoDonVi =
    useMemo(() => {
      const ketQua =
        new Map<
          number,
          ThongTinKiemTraGioHang
        >();

      ketQuaKiemTra?.danhSachThongTin.forEach(
        (thongTin) => {
          ketQua.set(
            thongTin.maDonViSanPham,
            thongTin
          );
        }
      );

      return ketQua;
    }, [
      ketQuaKiemTra,
    ]);

  /*
   * Giá và tồn kho lấy từ lần backend
   * kiểm tra gần nhất.
   *
   * Số lượng lấy từ state/localStorage.
   */
  const danhSachChiTietHienThi =
    useMemo<ChiTietGioHangHienThi[]>(
      () => {
        return danhSachChiTietGioHangLocal.map(
          (chiTietLocal) => {
            const thongTinMoi =
              thongTinTheoDonVi.get(
                chiTietLocal.maDonViSanPham
              );

            const donViLocal =
              chiTietLocal.danhSachDonViBan.find(
                (donVi) =>
                  donVi.maDonViSanPham ===
                  chiTietLocal.maDonViSanPham
              );

            const giaGocLocal =
              donViLocal?.giaBanTheoDonVi ??
              chiTietLocal.giaBanTamThoi;

            const giaSauKhuyenMaiLocal =
              donViLocal?.giaSauKhuyenMai ??
              chiTietLocal.giaBanTamThoi;

            const giaBanTheoDonVi =
              thongTinMoi?.giaBanTheoDonVi ??
              giaGocLocal;

            const giaSauKhuyenMai =
              thongTinMoi?.giaSauKhuyenMai ??
              giaSauKhuyenMaiLocal;

            const soTienGiamMoiDonVi =
              thongTinMoi
                ?.soTienGiamMoiDonVi ??
              Math.max(
                giaBanTheoDonVi -
                  giaSauKhuyenMai,
                0
              );

            const coKhuyenMaiTheoDuLieu =
              thongTinMoi?.coKhuyenMai ??
              donViLocal?.coKhuyenMai ??
              (
                giaBanTheoDonVi >
                giaSauKhuyenMai
              );

            const coKhuyenMai =
              Boolean(
                coKhuyenMaiTheoDuLieu
              ) &&
              giaBanTheoDonVi >
                giaSauKhuyenMai;

            /*
             * Đồng bộ thông tin mới nhất
             * cho đơn vị đang được chọn.
             */
            const danhSachDonViBan =
              chiTietLocal.danhSachDonViBan.map(
                (donVi) => {
                  if (
                    donVi.maDonViSanPham !==
                      chiTietLocal
                        .maDonViSanPham ||
                    !thongTinMoi
                  ) {
                    return donVi;
                  }

                  return {
                    ...donVi,

                    giaBanTheoDonVi:
                      thongTinMoi
                        .giaBanTheoDonVi,

                    soTienGiamMoiDonVi:
                      thongTinMoi
                        .soTienGiamMoiDonVi,

                    giaSauKhuyenMai:
                      thongTinMoi
                        .giaSauKhuyenMai,

                    coKhuyenMai:
                      thongTinMoi
                        .coKhuyenMai,
                  };
                }
              );

            const thanhTienGoc =
              giaBanTheoDonVi *
              chiTietLocal.soLuong;

            const tongSoTienGiam =
              soTienGiamMoiDonVi *
              chiTietLocal.soLuong;

            const thanhTien =
              giaSauKhuyenMai *
              chiTietLocal.soLuong;

            return {
              maSanPham:
                chiTietLocal.maSanPham,

              maDonViSanPham:
                chiTietLocal.maDonViSanPham,

              soLuong:
                chiTietLocal.soLuong,

              tenSanPham:
                chiTietLocal.tenSanPham,

              hinhAnh:
                chiTietLocal.hinhAnh,

              tenDonViTinh:
                chiTietLocal.tenDonViTinh,

              danhSachDonViBan,

              giaBanTheoDonVi,

              soTienGiamMoiDonVi,

              giaSauKhuyenMai,

              coKhuyenMai,

              thanhTienGoc,

              tongSoTienGiam,

              thanhTien,

              heSoQuyDoiVeDonViCoSo:
                thongTinMoi
                  ?.heSoQuyDoiVeDonViCoSo ??
                null,

              tonKhaDungTheoQuyDoi:
                thongTinMoi
                  ?.tonKhaDungTheoQuyDoi ??
                null,

              daCoThongTinKiemTra:
                thongTinMoi !== undefined,
            };
          }
        );
      },
      [
        danhSachChiTietGioHangLocal,
        thongTinTheoDonVi,
      ]
    );

  const tongTienGoc =
    useMemo(() => {
      return danhSachChiTietHienThi.reduce(
        (tong, chiTiet) =>
          tong +
          chiTiet.thanhTienGoc,
        0
      );
    }, [
      danhSachChiTietHienThi,
    ]);

  const tongGiamGiaTrucTiep =
    useMemo(() => {
      return danhSachChiTietHienThi.reduce(
        (tong, chiTiet) =>
          tong +
          chiTiet.tongSoTienGiam,
        0
      );
    }, [
      danhSachChiTietHienThi,
    ]);

  const tongTien =
    useMemo(() => {
      return danhSachChiTietHienThi.reduce(
        (tong, chiTiet) =>
          tong +
          chiTiet.thanhTien,
        0
      );
    }, [
      danhSachChiTietHienThi,
    ]);

  return {
    danhSachChiTietHienThi,

    tongTienGoc,
    tongGiamGiaTrucTiep,
    tongTien,

    hopLe:
      ketQuaKiemTra?.hopLe ??
      false,

    daKiemTraThanhCong:
      ketQuaKiemTra !== null,

    dangTaiDuLieu,

    thongBaoLoi,

    kiemTraLaiGioHang,

    kiemTraDanhSachGioHang,
  };
}