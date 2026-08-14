package com.pharma.backend.service.admin;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.admin.voucherdonhang.VoucherDonHangRequest;
import com.pharma.backend.dto.admin.voucherdonhang.VoucherDonHangResponse;
import com.pharma.backend.entity.NhanVienNoiBo;
import com.pharma.backend.entity.VoucherDonHang;
import com.pharma.backend.repository.NhanVienNoiBoRepository;
import com.pharma.backend.repository.VoucherDonHangRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoucherDonHangService {

    private final VoucherDonHangRepository voucherDonHangRepository;

    private final NhanVienNoiBoRepository nhanVienNoiBoRepository;

    @Transactional(readOnly = true)
    public List<VoucherDonHangResponse> layDanhSachVoucher() {
        return voucherDonHangRepository.findAll()
                .stream()
                .sorted(
                        Comparator.comparing(
                                VoucherDonHang::getMaVoucher,
                                Comparator.reverseOrder()
                        )
                )
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public VoucherDonHangResponse themVoucher(
            VoucherDonHangRequest request,
            Long maNhanVienTao
    ) {
        kiemTraThoiGianHopLe(request);

        NhanVienNoiBo nhanVienTao =
                nhanVienNoiBoRepository.findById(maNhanVienTao)
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Không tìm thấy nhân viên tạo voucher"
                                )
                        );

        VoucherDonHang voucher =
                new VoucherDonHang();

        voucher.setNhanVienTao(
                nhanVienTao
        );

        ganDuLieuTuRequest(
                voucher,
                request
        );

        voucher.setSoLuongDaSuDung(0);
        voucher.setTrangThai(true);

        return toResponse(
                voucherDonHangRepository.save(
                        voucher
                )
        );
    }

    @Transactional
    public VoucherDonHangResponse capNhatVoucher(
            Long maVoucher,
            VoucherDonHangRequest request
    ) {
        VoucherDonHang voucher =
                voucherDonHangRepository.findById(maVoucher)
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Không tìm thấy voucher"
                                )
                        );

        kiemTraThoiGianHopLe(request);

        ganDuLieuTuRequest(
                voucher,
                request
        );

        return toResponse(
                voucherDonHangRepository.save(
                        voucher
                )
        );
    }

    @Transactional
    public VoucherDonHangResponse doiTrangThaiVoucher(
            Long maVoucher
    ) {
        VoucherDonHang voucher =
                voucherDonHangRepository.findById(maVoucher)
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Không tìm thấy voucher"
                                )
                        );

        voucher.setTrangThai(
                !Boolean.TRUE.equals(
                        voucher.getTrangThai()
                )
        );

        return toResponse(
                voucherDonHangRepository.save(
                        voucher
                )
        );
    }

    private void ganDuLieuTuRequest(
            VoucherDonHang voucher,
            VoucherDonHangRequest request
    ) {
        voucher.setMaGiamGia(
                request.getMaGiamGia().trim()
        );

        voucher.setTenVoucher(
                request.getTenVoucher().trim()
        );

        voucher.setLoaiGiamGia(
                request.getLoaiGiamGia()
        );

        voucher.setGiaTriGiam(
                request.getGiaTriGiam()
        );

        voucher.setSoTienGiamToiDa(
                request.getSoTienGiamToiDa()
        );

        voucher.setDonGiaToiThieu(
                request.getDonGiaToiThieu()
        );

        voucher.setThoiGianBatDau(
                request.getThoiGianBatDau()
        );

        voucher.setThoiGianKetThuc(
                request.getThoiGianKetThuc()
        );

        voucher.setSoLuongSuDung(
                request.getSoLuongSuDung()
        );
    }

    private void kiemTraThoiGianHopLe(
            VoucherDonHangRequest request
    ) {
        if (
                !request.getThoiGianKetThuc()
                        .isAfter(
                                request.getThoiGianBatDau()
                        )
        ) {
            throw new IllegalArgumentException(
                    "Thời gian kết thúc phải sau thời gian bắt đầu"
            );
        }
    }

    private VoucherDonHangResponse toResponse(
            VoucherDonHang voucher
    ) {
        return VoucherDonHangResponse.builder()
                .maVoucher(
                        voucher.getMaVoucher()
                )
                .maGiamGia(
                        voucher.getMaGiamGia()
                )
                .tenVoucher(
                        voucher.getTenVoucher()
                )
                .loaiGiamGia(
                        voucher.getLoaiGiamGia()
                )
                .giaTriGiam(
                        voucher.getGiaTriGiam()
                )
                .soTienGiamToiDa(
                        voucher.getSoTienGiamToiDa()
                )
                .donGiaToiThieu(
                        voucher.getDonGiaToiThieu()
                )
                .thoiGianBatDau(
                        voucher.getThoiGianBatDau()
                )
                .thoiGianKetThuc(
                        voucher.getThoiGianKetThuc()
                )
                .soLuongSuDung(
                        voucher.getSoLuongSuDung()
                )
                .soLuongDaSuDung(
                        voucher.getSoLuongDaSuDung()
                )
                .trangThai(
                        voucher.getTrangThai()
                )
                .build();
    }
}