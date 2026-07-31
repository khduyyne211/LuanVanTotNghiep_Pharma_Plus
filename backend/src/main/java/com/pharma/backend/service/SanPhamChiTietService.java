package com.pharma.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.sanpham.SanPhamChiTietResponseDto;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.DuLieuChuyenMonThuoc;
import com.pharma.backend.entity.QuyDoiDonVi;
import com.pharma.backend.entity.SanPham;
import com.pharma.backend.entity.ThanhPhanHoatChat;
import com.pharma.backend.repository.DonViSanPhamRepository;
import com.pharma.backend.repository.DuLieuChuyenMonThuocRepository;
import com.pharma.backend.repository.QuyDoiDonViRepository;
import com.pharma.backend.repository.SanPhamRepository;
import com.pharma.backend.repository.ThanhPhanHoatChatRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SanPhamChiTietService {

    private final SanPhamRepository sanPhamRepository;
    private final DonViSanPhamRepository donViSanPhamRepository;
    private final ThanhPhanHoatChatRepository thanhPhanHoatChatRepository;
    private final DuLieuChuyenMonThuocRepository duLieuChuyenMonThuocRepository;
    private final QuyDoiDonViRepository quyDoiDonViRepository;
    private final SanPhamMapper sanPhamMapper;

    @Transactional(readOnly = true)
    public SanPhamChiTietResponseDto layChiTietSanPhamKhachHang(
            Long maSanPham
    ) {
        SanPham sanPham = sanPhamRepository.findById(maSanPham)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy sản phẩm"
                ));

        if (!Boolean.TRUE.equals(sanPham.getTrangThaiSanPham())) {
            throw new IllegalArgumentException(
                    "Sản phẩm hiện không được phép hiển thị"
            );
        }

        List<DonViSanPham> danhSachDonViBan =
                donViSanPhamRepository
                        .findBySanPham_MaSanPhamAndChoPhepBanTrueAndTrangThaiTrue(
                                maSanPham
                        );

        List<ThanhPhanHoatChat> danhSachThanhPhanHoatChat =
                thanhPhanHoatChatRepository.timTheoMaSanPham(maSanPham);

        DuLieuChuyenMonThuoc duLieuChuyenMonThuoc =
                duLieuChuyenMonThuocRepository.timTheoMaSanPham(maSanPham)
                        .orElse(null);

        List<QuyDoiDonVi> danhSachQuyDoiDonVi =
                quyDoiDonViRepository
                        .findBySanPham_MaSanPhamAndTrangThaiTrue(maSanPham);

        return sanPhamMapper.chuyenSangSanPhamChiTietResponseDto(
                sanPham,
                danhSachDonViBan,
                danhSachThanhPhanHoatChat,
                duLieuChuyenMonThuoc,
                danhSachQuyDoiDonVi
        );
    }
}
