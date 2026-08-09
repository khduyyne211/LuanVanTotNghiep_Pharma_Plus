package com.pharma.backend.service.khachhang;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.khachhang.giohang.ChiTietGioHangLocalRequestDto;
import com.pharma.backend.dto.khachhang.giohang.KiemTraGioHangRequestDto;
import com.pharma.backend.dto.khachhang.giohang.KiemTraGioHangResponseDto;
import com.pharma.backend.dto.khachhang.giohang.ThongTinKiemTraGioHangDto;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.QuyDoiDonVi;
import com.pharma.backend.repository.DonViSanPhamRepository;

import lombok.RequiredArgsConstructor;

/**
 * Kiểm tra toàn bộ giỏ hàng theo giá, đơn vị bán,
 * quy đổi đơn vị và tồn kho mới nhất.
 */
@Service
@RequiredArgsConstructor
public class KiemTraGioHangService {

    private final DonViSanPhamRepository
            donViSanPhamRepository;

    private final TonKhoSanPhamService
            tonKhoSanPhamService;

    private final TinhGiaSanPhamService
            tinhGiaSanPhamService;

    @Transactional(readOnly = true)
    public KiemTraGioHangResponseDto kiemTraGioHang(
            KiemTraGioHangRequestDto request
    ) {
        Map<Long, Integer> soLuongTheoDonVi =
                chuanHoaDanhSachChiTiet(request);

        List<DonViSanPham> danhSachDonVi =
                donViSanPhamRepository.findAllById(
                        soLuongTheoDonVi.keySet()
                );

        Map<Long, DonViSanPham> donViTheoMa =
                taoMapDonViSanPham(
                        danhSachDonVi
                );

        if (donViTheoMa.size()
                != soLuongTheoDonVi.size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Có đơn vị sản phẩm không tồn tại."
            );
        }

        for (DonViSanPham donViSanPham
                : danhSachDonVi) {
            kiemTraDonViDuocBan(
                    donViSanPham
            );
        }

        List<Long> danhSachMaSanPham =
                danhSachDonVi.stream()
                        .map(donViSanPham ->
                                donViSanPham.getSanPham()
                                        .getMaSanPham()
                        )
                        .distinct()
                        .toList();

        Map<Long, List<QuyDoiDonVi>>
                quyDoiTheoSanPham =
                tonKhoSanPhamService
                        .layQuyDoiTheoDanhSachSanPham(
                                danhSachMaSanPham
                        );

        Map<Long, BigDecimal> tonTheoSanPham =
                tonKhoSanPhamService
                        .layTonKhaDungTheoDanhSachSanPham(
                                danhSachMaSanPham
                        );

        /*
         * Toàn bộ giỏ hàng sử dụng chung một thời điểm tính giá.
         */
        LocalDateTime thoiDiemTinhGia =
                LocalDateTime.now();

        Map<Long, KetQuaTinhGiaSanPham>
                ketQuaGiaTheoDonVi =
                tinhGiaSanPhamService
                        .tinhGiaTheoDanhSachDonVi(
                                danhSachDonVi,
                                thoiDiemTinhGia
                        );

        List<ThongTinKiemTraGioHangDto>
                danhSachThongTin =
                new ArrayList<>();

        Map<Long, BigDecimal>
                tongCanTheoSanPham =
                new HashMap<>();

