package com.pharma.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.quydoidonvi.QuyDoiDonViRequest;
import com.pharma.backend.dto.quydoidonvi.QuyDoiDonViResponse;
import com.pharma.backend.service.QuyDoiDonViService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class QuyDoiDonViController {

    private final QuyDoiDonViService quyDoiDonViService;

    @GetMapping("/san-pham/{maSanPham}/quy-doi-don-vi")
    public List<QuyDoiDonViResponse> layDanhSachQuyDoiTheoSanPham(
            @PathVariable Long maSanPham
    ) {
        return quyDoiDonViService.layDanhSachQuyDoiTheoSanPham(maSanPham);
    }

    @GetMapping("/quy-doi-don-vi/{maQuyDoi}")
    public QuyDoiDonViResponse layChiTietQuyDoiDonVi(
            @PathVariable Long maQuyDoi
    ) {
        return quyDoiDonViService.layChiTietQuyDoiDonVi(maQuyDoi);
    }

    @PostMapping("/quy-doi-don-vi")
    public QuyDoiDonViResponse themQuyDoiDonVi(
            @RequestBody QuyDoiDonViRequest request
    ) {
        return quyDoiDonViService.themQuyDoiDonVi(request);
    }

    @PutMapping("/quy-doi-don-vi/{maQuyDoi}")
    public QuyDoiDonViResponse capNhatQuyDoiDonVi(
            @PathVariable Long maQuyDoi,
            @RequestBody QuyDoiDonViRequest request
    ) {
        return quyDoiDonViService.capNhatQuyDoiDonVi(maQuyDoi, request);
    }

    @PutMapping("/quy-doi-don-vi/{maQuyDoi}/an")
    public QuyDoiDonViResponse anQuyDoiDonVi(
            @PathVariable Long maQuyDoi
    ) {
        return quyDoiDonViService.anQuyDoiDonVi(maQuyDoi);
    }

    @PutMapping("/quy-doi-don-vi/{maQuyDoi}/hien")
    public QuyDoiDonViResponse hienQuyDoiDonVi(
            @PathVariable Long maQuyDoi
    ) {
        return quyDoiDonViService.hienQuyDoiDonVi(maQuyDoi);
    }
}