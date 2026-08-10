package com.pharma.backend.service.admin;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.admin.danhmucsanpham.DanhMucSanPhamRequest;
import com.pharma.backend.dto.admin.danhmucsanpham.DanhMucSanPhamResponse;
import com.pharma.backend.entity.DanhMucSanPham;
import com.pharma.backend.repository.DanhMucSanPhamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DanhMucSanPhamService {

    private final DanhMucSanPhamRepository danhMucSanPhamRepository;

    @Transactional(readOnly = true)
    public List<DanhMucSanPhamResponse> layDanhSachDanhMucSanPham() {
        return danhMucSanPhamRepository
                .findAllByOrderByThuTuHienThiAscTenDanhMucAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public DanhMucSanPhamResponse layChiTietDanhMucSanPham(long maDanhMuc) {
        DanhMucSanPham danhMuc = danhMucSanPhamRepository
                .findById(maDanhMuc)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy danh mục sản phẩm"
                ));

        return toResponse(danhMuc);
    }

    @Transactional
    public DanhMucSanPhamResponse themDanhMucSanPham(
            DanhMucSanPhamRequest request
    ) {
        if (danhMucSanPhamRepository.existsByTenDanhMuc(
                request.getTenDanhMuc()
        )) {
            throw new IllegalArgumentException(
                    "Tên danh mục sản phẩm đã tồn tại"
            );
        }

        DanhMucSanPham danhMucCha =
                layDanhMucCha(request.getMaDanhMucCha());

        DanhMucSanPham danhMuc = new DanhMucSanPham();
        danhMuc.setDanhMucCha(danhMucCha);
        danhMuc.setTenDanhMuc(request.getTenDanhMuc());
        danhMuc.setMoTa(request.getMoTa());
        danhMuc.setThuTuHienThi(request.getThuTuHienThi());
        danhMuc.setTrangThaiHienThi(true);

        return toResponse(danhMucSanPhamRepository.save(danhMuc));
    }

    @Transactional
    public DanhMucSanPhamResponse capNhatDanhMucSanPham(
            long maDanhMuc,
            DanhMucSanPhamRequest request
    ) {
        DanhMucSanPham danhMuc = danhMucSanPhamRepository
                .findById(maDanhMuc)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy danh mục sản phẩm"
                ));

        boolean biTrungTen =
                danhMucSanPhamRepository
                        .existsByTenDanhMucAndMaDanhMucNot(
                                request.getTenDanhMuc(),
                                maDanhMuc
                        );

        if (biTrungTen) {
            throw new IllegalArgumentException(
                    "Tên danh mục sản phẩm đã tồn tại"
            );
        }

        if (request.getMaDanhMucCha() != null
                && request.getMaDanhMucCha().equals(maDanhMuc)) {
            throw new IllegalArgumentException(
                    "Danh mục cha không được là chính nó"
            );
        }

        DanhMucSanPham danhMucCha =
                layDanhMucCha(request.getMaDanhMucCha());

        danhMuc.setDanhMucCha(danhMucCha);
        danhMuc.setTenDanhMuc(request.getTenDanhMuc());
        danhMuc.setMoTa(request.getMoTa());
        danhMuc.setThuTuHienThi(request.getThuTuHienThi());

        return toResponse(danhMucSanPhamRepository.save(danhMuc));
    }

    @Transactional
    public DanhMucSanPhamResponse anDanhMucSanPham(long maDanhMuc) {
        DanhMucSanPham danhMuc = danhMucSanPhamRepository
                .findById(maDanhMuc)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy danh mục sản phẩm"
                ));

        danhMuc.setTrangThaiHienThi(false);

        return toResponse(danhMucSanPhamRepository.save(danhMuc));
    }

    @Transactional
    public DanhMucSanPhamResponse hienDanhMucSanPham(long maDanhMuc) {
        DanhMucSanPham danhMuc = danhMucSanPhamRepository
                .findById(maDanhMuc)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy danh mục sản phẩm"
                ));

        danhMuc.setTrangThaiHienThi(true);

        return toResponse(danhMucSanPhamRepository.save(danhMuc));
    }

    private DanhMucSanPham layDanhMucCha(Long maDanhMucCha) {
        if (maDanhMucCha == null) {
            return null;
        }

        return danhMucSanPhamRepository
                .findById(maDanhMucCha)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy danh mục cha"
                ));
    }

    private DanhMucSanPhamResponse toResponse(DanhMucSanPham danhMuc) {
        DanhMucSanPham danhMucCha = danhMuc.getDanhMucCha();

        return DanhMucSanPhamResponse.builder()
                .maDanhMuc(danhMuc.getMaDanhMuc())
                .maDanhMucCha(
                        danhMucCha != null
                                ? danhMucCha.getMaDanhMuc()
                                : null
                )
                .tenDanhMucCha(
                        danhMucCha != null
                                ? danhMucCha.getTenDanhMuc()
                                : null
                )
                .tenDanhMuc(danhMuc.getTenDanhMuc())
                .moTa(danhMuc.getMoTa())
                .thuTuHienThi(danhMuc.getThuTuHienThi())
                .trangThaiHienThi(danhMuc.getTrangThaiHienThi())
                .build();
    }
}