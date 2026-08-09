package com.pharma.backend.service.khachhang;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.khachhang.giohang.ChiTietGioHangResponseDto;
import com.pharma.backend.dto.khachhang.giohang.GioHangResponseDto;
import com.pharma.backend.dto.sanpham.DonViBanSanPhamResponseDto;
import com.pharma.backend.entity.ChiTietGioHang;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.GioHang;
import com.pharma.backend.entity.KhachHang;
import com.pharma.backend.enums.giohang.TrangThaiGioHang;
import com.pharma.backend.repository.ChiTietGioHangRepository;
import com.pharma.backend.repository.DonViSanPhamRepository;
import com.pharma.backend.repository.GioHangRepository;
import com.pharma.backend.repository.KhachHangRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GioHangService {

    private final GioHangRepository gioHangRepository;

    private final ChiTietGioHangRepository chiTietGioHangRepository;

    private final DonViSanPhamRepository donViSanPhamRepository;

    private final KhachHangRepository khachHangRepository;

    public GioHangResponseDto layGioHang(Long maKhachHang) {
        GioHang gioHang = layHoacTaoGioHang(maKhachHang);

        List<ChiTietGioHang> danhSachChiTiet =
                chiTietGioHangRepository.findByGioHang_MaGioHang(
                        gioHang.getMaGioHang()
                );

        return chuyenSangGioHangResponseDto(gioHang, danhSachChiTiet);
    }

    private GioHang layHoacTaoGioHang(Long maKhachHang) {
        return gioHangRepository
        .findByKhachHang_MaKhachHang(maKhachHang)
        .orElseGet(() -> taoGioHangMoi(maKhachHang));
    }

    private GioHang taoGioHangMoi(Long maKhachHang) {
        KhachHang khachHang = khachHangRepository
                .findById(maKhachHang)
                .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Khách hàng không tồn tại."
                ));

        GioHang gioHangMoi = new GioHang();
        gioHangMoi.setKhachHang(khachHang);
        gioHangMoi.setTrangThaiGioHang(TrangThaiGioHang.DANG_SU_DUNG);

        return gioHangRepository.save(gioHangMoi);
    }

    private GioHangResponseDto chuyenSangGioHangResponseDto(
            GioHang gioHang,
            List<ChiTietGioHang> danhSachChiTiet
    ) {
        List<ChiTietGioHangResponseDto> danhSachChiTietDto =
                danhSachChiTiet.stream()
                        .map(this::chuyenSangChiTietGioHangResponseDto)
                        .toList();

        BigDecimal tongTien = danhSachChiTiet.stream()
                .map(ChiTietGioHang::getThanhTien)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new GioHangResponseDto(
                gioHang.getMaGioHang(),
                gioHang.getKhachHang().getMaKhachHang(),
                gioHang.getTrangThaiGioHang(),
                danhSachChiTietDto,
                tongTien
        );
    }

    private ChiTietGioHangResponseDto chuyenSangChiTietGioHangResponseDto(
        ChiTietGioHang chiTietGioHang
        ) {
        DonViSanPham donViSanPham = chiTietGioHang.getDonViSanPham();

        List<DonViSanPham> danhSachDonViBan =
                donViSanPhamRepository.findBySanPham_MaSanPhamAndChoPhepBanTrueAndTrangThaiTrue(
                        chiTietGioHang.getSanPham().getMaSanPham()
                );

        List<DonViBanSanPhamResponseDto> danhSachDonViBanDto =
                danhSachDonViBan.stream()
                        .map(this::chuyenSangDonViBanSanPhamResponseDto)
                        .toList();

        return new ChiTietGioHangResponseDto(
                chiTietGioHang.getMaChiTietGioHang(),
                chiTietGioHang.getSanPham().getMaSanPham(),
                chiTietGioHang.getSanPham().getTenSanPham(),
                chiTietGioHang.getSanPham().getHinhAnh(),
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
                chiTietGioHang.getSoLuong(),
                chiTietGioHang.getDonGia(),
                chiTietGioHang.getThanhTien(),
                danhSachDonViBanDto
        );
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
}