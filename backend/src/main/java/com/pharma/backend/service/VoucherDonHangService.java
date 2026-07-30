package com.pharma.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pharma.backend.dto.nhasanxuat.NhaSanXuatRequest;
import com.pharma.backend.dto.nhasanxuat.NhaSanXuatResponse;
import com.pharma.backend.dto.voucherdonhang.VoucherDonHangResponse;
import com.pharma.backend.entity.NhaSanXuat;
import com.pharma.backend.entity.VoucherDonHang;
import com.pharma.backend.repository.VoucherDonHangRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class VoucherDonHangService {
    private final VoucherDonHangRepository repo;

    public List<VoucherDonHangResponse> layDanhSachVoucher(){
        return repo.findAll()
                        .stream()
                        .map(this::toResponse)
                        .toList();
    }
    private VoucherDonHangResponse toResponse(VoucherDonHang v) {
        return VoucherDonHangResponse.builder()
                                    .maVoucher(v.getMaVoucher())
                                    .maGiamGia(v.getMaGiamGia())
                                    .tenVoucher(v.getTenVoucher())
                                    .loaiGiamGia(v.getLoaiGiamGia())
                                    .giaTriGiam(v.getGiaTriGiam())
                                    .soTienGiamToiDa(v.getSoTienGiamToiDa())
                                    .donGiaToiThieu(v.getDonGiaToiThieu())
                                    .thoiGianBatDau(v.getThoiGianBatDau())
                                    .thoiGianKetThuc(v.getThoiGianKetThuc())
                                    .soLuongSuDung(v.getSoLuongSuDung())
                                    .soLuongDaSuDung(v.getSoLuongDaSuDung())
                                    .trangThai(v.getTrangThai())
                                    .build();
    }
}
