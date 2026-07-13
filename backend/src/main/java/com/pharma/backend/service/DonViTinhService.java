package com.pharma.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.pharma.backend.dto.donvitinh.DonViTinhRequest;
import com.pharma.backend.dto.donvitinh.DonViTinhResponse;
import com.pharma.backend.entity.DonViTinh;
import com.pharma.backend.repository.DonViTinhRepository;

import lombok.*;

@Service
@RequiredArgsConstructor
public class DonViTinhService {

    private final DonViTinhRepository donViTinhRepository;

    public List<DonViTinhResponse> layDanhSachDonViTinh() {
        return donViTinhRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public DonViTinhResponse layChiTietDonViTinh(long maDonViTinh) {
        DonViTinh donViTinh = donViTinhRepository.findById(maDonViTinh)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn vị tính"));

        return toResponse(donViTinh);
    }

    public DonViTinhResponse themDonViTinh(DonViTinhRequest request) {
        if (donViTinhRepository.existsByTenDonViTinh(request.getTenDonViTinh())) {
            throw new IllegalArgumentException("Tên đơn vị tính đã tồn tại");
        }

        DonViTinh donViTinh = new DonViTinh();
        donViTinh.setTenDonViTinh(request.getTenDonViTinh());
        donViTinh.setKyHieu(request.getKyHieu());
        donViTinh.setMoTa(request.getMoTa());
        donViTinh.setTrangThai(true);

        DonViTinh saved = donViTinhRepository.save(donViTinh);

        return toResponse(saved);
    }

    public DonViTinhResponse capNhatDonViTinh(long maDonViTinh, DonViTinhRequest request) {
        DonViTinh donViTinh = donViTinhRepository.findById(maDonViTinh)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn vị tính"));

        boolean biTrungTen = donViTinhRepository.existsByTenDonViTinhAndMaDonViTinhNot(
                request.getTenDonViTinh(),
                maDonViTinh
        );

        if (biTrungTen) {
            throw new IllegalArgumentException("Tên đơn vị tính đã tồn tại");
        }

        donViTinh.setTenDonViTinh(request.getTenDonViTinh());
        donViTinh.setKyHieu(request.getKyHieu());
        donViTinh.setMoTa(request.getMoTa());

        DonViTinh updated = donViTinhRepository.save(donViTinh);

        return toResponse(updated);
    }

    public DonViTinhResponse anDonViTinh(long maDonViTinh) {
        DonViTinh donViTinh = donViTinhRepository.findById(maDonViTinh)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn vị tính"));

        donViTinh.setTrangThai(false);

        DonViTinh updated = donViTinhRepository.save(donViTinh);

        return toResponse(updated);
    }

    public DonViTinhResponse hienDonViTinh(long maDonViTinh) {
        DonViTinh donViTinh = donViTinhRepository.findById(maDonViTinh)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn vị tính"));

        donViTinh.setTrangThai(true);

        DonViTinh updated = donViTinhRepository.save(donViTinh);

        return toResponse(updated);
    }

    private DonViTinhResponse toResponse(DonViTinh donViTinh) {
        return DonViTinhResponse.builder()
                .maDonViTinh(donViTinh.getMaDonViTinh())
                .tenDonViTinh(donViTinh.getTenDonViTinh())
                .kyHieu(donViTinh.getKyHieu())
                .moTa(donViTinh.getMoTa())
                .trangThai(donViTinh.getTrangThai())
                .build();
    }
}