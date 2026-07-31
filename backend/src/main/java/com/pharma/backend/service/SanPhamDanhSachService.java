package com.pharma.backend.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.common.PageResponseDto;
import com.pharma.backend.dto.sanpham.SanPhamResponseDto;
import com.pharma.backend.entity.DanhMucSanPham;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.QuyDoiDonVi;
import com.pharma.backend.entity.SanPham;
import com.pharma.backend.repository.DanhMucSanPhamRepository;
import com.pharma.backend.repository.DonViSanPhamRepository;
import com.pharma.backend.repository.QuyDoiDonViRepository;
import com.pharma.backend.repository.SanPhamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SanPhamDanhSachService {

    private static final int SO_SAN_PHAM_TOI_DA_MOI_TRANG = 24;

    private final SanPhamRepository sanPhamRepository;
    private final DanhMucSanPhamRepository danhMucSanPhamRepository;
    private final DonViSanPhamRepository donViSanPhamRepository;
    private final QuyDoiDonViRepository quyDoiDonViRepository;
    private final SanPhamTimKiemSpecification sanPhamTimKiemSpecification;
    private final SanPhamMapper sanPhamMapper;

    @Transactional(readOnly = true)
    public PageResponseDto<SanPhamResponseDto> layDanhSachSanPhamKhachHang(
            String tuKhoa,
            String sapXep,
            BigDecimal giaTu,
            BigDecimal giaDen,
            Long maNhaSanXuat,
            Long maDanhMuc,
            int page,
            int size
    ) {
        String tuKhoaDaChuanHoa =
                sanPhamTimKiemSpecification.chuanHoaTuKhoaTimKiem(tuKhoa);

        List<String> danhSachThanhPhanTuKhoa =
                sanPhamTimKiemSpecification.tachThanhPhanTuKhoa(
                        tuKhoaDaChuanHoa
                );

        int pageHopLe = Math.max(page, 0);
        int sizeHopLe = Math.min(
                Math.max(size, 1),
                SO_SAN_PHAM_TOI_DA_MOI_TRANG
        );

        List<Long> danhSachMaDanhMucCanLoc =
                layDanhSachMaDanhMucCanLoc(maDanhMuc);

        Specification<SanPham> dieuKienLoc =
                sanPhamTimKiemSpecification.taoDieuKienLocSanPham(
                        giaTu,
                        giaDen,
                        maNhaSanXuat,
                        danhSachMaDanhMucCanLoc,
tuKhoaDaChuanHoa,
                        danhSachThanhPhanTuKhoa,
                        sapXep
                );

        Pageable pageable = PageRequest.of(
                pageHopLe,
                sizeHopLe,
                Sort.unsorted()
        );

        Page<SanPham> trangSanPham =
                sanPhamRepository.findAll(dieuKienLoc, pageable);

        List<SanPham> danhSachSanPham = trangSanPham.getContent();

        if (danhSachSanPham.isEmpty()) {
            return taoPageResponseRong(trangSanPham);
        }

        List<Long> danhSachMaSanPham = danhSachSanPham.stream()
                .map(SanPham::getMaSanPham)
                .toList();

        Map<Long, List<DonViSanPham>> donViBanTheoSanPham =
                donViSanPhamRepository
                        .findBySanPham_MaSanPhamInAndChoPhepBanTrueAndTrangThaiTrue(
                                danhSachMaSanPham
                        )
                        .stream()
                        .collect(Collectors.groupingBy(
                                donVi -> donVi.getSanPham().getMaSanPham()
                        ));

        Map<Long, List<QuyDoiDonVi>> quyDoiTheoSanPham =
                quyDoiDonViRepository
                        .findBySanPham_MaSanPhamInAndTrangThaiTrue(
                                danhSachMaSanPham
                        )
                        .stream()
                        .collect(Collectors.groupingBy(
                                quyDoi -> quyDoi.getSanPham().getMaSanPham()
                        ));

        List<SanPhamResponseDto> danhSachSanPhamDto =
                danhSachSanPham.stream()
                        .map(sanPham ->
                                sanPhamMapper.chuyenSangSanPhamResponseDto(
                                        sanPham,
                                        donViBanTheoSanPham.getOrDefault(
                                                sanPham.getMaSanPham(),
                                                Collections.emptyList()
                                        ),
                                        quyDoiTheoSanPham.getOrDefault(
                                                sanPham.getMaSanPham(),
                                                Collections.emptyList()
                                        )
                                )
                        )
                        .toList();

        return new PageResponseDto<>(
                danhSachSanPhamDto,
                trangSanPham.getNumber(),
                trangSanPham.getSize(),
                trangSanPham.getTotalElements(),
                trangSanPham.getTotalPages(),
                trangSanPham.isLast()
        );
    }

    private PageResponseDto<SanPhamResponseDto> taoPageResponseRong(
            Page<SanPham> trangSanPham
    ) {
        return new PageResponseDto<>(
                List.of(),
                trangSanPham.getNumber(),
trangSanPham.getSize(),
                trangSanPham.getTotalElements(),
                trangSanPham.getTotalPages(),
                trangSanPham.isLast()
        );
    }

    private List<Long> layDanhSachMaDanhMucCanLoc(Long maDanhMuc) {
        if (maDanhMuc == null) {
            return Collections.emptyList();
        }

        List<DanhMucSanPham> tatCaDanhMuc =
                danhMucSanPhamRepository.timDanhMucHienThiChoMenu();

        Map<Long, List<DanhMucSanPham>> danhMucConTheoMaCha =
                tatCaDanhMuc.stream()
                        .filter(danhMuc -> danhMuc.getDanhMucCha() != null)
                        .collect(Collectors.groupingBy(
                                danhMuc ->
                                        danhMuc.getDanhMucCha().getMaDanhMuc()
                        ));

        Set<Long> ketQua = new LinkedHashSet<>();

        themDanhMucVaDanhMucCon(
                maDanhMuc,
                danhMucConTheoMaCha,
                ketQua
        );

        return new ArrayList<>(ketQua);
    }

    private void themDanhMucVaDanhMucCon(
            Long maDanhMuc,
            Map<Long, List<DanhMucSanPham>> danhMucConTheoMaCha,
            Set<Long> ketQua
    ) {
        if (maDanhMuc == null || !ketQua.add(maDanhMuc)) {
            return;
        }

        List<DanhMucSanPham> danhSachDanhMucCon =
                danhMucConTheoMaCha.getOrDefault(
                        maDanhMuc,
                        Collections.emptyList()
                );

        for (DanhMucSanPham danhMucCon : danhSachDanhMucCon) {
            themDanhMucVaDanhMucCon(
                    danhMucCon.getMaDanhMuc(),
                    danhMucConTheoMaCha,
                    ketQua
            );
        }
    }
}
