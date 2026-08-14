package com.pharma.backend.service.admin;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.admin.khuyenmai.CapNhatSanPhamKhuyenMaiRequest;
import com.pharma.backend.dto.admin.khuyenmai.KhuyenMaiRequest;
import com.pharma.backend.dto.admin.khuyenmai.KhuyenMaiResponse;
import com.pharma.backend.dto.admin.khuyenmai.KhuyenMaiSanPhamResponse;
import com.pharma.backend.entity.KhuyenMai;
import com.pharma.backend.entity.NhanVienNoiBo;
import com.pharma.backend.entity.SanPham;
import com.pharma.backend.enums.khuyenmai.KieuGiamGia;
import com.pharma.backend.repository.KhuyenMaiRepository;
import com.pharma.backend.repository.NhanVienNoiBoRepository;
import com.pharma.backend.repository.SanPhamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class KhuyenMaiService {

    private static final String LOAI_KHUYEN_MAI_SAN_PHAM = "SAN_PHAM";

    private final KhuyenMaiRepository khuyenMaiRepository;

    private final NhanVienNoiBoRepository nhanVienNoiBoRepository;

    private final SanPhamRepository sanPhamRepository;

    @Transactional(readOnly = true)
    public List<KhuyenMaiResponse> layDanhSachKhuyenMai() {
        return khuyenMaiRepository.findAllOrderByThoiGianBatDauDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public KhuyenMaiResponse layChiTietKhuyenMai(
            Long maKhuyenMai) {
        return toResponse(
                timKhuyenMaiTheoMa(maKhuyenMai));
    }

    @Transactional
    public KhuyenMaiResponse themKhuyenMai(
            KhuyenMaiRequest request) {
        kiemTraNghiepVu(request);

        KhuyenMai khuyenMai = new KhuyenMai();

        khuyenMai.setNhanVienTao(
                timNhanVienTao(
                        request.getMaNhanVienTao()));

        khuyenMai.setTrangThai(true);

        ganDuLieuKhuyenMai(
                khuyenMai,
                request);

        return toResponse(
                khuyenMaiRepository.save(
                        khuyenMai));
    }

    @Transactional
    public KhuyenMaiResponse capNhatKhuyenMai(
            long maKhuyenMai,
            KhuyenMaiRequest request) {
        KhuyenMai khuyenMai = timKhuyenMaiTheoMa(
                maKhuyenMai);

        kiemTraNghiepVu(
                request);

        /*
         * Khi thay đổi khoảng thời gian của chương trình,
         * phải kiểm tra các sản phẩm đang được gắn có bị
         * trùng với chương trình khuyến mãi khác hay không.
         */
        kiemTraDanhSachSanPhamDangGanKhiCapNhatThoiGian(
                khuyenMai,
                request);

        ganDuLieuKhuyenMai(
                khuyenMai,
                request);

        return toResponse(
                khuyenMaiRepository.save(
                        khuyenMai));
    }

    @Transactional(readOnly = true)
    public List<KhuyenMaiSanPhamResponse> layDanhSachSanPhamDangGan(
            Long maKhuyenMai) {

        KhuyenMai khuyenMai = timKhuyenMaiTheoMa(
                maKhuyenMai);

        kiemTraLaKhuyenMaiSanPham(
                khuyenMai);

        return khuyenMai.getDanhSachSanPham()
                .stream()
                .sorted(
                        Comparator.comparing(
                                SanPham::getTenSanPham,
                                String.CASE_INSENSITIVE_ORDER))
                .map(
                        sanPham -> toSanPhamResponse(
                                sanPham,
                                true))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<KhuyenMaiSanPhamResponse> layDanhSachSanPhamCoTheGan(
            Long maKhuyenMai) {

        KhuyenMai khuyenMai = timKhuyenMaiTheoMa(
                maKhuyenMai);

        kiemTraLaKhuyenMaiSanPham(
                khuyenMai);

        Set<Long> danhSachMaDangGan = khuyenMai.getDanhSachSanPham()
                .stream()
                .map(
                        SanPham::getMaSanPham)
                .collect(
                        java.util.stream.Collectors.toSet());

        return sanPhamRepository.findAll()
                .stream()
                .filter(
                        sanPham -> Boolean.TRUE.equals(
                                sanPham.getTrangThaiSanPham()))
                .filter(
                        sanPham -> !Boolean.TRUE.equals(
                                sanPham.getLaThuocKeDon()))
                .filter(
                        sanPham -> danhSachMaDangGan.contains(
                                sanPham.getMaSanPham())
                                || !sanPhamBiTrungKhuyenMai(
                                        sanPham.getMaSanPham(),
                                        khuyenMai,
                                        khuyenMai.getThoiGianBatDau(),
                                        khuyenMai.getThoiGianKetThuc()))
                .sorted(
                        Comparator.comparing(
                                SanPham::getTenSanPham,
                                String.CASE_INSENSITIVE_ORDER))
                .map(
                        sanPham -> toSanPhamResponse(
                                sanPham,
                                danhSachMaDangGan.contains(
                                        sanPham.getMaSanPham())))
                .toList();
    }

    @Transactional
    public List<KhuyenMaiSanPhamResponse> capNhatDanhSachSanPham(
            Long maKhuyenMai,
            CapNhatSanPhamKhuyenMaiRequest request) {

        KhuyenMai khuyenMai = timKhuyenMaiTheoMa(
                maKhuyenMai);

        kiemTraLaKhuyenMaiSanPham(
                khuyenMai);

        Set<Long> danhSachMaSanPham = request.getDanhSachMaSanPham() == null
                ? Set.of()
                : new HashSet<>(
                        request.getDanhSachMaSanPham());

        if (danhSachMaSanPham.isEmpty()) {
            khuyenMai.setDanhSachSanPham(
                    new HashSet<>());

            khuyenMaiRepository.save(
                    khuyenMai);

            return List.of();
        }

        List<SanPham> danhSachSanPham = sanPhamRepository.findAllById(
                danhSachMaSanPham);

        if (danhSachSanPham.size() != danhSachMaSanPham.size()) {
            throw new IllegalArgumentException(
                    "Có sản phẩm không tồn tại");
        }

        for (SanPham sanPham : danhSachSanPham) {
            kiemTraSanPhamCoTheGan(
                    sanPham,
                    khuyenMai);
        }

        khuyenMai.setDanhSachSanPham(
                new HashSet<>(
                        danhSachSanPham));

        KhuyenMai khuyenMaiDaLuu = khuyenMaiRepository.save(
                khuyenMai);

        return khuyenMaiDaLuu
                .getDanhSachSanPham()
                .stream()
                .sorted(
                        Comparator.comparing(
                                SanPham::getTenSanPham,
                                String.CASE_INSENSITIVE_ORDER))
                .map(
                        sanPham -> toSanPhamResponse(
                                sanPham,
                                true))
                .toList();
    }

    private KhuyenMai timKhuyenMaiTheoMa(
            long maKhuyenMai) {
        return khuyenMaiRepository.findById(
                maKhuyenMai)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Không tìm thấy chương trình khuyến mãi"));
    }

    private NhanVienNoiBo timNhanVienTao(
            Long maNhanVienTao) {
        if (maNhanVienTao == null
                || maNhanVienTao <= 0) {
            throw new IllegalArgumentException(
                    "Mã nhân viên tạo không hợp lệ");
        }

        return nhanVienNoiBoRepository.findById(
                maNhanVienTao)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Không tìm thấy nhân viên tạo khuyến mãi"));
    }

    private void kiemTraNghiepVu(
            KhuyenMaiRequest request) {
        if (request.getThoiGianKetThuc() == null
                || request.getThoiGianBatDau() == null
                || !request.getThoiGianKetThuc()
                        .isAfter(
                                request.getThoiGianBatDau())) {
            throw new IllegalArgumentException(
                    "Thời gian kết thúc phải sau thời gian bắt đầu");
        }

        if (request.getKieuGiamGia() == KieuGiamGia.PHAN_TRAM
                && request.getGiaTriGiam()
                        .compareTo(
                                BigDecimal.valueOf(100)) > 0) {
            throw new IllegalArgumentException(
                    "Giá trị giảm theo phần trăm không được vượt quá 100");
        }
    }

    private void kiemTraLaKhuyenMaiSanPham(
            KhuyenMai khuyenMai) {
        if (khuyenMai.getLoaiKhuyenMai() == null
                || !LOAI_KHUYEN_MAI_SAN_PHAM
                        .equalsIgnoreCase(
                                khuyenMai.getLoaiKhuyenMai())) {
            throw new IllegalArgumentException(
                    "Chương trình này không phải khuyến mãi sản phẩm");
        }
    }

    private void kiemTraSanPhamCoTheGan(
            SanPham sanPham,
            KhuyenMai khuyenMai) {
        if (!Boolean.TRUE.equals(
                sanPham.getTrangThaiSanPham())) {
            throw new IllegalArgumentException(
                    "Sản phẩm \""
                            + sanPham.getTenSanPham()
                            + "\" đang ngừng hoạt động");
        }

        if (Boolean.TRUE.equals(
                sanPham.getLaThuocKeDon())) {
            throw new IllegalArgumentException(
                    "Không thể áp dụng khuyến mãi cho thuốc kê đơn: "
                            + sanPham.getTenSanPham());
        }

        if (sanPhamBiTrungKhuyenMai(
                sanPham.getMaSanPham(),
                khuyenMai,
                khuyenMai.getThoiGianBatDau(),
                khuyenMai.getThoiGianKetThuc())) {
            throw new IllegalArgumentException(
                    "Sản phẩm \""
                            + sanPham.getTenSanPham()
                            + "\" đã thuộc chương trình khuyến mãi khác bị trùng thời gian");
        }
    }

    private boolean sanPhamBiTrungKhuyenMai(
            Long maSanPham,
            KhuyenMai khuyenMaiHienTai,
            java.time.LocalDateTime thoiGianBatDau,
            java.time.LocalDateTime thoiGianKetThuc) {
        return khuyenMaiRepository.findAll()
                .stream()
                .filter(
                        khuyenMaiKhac -> !khuyenMaiKhac
                                .getMaKhuyenMai()
                                .equals(
                                        khuyenMaiHienTai
                                                .getMaKhuyenMai()))
                .filter(
                        khuyenMaiKhac -> khuyenMaiKhac
                                .getLoaiKhuyenMai() != null
                                && LOAI_KHUYEN_MAI_SAN_PHAM
                                        .equalsIgnoreCase(
                                                khuyenMaiKhac
                                                        .getLoaiKhuyenMai()))
                .filter(
                        khuyenMaiKhac -> haiKhoangThoiGianBiTrung(
                                thoiGianBatDau,
                                thoiGianKetThuc,
                                khuyenMaiKhac
                                        .getThoiGianBatDau(),
                                khuyenMaiKhac
                                        .getThoiGianKetThuc()))
                .anyMatch(
                        khuyenMaiKhac -> khuyenMaiKhac
                                .getDanhSachSanPham()
                                .stream()
                                .anyMatch(
                                        sanPham -> sanPham
                                                .getMaSanPham()
                                                .equals(
                                                        maSanPham)));
    }

    private boolean haiKhoangThoiGianBiTrung(
            java.time.LocalDateTime batDau1,
            java.time.LocalDateTime ketThuc1,
            java.time.LocalDateTime batDau2,
            java.time.LocalDateTime ketThuc2) {
        return !ketThuc1.isBefore(
                batDau2)
                && !ketThuc2.isBefore(
                        batDau1);
    }

    private void kiemTraDanhSachSanPhamDangGanKhiCapNhatThoiGian(
            KhuyenMai khuyenMai,
            KhuyenMaiRequest request) {
        if (khuyenMai.getDanhSachSanPham() == null
                || khuyenMai
                        .getDanhSachSanPham()
                        .isEmpty()) {
            return;
        }

        for (SanPham sanPham : khuyenMai.getDanhSachSanPham()) {
            if (sanPhamBiTrungKhuyenMai(
                    sanPham.getMaSanPham(),
                    khuyenMai,
                    request.getThoiGianBatDau(),
                    request.getThoiGianKetThuc())) {
                throw new IllegalArgumentException(
                        "Không thể cập nhật thời gian vì sản phẩm \""
                                + sanPham.getTenSanPham()
                                + "\" bị trùng với chương trình khuyến mãi khác");
            }
        }
    }

    private void ganDuLieuKhuyenMai(
            KhuyenMai khuyenMai,
            KhuyenMaiRequest request) {
        khuyenMai.setTenChuongTrinh(
                request.getTenChuongTrinh()
                        .trim());

        khuyenMai.setLoaiKhuyenMai(
                request.getLoaiKhuyenMai()
                        .trim()
                        .toUpperCase());

        khuyenMai.setKieuGiamGia(
                request.getKieuGiamGia());

        khuyenMai.setGiaTriGiam(
                request.getGiaTriGiam());

        khuyenMai.setThoiGianBatDau(
                request.getThoiGianBatDau());

        khuyenMai.setThoiGianKetThuc(
                request.getThoiGianKetThuc());
    }

    private KhuyenMaiResponse toResponse(
            KhuyenMai khuyenMai) {
        return KhuyenMaiResponse.builder()
                .maKhuyenMai(
                        khuyenMai.getMaKhuyenMai())
                .tenChuongTrinh(
                        khuyenMai.getTenChuongTrinh())
                .loaiKhuyenMai(
                        khuyenMai.getLoaiKhuyenMai())
                .kieuGiamGia(
                        khuyenMai.getKieuGiamGia())
                .giaTriGiam(
                        khuyenMai.getGiaTriGiam())
                .thoiGianBatDau(
                        khuyenMai.getThoiGianBatDau())
                .thoiGianKetThuc(
                        khuyenMai.getThoiGianKetThuc())
                .trangThai(
                        khuyenMai.getTrangThai())
                .build();
    }

    private KhuyenMaiSanPhamResponse toSanPhamResponse(
            SanPham sanPham,
            boolean dangDuocGan) {
        return KhuyenMaiSanPhamResponse.builder()
                .maSanPham(
                        sanPham.getMaSanPham())
                .tenSanPham(
                        sanPham.getTenSanPham())
                .laThuocKeDon(
                        sanPham.getLaThuocKeDon())
                .trangThaiSanPham(
                        sanPham.getTrangThaiSanPham())
                .dangDuocGan(
                        dangDuocGan)
                .build();
    }
}