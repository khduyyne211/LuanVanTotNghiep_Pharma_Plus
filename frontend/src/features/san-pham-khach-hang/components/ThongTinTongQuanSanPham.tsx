import { useState } from "react";
import type { SanPhamChiTiet } from "../types/SanPhamChiTiet";
import type { DonViBanSanPham } from "../../../shared/types/DonViBanSanPham";
import { useGioHangContext } from "../../gio-hang/context/GioHangContext";
import { useXacThucContext } from "../../xac-thuc/context/XacThucContext";
import { useThongBaoHeThong } from "../../../shared/hooks/useThongBaoHeThong";
import ThongBaoHeThong from "../../../shared/components/thong-bao/ThongBaoHeThong";

interface ThongTinTongQuanSanPhamProps {
  sanPhamChiTiet: SanPhamChiTiet;
}

function ThongTinTongQuanSanPham({sanPhamChiTiet,}: ThongTinTongQuanSanPhamProps) {
  const thongBao = useThongBaoHeThong();
  const [maDonViSanPhamDangChon, setMaDonViSanPhamDangChon] = useState<number | undefined>(undefined);

  const {
    daDangNhap,
    moHopThoaiDangNhap,
  } = useXacThucContext();

  const {
    themSanPhamLocal,
  } = useGioHangContext();

  const duLieuChuyenMonThuoc = sanPhamChiTiet.duLieuChuyenMonThuoc;

  const dinhDangTien = (gia: number) => {
    return gia.toLocaleString("vi-VN") + "đ";
  };

  const layDonViDangChon = (): DonViBanSanPham | undefined => {
    if (sanPhamChiTiet.danhSachDonViBan.length === 0) {
      return undefined;
    }

    const donViDangChon = sanPhamChiTiet.danhSachDonViBan.find(
      (donVi) => donVi.maDonViSanPham === maDonViSanPhamDangChon
    );

    return donViDangChon ?? sanPhamChiTiet.danhSachDonViBan[0];
  };

  const donViDangChon = layDonViDangChon();

  const giaDangHienThi =
    donViDangChon?.giaBanTheoDonVi !== null &&
    donViDangChon?.giaBanTheoDonVi !== undefined
      ? donViDangChon.giaBanTheoDonVi
      : sanPhamChiTiet.giaBan;

  const tenDonViDangHienThi = donViDangChon?.tenDonViTinh || "";

  const themVaoGioHang = () => {
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
      maSanPham: sanPhamChiTiet.maSanPham,
      maDonViSanPham: donViDangChon.maDonViSanPham,
      soLuong: 1,
      tenSanPham: sanPhamChiTiet.tenSanPham,
      hinhAnh: sanPhamChiTiet.hinhAnh,
      tenDonViTinh: donViDangChon.tenDonViTinh,
      giaBanTamThoi: giaDangHienThi,
      danhSachDonViBan: sanPhamChiTiet.danhSachDonViBan,
    });

    thongBao.hienThongBao(
      `Sản phẩm đã được thêm vào giỏ hàng.`,
      "THANH_CONG",
      "Thêm vào giỏ hàng thành công"
    );
  };

  return (
    <section className="chi-tiet-san-pham-tong-quan">
      <div className="chi-tiet-san-pham-hinh-anh">
        {sanPhamChiTiet.hinhAnh ? (
          <img src={sanPhamChiTiet.hinhAnh} alt={sanPhamChiTiet.tenSanPham} />
        ) : (
          <div className="chi-tiet-san-pham-khong-co-anh">Chưa có ảnh</div>
        )}
      </div>

      <div className="chi-tiet-san-pham-thong-tin">
        <p className="chi-tiet-san-pham-nha-san-xuat">
          Nhà sản xuất: {sanPhamChiTiet.tenNhaSanXuat || "Đang cập nhật"}
        </p>

        <h1 className="chi-tiet-san-pham-ten">
          {sanPhamChiTiet.tenSanPham}
        </h1>

        <div className="chi-tiet-san-pham-ma-va-danh-gia">
          <span>Mã sản phẩm: {sanPhamChiTiet.maSanPham}</span>
          <span className="chi-tiet-san-pham-danh-gia">
            Đánh giá: sẽ cập nhật sau
          </span>
        </div>

        {!sanPhamChiTiet.laThuocKeDon &&
          sanPhamChiTiet.danhSachDonViBan.length > 0 && (
            <div className="chi-tiet-san-pham-danh-sach-don-vi">
              {sanPhamChiTiet.danhSachDonViBan.map((donVi) => (
                <button
                  key={donVi.maDonViSanPham}
                  className={
                    donVi.maDonViSanPham === donViDangChon?.maDonViSanPham
                      ? "chi-tiet-san-pham-don-vi-nut dang-chon"
                      : "chi-tiet-san-pham-don-vi-nut"
                  }
                  onClick={() =>
                    setMaDonViSanPhamDangChon(donVi.maDonViSanPham)
                  }
                >
                  {donVi.tenDonViTinh}
                </button>
              ))}
            </div>
          )}

        <p className="chi-tiet-san-pham-gia">
          {dinhDangTien(giaDangHienThi)}
          <span className="chi-tiet-san-pham-don-vi-gia">
            {tenDonViDangHienThi ? ` / ${tenDonViDangHienThi}` : ""}
          </span>
        </p>

        {sanPhamChiTiet.laThuocKeDon ? (
          <div className="chi-tiet-san-pham-nhom-nut">
            <button className="nut-tu-van">Tư vấn ngay</button>
            <button className="nut-gui-don-thuoc">Gửi đơn thuốc</button>
          </div>
        ) : (
          <div className="chi-tiet-san-pham-nhom-nut">
            <button className="nut-them-gio-hang" onClick={themVaoGioHang}>
              Thêm vào giỏ hàng
            </button>
          </div>
        )}

        <div className="nhom-thong-tin-san-pham">
          <div className="dong-thong-tin">
            <div className="dong-thong-tin-ten">Danh mục</div>
            <div className="dong-thong-tin-noi-dung">
              {sanPhamChiTiet.tenDanhMuc || "Đang cập nhật"}
            </div>
          </div>

          <div className="dong-thong-tin">
            <div className="dong-thong-tin-ten">Công dụng</div>
            <div className="dong-thong-tin-noi-dung">
              {duLieuChuyenMonThuoc?.congDungThamKhao ||
                sanPhamChiTiet.moTaNgan ||
                "Đang cập nhật"}
            </div>
          </div>

          <div className="dong-thong-tin">
            <div className="dong-thong-tin-ten">Quy đổi đơn vị</div>
            <div className="dong-thong-tin-noi-dung">
              {sanPhamChiTiet.moTaQuyDoi || "Đang cập nhật"}
            </div>
          </div>

          <div className="dong-thong-tin">
            <div className="dong-thong-tin-ten">Dạng bào chế</div>
            <div className="dong-thong-tin-noi-dung">
              {duLieuChuyenMonThuoc?.dangBaoChe || "Đang cập nhật"}
            </div>
          </div>

          <div className="dong-thong-tin">
            <div className="dong-thong-tin-ten">Thành phần</div>
            <div className="dong-thong-tin-noi-dung">
              {sanPhamChiTiet.danhSachThanhPhanHoatChat.length > 0 ? (
                <table className="bang-thanh-phan-hoat-chat">
                  <thead>
                    <tr>
                      <th>Thông tin thành phần</th>
                      <th>Hàm lượng</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sanPhamChiTiet.danhSachThanhPhanHoatChat.map(
                      (thanhPhan) => (
                        <tr key={thanhPhan.maThanhPhan}>
                          <td>{thanhPhan.tenHoatChat}</td>
                          <td>
                            {thanhPhan.hamLuong || "Đang cập nhật"}{" "}
                            {thanhPhan.donViHamLuong || ""}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              ) : (
                "Đang cập nhật"
              )}
            </div>
          </div>
        </div>

        {sanPhamChiTiet.laThuocKeDon && (
          <p className="luu-y-thuoc-ke-don">
            Lưu ý: Sản phẩm này chỉ bán khi có chỉ định của bác sĩ, mọi thông
            tin trên Website chỉ mang tính chất tham khảo.
          </p>
        )}
      </div>

      <ThongBaoHeThong
        dangHien={thongBao.dangHien}
        tieuDe={thongBao.tieuDe}
        noiDung={thongBao.noiDung}
        loai={thongBao.loai}
        dongThongBao={thongBao.dongThongBao}
      />
    </section>
  );
}

export default ThongTinTongQuanSanPham;