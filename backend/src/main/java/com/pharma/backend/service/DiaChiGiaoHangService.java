package com.pharma.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.diachigiaohang.DiaChiGiaoHangResponseDto;
import com.pharma.backend.entity.DiaChiGiaoHang;
import com.pharma.backend.repository.DiaChiGiaoHangRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DiaChiGiaoHangService {

    private final DiaChiGiaoHangRepository diaChiGiaoHangRepository;

    @Transactional(readOnly = true)
    public List<DiaChiGiaoHangResponseDto> layDanhSachDiaChiDangSuDung(Long maKhachHang) {
        return diaChiGiaoHangRepository
                .findByKhachHang_MaKhachHangAndTrangThaiSuDungTrueOrderByLaMacDinhDescMaDiaChiDesc(maKhachHang)
                .stream()
                .map(this::chuyenSangDiaChiGiaoHangResponseDto)
                .toList();
    }

    private DiaChiGiaoHangResponseDto chuyenSangDiaChiGiaoHangResponseDto(DiaChiGiaoHang diaChi) {
        return new DiaChiGiaoHangResponseDto(
                diaChi.getMaDiaChi(),
                diaChi.getTenNguoiNhan(),
                diaChi.getSoDienThoaiNhan(),
                diaChi.getThanhPho(),
                diaChi.getPhuongKhuVuc(),
                diaChi.getDiaChiChiTiet(),
                diaChi.getLaMacDinh(),
                diaChi.getTrangThaiSuDung()
        );
    }
}