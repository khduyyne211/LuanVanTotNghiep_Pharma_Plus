package com.pharma.backend.controller.admin;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PutMapping;
import com.pharma.backend.dto.admin.phieunhap.PhieuNhapResponse;
import com.pharma.backend.dto.admin.phieunhap.PhieuNhapTaoMoiRequest;
import com.pharma.backend.service.admin.PhieuNhapService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/phieu-nhap")
@RequiredArgsConstructor
public class PhieuNhapController {

    private final PhieuNhapService phieuNhapService;

    @GetMapping
    public List<PhieuNhapResponse> layDanhSachPhieuNhap() {
        return phieuNhapService.layDanhSachPhieuNhap();
    }

    @GetMapping("/{maPhieuNhap}")
    public PhieuNhapResponse layChiTietPhieuNhap(
            @PathVariable Long maPhieuNhap) {
        return phieuNhapService.layChiTietPhieuNhap(
                maPhieuNhap);
    }

    @PostMapping
    public PhieuNhapResponse taoPhieuNhap(
            @Valid @RequestBody PhieuNhapTaoMoiRequest request) {
        return phieuNhapService.taoPhieuNhap(request);
    }

    @PutMapping("/{maPhieuNhap}/xac-nhan")
    public PhieuNhapResponse xacNhanNhapKho(
            @PathVariable Long maPhieuNhap) {
        return phieuNhapService.xacNhanNhapKho(
                maPhieuNhap);
    }

    @PutMapping("/{maPhieuNhap}/huy")
    public PhieuNhapResponse huyPhieuNhap(
            @PathVariable Long maPhieuNhap) {
        return phieuNhapService.huyPhieuNhap(
                maPhieuNhap);
    }
}
