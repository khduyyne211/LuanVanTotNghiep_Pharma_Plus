package com.pharma.backend.service.common;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.entity.ChiTietDonHang;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.QuyDoiDonVi;
import com.pharma.backend.repository.ChiTietDonHangRepository;
import com.pharma.backend.service.admin.XuatKhoService;
import com.pharma.backend.service.khachhang.TonKhoSanPhamService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class XuLyTonKhoDonHangService {

    private final ChiTietDonHangRepository chiTietDonHangRepository;

    private final TonKhoSanPhamService tonKhoSanPhamService;

    private final XuatKhoService xuatKhoService;

    /*
     * Service này bắt buộc phải được gọi bên trong transaction
     * của nghiệp vụ đang xử lý đơn hàng.
     *
     * Ví dụ:
     * - Callback ZaloPay thành công.
     * - Dược sĩ tiếp nhận đơn COD.
     *
     * Nếu một sản phẩm không đủ tồn, exception sẽ làm rollback
     * toàn bộ transaction, tránh trường hợp trừ tồn một phần.
     */
    @Transactional(propagation = Propagation.MANDATORY)
    public void truTonTheoDonHang(
            Long maDonHang
    ) {
        kiemTraMaDonHang(
                maDonHang
        );

        List<ChiTietDonHang> danhSachChiTiet =
                chiTietDonHangRepository
                        .layChiTietTheoMaDonHang(
                                maDonHang
                        );

        if (
                danhSachChiTiet == null
                        || danhSachChiTiet.isEmpty()
        ) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Đơn hàng không có sản phẩm để xuất kho."
            );
        }

        List<Long> danhSachMaSanPham =
                danhSachChiTiet
                        .stream()
                        .map(
                                chiTiet -> {
                                    if (
                                            chiTiet.getSanPham() == null
                                                    ||
                                            chiTiet.getSanPham()
                                                    .getMaSanPham() == null
                                    ) {
                                        throw new ResponseStatusException(
                                                HttpStatus.INTERNAL_SERVER_ERROR,
                                                "Chi tiết đơn hàng có thông tin sản phẩm không hợp lệ."
                                        );
                                    }

                                    return chiTiet
                                            .getSanPham()
                                            .getMaSanPham();
                                }
                        )
                        .distinct()
                        .toList();

        Map<Long, List<QuyDoiDonVi>>
                quyDoiTheoSanPham =
                tonKhoSanPhamService
                        .layQuyDoiTheoDanhSachSanPham(
                                danhSachMaSanPham
                        );

        Map<Long, BigDecimal>
                soLuongCanXuatTheoSanPham =
                new LinkedHashMap<>();

        for (
                ChiTietDonHang chiTiet
                : danhSachChiTiet
        ) {
            themSoLuongCanXuat(
                    chiTiet,
                    quyDoiTheoSanPham,
                    soLuongCanXuatTheoSanPham
            );
        }

        /*
         * XuatKhoService sẽ:
         * - khóa các lô còn tồn theo sản phẩm;
         * - lấy lô theo FEFO;
         * - kiểm tra tổng tồn trước;
         * - trừ tồn theo đơn vị cơ sở;
         * - chuyển lô hết tồn sang HET_HANG.
         */
        xuatKhoService.truTonTheoFefo(
                soLuongCanXuatTheoSanPham
        );
    }

    private void themSoLuongCanXuat(
            ChiTietDonHang chiTiet,
            Map<Long, List<QuyDoiDonVi>>
                    quyDoiTheoSanPham,
            Map<Long, BigDecimal>
                    soLuongCanXuatTheoSanPham
    ) {
        if (
                chiTiet == null
                        ||
                chiTiet.getSanPham() == null
                        ||
                chiTiet.getSanPham()
                        .getMaSanPham() == null
        ) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Chi tiết đơn hàng có thông tin sản phẩm không hợp lệ."
            );
        }

        if (
                chiTiet.getSoLuong() == null
                        ||
                chiTiet.getSoLuong() <= 0
        ) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Chi tiết đơn hàng có số lượng không hợp lệ."
            );
        }

        DonViSanPham donViBan =
                chiTiet.getDonViSanPham();

        if (
                donViBan == null
                        ||
                donViBan.getMaDonViSanPham() == null
        ) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Chi tiết đơn hàng có đơn vị bán không hợp lệ."
            );
        }

        Long maSanPham =
                chiTiet
                        .getSanPham()
                        .getMaSanPham();

        List<QuyDoiDonVi> danhSachQuyDoi =
                quyDoiTheoSanPham.getOrDefault(
                        maSanPham,
                        List.of()
                );

        BigDecimal soLuongCanXuat =
                tonKhoSanPhamService
                        .tinhSoLuongCanTheoQuyDoi(
                                donViBan,
                                chiTiet.getSoLuong(),
                                danhSachQuyDoi
                        );

        soLuongCanXuatTheoSanPham.merge(
                maSanPham,
                soLuongCanXuat,
                BigDecimal::add
        );
    }

    private void kiemTraMaDonHang(
            Long maDonHang
    ) {
        if (
                maDonHang == null
                        ||
                maDonHang <= 0
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Mã đơn hàng không hợp lệ."
            );
        }
    }
}