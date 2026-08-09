package com.pharma.backend.service.khachhang;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.enums.khuyenmai.KieuGiamGia;
import com.pharma.backend.repository.KhuyenMaiKhachHangRepository;
import com.pharma.backend.repository.KhuyenMaiKhachHangRepository.KhuyenMaiSanPhamProjection;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TinhGiaSanPhamService {

    private static final String LOAI_KHUYEN_MAI_SAN_PHAM =
            "SAN_PHAM";

    private static final int SO_CHU_SO_THAP_PHAN = 2;

    private static final BigDecimal MOT_TRAM =
            BigDecimal.valueOf(100);

    private final KhuyenMaiKhachHangRepository
            khuyenMaiKhachHangRepository;

    /**
     * Tính giá hàng loạt cho nhiều đơn vị sản phẩm.
     *
     * Toàn bộ đơn vị trong một lần gọi sử dụng chung một thời điểm,
     * tránh trường hợp khuyến mãi thay đổi giữa lúc đang xử lý.
     *
     * Map kết quả được đánh khóa bằng mã đơn vị sản phẩm.
     */
    public Map<Long, KetQuaTinhGiaSanPham>
            tinhGiaTheoDanhSachDonVi(
                    Collection<DonViSanPham> danhSachDonVi,
                    LocalDateTime thoiDiem
            ) {
        if (danhSachDonVi == null
                || danhSachDonVi.isEmpty()) {
            return Map.of();
        }

        if (thoiDiem == null) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Thời điểm tính giá không được để trống."
            );
        }

        List<DonViSanPham> danhSachDonViHopLe =
                danhSachDonVi.stream()
                        .filter(donVi -> donVi != null)
                        .toList();

        if (danhSachDonViHopLe.isEmpty()) {
            return Map.of();
        }

        for (DonViSanPham donViSanPham
                : danhSachDonViHopLe) {
            kiemTraDonViSanPham(donViSanPham);
        }

        List<Long> danhSachMaSanPham =
                danhSachDonViHopLe.stream()
                        .map(donVi ->
                                donVi.getSanPham()
                                        .getMaSanPham()
                        )
                        .distinct()
                        .toList();

        List<KhuyenMaiSanPhamProjection>
                danhSachKhuyenMai =
                khuyenMaiKhachHangRepository
                        .layKhuyenMaiSanPhamDangApDung(
                                danhSachMaSanPham,
                                LOAI_KHUYEN_MAI_SAN_PHAM,
                                thoiDiem
                        );

        Map<Long, TongHopKhuyenMai>
                khuyenMaiTheoSanPham =
                tongHopKhuyenMaiTheoSanPham(
                        danhSachKhuyenMai
                );

        Map<Long, KetQuaTinhGiaSanPham> ketQuaTheoDonVi =
                new LinkedHashMap<>();

        for (DonViSanPham donViSanPham
                : danhSachDonViHopLe) {
            Long maSanPham =
                    donViSanPham.getSanPham()
                            .getMaSanPham();

            TongHopKhuyenMai tongHopKhuyenMai =
                    khuyenMaiTheoSanPham.getOrDefault(
                            maSanPham,
                            TongHopKhuyenMai.khongCoKhuyenMai()
                    );

            KetQuaTinhGiaSanPham ketQua =
                    tinhGiaChoDonVi(
                            donViSanPham,
                            tongHopKhuyenMai
                    );

            ketQuaTheoDonVi.put(
                    donViSanPham.getMaDonViSanPham(),
                    ketQua
            );
        }

        return ketQuaTheoDonVi;
    }

    /**
     * Tính giá cho một đơn vị sản phẩm.
     *
     * Hàm này phù hợp với các luồng chỉ xử lý một đơn vị.
     * Các luồng danh sách, giỏ hàng hoặc đơn hàng nên gọi hàm hàng loạt.
     */
    public KetQuaTinhGiaSanPham tinhGiaChoDonVi(
            DonViSanPham donViSanPham,
            LocalDateTime thoiDiem
    ) {
        if (donViSanPham == null) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Thông tin đơn vị sản phẩm không hợp lệ."
            );
        }

        Map<Long, KetQuaTinhGiaSanPham> ketQua =
                tinhGiaTheoDanhSachDonVi(
                        List.of(donViSanPham),
                        thoiDiem
                );

        return ketQua.get(
                donViSanPham.getMaDonViSanPham()
        );
    }

    private Map<Long, TongHopKhuyenMai>
            tongHopKhuyenMaiTheoSanPham(
                    List<KhuyenMaiSanPhamProjection>
                            danhSachKhuyenMai
            ) {
        Map<Long, TongHopKhuyenMai> ketQua =
                new LinkedHashMap<>();

        if (danhSachKhuyenMai == null) {
            return ketQua;
        }

        for (KhuyenMaiSanPhamProjection khuyenMai
                : danhSachKhuyenMai) {
            kiemTraDuLieuKhuyenMai(khuyenMai);

            TongHopKhuyenMai tongHop =
                    ketQua.computeIfAbsent(
                            khuyenMai.getMaSanPham(),
                            maSanPham ->
                                    TongHopKhuyenMai
                                            .khongCoKhuyenMai()
                    );

            if (khuyenMai.getKieuGiamGia()
                    == KieuGiamGia.PHAN_TRAM) {
                tongHop.congPhanTram(
                        khuyenMai.getGiaTriGiam()
                );
            } else if (khuyenMai.getKieuGiamGia()
                    == KieuGiamGia.SO_TIEN) {
                tongHop.congSoTien(
                        khuyenMai.getGiaTriGiam()
                );
            }
        }

        return ketQua;
    }

    private KetQuaTinhGiaSanPham tinhGiaChoDonVi(
            DonViSanPham donViSanPham,
            TongHopKhuyenMai tongHopKhuyenMai
    ) {
        BigDecimal giaGoc =
                donViSanPham.getGiaBanTheoDonVi()
                        .setScale(
                                SO_CHU_SO_THAP_PHAN,
                                RoundingMode.HALF_UP
                        );

        BigDecimal tongPhanTram =
                tongHopKhuyenMai.tongPhanTram()
                        .setScale(
                                SO_CHU_SO_THAP_PHAN,
                                RoundingMode.HALF_UP
                        );

        BigDecimal tongSoTien =
                tongHopKhuyenMai.tongSoTien()
                        .setScale(
                                SO_CHU_SO_THAP_PHAN,
                                RoundingMode.HALF_UP
                        );

        BigDecimal soTienGiamTheoPhanTram =
                giaGoc.multiply(tongPhanTram)
                        .divide(
                                MOT_TRAM,
                                SO_CHU_SO_THAP_PHAN,
                                RoundingMode.HALF_UP
                        );

        BigDecimal soTienGiamMoiDonVi =
                soTienGiamTheoPhanTram
                        .add(tongSoTien)
                        .setScale(
                                SO_CHU_SO_THAP_PHAN,
                                RoundingMode.HALF_UP
                        );

        BigDecimal giaSauKhuyenMai =
                giaGoc.subtract(soTienGiamMoiDonVi)
                        .setScale(
                                SO_CHU_SO_THAP_PHAN,
                                RoundingMode.HALF_UP
                        );

        if (giaSauKhuyenMai.compareTo(
                BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Dữ liệu khuyến mãi làm giá sản phẩm nhỏ hơn 0."
            );
        }

        boolean coKhuyenMai =
                soTienGiamMoiDonVi.compareTo(
                        BigDecimal.ZERO) > 0;

        return new KetQuaTinhGiaSanPham(
                donViSanPham.getSanPham()
                        .getMaSanPham(),
                donViSanPham.getMaDonViSanPham(),
                giaGoc,
                tongPhanTram,
                tongSoTien,
                soTienGiamMoiDonVi,
                giaSauKhuyenMai,
                coKhuyenMai,
                taoCachTinhGia(
                        tongPhanTram,
                        tongSoTien,
                        coKhuyenMai
                )
        );
    }

    private void kiemTraDonViSanPham(
            DonViSanPham donViSanPham
    ) {
        if (donViSanPham.getMaDonViSanPham() == null
                || donViSanPham.getSanPham() == null
                || donViSanPham.getSanPham()
                        .getMaSanPham() == null) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Thông tin đơn vị sản phẩm không hợp lệ."
            );
        }

        if (donViSanPham.getGiaBanTheoDonVi() == null
                || donViSanPham.getGiaBanTheoDonVi()
                        .compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Giá bán theo đơn vị không hợp lệ."
            );
        }
    }

    private void kiemTraDuLieuKhuyenMai(
            KhuyenMaiSanPhamProjection khuyenMai
    ) {
        if (khuyenMai == null
                || khuyenMai.getMaSanPham() == null
                || khuyenMai.getMaKhuyenMai() == null
                || khuyenMai.getKieuGiamGia() == null
                || khuyenMai.getGiaTriGiam() == null
                || khuyenMai.getGiaTriGiam()
                        .compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Dữ liệu khuyến mãi sản phẩm không hợp lệ."
            );
        }
    }

    private String taoCachTinhGia(
            BigDecimal tongPhanTram,
            BigDecimal tongSoTien,
            boolean coKhuyenMai
    ) {
        if (!coKhuyenMai) {
            return "GIA_BAN_THEO_DON_VI";
        }

        boolean coGiamPhanTram =
                tongPhanTram.compareTo(
                        BigDecimal.ZERO) > 0;

        boolean coGiamSoTien =
                tongSoTien.compareTo(
                        BigDecimal.ZERO) > 0;

        if (coGiamPhanTram && coGiamSoTien) {
            return "KM SP: "
                    + boSoKhongDuThua(tongPhanTram)
                    + "% + "
                    + boSoKhongDuThua(tongSoTien)
                    + "đ";
        }

        if (coGiamPhanTram) {
            return "KM SP: "
                    + boSoKhongDuThua(tongPhanTram)
                    + "%";
        }

        return "KM SP: "
                + boSoKhongDuThua(tongSoTien)
                + "đ";
    }

    private String boSoKhongDuThua(
            BigDecimal giaTri
    ) {
        return giaTri.stripTrailingZeros()
                .toPlainString();
    }

    /**
     * Tổng hợp khuyến mãi của một sản phẩm.
     *
     * Dùng lớp mutable nội bộ để cộng nhiều chương trình đang hiệu lực.
     */
    private static final class TongHopKhuyenMai {

        private BigDecimal tongPhanTram;
        private BigDecimal tongSoTien;

        private TongHopKhuyenMai(
                BigDecimal tongPhanTram,
                BigDecimal tongSoTien
        ) {
            this.tongPhanTram = tongPhanTram;
            this.tongSoTien = tongSoTien;
        }

        private static TongHopKhuyenMai
                khongCoKhuyenMai() {
            return new TongHopKhuyenMai(
                    BigDecimal.ZERO,
                    BigDecimal.ZERO
            );
        }

        private void congPhanTram(
                BigDecimal giaTri
        ) {
            tongPhanTram =
                    tongPhanTram.add(giaTri);
        }

        private void congSoTien(
                BigDecimal giaTri
        ) {
            tongSoTien =
                    tongSoTien.add(giaTri);
        }

        private BigDecimal tongPhanTram() {
            return tongPhanTram;
        }

        private BigDecimal tongSoTien() {
            return tongSoTien;
        }
    }
}