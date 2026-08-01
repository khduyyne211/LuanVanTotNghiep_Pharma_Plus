package com.pharma.backend.service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Component;

import com.pharma.backend.dto.sanpham.DonViBanSanPhamResponseDto;
import com.pharma.backend.dto.sanpham.DuLieuChuyenMonThuocResponseDto;
import com.pharma.backend.dto.sanpham.SanPhamChiTietResponseDto;
import com.pharma.backend.dto.sanpham.SanPhamResponseDto;
import com.pharma.backend.dto.sanpham.ThanhPhanHoatChatResponseDto;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.DuLieuChuyenMonThuoc;
import com.pharma.backend.entity.QuyDoiDonVi;
import com.pharma.backend.entity.SanPham;
import com.pharma.backend.entity.ThanhPhanHoatChat;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SanPhamMapper {

    private final MoTaQuyDoiSanPhamService moTaQuyDoiSanPhamService;

    public SanPhamResponseDto chuyenSangSanPhamResponseDto(
            SanPham sanPham,
            List<DonViSanPham> danhSachDonViBan,
            List<QuyDoiDonVi> danhSachQuyDoiDonVi
    ) {
        List<DonViSanPham> danhSachDonViDaSapXep =
                sapXepDanhSachDonViBan(danhSachDonViBan);

        List<DonViBanSanPhamResponseDto> danhSachDonViBanDto =
                danhSachDonViDaSapXep.stream()
                        .map(this::chuyenSangDonViBanSanPhamResponseDto)
                        .toList();

        return new SanPhamResponseDto(
                sanPham.getMaSanPham(),
                sanPham.getTenSanPham(),
                sanPham.getHinhAnh(),
                layGiaBanDaiDien(danhSachDonViDaSapXep),
                sanPham.getLaThuocKeDon(),
                sanPham.getNhaSanXuat() != null
                        ? sanPham.getNhaSanXuat().getTenNhaSanXuat()
                        : null,
                sanPham.getDanhMuc() != null
                        ? sanPham.getDanhMuc().getMaDanhMuc()
                        : null,
                sanPham.getDanhMuc() != null
                        ? sanPham.getDanhMuc().getTenDanhMuc()
                        : null,
                sanPham.getMoTaNgan(),
                moTaQuyDoiSanPhamService.taoMoTaQuyDoi(
                        danhSachQuyDoiDonVi
                ),
                danhSachDonViBanDto
        );
    }

    public SanPhamChiTietResponseDto chuyenSangSanPhamChiTietResponseDto(
            SanPham sanPham,
            List<DonViSanPham> danhSachDonViBan,
            List<ThanhPhanHoatChat> danhSachThanhPhanHoatChat,
            DuLieuChuyenMonThuoc duLieuChuyenMonThuoc,
            List<QuyDoiDonVi> danhSachQuyDoiDonVi
    ) {
        List<DonViSanPham> danhSachDonViDaSapXep =
                sapXepDanhSachDonViBan(danhSachDonViBan);

        List<DonViBanSanPhamResponseDto> danhSachDonViBanDto =
                danhSachDonViDaSapXep.stream()
.map(this::chuyenSangDonViBanSanPhamResponseDto)
                        .toList();

        List<ThanhPhanHoatChatResponseDto> danhSachThanhPhanHoatChatDto =
                danhSachThanhPhanHoatChat.stream()
                        .map(this::chuyenSangThanhPhanHoatChatResponseDto)
                        .toList();

        return new SanPhamChiTietResponseDto(
                sanPham.getMaSanPham(),
                sanPham.getTenSanPham(),
                sanPham.getHinhAnh(),
                layGiaBanDaiDien(danhSachDonViDaSapXep),
                sanPham.getLaThuocKeDon(),
                sanPham.getTrangThaiSanPham(),
                sanPham.getMoTaNgan(),
                sanPham.getMoTa(),
                sanPham.getDanhMuc() != null
                        ? sanPham.getDanhMuc().getMaDanhMuc()
                        : null,
                sanPham.getDanhMuc() != null
                        ? sanPham.getDanhMuc().getTenDanhMuc()
                        : null,
                sanPham.getNhaSanXuat() != null
                        ? sanPham.getNhaSanXuat().getTenNhaSanXuat()
                        : null,
                moTaQuyDoiSanPhamService.taoMoTaQuyDoi(
                        danhSachQuyDoiDonVi
                ),
                danhSachDonViBanDto,
                danhSachThanhPhanHoatChatDto,
                chuyenSangDuLieuChuyenMonThuocResponseDto(
                        duLieuChuyenMonThuoc
                )
        );
    }

    private List<DonViSanPham> sapXepDanhSachDonViBan(
            List<DonViSanPham> danhSachDonViBan
    ) {
        if (danhSachDonViBan == null || danhSachDonViBan.isEmpty()) {
            return List.of();
        }

        return danhSachDonViBan.stream()
                .sorted(
                        Comparator.comparingInt(this::layThuTuUuTienDonVi)
                                .thenComparing(
                                        DonViSanPham::getMaDonViSanPham,
                                        Comparator.nullsLast(Long::compareTo)
                                )
                )
                .toList();
    }

    private int layThuTuUuTienDonVi(DonViSanPham donViSanPham) {
        if (Boolean.TRUE.equals(donViSanPham.getLaDonViBanMacDinh())) {
            return 0;
        }

        if (Boolean.TRUE.equals(donViSanPham.getLaDonViCoSo())) {
            return 1;
        }

        return 2;
    }

    private BigDecimal layGiaBanDaiDien(
            List<DonViSanPham> danhSachDonViBan
    ) {
        return danhSachDonViBan.stream()
                .map(DonViSanPham::getGiaBanTheoDonVi)
                .filter(giaBan -> giaBan != null)
                .findFirst()
                .orElse(BigDecimal.ZERO);
    }

    private DonViBanSanPhamResponseDto chuyenSangDonViBanSanPhamResponseDto(
            DonViSanPham donViSanPham
    ) {
        return new DonViBanSanPhamResponseDto(
                donViSanPham.getMaDonViSanPham(),
donViSanPham.getDonViTinh() != null
                        ? donViSanPham.getDonViTinh().getMaDonViTinh()
                        : null,
                donViSanPham.getDonViTinh() != null
                        ? donViSanPham.getDonViTinh().getTenDonViTinh()
                        : null,
                donViSanPham.getDonViTinh() != null
                        ? donViSanPham.getDonViTinh().getKyHieu()
                        : null,
                donViSanPham.getGiaBanTheoDonVi(),
                donViSanPham.getLaDonViCoSo()
        );
    }

    private ThanhPhanHoatChatResponseDto chuyenSangThanhPhanHoatChatResponseDto(
            ThanhPhanHoatChat thanhPhanHoatChat
    ) {
        return new ThanhPhanHoatChatResponseDto(
                thanhPhanHoatChat.getMaThanhPhan(),
                thanhPhanHoatChat.getHoatChat() != null
                        ? thanhPhanHoatChat.getHoatChat().getMaHoatChat()
                        : null,
                thanhPhanHoatChat.getHoatChat() != null
                        ? thanhPhanHoatChat.getHoatChat().getTenHoatChat()
                        : null,
                thanhPhanHoatChat.getHamLuong(),
                thanhPhanHoatChat.getDonViHamLuong(),
                thanhPhanHoatChat.getVaiTroHoatChat(),
                thanhPhanHoatChat.getGhiChu()
        );
    }

    private DuLieuChuyenMonThuocResponseDto
            chuyenSangDuLieuChuyenMonThuocResponseDto(
                    DuLieuChuyenMonThuoc duLieuChuyenMonThuoc
            ) {
        if (duLieuChuyenMonThuoc == null) {
            return null;
        }

        return new DuLieuChuyenMonThuocResponseDto(
                duLieuChuyenMonThuoc.getDangBaoChe(),
                duLieuChuyenMonThuoc.getCongDungThamKhao(),
                duLieuChuyenMonThuoc.getCachDungThamKhao(),
                duLieuChuyenMonThuoc.getCanhBaoAnToan(),
                duLieuChuyenMonThuoc.getPhanLoaiThuoc(),
                duLieuChuyenMonThuoc.getTrangThaiXacNhan()
        );
    }
}
