package com.pharma.backend.service.duocsi;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.common.PhanTrangResponse;
import com.pharma.backend.dto.duocsi.sanpham.DonViBanDuocSiResponse;
import com.pharma.backend.dto.duocsi.sanpham.SanPhamDuocSiResponse;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.QuyDoiDonVi;
import com.pharma.backend.entity.SanPham;
import com.pharma.backend.repository.DonViSanPhamRepository;
import com.pharma.backend.repository.SanPhamRepository;
import com.pharma.backend.service.khachhang.KetQuaTinhGiaSanPham;
import com.pharma.backend.service.khachhang.TinhGiaSanPhamService;
import com.pharma.backend.service.khachhang.TonKhoSanPhamService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SanPhamDuocSiService {

    private static final int SO_SAN_PHAM_TOI_DA_MOI_TRANG = 20;

    private final SanPhamRepository sanPhamRepository;
    private final DonViSanPhamRepository donViSanPhamRepository;
    private final TonKhoSanPhamService tonKhoSanPhamService;
    private final TinhGiaSanPhamService tinhGiaSanPhamService;

    @Transactional(readOnly = true)
    public PhanTrangResponse<SanPhamDuocSiResponse> layDanhSachSanPhamPhanTrang(
            int page,
            int size,
            String keyword) {
        int pageHopLe = Math.max(page, 0);
        int sizeHopLe = Math.min(Math.max(size, 1), SO_SAN_PHAM_TOI_DA_MOI_TRANG);
        String keywordDaXuLy = chuanHoaTuKhoa(keyword);

        Pageable pageable = PageRequest.of(
                pageHopLe,
                sizeHopLe,
                Sort.by(Sort.Direction.ASC, "tenSanPham"));

        Page<SanPham> trangSanPham = sanPhamRepository.timKiemSanPhamCoTheBanChoDuocSi(
                keywordDaXuLy,
                pageable);

        List<SanPham> danhSachSanPham = trangSanPham.getContent();

        if (danhSachSanPham.isEmpty()) {
            return taoPhanTrangRong(trangSanPham);
        }

        List<Long> danhSachMaSanPham = danhSachSanPham.stream()
                .map(SanPham::getMaSanPham)
                .toList();

        Map<Long, List<DonViSanPham>> donViTheoSanPham = donViSanPhamRepository
                .findBySanPham_MaSanPhamInAndChoPhepBanTrueAndTrangThaiTrue(danhSachMaSanPham)
                .stream()
                .collect(Collectors.groupingBy(
                        donVi -> donVi.getSanPham().getMaSanPham(),
                        LinkedHashMap::new,
                        Collectors.toList()));

        Map<Long, List<QuyDoiDonVi>> quyDoiTheoSanPham = tonKhoSanPhamService
                .layQuyDoiTheoDanhSachSanPham(danhSachMaSanPham);

        Map<Long, BigDecimal> tonTheoSanPham = tonKhoSanPhamService
                .layTonKhaDungTheoDanhSachSanPham(danhSachMaSanPham);

        List<DonViSanPham> tatCaDonViBan = danhSachSanPham.stream()
                .flatMap(sanPham -> donViTheoSanPham
                        .getOrDefault(sanPham.getMaSanPham(), List.of())
                        .stream())
                .toList();

        Map<Long, KetQuaTinhGiaSanPham> ketQuaGiaTheoDonVi = tinhGiaSanPhamService
                .tinhGiaTheoDanhSachDonVi(tatCaDonViBan, LocalDateTime.now());

        List<SanPhamDuocSiResponse> noiDung = danhSachSanPham.stream()
                .map(sanPham -> toResponse(
                        sanPham,
                        donViTheoSanPham.getOrDefault(sanPham.getMaSanPham(), List.of()),
                        quyDoiTheoSanPham.getOrDefault(sanPham.getMaSanPham(), List.of()),
                        tonTheoSanPham.getOrDefault(sanPham.getMaSanPham(), BigDecimal.ZERO),
                        ketQuaGiaTheoDonVi))
                .toList();

        return PhanTrangResponse.<SanPhamDuocSiResponse>builder()
                .content(noiDung)
                .page(trangSanPham.getNumber())
                .size(trangSanPham.getSize())
                .totalElements(trangSanPham.getTotalElements())
                .totalPages(trangSanPham.getTotalPages())
                .first(trangSanPham.isFirst())
                .last(trangSanPham.isLast())
                .build();
    }

    private SanPhamDuocSiResponse toResponse(
            SanPham sanPham,
            List<DonViSanPham> danhSachDonVi,
            List<QuyDoiDonVi> danhSachQuyDoi,
            BigDecimal tonKhaDung,
            Map<Long, KetQuaTinhGiaSanPham> ketQuaGiaTheoDonVi) {
        List<DonViBanDuocSiResponse> danhSachDonViResponse = danhSachDonVi.stream()
                .map(donVi -> toDonViResponse(
                        donVi,
                        danhSachQuyDoi,
                        tonKhaDung,
                        ketQuaGiaTheoDonVi))
                .toList();

        return SanPhamDuocSiResponse.builder()
                .maSanPham(sanPham.getMaSanPham())
                .tenSanPham(sanPham.getTenSanPham())
                .hinhAnh(sanPham.getHinhAnh())
                .laThuocKeDon(sanPham.getLaThuocKeDon())
                .danhSachDonViBan(danhSachDonViResponse)
                .build();
    }

    private DonViBanDuocSiResponse toDonViResponse(
            DonViSanPham donViSanPham,
            List<QuyDoiDonVi> danhSachQuyDoi,
            BigDecimal tonKhaDung,
            Map<Long, KetQuaTinhGiaSanPham> ketQuaGiaTheoDonVi) {
        KetQuaTinhGiaSanPham ketQuaGia = ketQuaGiaTheoDonVi.get(donViSanPham.getMaDonViSanPham());

        if (ketQuaGia == null) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Không tìm thấy kết quả tính giá của đơn vị sản phẩm.");
        }

        BigDecimal heSoQuyDoi = tonKhoSanPhamService.tinhHeSoVeDonViCoSo(
                donViSanPham,
                danhSachQuyDoi);

        int soLuongToiDa = tonKhoSanPhamService.tinhSoLuongToiDaCoTheBan(
                tonKhaDung,
                heSoQuyDoi);

        return DonViBanDuocSiResponse.builder()
                .maDonViSanPham(donViSanPham.getMaDonViSanPham())
                .maDonViTinh(donViSanPham.getDonViTinh().getMaDonViTinh())
                .tenDonViTinh(donViSanPham.getDonViTinh().getTenDonViTinh())
                .kyHieu(donViSanPham.getDonViTinh().getKyHieu())
                .giaGoc(ketQuaGia.giaGoc())
                .giaSauKhuyenMai(ketQuaGia.giaSauKhuyenMai())
                .cachTinhGia(ketQuaGia.cachTinhGia())
                .laDonViCoSo(donViSanPham.getLaDonViCoSo())
                .laDonViBanMacDinh(donViSanPham.getLaDonViBanMacDinh())
                .soLuongToiDa(soLuongToiDa)
                .build();
    }

    private PhanTrangResponse<SanPhamDuocSiResponse> taoPhanTrangRong(Page<SanPham> trangSanPham) {
        return PhanTrangResponse.<SanPhamDuocSiResponse>builder()
                .content(List.of())
                .page(trangSanPham.getNumber())
                .size(trangSanPham.getSize())
                .totalElements(trangSanPham.getTotalElements())
                .totalPages(trangSanPham.getTotalPages())
                .first(trangSanPham.isFirst())
                .last(trangSanPham.isLast())
                .build();
    }

    private String chuanHoaTuKhoa(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            return null;
        }

        return keyword.trim();
    }
}
