package com.pharma.backend.service.khachhang;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.khachhang.sanpham.SanPhamChiTietResponseDto;
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

    private final DonViSanPhamRepository
            donViSanPhamRepository;

    private final ThanhPhanHoatChatRepository
            thanhPhanHoatChatRepository;

    private final DuLieuChuyenMonThuocRepository
            duLieuChuyenMonThuocRepository;

    private final QuyDoiDonViRepository
            quyDoiDonViRepository;

    private final DieuKienHienThiSanPhamKhachHangService
            dieuKienHienThiSanPhamKhachHangService;

    private final TonKhoSanPhamService
            tonKhoSanPhamService;

    private final TinhGiaSanPhamService
            tinhGiaSanPhamService;

    private final SanPhamMapper sanPhamMapper;

    @Transactional(readOnly = true)
    public SanPhamChiTietResponseDto layChiTietSanPhamKhachHang(
            Long maSanPham
    ) {
        if (maSanPham == null || maSanPham <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Không tìm thấy sản phẩm."
            );
        }

        SanPham sanPham =
                sanPhamRepository.findById(maSanPham)
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Không tìm thấy sản phẩm."
                                )
                        );

        List<DonViSanPham> danhSachDonViBan =
                donViSanPhamRepository
                        .findBySanPham_MaSanPhamAndChoPhepBanTrueAndTrangThaiTrue(
                                maSanPham
                        );

        dieuKienHienThiSanPhamKhachHangService
                .yeuCauDuDieuKienHienThi(
                        sanPham,
                        danhSachDonViBan
                );

        List<QuyDoiDonVi> danhSachQuyDoiDonVi =
                quyDoiDonViRepository
                        .findBySanPham_MaSanPhamAndTrangThaiTrue(
                                maSanPham
                        );

        BigDecimal tonKhaDungTheoQuyDoi =
                tonKhoSanPhamService
                        .layTonKhaDungTheoDanhSachSanPham(
                                List.of(maSanPham)
                        )
                        .getOrDefault(
                                maSanPham,
                                BigDecimal.ZERO
                        );

        Map<Long, Integer> soLuongToiDaTheoDonVi =
                tinhSoLuongToiDaTheoDonVi(
                        danhSachDonViBan,
                        danhSachQuyDoiDonVi,
                        tonKhaDungTheoQuyDoi
                );

        LocalDateTime thoiDiemTinhGia =
                LocalDateTime.now();

        Map<Long, KetQuaTinhGiaSanPham>
                ketQuaGiaTheoDonVi =
                tinhGiaSanPhamService
                        .tinhGiaTheoDanhSachDonVi(
                                danhSachDonViBan,
                                thoiDiemTinhGia
                        );

        List<ThanhPhanHoatChat>
                danhSachThanhPhanHoatChat =
                thanhPhanHoatChatRepository
                        .timTheoMaSanPham(maSanPham);

        DuLieuChuyenMonThuoc duLieuChuyenMonThuoc =
                duLieuChuyenMonThuocRepository
                        .timTheoMaSanPham(maSanPham)
                        .orElse(null);

        return sanPhamMapper
                .chuyenSangSanPhamChiTietResponseDto(
                        sanPham,
                        danhSachDonViBan,
                        danhSachThanhPhanHoatChat,
                        duLieuChuyenMonThuoc,
                        danhSachQuyDoiDonVi,
                        ketQuaGiaTheoDonVi,
                        soLuongToiDaTheoDonVi
                );
    }

    private Map<Long, Integer> tinhSoLuongToiDaTheoDonVi(
            List<DonViSanPham> danhSachDonViBan,
            List<QuyDoiDonVi> danhSachQuyDoiDonVi,
            BigDecimal tonKhaDungTheoQuyDoi
    ) {
        Map<Long, Integer> ketQua =
                new LinkedHashMap<>();

        for (DonViSanPham donViSanPham
                : danhSachDonViBan) {
            BigDecimal heSoQuyDoiVeDonViCoSo =
                    tonKhoSanPhamService
                            .tinhHeSoVeDonViCoSo(
                                    donViSanPham,
                                    danhSachQuyDoiDonVi
                            );

            int soLuongToiDa =
                    tonKhoSanPhamService
                            .tinhSoLuongToiDaCoTheBan(
                                    tonKhaDungTheoQuyDoi,
                                    heSoQuyDoiVeDonViCoSo
                            );

            ketQua.put(
                    donViSanPham.getMaDonViSanPham(),
                    soLuongToiDa
            );
        }

        return ketQua;
    }
}