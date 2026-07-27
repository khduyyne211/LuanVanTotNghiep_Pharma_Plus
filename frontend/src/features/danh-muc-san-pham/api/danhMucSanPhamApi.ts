import axiosClient from "../../../api/axiosClient";
import type { 
    DanhMucSanPham, 
    DanhMucSanPhamRequest } from "../types/DanhMucSanPham";

export const layDanhSachDanhMucSanPham = () => {
    return axiosClient.get<DanhMucSanPham[]>(
        "/danh-muc-san-pham"
    );
};

export const layChiTietDanhMucSanPham = ( maDanhMuc: number) =>{
    return axiosClient.get<DanhMucSanPham[]>(
        `/dannh-muc-san-pham/${maDanhMuc}`
    );
};

export const themDanhMucSanPham = (
    request: DanhMucSanPhamRequest
) => {
    return axiosClient.post<DanhMucSanPham>(
        "/danh-muc-san-pham", request
    );
};

export const capNhatSanPham = (
    ma: number, 
    request:DanhMucSanPhamRequest
) =>{
    return axiosClient.put<DanhMucSanPham>(
        `/danh-muc-san-pham/${ma}`, request
    );
};

export const anDanhMucSanPham =(
    ma: number
) => {
    return axiosClient.put<DanhMucSanPham>(
        `/danh-muc-san-pham/${ma}/an`
    );
};

export const hienDanhMucSanPham =(
    ma: number
) => {
    return axiosClient.put<DanhMucSanPham>(
        `/danh-muc-san-pham/${ma}/hien`
    );
};


