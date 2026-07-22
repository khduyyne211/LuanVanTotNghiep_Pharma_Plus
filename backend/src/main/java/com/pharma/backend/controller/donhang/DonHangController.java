package com.pharma.backend.controller.donhang;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.common.PhanTrangResponse;
import com.pharma.backend.dto.donhang.DonHangChiTietResponse;
import com.pharma.backend.dto.donhang.DonHangDanhSachResponse;
import com.pharma.backend.dto.donhang.DonHangTaiQuayRequest;
import com.pharma.backend.dto.donhang.SanPhamBanTaiQuayResponse;
import com.pharma.backend.service.donhang.DonHangService;
import com.pharma.backend.service.donhang.DonHangTaiQuayService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/don-hang")
@RequiredArgsConstructor
public class DonHangController {

    private final DonHangService donHangService;
    private final DonHangTaiQuayService donHangTaiQuayService;

    @GetMapping("/phan-trang")
    public PhanTrangResponse<DonHangDanhSachResponse>
            layDanhSachDonHangPhanTrang(
                    @RequestParam(defaultValue = "0") int page,
                    @RequestParam(defaultValue = "10") int size,
                    @RequestParam(required = false)
                            String keyword,
                    @RequestParam(required = false)
                            String trangThaiDonHang,
                    @RequestParam(required = false)
                            String trangThaiThanhToan,
                    @RequestParam(required = false)
                            String trangThaiKiemDuyet
            ) {
        return donHangService.layDanhSachDonHangPhanTrang(
                page,
                size,
                keyword,
                trangThaiDonHang,
                trangThaiThanhToan,
                trangThaiKiemDuyet
        );
    }

    @GetMapping("/san-pham-ban-tai-quay")
    public List<SanPhamBanTaiQuayResponse>
            laySanPhamBanTaiQuay(
                    @RequestParam(defaultValue = "")
                            String keyword
            ) {
        return donHangTaiQuayService
                .laySanPhamBanTaiQuay(keyword);
    }

    @PostMapping("/tao-tai-quay")
    public DonHangChiTietResponse taoDonHangTaiQuay(
            @RequestBody DonHangTaiQuayRequest request
    ) {
        return donHangTaiQuayService
                .taoDonHangTaiQuay(request);
    }

    @GetMapping("/{maDonHang}")
    public DonHangChiTietResponse layChiTietDonHang(
            @PathVariable long maDonHang
    ) {
        return donHangService.layChiTietDonHang(maDonHang);
    }
}
