package com.pharma.backend.service.admin;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.admin.donvitinh.DonViTinhRequest;
import com.pharma.backend.dto.admin.donvitinh.DonViTinhResponse;
import com.pharma.backend.entity.DonViTinh;
import com.pharma.backend.repository.DonViTinhRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonViTinhService {

    private final DonViTinhRepository donViTinhRepository;

    @Transactional(readOnly = true)
    public List<DonViTinhResponse> layDanhSachDonViTinh() {
        return donViTinhRepository.findAllOrderByTenDonViTinhAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DonViTinhResponse layChiTietDonViTinh(long maDonViTinh) {
        DonViTinh donViTinh = timDonViTinhTheoMa(maDonViTinh);
        return toResponse(donViTinh);
    }

    @Transactional
    public DonViTinhResponse themDonViTinh(DonViTinhRequest request) {
        if (donViTinhRepository.existsByTenDonViTinh(request.getTenDonViTinh())) {
            throw new IllegalArgumentException("Tên đơn vị tính đã tồn tại");
        }

        DonViTinh donViTinh = new DonViTinh();
        donViTinh.setTenDonViTinh(request.getTenDonViTinh());
        donViTinh.setKyHieu(request.getKyHieu());
        donViTinh.setMoTa(request.getMoTa());
        donViTinh.setTrangThai(true);

        return toResponse(donViTinhRepository.save(donViTinh));
    }

    @Transactional
    public DonViTinhResponse capNhatDonViTinh(
            long maDonViTinh,
            DonViTinhRequest request
    ) {
        DonViTinh donViTinh = timDonViTinhTheoMa(maDonViTinh);

        boolean biTrungTen =
                donViTinhRepository.existsByTenDonViTinhAndMaDonViTinhNot(
                        request.getTenDonViTinh(),
                        maDonViTinh
                );

        if (biTrungTen) {
            throw new IllegalArgumentException("Tên đơn vị tính đã tồn tại");
        }

        donViTinh.setTenDonViTinh(request.getTenDonViTinh());
        donViTinh.setKyHieu(request.getKyHieu());
        donViTinh.setMoTa(request.getMoTa());

        return toResponse(donViTinhRepository.save(donViTinh));
    }

    @Transactional
    public DonViTinhResponse anDonViTinh(long maDonViTinh) {
        DonViTinh donViTinh = timDonViTinhTheoMa(maDonViTinh);
        donViTinh.setTrangThai(false);

        return toResponse(donViTinhRepository.save(donViTinh));
    }

    @Transactional
    public DonViTinhResponse hienDonViTinh(long maDonViTinh) {
        DonViTinh donViTinh = timDonViTinhTheoMa(maDonViTinh);
        donViTinh.setTrangThai(true);

        return toResponse(donViTinhRepository.save(donViTinh));
    }

    private DonViTinh timDonViTinhTheoMa(long maDonViTinh) {
        return donViTinhRepository.findById(maDonViTinh)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Không tìm thấy đơn vị tính"
                        )
                );
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