package com.pharma.backend.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.common.PhanTrangResponse;
import com.pharma.backend.dto.sanpham.SanPhamRequest;
import com.pharma.backend.dto.sanpham.SanPhamResponse;
import com.pharma.backend.entity.DanhMucSanPham;
import com.pharma.backend.entity.NhaSanXuat;
import com.pharma.backend.entity.SanPham;
import com.pharma.backend.repository.DanhMucSanPhamRepository;
import com.pharma.backend.repository.NhaSanXuatRepository;
import com.pharma.backend.repository.SanPhamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SanPhamService {

    private final SanPhamRepository sanPhamRepository;
    private final DanhMucSanPhamRepository danhMucSanPhamRepository;
    private final NhaSanXuatRepository nhaSanXuatRepository;
    private final DonViSanPhamService donViSanPhamService;
    private final QuyDoiDonViService quyDoiDonViService;

    @Transactional(readOnly = true)
    public List<SanPhamResponse> layDanhSachSanPham() {
        return sanPhamRepository.findAllByOrderByNgayTaoDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PhanTrangResponse<SanPhamResponse> layDanhSachSanPhamPhanTrang(
            int page,
            int size,
            String keyword,
            Boolean laThuocKeDon,
            Boolean trangThaiSanPham,
            Long maDanhMuc,
            Long maNhaSanXuat
    ) {
        if (page < 0) {
            page = 0;
        }

        if (size <= 0) {
            size = 10;
        }

        if (size > 50) {
            size = 50;
        }

        String keywordDaXuLy = null;

        if (keyword != null && !keyword.trim().isEmpty()) {
            keywordDaXuLy = keyword.trim();
        }

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "ngayTao")
        );

        Page<SanPham> sanPhamPage = sanPhamRepository.timKiemVaLocSanPham(
                keywordDaXuLy,
                laThuocKeDon,
                trangThaiSanPham,
                maDanhMuc,
                maNhaSanXuat,
                pageable
        );

        return PhanTrangResponse.<SanPhamResponse>builder()
                .content(
                        sanPhamPage.getContent()
                                .stream()
                                .map(this::toResponse)
                                .toList()
                )
                .page(sanPhamPage.getNumber())
                .size(sanPhamPage.getSize())
                .totalElements(sanPhamPage.getTotalElements())
                .totalPages(sanPhamPage.getTotalPages())
                .first(sanPhamPage.isFirst())
                .last(sanPhamPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public SanPhamResponse layChiTietSanPham(long maSanPham) {
        SanPham sanPham = sanPhamRepository.findById(maSanPham)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm"));

        return toResponse(sanPham);
    }

    @Transactional(readOnly = true)
    public SanPhamResponse layChiTietSanPhamDayDu(long maSanPham) {
        SanPham sanPham = sanPhamRepository.findById(maSanPham)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm"));

        return SanPhamResponse.builder()
                .maSanPham(sanPham.getMaSanPham())
                .maDanhMuc(sanPham.getDanhMuc() != null ? sanPham.getDanhMuc().getMaDanhMuc() : null)
                .tenDanhMuc(sanPham.getDanhMuc() != null ? sanPham.getDanhMuc().getTenDanhMuc() : null)
                .maNhaSanXuat(sanPham.getNhaSanXuat() != null ? sanPham.getNhaSanXuat().getMaNhaSanXuat() : null)
                .tenNhaSanXuat(sanPham.getNhaSanXuat() != null ? sanPham.getNhaSanXuat().getTenNhaSanXuat() : null)
                .tenSanPham(sanPham.getTenSanPham())
                .hinhAnh(sanPham.getHinhAnh())
                .laThuocKeDon(sanPham.getLaThuocKeDon())
                .trangThaiSanPham(sanPham.getTrangThaiSanPham())
                .moTaNgan(sanPham.getMoTaNgan())
                .moTa(sanPham.getMoTa())
                .ngayTao(sanPham.getNgayTao())
                .danhSachDonViSanPham(
                        donViSanPhamService.layDanhSachDonViTheoSanPham(maSanPham)
                )
                .danhSachQuyDoiDonVi(
                        quyDoiDonViService.layDanhSachQuyDoiTheoSanPham(maSanPham)
                )
                .build();
    }

    @Transactional
    public SanPhamResponse themSanPham(SanPhamRequest request) {
        if (sanPhamRepository.existsByTenSanPham(request.getTenSanPham())) {
            throw new IllegalArgumentException("Tên sản phẩm đã tồn tại");
        }

        DanhMucSanPham danhMuc = layDanhMuc(request.getMaDanhMuc());
        NhaSanXuat nhaSanXuat = layNhaSanXuat(request.getMaNhaSanXuat());

        SanPham sanPham = new SanPham();
        sanPham.setDanhMuc(danhMuc);
        sanPham.setNhaSanXuat(nhaSanXuat);
        sanPham.setTenSanPham(request.getTenSanPham());
        sanPham.setHinhAnh(request.getHinhAnh());
        sanPham.setLaThuocKeDon(request.getLaThuocKeDon() != null ? request.getLaThuocKeDon() : false);
        sanPham.setMoTaNgan(request.getMoTaNgan());
        sanPham.setMoTa(request.getMoTa());
        sanPham.setTrangThaiSanPham(true);

        SanPham saved = sanPhamRepository.save(sanPham);

        return toResponse(saved);
    }

    @Transactional
    public SanPhamResponse capNhatSanPham(long maSanPham, SanPhamRequest request) {
        SanPham sanPham = sanPhamRepository.findById(maSanPham)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm"));

        boolean biTrungTen = sanPhamRepository.existsByTenSanPhamAndMaSanPhamNot(
                request.getTenSanPham(),
                maSanPham
        );

        if (biTrungTen) {
            throw new IllegalArgumentException("Tên sản phẩm đã tồn tại");
        }

        DanhMucSanPham danhMuc = layDanhMuc(request.getMaDanhMuc());
        NhaSanXuat nhaSanXuat = layNhaSanXuat(request.getMaNhaSanXuat());

        sanPham.setDanhMuc(danhMuc);
        sanPham.setNhaSanXuat(nhaSanXuat);
        sanPham.setTenSanPham(request.getTenSanPham());
        sanPham.setHinhAnh(request.getHinhAnh());
        sanPham.setLaThuocKeDon(request.getLaThuocKeDon() != null ? request.getLaThuocKeDon() : false);
        sanPham.setMoTaNgan(request.getMoTaNgan());
        sanPham.setMoTa(request.getMoTa());
        SanPham updated = sanPhamRepository.save(sanPham);

        return toResponse(updated);
    }

    @Transactional
    public SanPhamResponse anSanPham(long maSanPham) {
        SanPham sanPham = sanPhamRepository.findById(maSanPham)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm"));

        sanPham.setTrangThaiSanPham(false);

        SanPham updated = sanPhamRepository.save(sanPham);

        return toResponse(updated);
    }

    @Transactional
    public SanPhamResponse hienSanPham(long maSanPham) {
        SanPham sanPham = sanPhamRepository.findById(maSanPham)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy sản phẩm"));

        sanPham.setTrangThaiSanPham(true);

        SanPham updated = sanPhamRepository.save(sanPham);

        return toResponse(updated);
    }

    private DanhMucSanPham layDanhMuc(Long maDanhMuc) {
        if (maDanhMuc == null) {
            throw new IllegalArgumentException("Danh mục sản phẩm không được để trống");
        }

        return danhMucSanPhamRepository.findById(maDanhMuc)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục sản phẩm"));
    }

    private NhaSanXuat layNhaSanXuat(Long maNhaSanXuat) {
        if (maNhaSanXuat == null) {
            return null;
        }

        return nhaSanXuatRepository.findById(maNhaSanXuat)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy nhà sản xuất"));
    }

    private SanPhamResponse toResponse(SanPham sanPham) {
        DanhMucSanPham danhMuc = sanPham.getDanhMuc();
        NhaSanXuat nhaSanXuat = sanPham.getNhaSanXuat();

        return SanPhamResponse.builder()
                .maSanPham(sanPham.getMaSanPham())
                .maDanhMuc(danhMuc != null ? danhMuc.getMaDanhMuc() : null)
                .tenDanhMuc(danhMuc != null ? danhMuc.getTenDanhMuc() : null)
                .maNhaSanXuat(nhaSanXuat != null ? nhaSanXuat.getMaNhaSanXuat() : null)
                .tenNhaSanXuat(nhaSanXuat != null ? nhaSanXuat.getTenNhaSanXuat() : null)
                .tenSanPham(sanPham.getTenSanPham())
                .hinhAnh(sanPham.getHinhAnh())
                .laThuocKeDon(sanPham.getLaThuocKeDon())
                .trangThaiSanPham(sanPham.getTrangThaiSanPham())
                .moTaNgan(sanPham.getMoTaNgan())
                .moTa(sanPham.getMoTa())
                .ngayTao(sanPham.getNgayTao())
                .build();
    }
}