import axiosClient from "../../../../api/axiosClient";
import type {
  PhieuNhap,
  PhieuNhapTaoMoiRequest,
  SanPhamNhapKhoOption,
} from "../types/PhieuNhap";


export const layDanhSachPhieuNhap = () => {
  return axiosClient.get<PhieuNhap[]>("/phieu-nhap");
};

export const layChiTietPhieuNhap = (
  maPhieuNhap: number
) => {
  return axiosClient.get<PhieuNhap>(
    `/phieu-nhap/${maPhieuNhap}`
  );
};

export const taoPhieuNhap = (
  request: PhieuNhapTaoMoiRequest
) => {
  return axiosClient.post<PhieuNhap>(
    "/phieu-nhap",
    request
  );
};

export const xacNhanNhapKho = (
  maPhieuNhap: number
) => {
  return axiosClient.put<PhieuNhap>(
    `/phieu-nhap/${maPhieuNhap}/xac-nhan`
  );
};

export const huyPhieuNhap = (
  maPhieuNhap: number
) => {
  return axiosClient.put<PhieuNhap>(
    `/phieu-nhap/${maPhieuNhap}/huy`
  );
};
export const layTuyChonNhapKho = () => {
  return axiosClient.get<SanPhamNhapKhoOption[]>(
    "/san-pham/tuy-chon-nhap-kho"
  );
};