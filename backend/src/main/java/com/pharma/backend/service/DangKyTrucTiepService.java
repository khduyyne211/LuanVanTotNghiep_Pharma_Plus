package com.pharma.backend.service;

import java.time.LocalDateTime;
import java.util.regex.Pattern;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.xacthuc.DangKyTrucTiepRequestDto;
import com.pharma.backend.entity.KhachHang;
import com.pharma.backend.entity.TaiKhoan;
import com.pharma.backend.entity.VaiTro;
import com.pharma.backend.repository.KhachHangRepository;
import com.pharma.backend.repository.TaiKhoanRepository;
import com.pharma.backend.repository.VaiTroRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DangKyTrucTiepService {

    private static final String KHACH_HANG = "KHACH_HANG";
    private static final Pattern MAU_SO_DIEN_THOAI = Pattern.compile("^0\\d{9}$");

    private final TaiKhoanRepository taiKhoanRepository;
    private final KhachHangRepository khachHangRepository;
    private final VaiTroRepository vaiTroRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void dangKy(DangKyTrucTiepRequestDto request) {
        kiemTraDuLieuDangKy(request);

        String soDienThoai = request.getSoDienThoai().trim();
        String hoTen = request.getHoTen().trim().replaceAll("\\s+", " ");

        kiemTraDuLieuDaTonTai(soDienThoai);

        VaiTro vaiTroKhachHang = vaiTroRepository
                .timVaiTroDangHoatDongTheoTen(KHACH_HANG)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Hệ thống chưa cấu hình vai trò khách hàng."
                ));

        try {
            TaiKhoan taiKhoan = new TaiKhoan();
            taiKhoan.setSoDienThoai(soDienThoai);
            taiKhoan.setMatKhau(passwordEncoder.encode(request.getMatKhau()));
            taiKhoan.setTrangThaiTaiKhoan(true);
            taiKhoan.setNgayTao(LocalDateTime.now());
            taiKhoan.getDanhSachVaiTro().add(vaiTroKhachHang);

            taiKhoanRepository.saveAndFlush(taiKhoan);

            KhachHang khachHang = new KhachHang();
            khachHang.setTaiKhoan(taiKhoan);
            khachHang.setHoTen(hoTen);
            khachHang.setGioiTinh(null);
            khachHang.setNgaySinh(null);
            khachHang.setTrangThai(true);

            khachHangRepository.saveAndFlush(khachHang);
        } catch (DataIntegrityViolationException exception) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Số điện thoại đã được sử dụng.",
                    exception
            );
        }
    }

    private void kiemTraDuLieuDangKy(DangKyTrucTiepRequestDto request) {
        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Dữ liệu đăng ký không hợp lệ."
            );
        }

        String soDienThoai = request.getSoDienThoai();

        if (
                soDienThoai == null ||
                !MAU_SO_DIEN_THOAI.matcher(soDienThoai.trim()).matches()
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Số điện thoại phải gồm đúng 10 chữ số và bắt đầu bằng số 0."
            );
        }

        String hoTen = request.getHoTen();

        if (
                hoTen == null ||
                hoTen.isBlank() ||
                hoTen.trim().length() > 100
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Họ tên không hợp lệ."
            );
        }

        String matKhau = request.getMatKhau();

        if (matKhau == null || matKhau.length() < 6) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Mật khẩu phải có ít nhất 6 ký tự."
            );
        }

        if (
                request.getXacNhanMatKhau() == null ||
                !matKhau.equals(request.getXacNhanMatKhau())
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Nhập lại mật khẩu không khớp."
            );
        }
    }

    private void kiemTraDuLieuDaTonTai(String soDienThoai) {
        if (taiKhoanRepository.existsBySoDienThoai(soDienThoai)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Tài khoản đã tồn tại."
            );
        }
    }
}