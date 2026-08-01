package com.pharma.backend.service;

import java.util.List;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.xacthuc.DangNhapRequestDto;
import com.pharma.backend.dto.xacthuc.DangNhapResponseDto;
import com.pharma.backend.entity.KhachHang;
import com.pharma.backend.entity.NhanVienNoiBo;
import com.pharma.backend.entity.TaiKhoan;
import com.pharma.backend.repository.KhachHangRepository;
import com.pharma.backend.repository.NhanVienNoiBoRepository;
import com.pharma.backend.repository.TaiKhoanRepository;
import com.pharma.backend.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class XacThucService {

    private static final String VAI_TRO_KHACH_HANG = "KHACH_HANG";
    private static final String VAI_TRO_ADMIN = "ADMIN";
    private static final String VAI_TRO_DUOC_SI = "DUOC_SI";

    private final TaiKhoanRepository taiKhoanRepository;
    private final KhachHangRepository khachHangRepository;
    private final NhanVienNoiBoRepository nhanVienNoiBoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional(readOnly = true)
    public DangNhapResponseDto dangNhap(DangNhapRequestDto request) {
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

        String vaiTro = layVaiTroDangHoatDongDuyNhat(taiKhoan);

        return switch (vaiTro) {
            case VAI_TRO_KHACH_HANG ->
                    taoPhanHoiDangNhapKhachHang(taiKhoan);

            case VAI_TRO_ADMIN, VAI_TRO_DUOC_SI ->
                    taoPhanHoiDangNhapNhanVien(taiKhoan, vaiTro);

            default -> throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Vai trò tài khoản không được hệ thống hỗ trợ."
            );
        };
    }

    private DangNhapResponseDto taoPhanHoiDangNhapKhachHang(
            TaiKhoan taiKhoan
    ) {
        KhachHang khachHang = khachHangRepository
                .findByTaiKhoan_MaTaiKhoan(taiKhoan.getMaTaiKhoan())
                .orElseThrow(() -> new ResponseStatusException(
HttpStatus.FORBIDDEN,
                        "Tài khoản chưa được liên kết với hồ sơ khách hàng."
                ));

        if (!Boolean.TRUE.equals(khachHang.getTrangThai())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Khách hàng hiện không hoạt động."
            );
        }

        String accessToken = jwtService.taoAccessToken(
                taiKhoan,
                khachHang.getMaKhachHang(),
                null,
                VAI_TRO_KHACH_HANG
        );

        return new DangNhapResponseDto(
                accessToken,
                "Bearer",
                taiKhoan.getMaTaiKhoan(),
                khachHang.getMaKhachHang(),
                null,
                khachHang.getHoTen(),
                taiKhoan.getSoDienThoai(),
                VAI_TRO_KHACH_HANG
        );
    }

    private DangNhapResponseDto taoPhanHoiDangNhapNhanVien(
            TaiKhoan taiKhoan,
            String vaiTro
    ) {
        NhanVienNoiBo nhanVien = nhanVienNoiBoRepository
                .timNhanVienDangHoatDongTheoTaiKhoan(
                        taiKhoan.getMaTaiKhoan()
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Tài khoản chưa được liên kết với nhân viên đang hoạt động."
                ));

        String accessToken = jwtService.taoAccessToken(
                taiKhoan,
                null,
                nhanVien.getMaNhanVien(),
                vaiTro
        );

        return new DangNhapResponseDto(
                accessToken,
                "Bearer",
                taiKhoan.getMaTaiKhoan(),
                null,
                nhanVien.getMaNhanVien(),
                nhanVien.getHoTen(),
                taiKhoan.getSoDienThoai(),
                vaiTro
        );
    }

    private String layVaiTroDangHoatDongDuyNhat(TaiKhoan taiKhoan) {
        List<String> danhSachVaiTroDangHoatDong = taiKhoan
                .getDanhSachVaiTro()
                .stream()
                .filter(vaiTro -> Boolean.TRUE.equals(vaiTro.getTrangThai()))
                .map(vaiTro -> vaiTro.getTenVaiTro())
                .filter(tenVaiTro -> tenVaiTro != null && !tenVaiTro.isBlank())
                .map(tenVaiTro -> tenVaiTro.trim().toUpperCase(Locale.ROOT))
                .filter(this::laVaiTroDuocHoTro)
                .distinct()
                .toList();

        if (danhSachVaiTroDangHoatDong.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Tài khoản không có vai trò đang hoạt động."
            );
        }

        if (danhSachVaiTroDangHoatDong.size() > 1) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
"Tài khoản đang được gán nhiều hơn một vai trò."
            );
        }

        return danhSachVaiTroDangHoatDong.getFirst();
    }

    private boolean laVaiTroDuocHoTro(String vaiTro) {
        return VAI_TRO_KHACH_HANG.equals(vaiTro)
                || VAI_TRO_ADMIN.equals(vaiTro)
                || VAI_TRO_DUOC_SI.equals(vaiTro);
    }

    private void kiemTraDuLieuDangNhap(DangNhapRequestDto request) {
        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Dữ liệu đăng nhập không hợp lệ."
            );
        }

        if (request.getSoDienThoai() == null
                || request.getSoDienThoai().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Số điện thoại không được để trống."
            );
        }

        if (request.getMatKhau() == null
                || request.getMatKhau().isBlank()) {
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

    private void kiemTraMatKhau(
            String matKhauNhapVao,
            TaiKhoan taiKhoan
    ) {
        boolean matKhauDung = passwordEncoder.matches(
                matKhauNhapVao,
                taiKhoan.getMatKhau()
        );

        if (!matKhauDung) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Mật khẩu không đúng."
            );
        }
    }
}
