package com.pharma.backend.service;

import java.util.List;

import com.pharma.backend.entity.ChiTietGioHang;
import com.pharma.backend.entity.DiaChiGiaoHang;
import com.pharma.backend.entity.GioHang;
import com.pharma.backend.entity.KhachHang;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DuLieuTaoDonHang {

    private KhachHang khachHang;

    private GioHang gioHang;

    private DiaChiGiaoHang diaChiGiaoHang;

    private List<ChiTietGioHang> danhSachChiTietGioHang;

    private String ghiChu;
}
