package com.pharma.backend.service.khachhang;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.khachhang.sanpham.SanPhamBanChayResponseDto;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.QuyDoiDonVi;
import com.pharma.backend.entity.SanPham;
import com.pharma.backend.enums.donhang.TrangThaiDonHang;
import com.pharma.backend.repository.ChiTietDonHangRepository;
import com.pharma.backend.repository.ChiTietDonHangRepository.SanPhamBanChayProjection;
import com.pharma.backend.repository.DonViSanPhamRepository;
import com.pharma.backend.repository.SanPhamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SanPhamBanChayService {

    private static final int GIOI_HAN_TOI_DA = 24;

    private final ChiTietDonHangRepository
            chiTietDonHangRepository;

    private final SanPhamRepository sanPhamRepository;

    private final DonViSanPhamRepository
            donViSanPhamRepository;

    private final DieuKienHienThiSanPhamKhachHangService
            dieuKienHienThiSanPhamKhachHangService;

    private final TonKhoSanPhamService
            tonKhoSanPhamService;

    private final TinhGiaSanPhamService
            tinhGiaSanPhamService;

    private final SanPhamMapper sanPhamMapper;

    @Transactional(readOnly = true)
    public List<SanPhamBanChayResponseDto>
            laySanPhamBanChay(
                    int gioiHan
            ) {
        kiemTraGioiHan(gioiHan);

        /*
         * Lấy toàn bộ thứ hạng trước.
         *
         * Không giới hạn ngay trong database vì có thể có sản phẩm
         * bán chạy nhưng không còn đủ điều kiện hiển thị cho khách.
         * Sau khi loại sản phẩm không hợp lệ mới lấy đúng số lượng
         * mà giao diện yêu cầu.
         */
        List<SanPhamBanChayProjection> danhSachXepHang =
                chiTietDonHangRepository
                        .timSanPhamBanChay(
                                TrangThaiDonHang.HOAN_THANH,
                                Pageable.unpaged()
                        );

        if (danhSachXepHang.isEmpty()) {
            return List.of();
        }

        List<Long> danhSachMaSanPhamXepHang =
                danhSachXepHang.stream()
                        .map(SanPhamBanChayProjection::getMaSanPham)
                        .distinct()
                        .toList();

        Map<Long, SanPham> sanPhamTheoMa =
                sanPhamRepository
                        .timSanPhamTheoDanhSachMa(
                                danhSachMaSanPhamXepHang,
                                true
                        )
                        .stream()
                        .collect(Collectors.toMap(
                                SanPham::getMaSanPham,
                                sanPham -> sanPham
                        ));

        Map<Long, List<DonViSanPham>>
                donViBanTheoSanPham =
                donViSanPhamRepository
                        .findBySanPham_MaSanPhamInAndChoPhepBanTrueAndTrangThaiTrue(
                                danhSachMaSanPhamXepHang
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
         * Giữ nguyên thứ tự bán chạy, loại sản phẩm không hợp lệ,
         * rồi mới giới hạn số lượng trả về.
         */
        List<SanPhamBanChayProjection>
                danhSachBanChayHopLe =
                danhSachXepHang.stream()
                        .filter(thongKe -> {
                            SanPham sanPham =
                                    sanPhamTheoMa.get(
                                            thongKe.getMaSanPham()
                                    );

                            if (sanPham == null) {
                                return false;
                            }

                            List<DonViSanPham> danhSachDonViBan =
                                    donViBanTheoSanPham
                                            .getOrDefault(
                                                    thongKe.getMaSanPham(),
                                                    List.of()
                                            );

                            return dieuKienHienThiSanPhamKhachHangService
                                    .duDieuKienHienThi(
                                            sanPham,
                                            danhSachDonViBan
                                    );
                        })
                        .limit(gioiHan)
                        .toList();

        if (danhSachBanChayHopLe.isEmpty()) {
            return List.of();
        }

        List<Long> danhSachMaSanPhamHopLe =
                danhSachBanChayHopLe.stream()
                        .map(SanPhamBanChayProjection::getMaSanPham)
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

        List<DonViSanPham> tatCaDonViBan =
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

        LocalDateTime thoiDiemTinhGia =
                LocalDateTime.now();

        Map<Long, KetQuaTinhGiaSanPham>
                ketQuaGiaTheoDonVi =
                tinhGiaSanPhamService
                        .tinhGiaTheoDanhSachDonVi(
                                tatCaDonViBan,
                                thoiDiemTinhGia
                        );

        return danhSachBanChayHopLe.stream()
                .map(thongKe ->
                        chuyenSangResponse(
                                thongKe,
                                sanPhamTheoMa,
                                donViBanTheoSanPham,
                                quyDoiTheoSanPham,
                                tonTheoSanPham,
                                ketQuaGiaTheoDonVi
                        )
                )
                .toList();
    }

    private SanPhamBanChayResponseDto chuyenSangResponse(
            SanPhamBanChayProjection thongKe,
            Map<Long, SanPham> sanPhamTheoMa,
            Map<Long, List<DonViSanPham>> donViBanTheoSanPham,
            Map<Long, List<QuyDoiDonVi>> quyDoiTheoSanPham,
            Map<Long, BigDecimal> tonTheoSanPham,
            Map<Long, KetQuaTinhGiaSanPham> ketQuaGiaTheoDonVi
    ) {
        Long maSanPham =
                thongKe.getMaSanPham();

        SanPham sanPham =
                sanPhamTheoMa.get(maSanPham);

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

        return new SanPhamBanChayResponseDto(
                sanPhamMapper.chuyenSangSanPhamResponseDto(
                        sanPham,
                        danhSachDonViBan,
                        danhSachQuyDoi,
                        ketQuaGiaTheoDonVi,
                        soLuongToiDaTheoDonVi
                ),
                thongKe.getTongSoLuongDaBan()
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

    private void kiemTraGioiHan(
            int gioiHan
    ) {
        if (gioiHan < 1
                || gioiHan > GIOI_HAN_TOI_DA) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Giới hạn sản phẩm bán chạy phải từ 1 đến 24."
            );
        }
    }
}