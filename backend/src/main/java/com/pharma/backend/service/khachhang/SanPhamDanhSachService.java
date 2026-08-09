package com.pharma.backend.service.khachhang;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.common.PageResponseDto;
import com.pharma.backend.dto.khachhang.sanpham.SanPhamResponseDto;
import com.pharma.backend.entity.DanhMucSanPham;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.QuyDoiDonVi;
import com.pharma.backend.entity.SanPham;
import com.pharma.backend.repository.DanhMucSanPhamRepository;
import com.pharma.backend.repository.DonViSanPhamRepository;
import com.pharma.backend.repository.SanPhamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SanPhamDanhSachService {

    private static final int SO_SAN_PHAM_TOI_DA_MOI_TRANG = 24;

    private static final String SAP_XEP_GIA_TANG_DAN =
            "GIA_TANG_DAN";

    private static final String SAP_XEP_GIA_GIAM_DAN =
            "GIA_GIAM_DAN";

    private final SanPhamRepository sanPhamRepository;

    private final DanhMucSanPhamRepository
            danhMucSanPhamRepository;

    private final DonViSanPhamRepository
            donViSanPhamRepository;

    private final SanPhamTimKiemSpecification
            sanPhamTimKiemSpecification;

    private final DieuKienHienThiSanPhamKhachHangService
            dieuKienHienThiSanPhamKhachHangService;

    private final TonKhoSanPhamService
            tonKhoSanPhamService;

    private final TinhGiaSanPhamService
            tinhGiaSanPhamService;

    private final SanPhamMapper sanPhamMapper;

    @Transactional(readOnly = true)
    public PageResponseDto<SanPhamResponseDto>
            layDanhSachSanPhamKhachHang(
                    String tuKhoa,
                    String sapXep,
                    BigDecimal giaTu,
                    BigDecimal giaDen,
                    Long maNhaSanXuat,
                    Long maDanhMuc,
                    int page,
                    int size
            ) {
        kiemTraKhoangGia(giaTu, giaDen);

        String tuKhoaDaChuanHoa =
                sanPhamTimKiemSpecification
                        .chuanHoaTuKhoaTimKiem(tuKhoa);

        List<String> danhSachThanhPhanTuKhoa =
                sanPhamTimKiemSpecification
                        .tachThanhPhanTuKhoa(
                                tuKhoaDaChuanHoa
                        );

        int pageHopLe = Math.max(page, 0);

        int sizeHopLe = Math.min(
                Math.max(size, 1),
                SO_SAN_PHAM_TOI_DA_MOI_TRANG
        );

        List<Long> danhSachMaDanhMucCanLoc =
                layDanhSachMaDanhMucCanLoc(
                        maDanhMuc
                );

        Specification<SanPham> dieuKienLoc =
                sanPhamTimKiemSpecification
                        .taoDieuKienLocSanPham(
                                maNhaSanXuat,
                                danhSachMaDanhMucCanLoc,
                                tuKhoaDaChuanHoa,
                                danhSachThanhPhanTuKhoa
                        );

        /*
         * Chưa phân trang ở database vì tồn kho và giá khuyến mãi
         * phải được tính trước khi lọc, sắp xếp và phân trang.
         */
        Page<SanPham> ketQuaTimKiem =
                sanPhamRepository.findAll(
                        dieuKienLoc,
                        Pageable.unpaged()
                );

        List<SanPham> danhSachUngVien =
                ketQuaTimKiem.getContent();

        if (danhSachUngVien.isEmpty()) {
            return taoPageResponseRong(
                    pageHopLe,
                    sizeHopLe
            );
        }

        List<Long> danhSachMaUngVien =
                danhSachUngVien.stream()
                        .map(SanPham::getMaSanPham)
                        .toList();

        Map<Long, List<DonViSanPham>>
                donViBanTheoSanPham =
                donViSanPhamRepository
                        .findBySanPham_MaSanPhamInAndChoPhepBanTrueAndTrangThaiTrue(
                                danhSachMaUngVien
                        )
                        .stream()
                        .collect(Collectors.groupingBy(
                                donVi ->
                                        donVi.getSanPham()
                                                .getMaSanPham(),
                                LinkedHashMap::new,
                                Collectors.toList()
                        ));

        /*
         * Lọc tiếp theo quy tắc dùng chung:
         * - sản phẩm hoạt động;
         * - danh mục và danh mục cha hiển thị;
         * - nhà sản xuất hoạt động;
         * - có đơn vị bán hợp lệ;
         * - đúng một đơn vị bán mặc định hợp lệ.
         */
        List<SanPham> danhSachSanPhamHopLe =
                danhSachUngVien.stream()
                        .filter(sanPham ->
                                dieuKienHienThiSanPhamKhachHangService
                                        .duDieuKienHienThi(
                                                sanPham,
                                                donViBanTheoSanPham
                                                        .getOrDefault(
                                                                sanPham.getMaSanPham(),
                                                                List.of()
                                                        )
                                        )
                        )
                        .toList();

        if (danhSachSanPhamHopLe.isEmpty()) {
            return taoPageResponseRong(
                    pageHopLe,
                    sizeHopLe
            );
        }

        List<Long> danhSachMaSanPhamHopLe =
                danhSachSanPhamHopLe.stream()
                        .map(SanPham::getMaSanPham)
                        .toList();

        Map<Long, List<QuyDoiDonVi>>
                quyDoiTheoSanPham =
                tonKhoSanPhamService
                        .layQuyDoiTheoDanhSachSanPham(
                                danhSachMaSanPhamHopLe
                        );

        Map<Long, BigDecimal> tonTheoSanPham =
                tonKhoSanPhamService
                        .layTonKhaDungTheoDanhSachSanPham(
                                danhSachMaSanPhamHopLe
                        );

        List<DonViSanPham> tatCaDonViBanHopLe =
                danhSachMaSanPhamHopLe.stream()
                        .flatMap(maSanPham ->
                                donViBanTheoSanPham
                                        .getOrDefault(
                                                maSanPham,
                                                List.of()
                                        )
                                        .stream()
                        )
                        .toList();

        /*
         * Tất cả sản phẩm trong lần tải danh sách dùng chung
         * một thời điểm tính giá.
         */
        LocalDateTime thoiDiemTinhGia =
                LocalDateTime.now();

        Map<Long, KetQuaTinhGiaSanPham>
                ketQuaGiaTheoDonVi =
                tinhGiaSanPhamService
                        .tinhGiaTheoDanhSachDonVi(
                                tatCaDonViBanHopLe,
                                thoiDiemTinhGia
                        );

        List<SanPhamDaXuLy> danhSachDaXuLy =
                new ArrayList<>();

        for (int viTri = 0;
                viTri < danhSachSanPhamHopLe.size();
                viTri++) {
            SanPham sanPham =
                    danhSachSanPhamHopLe.get(viTri);

            Long maSanPham =
                    sanPham.getMaSanPham();

            List<DonViSanPham> danhSachDonViBan =
                    donViBanTheoSanPham.getOrDefault(
                            maSanPham,
                            List.of()
                    );

            List<QuyDoiDonVi> danhSachQuyDoi =
                    quyDoiTheoSanPham.getOrDefault(
                            maSanPham,
                            List.of()
                    );

            BigDecimal tonKhaDung =
                    tonTheoSanPham.getOrDefault(
                            maSanPham,
                            BigDecimal.ZERO
                    );

            Map<Long, Integer> soLuongToiDaTheoDonVi =
                    tinhSoLuongToiDaTheoDonVi(
                            danhSachDonViBan,
                            danhSachQuyDoi,
                            tonKhaDung
                    );

            SanPhamResponseDto sanPhamDto =
                    sanPhamMapper
                            .chuyenSangSanPhamResponseDto(
                                    sanPham,
                                    danhSachDonViBan,
                                    danhSachQuyDoi,
                                    ketQuaGiaTheoDonVi,
                                    soLuongToiDaTheoDonVi
                            );

            danhSachDaXuLy.add(
                    new SanPhamDaXuLy(
                            viTri,
                            sanPhamDto
                    )
            );
        }

        /*
         * Lọc giá sau khi đã:
         * - chọn đúng đơn vị đại diện;
         * - tính tồn kho;
         * - tính giá sau khuyến mãi.
         */
        List<SanPhamDaXuLy> danhSachSauLocGia =
                danhSachDaXuLy.stream()
                        .filter(sanPhamDaXuLy ->
                                namTrongKhoangGia(
                                        sanPhamDaXuLy
                                                .sanPhamDto()
                                                .getGiaBan(),
                                        giaTu,
                                        giaDen
                                )
                        )
                        .collect(Collectors.toCollection(
                                ArrayList::new
                        ));

        /*
         * Luôn ưu tiên còn hàng trước.
         *
         * Khi không sắp theo giá, thứ tự ban đầu từ Specification
         * được giữ lại:
         * - tìm kiếm: theo điểm liên quan;
         * - không tìm kiếm: mã sản phẩm giảm dần.
         */
        danhSachSauLocGia.sort(
                taoBoSoSanhSanPham(sapXep)
        );

        return taoPageResponse(
                danhSachSauLocGia,
                pageHopLe,
                sizeHopLe
        );
    }

    private Map<Long, Integer> tinhSoLuongToiDaTheoDonVi(
            List<DonViSanPham> danhSachDonViBan,
            List<QuyDoiDonVi> danhSachQuyDoi,
            BigDecimal tonKhaDung
    ) {
        Map<Long, Integer> ketQua =
                new LinkedHashMap<>();

        for (DonViSanPham donViSanPham
                : danhSachDonViBan) {
            BigDecimal heSoVeDonViCoSo =
                    tonKhoSanPhamService
                            .tinhHeSoVeDonViCoSo(
                                    donViSanPham,
                                    danhSachQuyDoi
                            );

            int soLuongToiDa =
                    tonKhoSanPhamService
                            .tinhSoLuongToiDaCoTheBan(
                                    tonKhaDung,
                                    heSoVeDonViCoSo
                            );

            ketQua.put(
                    donViSanPham.getMaDonViSanPham(),
                    soLuongToiDa
            );
        }

        return ketQua;
    }

    private Comparator<SanPhamDaXuLy>
            taoBoSoSanhSanPham(
                    String sapXep
            ) {
        Comparator<SanPhamDaXuLy> uuTienConHang =
                Comparator.comparing(
                        sanPhamDaXuLy ->
                                Boolean.TRUE.equals(
                                        sanPhamDaXuLy
                                                .sanPhamDto()
                                                .getHetHang()
                                )
                );

        if (SAP_XEP_GIA_TANG_DAN.equals(sapXep)) {
            return uuTienConHang
                    .thenComparing(
                            sanPhamDaXuLy ->
                                    sanPhamDaXuLy
                                            .sanPhamDto()
                                            .getGiaBan()
                    )
                    .thenComparingInt(
                            SanPhamDaXuLy::thuTuBanDau
                    );
        }

        if (SAP_XEP_GIA_GIAM_DAN.equals(sapXep)) {
            return uuTienConHang
                    .thenComparing(
                            sanPhamDaXuLy ->
                                    sanPhamDaXuLy
                                            .sanPhamDto()
                                            .getGiaBan(),
                            Comparator.reverseOrder()
                    )
                    .thenComparingInt(
                            SanPhamDaXuLy::thuTuBanDau
                    );
        }

        return uuTienConHang.thenComparingInt(
                SanPhamDaXuLy::thuTuBanDau
        );
    }

    private boolean namTrongKhoangGia(
            BigDecimal giaSauKhuyenMai,
            BigDecimal giaTu,
            BigDecimal giaDen
    ) {
        if (giaSauKhuyenMai == null) {
            return false;
        }

        if (giaTu != null
                && giaSauKhuyenMai.compareTo(giaTu) < 0) {
            return false;
        }

        return giaDen == null
                || giaSauKhuyenMai.compareTo(giaDen) <= 0;
    }

    private void kiemTraKhoangGia(
            BigDecimal giaTu,
            BigDecimal giaDen
    ) {
        if (giaTu != null
                && giaTu.compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Giá bắt đầu không được nhỏ hơn 0."
            );
        }

        if (giaDen != null
                && giaDen.compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Giá kết thúc không được nhỏ hơn 0."
            );
        }

        if (giaTu != null
                && giaDen != null
                && giaTu.compareTo(giaDen) > 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Giá bắt đầu không được lớn hơn giá kết thúc."
            );
        }
    }

    private PageResponseDto<SanPhamResponseDto>
            taoPageResponse(
                    List<SanPhamDaXuLy> danhSachSanPham,
                    int page,
                    int size
            ) {
        int tongSoSanPham =
                danhSachSanPham.size();

        int tongSoTrang =
                tongSoSanPham == 0
                        ? 0
                        : (int) Math.ceil(
                                (double) tongSoSanPham / size
                        );

        long viTriBatDau =
                (long) page * size;

        List<SanPhamResponseDto> noiDungTrang;

        if (viTriBatDau >= tongSoSanPham) {
            noiDungTrang = List.of();
        } else {
            int tuViTri =
                    (int) viTriBatDau;

            int denViTri =
                    Math.min(
                            tuViTri + size,
                            tongSoSanPham
                    );

            noiDungTrang =
                    danhSachSanPham.subList(
                            tuViTri,
                            denViTri
                    )
                    .stream()
                    .map(SanPhamDaXuLy::sanPhamDto)
                    .toList();
        }

        boolean laTrangCuoi =
                tongSoTrang == 0
                        || page >= tongSoTrang - 1;

        return new PageResponseDto<>(
                noiDungTrang,
                page,
                size,
                (long) tongSoSanPham,
                tongSoTrang,
                laTrangCuoi
        );
    }

    private PageResponseDto<SanPhamResponseDto>
            taoPageResponseRong(
                    int page,
                    int size
            ) {
        return new PageResponseDto<>(
                List.of(),
                page,
                size,
                0L,
                0,
                true
        );
    }

    private List<Long> layDanhSachMaDanhMucCanLoc(
            Long maDanhMuc
    ) {
        if (maDanhMuc == null) {
            return Collections.emptyList();
        }

        List<DanhMucSanPham> tatCaDanhMuc =
                danhMucSanPhamRepository
                        .timDanhMucHienThiChoMenu();

        Map<Long, List<DanhMucSanPham>>
                danhMucConTheoMaCha =
                tatCaDanhMuc.stream()
                        .filter(danhMuc ->
                                danhMuc.getDanhMucCha() != null
                        )
                        .collect(Collectors.groupingBy(
                                danhMuc ->
                                        danhMuc.getDanhMucCha()
                                                .getMaDanhMuc()
                        ));

        Set<Long> ketQua =
                new LinkedHashSet<>();

        themDanhMucVaDanhMucCon(
                maDanhMuc,
                danhMucConTheoMaCha,
                ketQua
        );

        return new ArrayList<>(ketQua);
    }

    private void themDanhMucVaDanhMucCon(
            Long maDanhMuc,
            Map<Long, List<DanhMucSanPham>>
                    danhMucConTheoMaCha,
            Set<Long> ketQua
    ) {
        if (maDanhMuc == null
                || !ketQua.add(maDanhMuc)) {
            return;
        }

        List<DanhMucSanPham> danhSachDanhMucCon =
                danhMucConTheoMaCha.getOrDefault(
                        maDanhMuc,
                        Collections.emptyList()
                );

        for (DanhMucSanPham danhMucCon
                : danhSachDanhMucCon) {
            themDanhMucVaDanhMucCon(
                    danhMucCon.getMaDanhMuc(),
                    danhMucConTheoMaCha,
                    ketQua
            );
        }
    }

    private record SanPhamDaXuLy(
            int thuTuBanDau,
            SanPhamResponseDto sanPhamDto
    ) {
    }
}