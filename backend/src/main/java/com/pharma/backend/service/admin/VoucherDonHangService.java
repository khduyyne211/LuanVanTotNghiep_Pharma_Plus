package com.pharma.backend.service.admin;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.admin.voucherdonhang.VoucherDonHangResponse;
import com.pharma.backend.entity.VoucherDonHang;
import com.pharma.backend.repository.VoucherDonHangRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoucherDonHangService {

    private final VoucherDonHangRepository voucherDonHangRepository;

    @Transactional(readOnly = true)
    public List<VoucherDonHangResponse> layDanhSachVoucher() {
        return voucherDonHangRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private VoucherDonHangResponse toResponse(VoucherDonHang voucher) {
        return VoucherDonHangResponse.builder()
                .maVoucher(voucher.getMaVoucher())
                .maGiamGia(voucher.getMaGiamGia())
                .tenVoucher(voucher.getTenVoucher())
                .loaiGiamGia(voucher.getLoaiGiamGia())
                .giaTriGiam(voucher.getGiaTriGiam())
                .soTienGiamToiDa(voucher.getSoTienGiamToiDa())
                .donGiaToiThieu(voucher.getDonGiaToiThieu())
                .thoiGianBatDau(voucher.getThoiGianBatDau())
                .thoiGianKetThuc(voucher.getThoiGianKetThuc())
                .soLuongSuDung(voucher.getSoLuongSuDung())
                .soLuongDaSuDung(voucher.getSoLuongDaSuDung())
                .trangThai(voucher.getTrangThai())
                .build();
    }
}
