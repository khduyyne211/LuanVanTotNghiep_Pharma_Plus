package com.pharma.backend.service.duocsi;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.common.PhanTrangResponse;
import com.pharma.backend.dto.duocsi.khachhang.KhachHangDuocSiResponse;
import com.pharma.backend.entity.KhachHang;
import com.pharma.backend.repository.KhachHangRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KhachHangDuocSiService {

    private static final int KICH_THUOC_TRANG_TOI_DA = 20;

    private final KhachHangRepository khachHangRepository;

    @Transactional(readOnly = true)
    public PhanTrangResponse<KhachHangDuocSiResponse> layDanhSachKhachHangPhanTrang(
            int page,
            int size,
            String keyword) {

        int pageHopLe = Math.max(page, 0);
        int sizeHopLe = Math.min(Math.max(size, 1), KICH_THUOC_TRANG_TOI_DA);
        Pageable pageable = PageRequest.of(pageHopLe, sizeHopLe);

        Page<KhachHang> khachHangPage = khachHangRepository.timKiemKhachHangDangHoatDongChoDuocSi(
                chuanHoaTuKhoa(keyword),
                pageable);

        return PhanTrangResponse.<KhachHangDuocSiResponse>builder()
                .content(khachHangPage.getContent().stream().map(this::toResponse).toList())
                .page(khachHangPage.getNumber())
                .size(khachHangPage.getSize())
                .totalElements(khachHangPage.getTotalElements())
                .totalPages(khachHangPage.getTotalPages())
                .first(khachHangPage.isFirst())
                .last(khachHangPage.isLast())
                .build();
    }

    private KhachHangDuocSiResponse toResponse(KhachHang khachHang) {
        return new KhachHangDuocSiResponse(
                khachHang.getMaKhachHang(),
                khachHang.getHoTen(),
                khachHang.getTaiKhoan().getSoDienThoai());
    }

    private String chuanHoaTuKhoa(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return null;
        }

        return keyword.trim();
    }
}
