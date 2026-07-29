package com.pharma.backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.khuyenmai.KhuyenMaiRequest;
import com.pharma.backend.dto.khuyenmai.KhuyenMaiResponse;
import com.pharma.backend.entity.KhuyenMai;
import com.pharma.backend.repository.KhuyenMaiRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KhuyenMaiService {

    private static final String PHAN_TRAM = "PHAN_TRAM";
    private static final String SO_TIEN = "SO_TIEN";

    private static final String CHUA_BAT_DAU = "CHUA_BAT_DAU";
    private static final String DANG_DIEN_RA = "DANG_DIEN_RA";
    private static final String DA_KET_THUC = "DA_KET_THUC";

    private final KhuyenMaiRepository khuyenMaiRepository;

    @Transactional(readOnly = true)
    public List<KhuyenMaiResponse> layDanhSachKhuyenMai() {
        return khuyenMaiRepository.findAllOrderByThoiGianBatDauDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public KhuyenMaiResponse layChiTietKhuyenMai(Long maKhuyenMai) {
        return toResponse(timKhuyenMaiTheoMa(maKhuyenMai));
    }

    @Transactional
    public KhuyenMaiResponse themKhuyenMai(KhuyenMaiRequest request) {
        kiemTraNghiepVu(request);

        KhuyenMai khuyenMai = new KhuyenMai();
        ganDuLieuKhuyenMai(khuyenMai, request);

        return toResponse(khuyenMaiRepository.save(khuyenMai));
    }

    @Transactional
    public KhuyenMaiResponse capNhatKhuyenMai(
            long maKhuyenMai,
            KhuyenMaiRequest request
    ) {
        KhuyenMai khuyenMai = timKhuyenMaiTheoMa(maKhuyenMai);

        kiemTraNghiepVu(request);
        ganDuLieuKhuyenMai(khuyenMai, request);

        return toResponse(khuyenMaiRepository.save(khuyenMai));
    }

    private KhuyenMai timKhuyenMaiTheoMa(long maKhuyenMai) {
        return khuyenMaiRepository.findById(maKhuyenMai)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Không tìm thấy chương trình khuyến mãi"
                        )
                );
    }

    private void kiemTraNghiepVu(KhuyenMaiRequest request) {
        LocalDateTime batDau = request.getThoiGianBatDau();
        LocalDateTime ketThuc = request.getThoiGianKetThuc();

        if (!ketThuc.isAfter(batDau)) {
            throw new IllegalArgumentException(
                    "Thời gian kết thúc phải sau thời gian bắt đầu"
            );
        }

        String loaiKhuyenMai = request.getLoaiKhuyenMai().trim().toUpperCase();

        if (PHAN_TRAM.equals(loaiKhuyenMai)) {
            kiemTraKhuyenMaiPhanTram(request);
            return;
        }

        if (SO_TIEN.equals(loaiKhuyenMai)) {
            kiemTraKhuyenMaiSoTien(request);
            return;
        }

        throw new IllegalArgumentException(
                "Loại khuyến mãi chỉ nhận PHAN_TRAM hoặc SO_TIEN"
        );
    }

    private void kiemTraKhuyenMaiPhanTram(KhuyenMaiRequest request) {
        BigDecimal giamGia = request.getGiamGia();

        if (giamGia == null) {
            throw new IllegalArgumentException(
                    "Khuyến mãi phần trăm phải có phần trăm giảm"
            );
        }

        if (giamGia.compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new IllegalArgumentException(
                    "Phần trăm giảm không được vượt quá 100"
            );
        }

        if (request.getGiaTriGiam() != null) {
            throw new IllegalArgumentException(
                    "Khuyến mãi phần trăm không sử dụng giá trị giảm theo số tiền"
            );
        }
    }

    private void kiemTraKhuyenMaiSoTien(KhuyenMaiRequest request) {
        if (request.getGiaTriGiam() == null) {
            throw new IllegalArgumentException(
                    "Khuyến mãi số tiền phải có giá trị giảm"
            );
        }

        if (request.getGiamGia() != null) {
            throw new IllegalArgumentException(
                    "Khuyến mãi số tiền không sử dụng phần trăm giảm"
            );
        }
    }

    private void ganDuLieuKhuyenMai(
            KhuyenMai khuyenMai,
            KhuyenMaiRequest request
    ) {
        String loaiKhuyenMai = request.getLoaiKhuyenMai().trim().toUpperCase();

        khuyenMai.setTenChuongTrinh(request.getTenChuongTrinh().trim());
        khuyenMai.setLoaiKhuyenMai(loaiKhuyenMai);
        khuyenMai.setThoiGianBatDau(request.getThoiGianBatDau());
        khuyenMai.setThoiGianKetThuc(request.getThoiGianKetThuc());

        if (PHAN_TRAM.equals(loaiKhuyenMai)) {
            khuyenMai.setGiamGia(request.getGiamGia());
            khuyenMai.setGiaTriGiam(null);
        } else {
            khuyenMai.setGiamGia(null);
            khuyenMai.setGiaTriGiam(request.getGiaTriGiam());
        }

        khuyenMai.setTrangThaiKhuyenMai(
                xacDinhTrangThai(
                        request.getThoiGianBatDau(),
                        request.getThoiGianKetThuc()
                )
        );
    }

    private String xacDinhTrangThai(
            LocalDateTime thoiGianBatDau,
            LocalDateTime thoiGianKetThuc
    ) {
        LocalDateTime hienTai = LocalDateTime.now();

        if (hienTai.isBefore(thoiGianBatDau)) {
            return CHUA_BAT_DAU;
        }

        if (hienTai.isAfter(thoiGianKetThuc)) {
            return DA_KET_THUC;
        }

        return DANG_DIEN_RA;
    }

    private KhuyenMaiResponse toResponse(KhuyenMai khuyenMai) {
        String trangThaiHienTai = xacDinhTrangThai(
                khuyenMai.getThoiGianBatDau(),
                khuyenMai.getThoiGianKetThuc()
        );

        return KhuyenMaiResponse.builder()
                .maKhuyenMai(khuyenMai.getMaKhuyenMai())
                .tenChuongTrinh(khuyenMai.getTenChuongTrinh())
                .loaiKhuyenMai(khuyenMai.getLoaiKhuyenMai())
                .giamGia(khuyenMai.getGiamGia())
                .giaTriGiam(khuyenMai.getGiaTriGiam())
                .thoiGianBatDau(khuyenMai.getThoiGianBatDau())
                .thoiGianKetThuc(khuyenMai.getThoiGianKetThuc())
                .trangThaiKhuyenMai(trangThaiHienTai)
                .build();
    }
}