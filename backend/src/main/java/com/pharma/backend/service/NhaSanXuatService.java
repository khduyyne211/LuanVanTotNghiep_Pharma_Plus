package com.pharma.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.nhasanxuat.NhaSanXuatRequest;
import com.pharma.backend.dto.nhasanxuat.NhaSanXuatResponse;
import com.pharma.backend.entity.NhaSanXuat;
import com.pharma.backend.repository.NhaSanXuatRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NhaSanXuatService {

    private final NhaSanXuatRepository nhaSanXuatRepository;

    @Transactional(readOnly = true)
    public List<NhaSanXuatResponse> layDanhSachNhaSanXuat() {
        return nhaSanXuatRepository.findAllByOrderByTenNhaSanXuatAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public NhaSanXuatResponse layChiTietNhaSanXuat(long maNhaSanXuat) {
        NhaSanXuat nhaSanXuat = nhaSanXuatRepository.findById(maNhaSanXuat)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhà sản xuất"));

        return toResponse(nhaSanXuat);
    }

    @Transactional
    public NhaSanXuatResponse themNhaSanXuat(NhaSanXuatRequest request) {
        if (nhaSanXuatRepository.existsByTenNhaSanXuat(request.getTenNhaSanXuat())) {
            throw new IllegalArgumentException("Tên nhà sản xuất đã tồn tại");
        }

        NhaSanXuat nhaSanXuat = new NhaSanXuat();
        nhaSanXuat.setTenNhaSanXuat(request.getTenNhaSanXuat());
        nhaSanXuat.setQuocGia(request.getQuocGia());
        nhaSanXuat.setDiaChi(request.getDiaChi());
        nhaSanXuat.setTrangThai(true);

        NhaSanXuat saved = nhaSanXuatRepository.save(nhaSanXuat);

        return toResponse(saved);
    }

    @Transactional
    public NhaSanXuatResponse capNhatNhaSanXuat(
            long maNhaSanXuat,
            NhaSanXuatRequest request
    ) {
        NhaSanXuat nhaSanXuat = nhaSanXuatRepository.findById(maNhaSanXuat)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhà sản xuất"));

        boolean biTrungTen = nhaSanXuatRepository.existsByTenNhaSanXuatAndMaNhaSanXuatNot(
                request.getTenNhaSanXuat(),
                maNhaSanXuat
        );

        if (biTrungTen) {
            throw new IllegalArgumentException("Tên nhà sản xuất đã tồn tại");
        }

        nhaSanXuat.setTenNhaSanXuat(request.getTenNhaSanXuat());
        nhaSanXuat.setQuocGia(request.getQuocGia());
        nhaSanXuat.setDiaChi(request.getDiaChi());

        NhaSanXuat updated = nhaSanXuatRepository.save(nhaSanXuat);

        return toResponse(updated);
    }

    @Transactional
    public NhaSanXuatResponse anNhaSanXuat(long maNhaSanXuat) {
        NhaSanXuat nhaSanXuat = nhaSanXuatRepository.findById(maNhaSanXuat)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhà sản xuất"));

        nhaSanXuat.setTrangThai(false);

        NhaSanXuat updated = nhaSanXuatRepository.save(nhaSanXuat);

        return toResponse(updated);
    }

    @Transactional
    public NhaSanXuatResponse hienNhaSanXuat(long maNhaSanXuat) {
        NhaSanXuat nhaSanXuat = nhaSanXuatRepository.findById(maNhaSanXuat)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhà sản xuất"));

        nhaSanXuat.setTrangThai(true);

        NhaSanXuat updated = nhaSanXuatRepository.save(nhaSanXuat);

        return toResponse(updated);
    }

    private NhaSanXuatResponse toResponse(NhaSanXuat nhaSanXuat) {
        return NhaSanXuatResponse.builder()
                .maNhaSanXuat(nhaSanXuat.getMaNhaSanXuat())
                .tenNhaSanXuat(nhaSanXuat.getTenNhaSanXuat())
                .quocGia(nhaSanXuat.getQuocGia())
                .diaChi(nhaSanXuat.getDiaChi())
                .trangThai(nhaSanXuat.getTrangThai())
                .build();
    }
}