        for (Map.Entry<Long, Integer> entry
                : soLuongTheoDonVi.entrySet()) {
            DonViSanPham donViSanPham =
                    donViTheoMa.get(
                            entry.getKey()
                    );

            Long maSanPham =
                    donViSanPham.getSanPham()
                            .getMaSanPham();

            List<QuyDoiDonVi>
                    danhSachQuyDoi =
                    quyDoiTheoSanPham.getOrDefault(
                            maSanPham,
                            List.of()
                    );

            BigDecimal heSoQuyDoi =
                    tonKhoSanPhamService
                            .tinhHeSoVeDonViCoSo(
                                    donViSanPham,
                                    danhSachQuyDoi
                            );

            BigDecimal soLuongCan =
                    heSoQuyDoi.multiply(
                            BigDecimal.valueOf(
                                    entry.getValue()
                            )
                    );

            tongCanTheoSanPham.merge(
                    maSanPham,
                    soLuongCan,
                    BigDecimal::add
            );

            BigDecimal tonKhaDung =
                    tonTheoSanPham.getOrDefault(
                            maSanPham,
                            BigDecimal.ZERO
                    );

            KetQuaTinhGiaSanPham ketQuaGia =
                    ketQuaGiaTheoDonVi.get(
                            donViSanPham
                                    .getMaDonViSanPham()
                    );

            if (ketQuaGia == null) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Không tìm thấy kết quả tính giá của đơn vị sản phẩm."
                );
            }

            danhSachThongTin.add(
                    new ThongTinKiemTraGioHangDto(
                            maSanPham,
                            donViSanPham
                                    .getMaDonViSanPham(),
                            ketQuaGia.giaGoc(),
                            ketQuaGia
                                    .soTienGiamMoiDonVi(),
                            ketQuaGia
                                    .giaSauKhuyenMai(),
                            ketQuaGia.coKhuyenMai(),
                            heSoQuyDoi,
                            tonKhaDung
                    )
            );
        }

        boolean hopLe =
                tonKhoSanPhamService
                        .kiemTraDuTon(
                                tongCanTheoSanPham,
                                tonTheoSanPham
                        );

        return new KiemTraGioHangResponseDto(
                hopLe,
                danhSachThongTin
        );
    }

    /**
     * Dùng khi đồng bộ giỏ hàng local vào cơ sở dữ liệu.
     * Không đủ tồn thì dừng trước khi xóa hoặc ghi chi tiết giỏ hàng.
     */
    @Transactional(readOnly = true)
    public KiemTraGioHangResponseDto
            kiemTraDuDieuKienDongBo(
                    KiemTraGioHangRequestDto request
            ) {
        KiemTraGioHangResponseDto ketQuaKiemTra =
                kiemTraGioHang(request);

        if (!ketQuaKiemTra.isHopLe()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Một hoặc nhiều sản phẩm không đủ số lượng tồn kho."
            );
        }

        return ketQuaKiemTra;
    }

    private Map<Long, Integer>
            chuanHoaDanhSachChiTiet(
                    KiemTraGioHangRequestDto request
            ) {
        if (request == null
                || request.getDanhSachChiTiet() == null
                || request.getDanhSachChiTiet()
                        .isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Giỏ hàng không có sản phẩm."
            );
        }

        Map<Long, Integer> soLuongTheoDonVi =
                new LinkedHashMap<>();

        for (ChiTietGioHangLocalRequestDto chiTiet
                : request.getDanhSachChiTiet()) {
            if (chiTiet == null
                    || chiTiet.getMaDonViSanPham() == null
                    || chiTiet.getSoLuong() == null
                    || chiTiet.getSoLuong() <= 0) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Mã đơn vị sản phẩm và số lượng phải hợp lệ."
                );
            }

            soLuongTheoDonVi.merge(
                    chiTiet.getMaDonViSanPham(),
                    chiTiet.getSoLuong(),
                    Integer::sum
            );
        }

        return soLuongTheoDonVi;
    }

    private Map<Long, DonViSanPham>
            taoMapDonViSanPham(
                    List<DonViSanPham> danhSachDonVi
            ) {
        Map<Long, DonViSanPham> donViTheoMa =
                new HashMap<>();

        for (DonViSanPham donViSanPham
                : danhSachDonVi) {
            donViTheoMa.put(
                    donViSanPham
                            .getMaDonViSanPham(),
                    donViSanPham
            );
        }

        return donViTheoMa;
    }

    private void kiemTraDonViDuocBan(
            DonViSanPham donViSanPham
    ) {
        if (donViSanPham == null
                || donViSanPham.getSanPham() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Thông tin đơn vị sản phẩm không hợp lệ."
            );
        }

        if (!Boolean.TRUE.equals(
                donViSanPham.getTrangThai()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Đơn vị sản phẩm đã ngừng hoạt động."
            );
        }

        if (!Boolean.TRUE.equals(
                donViSanPham.getChoPhepBan()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Đơn vị sản phẩm không được phép bán."
            );
        }

        if (donViSanPham.getGiaBanTheoDonVi() == null
                || donViSanPham
                        .getGiaBanTheoDonVi()
                        .compareTo(
                                BigDecimal.ZERO
                        ) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Đơn vị sản phẩm chưa có giá bán hợp lệ."
            );
        }
    }
}