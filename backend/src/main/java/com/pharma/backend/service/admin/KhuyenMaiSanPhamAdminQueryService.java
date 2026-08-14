package com.pharma.backend.service.admin;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.admin.khuyenmai.KhuyenMaiSanPhamResponse;
import com.pharma.backend.entity.KhuyenMai;
import com.pharma.backend.entity.SanPham;
import com.pharma.backend.repository.KhuyenMaiRepository;
import com.pharma.backend.repository.KhuyenMaiSanPhamAdminRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KhuyenMaiSanPhamAdminQueryService {

    private static final String LOAI_KHUYEN_MAI_SAN_PHAM =
            "SAN_PHAM";

    private static final int KICH_THUOC_TRANG_MAC_DINH =
            10;

    private static final int KICH_THUOC_TRANG_TOI_DA =
            50;

    private final KhuyenMaiRepository khuyenMaiRepository;

    private final KhuyenMaiSanPhamAdminRepository
            khuyenMaiSanPhamAdminRepository;

    @Transactional(readOnly = true)
    public Page<KhuyenMaiSanPhamResponse>
            layDanhSachSanPhamCoTheGan(
                    Long maKhuyenMai,
                    String keyword,
                    int page,
                    int size
            ) {

        KhuyenMai khuyenMai =
                timKhuyenMaiTheoMa(
                        maKhuyenMai
                );

        kiemTraKhuyenMaiSanPham(
                khuyenMai
        );

        int trangHopLe =
                Math.max(
                        page,
                        0
                );

        int kichThuocHopLe =
                size <= 0
                        ? KICH_THUOC_TRANG_MAC_DINH
                        : Math.min(
                                size,
                                KICH_THUOC_TRANG_TOI_DA
                        );

        String tuKhoa =
                chuanHoaTuKhoa(
                        keyword
                );

        Long maSanPhamTimKiem =
                chuyenTuKhoaThanhMaSanPham(
                        tuKhoa
                );

        Set<Long> danhSachMaDangGan =
                khuyenMai
                        .getDanhSachSanPham()
                        .stream()
                        .map(
                                SanPham::getMaSanPham
                        )
                        .collect(
                                Collectors.toSet()
                        );

        PageRequest pageable =
                PageRequest.of(
                        trangHopLe,
                        kichThuocHopLe,
                        Sort.by(
                                Sort.Order.asc(
                                        "tenSanPham"
                                ),
                                Sort.Order.asc(
                                        "maSanPham"
                                )
                        )
                );

        return khuyenMaiSanPhamAdminRepository
                .timSanPhamCoTheGanKhuyenMai(
                        khuyenMai.getMaKhuyenMai(),
                        tuKhoa,
                        maSanPhamTimKiem,
                        khuyenMai.getThoiGianBatDau(),
                        khuyenMai.getThoiGianKetThuc(),
                        pageable
                )
                .map(
                        sanPham ->
                                toResponse(
                                        sanPham,
                                        danhSachMaDangGan.contains(
                                                sanPham.getMaSanPham()
                                        )
                                )
                );
    }

    private KhuyenMai timKhuyenMaiTheoMa(
            Long maKhuyenMai
    ) {
        return khuyenMaiRepository
                .findById(
                        maKhuyenMai
                )
                .orElseThrow(
                        () ->
                                new IllegalArgumentException(
                                        "Không tìm thấy chương trình khuyến mãi"
                                )
                );
    }

    private void kiemTraKhuyenMaiSanPham(
            KhuyenMai khuyenMai
    ) {
        if (
                khuyenMai.getLoaiKhuyenMai() == null
                        || !LOAI_KHUYEN_MAI_SAN_PHAM
                                .equalsIgnoreCase(
                                        khuyenMai.getLoaiKhuyenMai()
                                )
        ) {
            throw new IllegalArgumentException(
                    "Chương trình này không phải khuyến mãi sản phẩm"
            );
        }
    }

    private String chuanHoaTuKhoa(
            String keyword
    ) {
        if (
                keyword == null
                        || keyword.isBlank()
        ) {
            return null;
        }

        return keyword.trim();
    }

    private Long chuyenTuKhoaThanhMaSanPham(
            String keyword
    ) {
        if (keyword == null) {
            return null;
        }

        try {
            return Long.valueOf(
                    keyword
            );
        } catch (NumberFormatException exception) {
            return null;
        }
    }

    private KhuyenMaiSanPhamResponse toResponse(
            SanPham sanPham,
            boolean dangDuocGan
    ) {
        return KhuyenMaiSanPhamResponse
                .builder()
                .maSanPham(
                        sanPham.getMaSanPham()
                )
                .tenSanPham(
                        sanPham.getTenSanPham()
                )
                .laThuocKeDon(
                        sanPham.getLaThuocKeDon()
                )
                .trangThaiSanPham(
                        sanPham.getTrangThaiSanPham()
                )
                .dangDuocGan(
                        dangDuocGan
                )
                .build();
    }
}