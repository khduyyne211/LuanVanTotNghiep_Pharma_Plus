package com.pharma.backend.controller.duocsi;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.common.PhanTrangResponse;
import com.pharma.backend.dto.duocsi.donthuoc.DonThuocKiemDuyetRequest;
import com.pharma.backend.dto.duocsi.donthuoc.DonThuocResponse;
import com.pharma.backend.enums.donthuoc.TrangThaiDonThuoc;
import com.pharma.backend.service.duocsi.DonThuocService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/don-thuoc")
@RequiredArgsConstructor
public class DonThuocController {

    private final DonThuocService donThuocService;

    @GetMapping("/phan-trang")
    public PhanTrangResponse<DonThuocResponse>
            layDanhSachDonThuocPhanTrang(
                    @RequestParam(defaultValue = "0") int page,
                    @RequestParam(defaultValue = "10") int size,
                    @RequestParam(required = false) TrangThaiDonThuoc trangThai,
                    @RequestParam(required = false) String keyword
            ) {
        return donThuocService.layDanhSachDonThuocPhanTrang(
                page,
                size,
                trangThai,
                keyword
        );
    }

    @GetMapping("/{maDonThuoc}")
    public DonThuocResponse layChiTietDonThuoc(
            @PathVariable long maDonThuoc
    ) {
        return donThuocService.layChiTietDonThuoc(maDonThuoc);
    }

    @PutMapping("/{maDonThuoc}/duyet")
    public DonThuocResponse duyetDonThuoc(
            @PathVariable long maDonThuoc,
            @RequestBody DonThuocKiemDuyetRequest request
    ) {
        return donThuocService.duyetDonThuoc(
                maDonThuoc,
                request
        );
    }

    @PutMapping("/{maDonThuoc}/tu-choi")
    public DonThuocResponse tuChoiDonThuoc(
            @PathVariable long maDonThuoc,
            @RequestBody DonThuocKiemDuyetRequest request
    ) {
        return donThuocService.tuChoiDonThuoc(
                maDonThuoc,
                request
        );
    }
}