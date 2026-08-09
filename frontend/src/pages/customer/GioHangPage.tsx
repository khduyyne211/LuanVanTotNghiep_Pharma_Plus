import axios from "axios";
import {
  useEffect,
  useState,
} from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import DongChiTietGioHang from "../../features/customer/gio-hang/components/DongChiTietGioHang";
import { dongBoGioHangApi } from "../../features/customer/gio-hang/api/GioHangApi";
import { useGioHangContext } from "../../features/customer/gio-hang/context/GioHangContext";
import { useKiemTraGioHangLocal } from "../../features/customer/gio-hang/hooks/useKiemTraGioHangLocal";

import type { ChiTietGioHangLocal } from "../../features/customer/gio-hang/types/GioHangLocal";

import ThongBaoHeThong from "../../shared/components/thong-bao/ThongBaoHeThong";
import { useThongBaoHeThong } from "../../shared/hooks/useThongBaoHeThong";

import "../../features/customer/gio-hang/styles/GioHang.css";

interface DuLieuLoiApi {
  detail?: string;
  message?: string;
}

function GioHangPage() {
  const navigate = useNavigate();

  const thongBao =
    useThongBaoHeThong();

  const {
    danhSachChiTietGioHangLocal,
    capNhatSoLuongLocal,
    xoaSanPhamLocal,
    thayTheDanhSachGioHangLocal,
    xoaToanBoGioHangLocal,
  } = useGioHangContext();

  const {
    danhSachChiTietHienThi,
    tongTienGoc,
    tongGiamGiaTrucTiep,
    hopLe,
    daKiemTraThanhCong,
    dangTaiDuLieu,
    thongBaoLoi,
    kiemTraDanhSachGioHang,
  } = useKiemTraGioHangLocal();

  const [
    dangDoiDonVi,
    setDangDoiDonVi,
  ] = useState(false);

  const [
    dangDongBo,
    setDangDongBo,
  ] = useState(false);

  /*
   * dangTaiDuLieu chỉ bật khi thực sự có
   * request backend.
   *
   * Sau tối ưu, thao tác +/- bình thường
   * không làm dangTaiDuLieu bật nữa.
   */
  const dangXuLy =
    dangTaiDuLieu ||
    dangDoiDonVi ||
    dangDongBo;

  const giamGiaVoucher = 0;

  const tietKiemDuoc =
    tongGiamGiaTrucTiep +
    giamGiaVoucher;

  const thanhTien =
    tongTienGoc -
    tongGiamGiaTrucTiep -
    giamGiaVoucher;

  const dinhDangTien = (
    giaTri: number
  ) => {
    return (
      giaTri.toLocaleString(
        "vi-VN"
      ) + "đ"
    );
  };

  /*
   * Sau khi backend kiểm tra:
   * - đồng bộ giá sau khuyến mãi;
   * - tự hạ số lượng nếu tồn hiện tại
   *   thấp hơn số lượng local.
   *
   * Chỉ trường hợp phải HẠ SỐ LƯỢNG
   * mới cần backend kiểm tra lại một lần
   * để cập nhật trạng thái hopLe.
   */
  useEffect(() => {
    if (
      !daKiemTraThanhCong ||
      danhSachChiTietHienThi.length ===
        0
    ) {
      return;
    }

    const tonConLaiTheoSanPham =
      new Map<number, number>();

    const danhSachMoi:
      ChiTietGioHangLocal[] = [];

    let daDieuChinh = false;

    let daDieuChinhSoLuong =
      false;

    for (
      const chiTietLocal
      of danhSachChiTietGioHangLocal
    ) {
      const chiTietHienThi =
        danhSachChiTietHienThi.find(
          (chiTiet) =>
            chiTiet.maDonViSanPham ===
            chiTietLocal.maDonViSanPham
        );

      if (
        !chiTietHienThi ||
        chiTietHienThi
          .heSoQuyDoiVeDonViCoSo ===
          null ||
        chiTietHienThi
          .tonKhaDungTheoQuyDoi ===
          null
      ) {
        danhSachMoi.push(
          chiTietLocal
        );

        continue;
      }

      const maSanPham =
        chiTietHienThi.maSanPham;

      const heSo =
        chiTietHienThi
          .heSoQuyDoiVeDonViCoSo;

      const tonConLai =
        tonConLaiTheoSanPham.get(
          maSanPham
        ) ??
        chiTietHienThi
          .tonKhaDungTheoQuyDoi;

      const soLuongToiDa =
        Math.max(
          0,
          Math.floor(
            (
              tonConLai +
              1e-9
            ) /
              heSo
          )
        );

      const soLuongMoi =
        Math.min(
          chiTietLocal.soLuong,
          soLuongToiDa
        );

      if (
        soLuongMoi !==
        chiTietLocal.soLuong
      ) {
        daDieuChinh = true;

        daDieuChinhSoLuong =
          true;
      }

      if (
        chiTietLocal
          .giaBanTamThoi !==
        chiTietHienThi
          .giaSauKhuyenMai
      ) {
        daDieuChinh = true;
      }

      if (
        soLuongMoi > 0
      ) {
        danhSachMoi.push({
          ...chiTietLocal,

          soLuong:
            soLuongMoi,

          giaBanTamThoi:
            chiTietHienThi
              .giaSauKhuyenMai,
        });
      }

      tonConLaiTheoSanPham.set(
        maSanPham,
        tonConLai -
          soLuongMoi *
            heSo
      );
    }

    if (!daDieuChinh) {
      return;
    }

    thayTheDanhSachGioHangLocal(
      danhSachMoi
    );

    /*
     * Giá thay đổi không cần recheck.
     *
     * Nếu backend buộc phải hạ số lượng
     * vì tồn kho thay đổi thì kiểm tra lại
     * đúng một lần để hopLe được cập nhật.
     */
    if (
      daDieuChinhSoLuong
    ) {
      void kiemTraDanhSachGioHang(
        danhSachMoi
      );
    }
  }, [
    daKiemTraThanhCong,
    danhSachChiTietHienThi,
    danhSachChiTietGioHangLocal,
    thayTheDanhSachGioHangLocal,
    kiemTraDanhSachGioHang,
  ]);

  /*
   * Tính giới hạn bằng snapshot tồn kho
   * mà backend đã trả khi vào giỏ.
   *
   * Không cần request backend mỗi lần +/-.
   */
  const laySoLuongToiDa = (
    maDonViSanPham: number
  ): number | null => {
    const chiTietDangSua =
      danhSachChiTietHienThi.find(
        (chiTiet) =>
          chiTiet.maDonViSanPham ===
          maDonViSanPham
      );

    if (
      !chiTietDangSua ||
      chiTietDangSua
        .heSoQuyDoiVeDonViCoSo ===
        null ||
      chiTietDangSua
        .tonKhaDungTheoQuyDoi ===
        null
    ) {
      return null;
    }

    const tongQuyDoiCuaDongKhac =
      danhSachChiTietHienThi
        .filter(
          (chiTiet) =>
            chiTiet.maSanPham ===
              chiTietDangSua
                .maSanPham &&
            chiTiet.maDonViSanPham !==
              maDonViSanPham &&
            chiTiet
              .heSoQuyDoiVeDonViCoSo !==
              null
        )
        .reduce(
          (tong, chiTiet) =>
            tong +
            chiTiet.soLuong *
              (
                chiTiet
                  .heSoQuyDoiVeDonViCoSo ??
                0
              ),
          0
        );

    const tonConLaiChoDongHienTai =
      chiTietDangSua
        .tonKhaDungTheoQuyDoi -
      tongQuyDoiCuaDongKhac;

    return Math.max(
      0,
      Math.floor(
        (
          tonConLaiChoDongHienTai +
          1e-9
        ) /
          chiTietDangSua
            .heSoQuyDoiVeDonViCoSo
      )
    );
  };

  /*
   * +/- và nhập số lượng:
   * chỉ cập nhật state/localStorage.
   *
   * Tổng tiền được React tính lại
   * ngay lập tức ở frontend.
   */
  const capNhatSoLuong = (
    maDonViSanPham: number,
    soLuongMoi: number,
    laNhapTay: boolean
  ): number => {
    const chiTietHienTai =
      danhSachChiTietGioHangLocal.find(
        (chiTiet) =>
          chiTiet.maDonViSanPham ===
          maDonViSanPham
      );

    if (!chiTietHienTai) {
      return 1;
    }

    const soLuongToiDa =
      laySoLuongToiDa(
        maDonViSanPham
      );

    if (
      soLuongToiDa === null
    ) {
      thongBao.hienThongBao(
        "Chưa thể xác định số lượng tồn kho của sản phẩm.",
        "CANH_BAO",
        "Chưa có thông tin tồn kho"
      );

      return chiTietHienTai.soLuong;
    }

    if (
      soLuongToiDa <= 0
    ) {
      thongBao.hienThongBao(
        "Sản phẩm này hiện đã hết hàng.",
        "CANH_BAO",
        "Sản phẩm hết hàng"
      );

      return chiTietHienTai.soLuong;
    }

    if (
      soLuongMoi >
      soLuongToiDa
    ) {
      thongBao.hienThongBao(
        `Số lượng sản phẩm tối đa có thể mua là ${soLuongToiDa} ${chiTietHienTai.tenDonViTinh}.`,
        "CANH_BAO",
        "Số lượng vượt quá tồn kho"
      );

      if (laNhapTay) {
        capNhatSoLuongLocal(
          maDonViSanPham,
          soLuongToiDa
        );

        return soLuongToiDa;
      }

      return chiTietHienTai.soLuong;
    }

    capNhatSoLuongLocal(
      maDonViSanPham,
      soLuongMoi
    );

    return soLuongMoi;
  };

  /*
   * Đổi đơn vị vẫn cần backend
   * kiểm tra vì hệ số quy đổi,
   * tồn kho và giá có thể khác.
   */
  const chonDonViBan = async (
    maDonViSanPhamCu: number,
    maDonViSanPhamMoi: number
  ) => {
    const chiTietCu =
      danhSachChiTietGioHangLocal.find(
        (chiTiet) =>
          chiTiet.maDonViSanPham ===
          maDonViSanPhamCu
      );

    if (!chiTietCu) {
      return;
    }

    const donViMoi =
      chiTietCu.danhSachDonViBan.find(
        (donVi) =>
          donVi.maDonViSanPham ===
          maDonViSanPhamMoi
      );

    if (!donViMoi) {
      return;
    }

    const dongDonViMoiDaCo =
      danhSachChiTietGioHangLocal.find(
        (chiTiet) =>
          chiTiet.maDonViSanPham ===
          maDonViSanPhamMoi
      );

    const danhSachMoi =
      danhSachChiTietGioHangLocal.filter(
        (chiTiet) =>
          chiTiet.maDonViSanPham !==
            maDonViSanPhamCu &&
          chiTiet.maDonViSanPham !==
            maDonViSanPhamMoi
      );

    if (
      dongDonViMoiDaCo
    ) {
      danhSachMoi.push({
        ...dongDonViMoiDaCo,

        soLuong:
          dongDonViMoiDaCo.soLuong +
          chiTietCu.soLuong,
      });
    } else {
      danhSachMoi.push({
        ...chiTietCu,

        maDonViSanPham:
          maDonViSanPhamMoi,

        tenDonViTinh:
          donViMoi.tenDonViTinh,

        giaBanTamThoi:
          donViMoi
            .giaSauKhuyenMai ??
          donViMoi
            .giaBanTheoDonVi ??
          0,
      });
    }

    try {
      setDangDoiDonVi(
        true
      );

      const ketQua =
        await kiemTraDanhSachGioHang(
          danhSachMoi
        );

      if (!ketQua) {
        thongBao.hienThongBao(
          "Không thể kiểm tra đơn vị bán vừa chọn.",
          "LOI",
          "Không thể đổi đơn vị"
        );

        return;
      }

      if (!ketQua.hopLe) {
        thongBao.hienThongBao(
          "Số lượng sau khi đổi đơn vị vượt quá tồn kho hiện tại.",
          "CANH_BAO",
          "Không thể đổi đơn vị"
        );

        return;
      }

      thayTheDanhSachGioHangLocal(
        danhSachMoi
      );
    } finally {
      setDangDoiDonVi(
        false
      );
    }
  };

  /*
   * Đây mới là thời điểm cần đồng bộ
   * số lượng local xuống backend.
   *
   * Backend sẽ kiểm tra lại tồn kho
   * và dữ liệu trước khi sang xác nhận.
   */
  const tienHanhDatHang =
    async () => {
      if (
        danhSachChiTietGioHangLocal
          .length === 0 ||
        dangDongBo
      ) {
        return;
      }

      try {
        setDangDongBo(
          true
        );

        const danhSachGuiBackend =
          danhSachChiTietGioHangLocal.map(
            (chiTiet) => ({
              maDonViSanPham:
                chiTiet.maDonViSanPham,

              soLuong:
                chiTiet.soLuong,
            })
          );

        await dongBoGioHangApi(
          danhSachGuiBackend
        );

        navigate(
          "/xac-nhan-dat-hang"
        );
      } catch (
        error: unknown
      ) {
        let noiDungLoi =
          "Không thể kiểm tra và đồng bộ giỏ hàng.";

        if (
          axios.isAxiosError<DuLieuLoiApi>(
            error
          )
        ) {
          noiDungLoi =
            error.response?.data
              ?.detail ||
            error.response?.data
              ?.message ||
            noiDungLoi;
        }

        thongBao.hienThongBao(
          noiDungLoi,
          "LOI",
          "Không thể mua hàng"
        );
      } finally {
        setDangDongBo(
          false
        );
      }
    };

  if (
    dangTaiDuLieu &&
    !daKiemTraThanhCong &&
    danhSachChiTietGioHangLocal
      .length > 0
  ) {
    return (
      <div className="page-container trang-gio-hang">
        <p className="gio-hang-dang-tai">
          Đang kiểm tra giỏ hàng...
        </p>
      </div>
    );
  }

  if (
    danhSachChiTietGioHangLocal
      .length === 0
  ) {
    return (
      <div className="page-container trang-gio-hang">
        <Link
          to="/"
          className="gio-hang-tiep-tuc-mua-sam"
        >
          ← Tiếp tục mua sắm
        </Link>

        <div className="gio-hang-rong">
          <div className="gio-hang-rong-bieu-tuong">
            <i className="bi bi-cart-x"></i>
          </div>

          <h2>
            Chưa có sản phẩm nào
            trong giỏ
          </h2>

          <p>
            Cùng khám phá hàng ngàn
            sản phẩm
            <br />
            tại Pharma+ nhé!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container trang-gio-hang">
      <Link
        to="/"
        className="gio-hang-tiep-tuc-mua-sam"
      >
        ← Tiếp tục mua sắm
      </Link>

      {thongBaoLoi && (
        <p className="gio-hang-thong-bao-loi">
          {thongBaoLoi}
        </p>
      )}

      <div className="gio-hang-bo-cuc">
        <div className="gio-hang-ben-trai">
          <div className="gio-hang-bang">
            <div className="gio-hang-bang-tieu-de">
              <div></div>

              <div className="gio-hang-cot-tieu-de gia-thanh">
                Giá thành
              </div>

              <div className="gio-hang-cot-tieu-de so-luong">
                Số lượng
              </div>

              <div className="gio-hang-cot-tieu-de don-vi">
                Đơn vị
              </div>

              <div></div>
            </div>

            <div className="gio-hang-bang-noi-dung">
              {danhSachChiTietHienThi.map(
                (chiTiet) => (
                  <DongChiTietGioHang
                    key={
                      chiTiet
                        .maDonViSanPham
                    }
                    chiTiet={
                      chiTiet
                    }
                    dangXuLy={
                      dangXuLy
                    }
                    capNhatSoLuong={
                      capNhatSoLuong
                    }
                    chonDonViBan={
                      chonDonViBan
                    }
                    xoaSanPhamKhoiGioHang={
                      xoaSanPhamLocal
                    }
                  />
                )
              )}
            </div>
          </div>

          <div className="gio-hang-khu-vuc-xoa">
            <button
              type="button"
              className="gio-hang-nut-xoa-tat-ca"
              onClick={
                xoaToanBoGioHangLocal
              }
              disabled={
                dangXuLy
              }
            >
              Xóa tất cả sản phẩm
            </button>
          </div>
        </div>

        <div className="gio-hang-ben-phai">
          <div className="gio-hang-tom-tat">
            <h2>
              Thông tin đơn hàng
            </h2>

            <div className="gio-hang-tom-tat-dong">
              <span>
                Tổng tiền
              </span>

              <strong>
                {dinhDangTien(
                  tongTienGoc
                )}
              </strong>
            </div>

            <div className="gio-hang-tom-tat-dong">
              <span>
                Giảm giá trực tiếp
              </span>

              <strong className="gio-hang-gia-tri-khuyen-mai">
                {tongGiamGiaTrucTiep >
                0
                  ? `-${dinhDangTien(
                      tongGiamGiaTrucTiep
                    )}`
                  : "0đ"}
              </strong>
            </div>

            <div className="gio-hang-tom-tat-dong">
              <span>
                Giảm giá voucher
              </span>

              <strong className="gio-hang-gia-tri-khuyen-mai">
                {giamGiaVoucher >
                0
                  ? `-${dinhDangTien(
                      giamGiaVoucher
                    )}`
                  : "0đ"}
              </strong>
            </div>

            <div className="gio-hang-tom-tat-dong">
              <span>
                Tiết kiệm được
              </span>

              <strong className="gio-hang-gia-tri-khuyen-mai">
                {dinhDangTien(
                  tietKiemDuoc
                )}
              </strong>
            </div>

            <div className="gio-hang-tom-tat-dong gio-hang-thanh-tien">
              <span>
                Thành tiền
              </span>

              <strong>
                {dinhDangTien(
                  thanhTien
                )}
              </strong>
            </div>

            <button
              type="button"
              className="gio-hang-nut-mua-hang"
              onClick={
                tienHanhDatHang
              }
              disabled={
                dangXuLy ||
                !daKiemTraThanhCong ||
                !hopLe
              }
            >
              {dangDongBo
                ? "Đang kiểm tra..."
                : "Mua hàng"}
            </button>
          </div>
        </div>
      </div>

      <ThongBaoHeThong
        dangHien={
          thongBao.dangHien
        }
        tieuDe={
          thongBao.tieuDe
        }
        noiDung={
          thongBao.noiDung
        }
        loai={
          thongBao.loai
        }
        dongThongBao={
          thongBao.dongThongBao
        }
      />
    </div>
  );
}

export default GioHangPage;