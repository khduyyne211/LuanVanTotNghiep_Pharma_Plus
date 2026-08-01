package com.pharma.backend.service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.sanpham.SanPhamBanChayResponseDto;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.QuyDoiDonVi;
import com.pharma.backend.entity.SanPham;
import com.pharma.backend.enums.donhang.TrangThaiDonHang;
import com.pharma.backend.repository.ChiTietDonHangRepository;
import com.pharma.backend.repository.ChiTietDonHangRepository.SanPhamBanChayProjection;
import com.pharma.backend.repository.DonViSanPhamRepository;
import com.pharma.backend.repository.QuyDoiDonViRepository;
import com.pharma.backend.repository.SanPhamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SanPhamBanChayService {

    private static final int GIOI_HAN_TOI_DA = 24;

    private final ChiTietDonHangRepository chiTietDonHangRepository;
    private final SanPhamRepository sanPhamRepository;
    private final DonViSanPhamRepository donViSanPhamRepository;
    private final QuyDoiDonViRepository quyDoiDonViRepository;
    private final SanPhamMapper sanPhamMapper;

    @Transactional(readOnly = true)
    public List<SanPhamBanChayResponseDto> laySanPhamBanChay(
            int gioiHan
    ) {
        kiemTraGioiHan(gioiHan);

        Pageable pageable = PageRequest.of(0, gioiHan);

        List<SanPhamBanChayProjection> danhSachBanChay =
                chiTietDonHangRepository.timSanPhamBanChay(
                        TrangThaiDonHang.HOAN_THANH,
                        pageable
                );

        if (danhSachBanChay.isEmpty()) {
            return List.of();
        }

        List<Long> danhSachMaSanPham = danhSachBanChay.stream()
                .map(SanPhamBanChayProjection::getMaSanPham)
                .toList();

        Map<Long, SanPham> sanPhamTheoMa =
                sanPhamRepository.timSanPhamTheoDanhSachMa(
                        danhSachMaSanPham,
                        true
                )
                .stream()
                .collect(Collectors.toMap(
                        SanPham::getMaSanPham,
                        sanPham -> sanPham
                ));

        Map<Long, List<DonViSanPham>> donViBanTheoSanPham =
                donViSanPhamRepository
                        .findBySanPham_MaSanPhamInAndChoPhepBanTrueAndTrangThaiTrue(
                                danhSachMaSanPham
                        )
                        .stream()
.collect(Collectors.groupingBy(
                                donVi ->
                                        donVi.getSanPham().getMaSanPham()
                        ));

        Map<Long, List<QuyDoiDonVi>> quyDoiTheoSanPham =
                quyDoiDonViRepository
                        .findBySanPham_MaSanPhamInAndTrangThaiTrue(
                                danhSachMaSanPham
                        )
                        .stream()
                        .collect(Collectors.groupingBy(
                                quyDoi ->
                                        quyDoi.getSanPham().getMaSanPham()
                        ));

        return danhSachBanChay.stream()
                .filter(thongKe ->
                        sanPhamTheoMa.containsKey(
                                thongKe.getMaSanPham()
                        )
                )
                .map(thongKe -> chuyenSangResponse(
                        sanPhamTheoMa.get(thongKe.getMaSanPham()),
                        thongKe.getTongSoLuongDaBan(),
                        donViBanTheoSanPham,
                        quyDoiTheoSanPham
                ))
                .toList();
    }

    private SanPhamBanChayResponseDto chuyenSangResponse(
            SanPham sanPham,
            Long tongSoLuongDaBan,
            Map<Long, List<DonViSanPham>> donViBanTheoSanPham,
            Map<Long, List<QuyDoiDonVi>> quyDoiTheoSanPham
    ) {
        Long maSanPham = sanPham.getMaSanPham();

        return new SanPhamBanChayResponseDto(
                sanPhamMapper.chuyenSangSanPhamResponseDto(
                        sanPham,
                        donViBanTheoSanPham.getOrDefault(
                                maSanPham,
                                Collections.emptyList()
                        ),
                        quyDoiTheoSanPham.getOrDefault(
                                maSanPham,
                                Collections.emptyList()
                        )
                ),
                tongSoLuongDaBan
        );
    }

    private void kiemTraGioiHan(int gioiHan) {
        if (gioiHan < 1 || gioiHan > GIOI_HAN_TOI_DA) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Giới hạn sản phẩm bán chạy phải từ 1 đến 24."
            );
        }
    }
}
