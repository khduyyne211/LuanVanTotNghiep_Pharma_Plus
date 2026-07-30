package com.pharma.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.nhacungcap.NhaCungCapRequest;
import com.pharma.backend.dto.nhacungcap.NhaCungCapResponse;
import com.pharma.backend.entity.NhaCungCap;
import com.pharma.backend.repository.NhaCungCapRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NhaCungCapService {

    private final NhaCungCapRepository nhaCungCapRepository;

    @Transactional(readOnly = true)
    public List<NhaCungCapResponse> layDanhSachNhaCungCap() {
        return nhaCungCapRepository.findAllOrderByTenNhaCungCapAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public NhaCungCapResponse themNhaCungCap(NhaCungCapRequest request) {
        NhaCungCap nhaCungCap = new NhaCungCap();

        nhaCungCap.setTenNhaCungCap(request.getTenNhaCungCap().trim());
        nhaCungCap.setSoDienThoai(chuanHoaChuoiKhongBatBuoc(request.getSoDienThoai()));
        nhaCungCap.setDiaChi(chuanHoaChuoiKhongBatBuoc(request.getDiaChi()));
        nhaCungCap.setEmail(chuanHoaChuoiKhongBatBuoc(request.getEmail()));
        nhaCungCap.setTrangThaiHopTac(true);

        return toResponse(nhaCungCapRepository.save(nhaCungCap));
    }

    @Transactional
    public NhaCungCapResponse capNhatNhaCungCap(
            Long maNhaCungCap,
            NhaCungCapRequest request
    ) {
        NhaCungCap nhaCungCap = nhaCungCapRepository.findById(maNhaCungCap)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy nhà cung cấp"
                ));

        nhaCungCap.setTenNhaCungCap(request.getTenNhaCungCap().trim());
        nhaCungCap.setSoDienThoai(chuanHoaChuoiKhongBatBuoc(request.getSoDienThoai()));
        nhaCungCap.setDiaChi(chuanHoaChuoiKhongBatBuoc(request.getDiaChi()));
        nhaCungCap.setEmail(chuanHoaChuoiKhongBatBuoc(request.getEmail()));

        return toResponse(nhaCungCapRepository.save(nhaCungCap));
    }

    @Transactional
    public NhaCungCapResponse doiTrangThaiHopTac(Long maNhaCungCap) {
        NhaCungCap nhaCungCap = nhaCungCapRepository.findById(maNhaCungCap)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy nhà cung cấp"
                ));

        nhaCungCap.setTrangThaiHopTac(
                !nhaCungCap.getTrangThaiHopTac()
        );

        return toResponse(nhaCungCapRepository.save(nhaCungCap));
    }

    private String chuanHoaChuoiKhongBatBuoc(String giaTri) {
        if (giaTri == null || giaTri.isBlank()) {
            return null;
        }

        return giaTri.trim();
    }

    private NhaCungCapResponse toResponse(NhaCungCap nhaCungCap) {
        return NhaCungCapResponse.builder()
                .maNhaCungCap(nhaCungCap.getMaNhaCungCap())
                .tenNhaCungCap(nhaCungCap.getTenNhaCungCap())
                .soDienThoai(nhaCungCap.getSoDienThoai())
                .diaChi(nhaCungCap.getDiaChi())
                .email(nhaCungCap.getEmail())
                .trangThaiHopTac(nhaCungCap.getTrangThaiHopTac())
                .build();
    }
}