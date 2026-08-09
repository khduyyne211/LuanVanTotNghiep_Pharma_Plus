import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { SanPham } from "../types/SanPham";
import type { DonViBanSanPham } from "../../../../shared/types/DonViBanSanPham";
import { taoSlug } from "../../../../shared/utils/taoSlug";
import { useGioHangContext } from "../../gio-hang/context/GioHangContext";
import { useXacThucContext } from "../../../xac-thuc/context/XacThucContext";
import { useThongBaoHeThong } from "../../../../shared/hooks/useThongBaoHeThong";
import ThongBaoHeThong from "../../../../shared/components/thong-bao/ThongBaoHeThong";

interface TheSanPhamProps {
  sanPham: SanPham;
}

function TheSanPham({ sanPham }: TheSanPhamProps) {
  const navigate = useNavigate();
  const thongBao = useThongBaoHeThong();

  const [maDonViSanPhamDangChon, setMaDonViSanPhamDangChon] = useState<
    number | undefined
  >(undefined);

  const { daDangNhap, moHopThoaiDangNhap } = useXacThucContext();
  const {
    themSanPhamLocal,
    dangKiemTraThemGioHang,
    maDonViSanPhamDangKiemTra,
  } = useGioHangContext();

  const chuyenDenChiTietSanPham = () => {
    navigate(`/san-pham/${sanPham.maSanPham}/${taoSlug(sanPham.tenSanPham)}`);
  };

  const dinhDangTien = (giaTri: number) => {
    return giaTri.toLocaleString("vi-VN");
  };

  const layDonViDangChon = (): DonViBanSanPham | undefined => {
    if (sanPham.danhSachDonViBan.length === 0) {
      return undefined;
    }

    const donViDangChon = sanPham.danhSachDonViBan.find(
      (donVi) => donVi.maDonViSanPham === maDonViSanPhamDangChon
    );

    return donViDangChon ?? sanPham.danhSachDonViBan[0];
  };

  const donViDangChon = layDonViDangChon();

  const dangKiemTraSanPhamNay =
    donViDangChon?.maDonViSanPham ===
    maDonViSanPhamDangKiemTra;

  const hetHang =
    Boolean(sanPham.hetHang) ||
    (!sanPham.laThuocKeDon && !donViDangChon);

  const coHienThiDonViBan =
    !sanPham.laThuocKeDon &&
    !hetHang &&
    sanPham.danhSachDonViBan.length > 0;

  const giaGocDangHienThi =
    donViDangChon?.giaBanTheoDonVi ?? sanPham.giaBanGoc;

  const giaDangHienThi =
    donViDangChon?.giaSauKhuyenMai ?? sanPham.giaBan;

  const coKhuyenMaiDangHienThi =
    Boolean(donViDangChon?.coKhuyenMai ?? sanPham.coKhuyenMai) &&
    giaGocDangHienThi > giaDangHienThi;

  const tenDonViDangHienThi =
    donViDangChon?.tenDonViTinh ?? "";

  const chonDonViBan = (
    event: React.MouseEvent<HTMLButtonElement>,
    maDonViSanPham: number
  ) => {
    event.stopPropagation();
    setMaDonViSanPhamDangChon(maDonViSanPham);
  };

  const themVaoGioHang = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    if (
      hetHang ||
      !donViDangChon
    ) {
      thongBao.hienThongBao(
        "Sản phẩm này hiện đã hết hàng.",
        "CANH_BAO",
        "Chưa thể thêm vào giỏ hàng"
      );
      return;
    }

    if (!daDangNhap) {
      moHopThoaiDangNhap();
      return;
    }

    const ketQua =
      await themSanPhamLocal({
        maSanPham: sanPham.maSanPham,
        maDonViSanPham:
          donViDangChon.maDonViSanPham,
        soLuong: 1,
        tenSanPham: sanPham.tenSanPham,
        hinhAnh: sanPham.hinhAnh,
        tenDonViTinh:
          donViDangChon.tenDonViTinh,
        giaBanTamThoi:
          giaDangHienThi,
        danhSachDonViBan:
          sanPham.danhSachDonViBan,
      });

    if (ketQua.thanhCong) {
      thongBao.hienThongBao(
        "Sản phẩm đã được thêm vào giỏ hàng.",
        "THANH_CONG",
        "Thêm vào giỏ hàng thành công"
      );
      return;
    }

    if (
      ketQua.lyDo === "VUOT_TON_KHO"
    ) {
      thongBao.hienThongBao(
        "Số lượng yêu cầu vượt quá tồn kho hiện có.",
        "CANH_BAO",
        "Chưa thể thêm vào giỏ hàng"
      );
      return;
    }

    if (
      ketQua.lyDo === "LOI_KIEM_TRA"
    ) {
      thongBao.hienThongBao(
        "Không thể kiểm tra tồn kho lúc này. Vui lòng thử lại.",
        "LOI",
        "Chưa thể thêm vào giỏ hàng"
      );
    }
  };

  const xemChiTietSanPham = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    chuyenDenChiTietSanPham();
  };

  return (
    <div
      className="the-san-pham"
      onClick={chuyenDenChiTietSanPham}
    >
      <div className="the-san-pham-nsx">
        {sanPham.tenNhaSanXuat || "Đang cập nhật"}
      </div>

      {hetHang && (
          <span className="the-san-pham-nhan-het-hang">
            Hết hàng
          </span>
      )}

      <div className="the-san-pham-anh-khung">
        {sanPham.hinhAnh ? (
          <img
            className="the-san-pham-anh"
            src={sanPham.hinhAnh.trim()}
            alt={sanPham.tenSanPham}
          />
        ) : (
          <div className="the-san-pham-khong-co-anh">
            Chưa có ảnh
          </div>
        )}
      </div>

      <h3 className="the-san-pham-ten">
        {sanPham.tenSanPham}
      </h3>

      <div
        className={
          coHienThiDonViBan
            ? "the-san-pham-danh-sach-don-vi"
            : "the-san-pham-danh-sach-don-vi the-san-pham-vung-trong"
        }
        onClick={(event) => event.stopPropagation()}
      >
        {coHienThiDonViBan &&
          sanPham.danhSachDonViBan.map((donVi) => (
            <button
              key={donVi.maDonViSanPham}
              type="button"
              disabled={dangKiemTraThemGioHang}
              className={
                donVi.maDonViSanPham ===
                donViDangChon?.maDonViSanPham
                  ? "the-san-pham-don-vi-nut dang-chon"
                  : "the-san-pham-don-vi-nut"
              }
              onClick={(event) =>
                chonDonViBan(
                  event,
                  donVi.maDonViSanPham
                )
              }
            >
              {donVi.tenDonViTinh}
            </button>
          ))}
      </div>

      <div className="the-san-pham-khu-vuc-gia">
        {coKhuyenMaiDangHienThi && (
          <p className="the-san-pham-gia-goc">
            {dinhDangTien(giaGocDangHienThi)}đ
          </p>
        )}

        <p className="the-san-pham-gia">
          {dinhDangTien(giaDangHienThi)}đ
          <span className="the-san-pham-don-vi">
            {tenDonViDangHienThi
              ? ` / ${tenDonViDangHienThi}`
              : ""}
          </span>
        </p>
      </div>

      <div
        className={
          sanPham.moTaQuyDoi
            ? "the-san-pham-quy-cach"
            : "the-san-pham-quy-cach the-san-pham-vung-trong"
        }
        onClick={(event) => event.stopPropagation()}
      >
        {sanPham.moTaQuyDoi || "Đang cập nhật"}
      </div>

      <div className="the-san-pham-khu-vuc-nut">
        {sanPham.laThuocKeDon ? (
          <button
            type="button"
            className="the-san-pham-nut-xem-chi-tiet"
            onClick={xemChiTietSanPham}
          >
            Xem chi tiết
          </button>
        ) : hetHang ? (
          <button
            type="button"
            className="the-san-pham-nut-xem-chi-tiet"
            onClick={xemChiTietSanPham}
          >
            Xem chi tiết
          </button>
        ) : (
          <button
            type="button"
            className="the-san-pham-nut"
            onClick={themVaoGioHang}
            disabled={dangKiemTraThemGioHang}
          >
            {dangKiemTraSanPhamNay
              ? "Đang kiểm tra..."
              : "Thêm vào giỏ hàng"}
          </button>
        )}
      </div>

      <ThongBaoHeThong
        dangHien={thongBao.dangHien}
        tieuDe={thongBao.tieuDe}
        noiDung={thongBao.noiDung}
        loai={thongBao.loai}
        dongThongBao={thongBao.dongThongBao}
      />
    </div>
  );
}

export default TheSanPham;