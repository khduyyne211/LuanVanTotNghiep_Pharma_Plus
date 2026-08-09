import { useState } from "react";

import type { SanPhamChiTiet } from "../types/SanPhamChiTiet";
import type { DonViBanSanPham } from "../../../../shared/types/DonViBanSanPham";
import { useGioHangContext } from "../../../gio-hang/context/GioHangContext";
import { useXacThucContext } from "../../../xac-thuc/context/XacThucContext";
import { useThongBaoHeThong } from "../../../../shared/hooks/useThongBaoHeThong";
import ThongBaoHeThong from "../../../../shared/components/thong-bao/ThongBaoHeThong";

interface ThongTinTongQuanSanPhamProps {
  sanPhamChiTiet: SanPhamChiTiet;
}

function ThongTinTongQuanSanPham({
  sanPhamChiTiet,
}: ThongTinTongQuanSanPhamProps) {
  const thongBao = useThongBaoHeThong();

  const [maDonViSanPhamDangChon, setMaDonViSanPhamDangChon] =
    useState<number | undefined>(undefined);

  const [soLuongHopLe, setSoLuongHopLe] = useState(1);
  const [giaTriSoLuong, setGiaTriSoLuong] = useState("1");

  const { daDangNhap, moHopThoaiDangNhap } =
    useXacThucContext();

  const {
    themSanPhamLocal,
    dangKiemTraThemGioHang,
    maDonViSanPhamDangKiemTra,
  } = useGioHangContext();

  const duLieuChuyenMonThuoc =
    sanPhamChiTiet.duLieuChuyenMonThuoc;

  const dinhDangTien = (gia: number) => {
    return gia.toLocaleString("vi-VN") + "đ";
  };

  const layDonViDangChon = (): DonViBanSanPham | undefined => {
    if (sanPhamChiTiet.danhSachDonViBan.length === 0) {
      return undefined;
    }

    const donViDangChon =
      sanPhamChiTiet.danhSachDonViBan.find(
        (donVi) =>
          donVi.maDonViSanPham ===
          maDonViSanPhamDangChon
      );

    return (
      donViDangChon ??
      sanPhamChiTiet.danhSachDonViBan[0]
    );
  };

  const donViDangChon = layDonViDangChon();

  const dangKiemTraSanPhamNay =
    donViDangChon?.maDonViSanPham ===
    maDonViSanPhamDangKiemTra;

  const hetHang =
    Boolean(sanPhamChiTiet.hetHang) ||
    (!sanPhamChiTiet.laThuocKeDon && !donViDangChon);

  const giaGocDangHienThi =
    donViDangChon?.giaBanTheoDonVi ??
    sanPhamChiTiet.giaBanGoc;

  const giaDangHienThi =
    donViDangChon?.giaSauKhuyenMai ??
    sanPhamChiTiet.giaBan;

  const coKhuyenMaiDangHienThi =
    Boolean(
      donViDangChon?.coKhuyenMai ??
        sanPhamChiTiet.coKhuyenMai
    ) && giaGocDangHienThi > giaDangHienThi;

  const tenDonViDangHienThi =
    donViDangChon?.tenDonViTinh ?? "";

  const soLuongToiDa =
    donViDangChon?.soLuongToiDaCoTheBan ?? 0;

  const datLaiSoLuongVeMot = () => {
    setSoLuongHopLe(1);
    setGiaTriSoLuong("1");
  };

  const chonDonViBan = (
    maDonViSanPham: number
  ) => {
    setMaDonViSanPhamDangChon(maDonViSanPham);
    datLaiSoLuongVeMot();
  };

  const capNhatGiaTriSoLuong = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGiaTriSoLuong(event.target.value);
  };

  const khoiPhucSoLuongTruocDo = () => {
    setGiaTriSoLuong(String(soLuongHopLe));
  };

  const xacNhanSoLuong = () => {
    const soLuongMoi = Number(giaTriSoLuong);

    if (
      giaTriSoLuong.trim() === "" ||
      !Number.isInteger(soLuongMoi) ||
      soLuongMoi < 1
    ) {
      khoiPhucSoLuongTruocDo();
      return;
    }

    if (soLuongMoi > soLuongToiDa) {
      thongBao.hienThongBao(
        "Số lượng yêu cầu vượt quá tồn kho hiện có.",
        "CANH_BAO",
        "Số lượng không hợp lệ"
      );

      khoiPhucSoLuongTruocDo();
      return;
    }

    setSoLuongHopLe(soLuongMoi);
    setGiaTriSoLuong(String(soLuongMoi));
  };

  const xuLyPhimSoLuong = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.currentTarget.blur();
    }
  };

  const giamSoLuong = () => {
    if (
      dangKiemTraThemGioHang ||
      soLuongHopLe <= 1
    ) {
      return;
    }

    const soLuongMoi = soLuongHopLe - 1;

    setSoLuongHopLe(soLuongMoi);
    setGiaTriSoLuong(String(soLuongMoi));
  };

  const tangSoLuong = () => {
    if (soLuongHopLe >= soLuongToiDa) {
      return;
    }

    const soLuongMoi = soLuongHopLe + 1;

    setSoLuongHopLe(soLuongMoi);
    setGiaTriSoLuong(String(soLuongMoi));
  };

  const themVaoGioHang = async () => {
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

    if (
      soLuongHopLe >
      soLuongToiDa
    ) {
      thongBao.hienThongBao(
        "Số lượng yêu cầu vượt quá tồn kho hiện có.",
        "CANH_BAO",
        "Số lượng không hợp lệ"
      );
      return;
    }

    if (!daDangNhap) {
      moHopThoaiDangNhap();
      return;
    }

    const ketQua =
      await themSanPhamLocal({
        maSanPham:
          sanPhamChiTiet.maSanPham,
        maDonViSanPham:
          donViDangChon.maDonViSanPham,
        soLuong: soLuongHopLe,
        tenSanPham:
          sanPhamChiTiet.tenSanPham,
        hinhAnh:
          sanPhamChiTiet.hinhAnh,
        tenDonViTinh:
          donViDangChon.tenDonViTinh,
        giaBanTamThoi:
          giaDangHienThi,
        danhSachDonViBan:
          sanPhamChiTiet.danhSachDonViBan,
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

  return (
    <section className="chi-tiet-san-pham-tong-quan">
      <div className="chi-tiet-san-pham-hinh-anh">
        {sanPhamChiTiet.hinhAnh ? (
          <img
            src={sanPhamChiTiet.hinhAnh}
            alt={sanPhamChiTiet.tenSanPham}
          />
        ) : (
          <div className="chi-tiet-san-pham-khong-co-anh">
            Chưa có ảnh
          </div>
        )}

        {hetHang && (
          <span className="chi-tiet-san-pham-nhan-het-hang">
            Hết hàng
          </span>
        )}
      </div>

      <div className="chi-tiet-san-pham-thong-tin">
        <p className="chi-tiet-san-pham-nha-san-xuat">
          Nhà sản xuất:{" "}
          {sanPhamChiTiet.tenNhaSanXuat ||
            "Đang cập nhật"}
        </p>

        <h1 className="chi-tiet-san-pham-ten">
          {sanPhamChiTiet.tenSanPham}
        </h1>

        {!sanPhamChiTiet.laThuocKeDon &&
          sanPhamChiTiet.danhSachDonViBan.length >
            0 && (
            <div className="chi-tiet-san-pham-danh-sach-don-vi">
              {sanPhamChiTiet.danhSachDonViBan.map(
                (donVi) => (
                  <button
                    key={donVi.maDonViSanPham}
                    type="button"
                    className={
                      donVi.maDonViSanPham ===
                      donViDangChon?.maDonViSanPham
                        ? "chi-tiet-san-pham-don-vi-nut dang-chon"
                        : "chi-tiet-san-pham-don-vi-nut"
                    }
                    onClick={() =>
                      chonDonViBan(
                        donVi.maDonViSanPham
                      )
                    }
                    disabled={dangKiemTraThemGioHang}
                  >
                    {donVi.tenDonViTinh}
                  </button>
                )
              )}
            </div>
          )}

        <div className="chi-tiet-san-pham-khu-vuc-gia">
          {coKhuyenMaiDangHienThi && (
            <p className="chi-tiet-san-pham-gia-goc">
              {dinhDangTien(giaGocDangHienThi)}
            </p>
          )}

          <p className="chi-tiet-san-pham-gia">
            {dinhDangTien(giaDangHienThi)}

            <span className="chi-tiet-san-pham-don-vi-gia">
              {tenDonViDangHienThi
                ? ` / ${tenDonViDangHienThi}`
                : ""}
            </span>
          </p>
        </div>

        {!sanPhamChiTiet.laThuocKeDon &&
          !hetHang &&
          donViDangChon && (
            <div className="chi-tiet-san-pham-chon-so-luong">
              <span className="chi-tiet-san-pham-chon-so-luong-tieu-de">
                Số lượng
              </span>

              <div className="chi-tiet-san-pham-bo-dem-so-luong">
                <button
                  type="button"
                  onClick={giamSoLuong}
                  disabled={
                    dangKiemTraThemGioHang ||
                    soLuongHopLe <= 1
                  }
                  aria-label="Giảm số lượng"
                >
                  −
                </button>

                <input
                  type="number"
                  inputMode="numeric"
                  value={giaTriSoLuong}
                  onChange={capNhatGiaTriSoLuong}
                  onBlur={xacNhanSoLuong}
                  onKeyDown={xuLyPhimSoLuong}
                  aria-label="Số lượng sản phẩm"
                  disabled={dangKiemTraThemGioHang}
                />

                <button
                  type="button"
                  onClick={tangSoLuong}
                  disabled={
                    dangKiemTraThemGioHang ||
                    soLuongHopLe >= soLuongToiDa
                  }
                  aria-label="Tăng số lượng"
                >
                  +
                </button>
              </div>

              <span className="chi-tiet-san-pham-ton-kho">
                Có thể mua tối đa {soLuongToiDa}
              </span>
            </div>
          )}

        {sanPhamChiTiet.laThuocKeDon ? (
          <div className="chi-tiet-san-pham-nhom-nut">
            <button
              type="button"
              className="nut-tu-van"
            >
              Tư vấn ngay
            </button>

            <button
              type="button"
              className="nut-gui-don-thuoc"
            >
              Gửi đơn thuốc
            </button>
          </div>
        ) : (
          <div className="chi-tiet-san-pham-nhom-nut">
            <button
              type="button"
              className={
                hetHang
                  ? "nut-them-gio-hang het-hang"
                  : "nut-them-gio-hang"
              }
              onClick={themVaoGioHang}
              disabled={
                hetHang ||
                dangKiemTraThemGioHang
              }
            >
              {hetHang
                ? "Hết hàng"
                : dangKiemTraSanPhamNay
                  ? "Đang kiểm tra..."
                  : "Thêm vào giỏ hàng"}
            </button>
          </div>
        )}

        <div className="nhom-thong-tin-san-pham">
          <div className="dong-thong-tin">
            <div className="dong-thong-tin-ten">
              Danh mục
            </div>

            <div className="dong-thong-tin-noi-dung">
              {sanPhamChiTiet.tenDanhMuc ||
                "Đang cập nhật"}
            </div>
          </div>

          <div className="dong-thong-tin">
            <div className="dong-thong-tin-ten">
              Công dụng
            </div>

            <div className="dong-thong-tin-noi-dung">
              {duLieuChuyenMonThuoc?.congDungThamKhao ||
                sanPhamChiTiet.moTaNgan ||
                "Đang cập nhật"}
            </div>
          </div>

          <div className="dong-thong-tin">
            <div className="dong-thong-tin-ten">
              Quy đổi đơn vị
            </div>

            <div className="dong-thong-tin-noi-dung">
              {sanPhamChiTiet.moTaQuyDoi ||
                "Đang cập nhật"}
            </div>
          </div>

          <div className="dong-thong-tin">
            <div className="dong-thong-tin-ten">
              Dạng bào chế
            </div>

            <div className="dong-thong-tin-noi-dung">
              {duLieuChuyenMonThuoc?.dangBaoChe ||
                "Đang cập nhật"}
            </div>
          </div>

          <div className="dong-thong-tin">
            <div className="dong-thong-tin-ten">
              Thành phần
            </div>

            <div className="dong-thong-tin-noi-dung">
              {sanPhamChiTiet.danhSachThanhPhanHoatChat
                .length > 0 ? (
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
                          <td>
                            {thanhPhan.tenHoatChat}
                          </td>

                          <td>
                            {thanhPhan.hamLuong ||
                              "Đang cập nhật"}{" "}
                            {thanhPhan.donViHamLuong ||
                              ""}
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
            Lưu ý: Sản phẩm này chỉ bán khi có chỉ
            định của bác sĩ, mọi thông tin trên
            Website chỉ mang tính chất tham khảo.
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