package com.pharma.backend.service.admin;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.admin.khuyenmai.KhuyenMaiRequest;
import com.pharma.backend.dto.admin.khuyenmai.KhuyenMaiResponse;
import com.pharma.backend.entity.KhuyenMai;
import com.pharma.backend.entity.NhanVienNoiBo;
import com.pharma.backend.enums.khuyenmai.KieuGiamGia;
import com.pharma.backend.repository.KhuyenMaiRepository;
import com.pharma.backend.repository.NhanVienNoiBoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KhuyenMaiService {

    private final KhuyenMaiRepository khuyenMaiRepository;
    private final NhanVienNoiBoRepository nhanVienNoiBoRepository;

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
        khuyenMai.setNhanVienTao(timNhanVienTao(request.getMaNhanVienTao()));
        khuyenMai.setTrangThai(true);
        ganDuLieuKhuyenMai(khuyenMai, request);

        return toResponse(khuyenMaiRepository.save(khuyenMai));
    }

    @Transactional
    public KhuyenMaiResponse capNhatKhuyenMai(long maKhuyenMai, KhuyenMaiRequest request) {
        KhuyenMai khuyenMai = timKhuyenMaiTheoMa(maKhuyenMai);

        kiemTraNghiepVu(request);
        ganDuLieuKhuyenMai(khuyenMai, request);

        return toResponse(khuyenMaiRepository.save(khuyenMai));
    }

    private KhuyenMai timKhuyenMaiTheoMa(long maKhuyenMai) {
        return khuyenMaiRepository.findById(maKhuyenMai)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy chương trình khuyến mãi"
                ));
    }

    private NhanVienNoiBo timNhanVienTao(Long maNhanVienTao) {
        if (maNhanVienTao == null || maNhanVienTao <= 0) {
            throw new IllegalArgumentException("Mã nhân viên tạo không hợp lệ");
        }

        return nhanVienNoiBoRepository.findById(maNhanVienTao)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy nhân viên tạo khuyến mãi"
                ));
    }

    private void kiemTraNghiepVu(KhuyenMaiRequest request) {
        if (request.getThoiGianKetThuc() == null
                || request.getThoiGianBatDau() == null
                || !request.getThoiGianKetThuc().isAfter(request.getThoiGianBatDau())) {
            throw new IllegalArgumentException(
                    "Thời gian kết thúc phải sau thời gian bắt đầu"
            );
        }

        if (request.getKieuGiamGia() == KieuGiamGia.PHAN_TRAM
                && request.getGiaTriGiam().compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new IllegalArgumentException(
                    "Giá trị giảm theo phần trăm không được vượt quá 100"
            );
        }
    }

    private void ganDuLieuKhuyenMai(KhuyenMai khuyenMai, KhuyenMaiRequest request) {
        khuyenMai.setTenChuongTrinh(request.getTenChuongTrinh().trim());
        khuyenMai.setLoaiKhuyenMai(request.getLoaiKhuyenMai().trim().toUpperCase());
        khuyenMai.setKieuGiamGia(request.getKieuGiamGia());
        khuyenMai.setGiaTriGiam(request.getGiaTriGiam());
        khuyenMai.setThoiGianBatDau(request.getThoiGianBatDau());
        khuyenMai.setThoiGianKetThuc(request.getThoiGianKetThuc());
    }

    private KhuyenMaiResponse toResponse(KhuyenMai khuyenMai) {
        return KhuyenMaiResponse.builder()
                .maKhuyenMai(khuyenMai.getMaKhuyenMai())
                .tenChuongTrinh(khuyenMai.getTenChuongTrinh())
                .loaiKhuyenMai(khuyenMai.getLoaiKhuyenMai())
                .kieuGiamGia(khuyenMai.getKieuGiamGia())
                .giaTriGiam(khuyenMai.getGiaTriGiam())
                .thoiGianBatDau(khuyenMai.getThoiGianBatDau())
                .thoiGianKetThuc(khuyenMai.getThoiGianKetThuc())
                .trangThai(khuyenMai.getTrangThai())
                .build();
    }
}
