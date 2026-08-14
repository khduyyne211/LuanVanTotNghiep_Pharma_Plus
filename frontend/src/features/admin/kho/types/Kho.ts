export interface TonKhoThap {
  maSanPham: number;
  tenSanPham: string;
  tongSoLuongTon: number;
  nguongTon: number;
}

export type MucCanhBaoHetHan =
  | "NGUY_CAP"
  | "SAP_HET_HAN"
  | "CAN_THEO_DOI";

export interface LoSapHetHan {
  maChiTietPhieuNhap: number;
  maPhieuNhap: number;
  maSanPham: number;
  tenSanPham: string;
  maDonViSanPham: number;
  tenDonViTinh: string;
  soLuongConLai: number;
  hanSuDung: string;
  soNgayConLai: number;
  mucCanhBao: MucCanhBaoHetHan;
}