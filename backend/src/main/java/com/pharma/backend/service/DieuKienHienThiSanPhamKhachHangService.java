package com.pharma.backend.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.entity.DanhMucSanPham;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.SanPham;

@Service
public class DieuKienHienThiSanPhamKhachHangService {

    /**
     * Kiểm tra các điều kiện chung để một sản phẩm được phép xuất hiện
     * trên website khách hàng.
     */
    public boolean duDieuKienHienThi(
            SanPham sanPham,
            List<DonViSanPham> danhSachDonViBan
    ) {
        if (sanPham == null
                || sanPham.getMaSanPham() == null
                || !Boolean.TRUE.equals(
                        sanPham.getTrangThaiSanPham()
                )) {
            return false;
        }

        if (!danhMucDuocHienThi(sanPham.getDanhMuc())) {
            return false;
        }

        if (sanPham.getNhaSanXuat() == null
                || !Boolean.TRUE.equals(
                        sanPham.getNhaSanXuat().getTrangThai()
                )) {
            return false;
        }

        if (danhSachDonViBan == null
                || danhSachDonViBan.isEmpty()) {
            return false;
        }

        List<DonViSanPham> danhSachDonViHopLe =
                danhSachDonViBan.stream()
                        .filter(donVi ->
                                laDonViBanHopLe(
                                        sanPham,
                                        donVi
                                )
                        )
                        .toList();

        if (danhSachDonViHopLe.isEmpty()) {
            return false;
        }

        long soLuongDonViBanMacDinh =
                danhSachDonViHopLe.stream()
                        .filter(donVi ->
                                Boolean.TRUE.equals(
                                        donVi.getLaDonViBanMacDinh()
                                )
                        )
                        .count();

        return soLuongDonViBanMacDinh == 1;
    }

    /**
     * Dùng cho trang chi tiết. Sản phẩm không đủ điều kiện được xử lý
     * giống như không tồn tại để người dùng không truy cập trực tiếp.
     */
    public void yeuCauDuDieuKienHienThi(
            SanPham sanPham,
            List<DonViSanPham> danhSachDonViBan
    ) {
        if (!duDieuKienHienThi(
                sanPham,
                danhSachDonViBan
        )) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy sản phẩm."
            );
        }
    }

    private boolean danhMucDuocHienThi(
            DanhMucSanPham danhMuc
    ) {
        if (danhMuc == null
                || !Boolean.TRUE.equals(
                        danhMuc.getTrangThaiHienThi()
                )) {
            return false;
        }

        DanhMucSanPham danhMucCha =
                danhMuc.getDanhMucCha();

        return danhMucCha == null
                || Boolean.TRUE.equals(
                        danhMucCha.getTrangThaiHienThi()
                );
    }

    private boolean laDonViBanHopLe(
            SanPham sanPham,
            DonViSanPham donViSanPham
    ) {
        if (donViSanPham == null
                || donViSanPham.getSanPham() == null
                || donViSanPham.getMaDonViSanPham() == null) {
            return false;
        }

        if (!Objects.equals(
                sanPham.getMaSanPham(),
                donViSanPham.getSanPham().getMaSanPham()
        )) {
            return false;
        }

        return Boolean.TRUE.equals(
                donViSanPham.getTrangThai()
        )
                && Boolean.TRUE.equals(
                        donViSanPham.getChoPhepBan()
                )
                && donViSanPham.getGiaBanTheoDonVi() != null
                && donViSanPham.getGiaBanTheoDonVi()
                        .compareTo(BigDecimal.ZERO) > 0;
    }
}