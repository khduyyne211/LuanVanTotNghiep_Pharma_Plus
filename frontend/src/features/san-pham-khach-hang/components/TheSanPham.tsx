import { useState } from "react";
import type { SanPham } from "../types/SanPham";
import type { DonViBanSanPham } from "../../../shared/types/DonViBanSanPham";
import { useNavigate } from "react-router-dom";
import { taoSlug } from "../../../shared/utils/taoSlug";
import { useGioHangContext } from "../../gio-hang/context/GioHangContext";
import { useXacThucContext } from "../../xac-thuc/context/XacThucContext";
import { useThongBaoHeThong } from "../../../shared/hooks/useThongBaoHeThong";
import ThongBaoHeThong from "../../../shared/components/thong-bao/ThongBaoHeThong";

interface TheSanPhamProps {
  sanPham: SanPham;
}

function TheSanPham({ sanPham }: TheSanPhamProps) {
  const navigate = useNavigate();

  const thongBao = useThongBaoHeThong();

  const [maDonViSanPhamDangChon, setMaDonViSanPhamDangChon] = useState<
    number | undefined
  >(undefined);

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

  const coHienThiDonViBan = !sanPham.laThuocKeDon && sanPham.danhSachDonViBan.length > 0;

  const giaDangHienThi =
    donViDangChon?.giaBanTheoDonVi !== null &&
    donViDangChon?.giaBanTheoDonVi !== undefined
      ? donViDangChon.giaBanTheoDonVi
      : sanPham.giaBan;

  const tenDonViDangHienThi = donViDangChon?.tenDonViTinh || "";

  const chonDonViBan = (
    event: React.MouseEvent<HTMLButtonElement>,
    maDonViSanPham: number
  ) => {
    event.stopPropagation();

    setMaDonViSanPhamDangChon(maDonViSanPham);
  };

  const {
    daDangNhap,
    moHopThoaiDangNhap,
  } = useXacThucContext();

  const {themSanPhamLocal} = useGioHangContext();

  const themVaoGioHang = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (!daDangNhap) {
      moHopThoaiDangNhap();
      return;
    }

    if (!donViDangChon) {
      thongBao.hienThongBao(
        "Sản phẩm này hiện chưa có đơn vị bán phù hợp.",
        "CANH_BAO",
        "Chưa thể thêm vào giỏ hàng"
      );

      return;
    }

    themSanPhamLocal({
      maSanPham: sanPham.maSanPham,
      maDonViSanPham: donViDangChon.maDonViSanPham,
      soLuong: 1,
      tenSanPham: sanPham.tenSanPham,
      hinhAnh: sanPham.hinhAnh,
      tenDonViTinh: donViDangChon.tenDonViTinh,
      giaBanTamThoi: giaDangHienThi,
      danhSachDonViBan: sanPham.danhSachDonViBan,
    });

    thongBao.hienThongBao(
      `Sản phẩm đã được thêm vào giỏ hàng.`,
      "THANH_CONG",
      "Thêm vào giỏ hàng thành công"
    );
  };

  const xemChiTietSanPham = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    chuyenDenChiTietSanPham();
  };

  return (
    <div className="the-san-pham" onClick={chuyenDenChiTietSanPham}>
      <div className="the-san-pham-nsx">
        {sanPham.tenNhaSanXuat || "Đang cập nhật"}
      </div>

      <div className="the-san-pham-anh-khung">
        {sanPham.hinhAnh ? (
          <img
            className="the-san-pham-anh"
            src={sanPham.hinhAnh.trim()}
            alt={sanPham.tenSanPham}
          />
        ) : (
          <div className="the-san-pham-khong-co-anh">Chưa có ảnh</div>
        )}
      </div>

      <h3 className="the-san-pham-ten">{sanPham.tenSanPham}</h3>

      <div className={
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
              className={
                donVi.maDonViSanPham === donViDangChon?.maDonViSanPham
                  ? "the-san-pham-don-vi-nut dang-chon"
                  : "the-san-pham-don-vi-nut"
              }
              onClick={(event) => chonDonViBan(event, donVi.maDonViSanPham)}
            >
              {donVi.tenDonViTinh}
            </button>
          ))}
      </div>

      <p className="the-san-pham-gia">
        {dinhDangTien(giaDangHienThi)}đ{" "}
        <span className="the-san-pham-don-vi">
          {tenDonViDangHienThi ? ` / ${tenDonViDangHienThi}` : ""}
        </span>
      </p>

      <div className={
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
            className="the-san-pham-nut-xem-chi-tiet"
            onClick={xemChiTietSanPham}
          >
            Xem chi tiết
          </button>
        ) : (
          <button className="the-san-pham-nut" onClick={themVaoGioHang}>
            Thêm vào giỏ hàng
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