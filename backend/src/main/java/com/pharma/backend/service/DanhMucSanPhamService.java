package com.pharma.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.danhmucsanpham.DanhMucSanPhamRequest;
import com.pharma.backend.dto.danhmucsanpham.DanhMucSanPhamResponse;
import com.pharma.backend.entity.DanhMucSanPham;
import com.pharma.backend.repository.DanhMucSanPhamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DanhMucSanPhamService {

    private final DanhMucSanPhamRepository danhMucSanPhamRepository;

    @Transactional(readOnly = true)
    public List<DanhMucSanPhamResponse> layDanhSachDanhMucSanPham() {
        return danhMucSanPhamRepository.findAllByOrderByThuTuHienThiAscTenDanhMucAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DanhMucSanPhamResponse layChiTietDanhMucSanPham(Long maDanhMuc) {
        DanhMucSanPham danhMuc = danhMucSanPhamRepository.findById(maDanhMuc)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục sản phẩm"));

        return toResponse(danhMuc);
    }

    @Transactional
    public DanhMucSanPhamResponse themDanhMucSanPham(DanhMucSanPhamRequest request) {
        if (danhMucSanPhamRepository.existsByTenDanhMuc(request.getTenDanhMuc())) {
            throw new IllegalArgumentException("Tên danh mục sản phẩm đã tồn tại");
        }

        DanhMucSanPham danhMucCha = layDanhMucCha(request.getMaDanhMucCha());

        DanhMucSanPham danhMuc = new DanhMucSanPham();
        danhMuc.setDanhMucCha(danhMucCha);
        danhMuc.setTenDanhMuc(request.getTenDanhMuc());
        danhMuc.setMoTa(request.getMoTa());
        danhMuc.setThuTuHienThi(request.getThuTuHienThi());
        danhMuc.setTrangThaiHienThi(true);

        DanhMucSanPham saved = danhMucSanPhamRepository.save(danhMuc);

        return toResponse(saved);
    }

    @Transactional
    public DanhMucSanPhamResponse capNhatDanhMucSanPham(
            Long maDanhMuc,
            DanhMucSanPhamRequest request
    ) {
        DanhMucSanPham danhMuc = danhMucSanPhamRepository.findById(maDanhMuc)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục sản phẩm"));

        boolean biTrungTen = danhMucSanPhamRepository.existsByTenDanhMucAndMaDanhMucNot(
                request.getTenDanhMuc(),
                maDanhMuc
        );

        if (biTrungTen) {
            throw new IllegalArgumentException("Tên danh mục sản phẩm đã tồn tại");
        }

        if (request.getMaDanhMucCha() != null && request.getMaDanhMucCha().equals(maDanhMuc)) {
            throw new IllegalArgumentException("Danh mục cha không được là chính nó");
        }

        DanhMucSanPham danhMucCha = layDanhMucCha(request.getMaDanhMucCha());

        danhMuc.setDanhMucCha(danhMucCha);
        danhMuc.setTenDanhMuc(request.getTenDanhMuc());
        danhMuc.setMoTa(request.getMoTa());
        danhMuc.setThuTuHienThi(request.getThuTuHienThi());

        DanhMucSanPham updated = danhMucSanPhamRepository.save(danhMuc);

        return toResponse(updated);
    }

    @Transactional
    public DanhMucSanPhamResponse anDanhMucSanPham(Long maDanhMuc) {
        DanhMucSanPham danhMuc = danhMucSanPhamRepository.findById(maDanhMuc)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục sản phẩm"));

        danhMuc.setTrangThaiHienThi(false);

        DanhMucSanPham updated = danhMucSanPhamRepository.save(danhMuc);

        return toResponse(updated);
    }

    @Transactional
    public DanhMucSanPhamResponse hienDanhMucSanPham(Long maDanhMuc) {
        DanhMucSanPham danhMuc = danhMucSanPhamRepository.findById(maDanhMuc)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục sản phẩm"));

        danhMuc.setTrangThaiHienThi(true);

        DanhMucSanPham updated = danhMucSanPhamRepository.save(danhMuc);

        return toResponse(updated);
    }

    private DanhMucSanPham layDanhMucCha(Long maDanhMucCha) {
        if (maDanhMucCha == null) {
            return null;
        }

        return danhMucSanPhamRepository.findById(maDanhMucCha)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục cha"));
    }

    private DanhMucSanPhamResponse toResponse(DanhMucSanPham danhMuc) {
        DanhMucSanPham danhMucCha = danhMuc.getDanhMucCha();

        return DanhMucSanPhamResponse.builder()
                .maDanhMuc(danhMuc.getMaDanhMuc())
                .maDanhMucCha(danhMucCha != null ? danhMucCha.getMaDanhMuc() : null)
                .tenDanhMucCha(danhMucCha != null ? danhMucCha.getTenDanhMuc() : null)
                .tenDanhMuc(danhMuc.getTenDanhMuc())
                .moTa(danhMuc.getMoTa())
                .thuTuHienThi(danhMuc.getThuTuHienThi())
                .trangThaiHienThi(danhMuc.getTrangThaiHienThi())
                .build();
    }
}