package com.pharma.backend.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.xacthuc.DangNhapRequestDto;
import com.pharma.backend.dto.xacthuc.DangNhapResponseDto;
import com.pharma.backend.entity.KhachHang;
import com.pharma.backend.entity.TaiKhoan;
import com.pharma.backend.repository.KhachHangRepository;
import com.pharma.backend.repository.TaiKhoanRepository;
import com.pharma.backend.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class XacThucService {
    private static final String VAI_TRO_KHACH_HANG = "KHACH_HANG";

    private final TaiKhoanRepository taiKhoanRepository;
    private final KhachHangRepository khachHangRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional(readOnly = true)
    public DangNhapResponseDto dangNhapKhachHang(DangNhapRequestDto request) {
        kiemTraDuLieuDangNhap(request);

        String soDienThoai = request.getSoDienThoai().trim();

        TaiKhoan taiKhoan = taiKhoanRepository
            .findBySoDienThoai(soDienThoai)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Tài khoản không tồn tại."
            ));

        kiemTraTrangThaiTaiKhoan(taiKhoan);
        kiemTraMatKhau(request.getMatKhau(), taiKhoan);
        kiemTraVaiTroKhachHang(taiKhoan);

        KhachHang khachHang = khachHangRepository
            .findByTaiKhoan_MaTaiKhoan(taiKhoan.getMaTaiKhoan())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Tài khoản chưa được liên kết với hồ sơ khách hàng."
            ));

        kiemTraTrangThaiKhachHang(khachHang);
        String accessToken = jwtService.taoAccessToken(taiKhoan,khachHang);

        return new DangNhapResponseDto(
            accessToken,
            "Bearer",
            taiKhoan.getMaTaiKhoan(),
            khachHang.getMaKhachHang(),
            khachHang.getHoTen(),
            taiKhoan.getSoDienThoai(),
            VAI_TRO_KHACH_HANG
        );
    }

    private void kiemTraDuLieuDangNhap(DangNhapRequestDto request) {
        if (request == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Dữ liệu đăng nhập không hợp lệ."
            );
        }

        if (request.getSoDienThoai() == null || request.getSoDienThoai().trim().isEmpty()) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Số điện thoại không được để trống."
            );
        }

        if (request.getMatKhau() == null || request.getMatKhau().isBlank()
        ) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Mật khẩu không được để trống."
            );
        }
    }

    private void kiemTraTrangThaiTaiKhoan(TaiKhoan taiKhoan) {
        if (!Boolean.TRUE.equals(taiKhoan.getTrangThaiTaiKhoan())) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Tài khoản hiện không hoạt động."
            );
        }
    }

    private void kiemTraMatKhau(String matKhauNhapVao,TaiKhoan taiKhoan) {
        boolean matKhauDung = passwordEncoder.matches(matKhauNhapVao,taiKhoan.getMatKhau());

        if (!matKhauDung) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Mật khẩu không đúng."
            );
        }
    }

    private void kiemTraVaiTroKhachHang(TaiKhoan taiKhoan) {
        boolean coVaiTroKhachHang = taiKhoan
            .getDanhSachVaiTro()
            .stream()
            .anyMatch(vaiTro -> Boolean.TRUE.equals(vaiTro.getTrangThai()) &&
                VAI_TRO_KHACH_HANG.equalsIgnoreCase(
                    vaiTro.getTenVaiTro().trim()
                )
            );

        if (!coVaiTroKhachHang) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Tài khoản không có vai trò khách hàng."
            );
        }
    }

    private void kiemTraTrangThaiKhachHang(KhachHang khachHang) {
        if (!Boolean.TRUE.equals(khachHang.getTrangThai())) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Khách hàng hiện không hoạt động."
            );
        }
    }
}
