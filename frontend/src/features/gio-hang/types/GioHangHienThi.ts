import type { DonViBanSanPham } from "../../../shared/types/DonViBanSanPham";
//Giỏ hàng hàng hiển thị chứa kết quả từ 2 nguồn bao gồm ChiTietGioHangLocal và sau khi gọi backend để kiểm tra
export interface ChiTietGioHangHienThi {
  maSanPham: number;
  maDonViSanPham: number;
  soLuong: number;

  tenSanPham: string;
  hinhAnh: string | null;
  tenDonViTinh: string;
  danhSachDonViBan: DonViBanSanPham[];

  giaBanTheoDonVi: number;
  thanhTien: number;

  heSoQuyDoiVeDonViCoSo: number | null;
  tonKhaDungTheoQuyDoi: number | null;
  daCoThongTinKiemTra: boolean;
}