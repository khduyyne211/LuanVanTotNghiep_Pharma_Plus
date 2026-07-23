import axiosClient from "../../../api/axiosClient";
import type { PhanTrangResponse } from "../../../types/PhanTrangResponse";
import type { SanPham, DanhMucSanPhamOption, NhaSanXuatOption, DonViSanPham, QuyDoiDonVi } from "../types/SanPham";

export interface ThamSoLocSanPham{
    page: number;
    size: number;

    keyword?:string;
    laThuocKeDon?:boolean;
    trangThaiSanPham?:boolean;

    maDanhMuc?:number;
    maNhaSanXuat?:number;
}
export interface SanPhamRequest{
    maDanhMuc: number;
    maNhaSanXuat: number | null;
    tenSanPham:string;
    hinhAnh:string|null;
    giaBan:number;
    laThuocKeDon:boolean;
    moTaNgan:string|null;

}
export const layDanhSachSanPhamPhanTrang  = (
    thamSo: ThamSoLocSanPham
)=>{
    return axiosClient.get<PhanTrangResponse<SanPham>>(
        "/san-pham/phan-trang",{
            params: thamSo,
        }
    );
};

export const layChiTietSanPhamDayDu = (maSanPham:number) =>{
    return axiosClient.get<SanPham>(
        `/san-pham/${maSanPham}/chi-tiet-day-du`
    );
};

export const themSanPham = (duLieu:SanPhamRequest)=>{
    return axiosClient.post<SanPham>("/san-pham", duLieu);
};

export const capNhatSanPham = (ma:number,data: SanPhamRequest)=>{
    return axiosClient.put<SanPham>(`/san-pham/${ma}`, data)
};

export const anSanPham = (ma:number)=>{
    return axiosClient.put<SanPham>(`/san-pham/${ma}/an`);
};

export const hienSanPham = (ma:number)=>{
    return axiosClient.put<SanPham>(`/san-pham/${ma}/hien`);
};

export const layDanhSachDanhMucSanPham = ()=>{
    return axiosClient.get<DanhMucSanPhamOption[]>(
        "/danh-muc-san-pham"
    );
};

export const layDanhSachNhaSanXuat = ()=>{
    return axiosClient.get<NhaSanXuatOption[]>(
        "/nha-san-xuat"
    );
};

export const anDonViSanPham = (ma:number)=>{
    return axiosClient.put<DonViSanPham>(
        `/don-vi-san-pham/${ma}/an`
    );
};

export const hienDonViSanPham = (ma:number) =>{
    return axiosClient.put<DonViSanPham>(
    `/don-vi-san-pham/${ma}/hien`
    );
};

export const anQuyDoiDonVi = (ma:number) =>{
    return axiosClient.put<QuyDoiDonVi>(
        `/quy-doi-don-vi/${ma}/an`
    );
};

export const hienQuyDoiDonVi = (ma:number) =>{
    return axiosClient.put<QuyDoiDonVi>(
        `/quy-doi-don-vi/${ma}/hien`
    );
};