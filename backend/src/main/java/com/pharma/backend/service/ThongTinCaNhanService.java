package com.pharma.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.thongtincanhan.CapNhatThongTinCaNhanRequestDto;
import com.pharma.backend.dto.thongtincanhan.ThongTinCaNhanResponseDto;
import com.pharma.backend.entity.KhachHang;
import com.pharma.backend.repository.KhachHangRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ThongTinCaNhanService {

    private final KhachHangRepository khachHangRepository;

    @Transactional(readOnly = true)
    public ThongTinCaNhanResponseDto layThongTinCaNhan(Long maKhachHang) {
        KhachHang khachHang = layKhachHangDangHoatDong(maKhachHang);

        return chuyenSangResponseDto(khachHang);
    }

    @Transactional
    public ThongTinCaNhanResponseDto capNhatThongTinCaNhan(
            Long maKhachHang,
            CapNhatThongTinCaNhanRequestDto request
    ) {
        KhachHang khachHang = layKhachHangDangHoatDong(maKhachHang);

        khachHang.setHoTen(request.getHoTen().trim());
        khachHang.setGioiTinh(request.getGioiTinh());
        khachHang.setNgaySinh(request.getNgaySinh());

        KhachHang khachHangDaCapNhat =
                khachHangRepository.save(khachHang);

        return chuyenSangResponseDto(khachHangDaCapNhat);
    }

    private KhachHang layKhachHangDangHoatDong(Long maKhachHang) {
        if (maKhachHang == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Không xác định được khách hàng đang đăng nhập."
            );
        }

        return khachHangRepository
                .timThongTinCaNhanDangHoatDong(maKhachHang)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy thông tin khách hàng đang hoạt động."
                ));
    }

    private ThongTinCaNhanResponseDto chuyenSangResponseDto(KhachHang khachHang) {
        return new ThongTinCaNhanResponseDto(
                khachHang.getTaiKhoan().getSoDienThoai(),
                khachHang.getHoTen(),
                khachHang.getGioiTinh(),
                khachHang.getNgaySinh()
        );
    }
}