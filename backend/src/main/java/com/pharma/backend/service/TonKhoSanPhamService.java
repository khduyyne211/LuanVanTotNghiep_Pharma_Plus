package com.pharma.backend.service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Deque;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.QuyDoiDonVi;
import com.pharma.backend.enums.nhapkho.TrangThaiLo;
import com.pharma.backend.enums.nhapkho.TrangThaiPhieuNhap;
import com.pharma.backend.repository.ChiTietPhieuNhapRepository;
import com.pharma.backend.repository.ChiTietPhieuNhapRepository.TonKhaDungTheoSanPhamProjection;
import com.pharma.backend.repository.QuyDoiDonViRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TonKhoSanPhamService {

    private final ChiTietPhieuNhapRepository chiTietPhieuNhapRepository;
    private final QuyDoiDonViRepository quyDoiDonViRepository;

    /**
     * Lấy tổng tồn khả dụng theo đơn vị cơ sở cho nhiều sản phẩm.
     *
     * Sản phẩm chưa từng nhập hoặc không còn lô hợp lệ sẽ có tồn bằng 0.
     */
    public Map<Long, BigDecimal> layTonKhaDungTheoDanhSachSanPham(
            Collection<Long> danhSachMaSanPham) {
        List<Long> danhSachMaHopLe = chuanHoaDanhSachMaSanPham(danhSachMaSanPham);

        if (danhSachMaHopLe.isEmpty()) {
            return Map.of();
        }

        Map<Long, BigDecimal> tonTheoSanPham = new LinkedHashMap<>();

        for (Long maSanPham : danhSachMaHopLe) {
            tonTheoSanPham.put(maSanPham, BigDecimal.ZERO);
        }

        List<TonKhaDungTheoSanPhamProjection> danhSachTon = chiTietPhieuNhapRepository
                .tinhTongTonKhaDungTheoDanhSachSanPham(
                        danhSachMaHopLe,
                        TrangThaiLo.DANG_SU_DUNG,
                        TrangThaiPhieuNhap.DA_NHAP);

        for (TonKhaDungTheoSanPhamProjection thongTinTon : danhSachTon) {
            if (thongTinTon.getMaSanPham() == null) {
                continue;
            }

            BigDecimal tonKhaDung = thongTinTon.getTonKhaDungTheoQuyDoi() != null
                    ? thongTinTon.getTonKhaDungTheoQuyDoi()
                    : BigDecimal.ZERO;

            tonTheoSanPham.put(
                    thongTinTon.getMaSanPham(),
                    tonKhaDung);
        }

        return tonTheoSanPham;
    }

    /**
     * Lấy toàn bộ quy đổi đang hoạt động của nhiều sản phẩm trong một truy vấn.
     */
    public Map<Long, List<QuyDoiDonVi>> layQuyDoiTheoDanhSachSanPham(
            Collection<Long> danhSachMaSanPham) {
        List<Long> danhSachMaHopLe = chuanHoaDanhSachMaSanPham(danhSachMaSanPham);

        if (danhSachMaHopLe.isEmpty()) {
            return Map.of();
        }

        Map<Long, List<QuyDoiDonVi>> quyDoiTheoSanPham = quyDoiDonViRepository
                .findBySanPham_MaSanPhamInAndTrangThaiTrue(
                        danhSachMaHopLe)
                .stream()
                .collect(Collectors.groupingBy(
                        quyDoi -> quyDoi.getSanPham().getMaSanPham(),
                        LinkedHashMap::new,
                        Collectors.toList()));

        for (Long maSanPham : danhSachMaHopLe) {
            quyDoiTheoSanPham.putIfAbsent(
                    maSanPham,
                    List.of());
        }

        return quyDoiTheoSanPham;
    }

    /**
     * Tính số đơn vị cơ sở tương ứng với một đơn vị bán.
     *
     * Hỗ trợ chuỗi quy đổi nhiều cấp và quy đổi theo cả hai chiều.
     */
    public BigDecimal tinhHeSoVeDonViCoSo(
            DonViSanPham donViBan,
            List<QuyDoiDonVi> danhSachQuyDoi) {
        if (donViBan == null
                || donViBan.getMaDonViSanPham() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Thông tin đơn vị sản phẩm không hợp lệ.");
        }

        if (Boolean.TRUE.equals(donViBan.getLaDonViCoSo())) {
            return BigDecimal.ONE;
        }

        Map<Long, List<BuocQuyDoi>> doThiQuyDoi = taoDoThiQuyDoi(danhSachQuyDoi);

        Deque<TrangThaiQuyDoi> hangDoi = new ArrayDeque<>();
        Set<Long> danhSachDaDuyet = new HashSet<>();

        hangDoi.addLast(new TrangThaiQuyDoi(
                donViBan,
                BigDecimal.ONE));

        while (!hangDoi.isEmpty()) {
            TrangThaiQuyDoi trangThai = hangDoi.removeFirst();

            DonViSanPham donViHienTai = trangThai.donViSanPham();

            Long maDonViHienTai = donViHienTai.getMaDonViSanPham();

            if (!danhSachDaDuyet.add(maDonViHienTai)) {
                continue;
            }

            if (Boolean.TRUE.equals(
                    donViHienTai.getLaDonViCoSo())) {
                return trangThai.heSoTuDonViBan();
            }

            List<BuocQuyDoi> danhSachBuoc = doThiQuyDoi.getOrDefault(
                    maDonViHienTai,
                    List.of());

            for (BuocQuyDoi buocQuyDoi : danhSachBuoc) {
                BigDecimal heSoMoi = trangThai.heSoTuDonViBan().multiply(
                        buocQuyDoi.heSo(),
                        MathContext.DECIMAL128);

                hangDoi.addLast(new TrangThaiQuyDoi(
                        buocQuyDoi.donViDich(),
                        heSoMoi));
            }
        }

        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Không tìm thấy đường quy đổi từ đơn vị bán về đơn vị cơ sở.");
    }

    /**
     * Tính tổng số lượng cần theo đơn vị cơ sở.
     */
    public BigDecimal tinhSoLuongCanTheoQuyDoi(
            DonViSanPham donViBan,
            Integer soLuong,
            List<QuyDoiDonVi> danhSachQuyDoi) {
        if (soLuong == null || soLuong <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Số lượng sản phẩm phải lớn hơn 0.");
        }

        BigDecimal heSoQuyDoi = tinhHeSoVeDonViCoSo(
                donViBan,
                danhSachQuyDoi);

        return heSoQuyDoi.multiply(
                BigDecimal.valueOf(soLuong),
                MathContext.DECIMAL128);
    }

    /**
     * Kiểm tra tổng nhu cầu của từng sản phẩm có vượt tồn khả dụng hay không.
     */
    public boolean kiemTraDuTon(
            Map<Long, BigDecimal> tongCanTheoSanPham,
            Map<Long, BigDecimal> tonTheoSanPham) {
        if (tongCanTheoSanPham == null
                || tongCanTheoSanPham.isEmpty()) {
            return true;
        }

        Map<Long, BigDecimal> duLieuTon = tonTheoSanPham != null
                ? tonTheoSanPham
                : Map.of();

        for (Map.Entry<Long, BigDecimal> entry : tongCanTheoSanPham.entrySet()) {
            BigDecimal soLuongCan = entry.getValue();

            if (soLuongCan == null
                    || soLuongCan.compareTo(BigDecimal.ZERO) <= 0) {
                return false;
            }

            BigDecimal tonKhaDung = duLieuTon.getOrDefault(
                    entry.getKey(),
                    BigDecimal.ZERO);

            if (soLuongCan.compareTo(tonKhaDung) > 0) {
                return false;
            }
        }

        return true;
    }

    /**
     * Tính số lượng nguyên tối đa có thể bán theo một đơn vị.
     */
    public int tinhSoLuongToiDaCoTheBan(
            BigDecimal tonKhaDungTheoQuyDoi,
            BigDecimal heSoQuyDoiVeDonViCoSo) {
        if (tonKhaDungTheoQuyDoi == null
                || tonKhaDungTheoQuyDoi.compareTo(BigDecimal.ZERO) <= 0) {
            return 0;
        }

        if (heSoQuyDoiVeDonViCoSo == null
                || heSoQuyDoiVeDonViCoSo.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Hệ số quy đổi của đơn vị sản phẩm không hợp lệ.");
        }

        BigDecimal soLuongToiDa = tonKhaDungTheoQuyDoi.divide(
                heSoQuyDoiVeDonViCoSo,
                0,
                RoundingMode.DOWN);

        BigDecimal gioiHanInteger = BigDecimal.valueOf(Integer.MAX_VALUE);

        if (soLuongToiDa.compareTo(gioiHanInteger) > 0) {
            return Integer.MAX_VALUE;
        }

        return soLuongToiDa.intValue();
    }

    private List<Long> chuanHoaDanhSachMaSanPham(
            Collection<Long> danhSachMaSanPham) {
        if (danhSachMaSanPham == null
                || danhSachMaSanPham.isEmpty()) {
            return List.of();
        }

        return danhSachMaSanPham.stream()
                .filter(maSanPham -> maSanPham != null && maSanPham > 0)
                .distinct()
                .toList();
    }

    private Map<Long, List<BuocQuyDoi>> taoDoThiQuyDoi(
            List<QuyDoiDonVi> danhSachQuyDoi) {
        Map<Long, List<BuocQuyDoi>> doThiQuyDoi = new HashMap<>();

        if (danhSachQuyDoi == null) {
            return doThiQuyDoi;
        }

        for (QuyDoiDonVi quyDoi : danhSachQuyDoi) {
            if (!laQuyDoiHopLe(quyDoi)) {
                continue;
            }

            BigDecimal heSoNguonSangDich = quyDoi.getSoLuongDich().divide(
                    quyDoi.getSoLuongNguon(),
                    MathContext.DECIMAL128);

            BigDecimal heSoDichSangNguon = quyDoi.getSoLuongNguon().divide(
                    quyDoi.getSoLuongDich(),
                    MathContext.DECIMAL128);

            themCanhQuyDoi(
                    doThiQuyDoi,
                    quyDoi.getDonViNguon(),
                    quyDoi.getDonViDich(),
                    heSoNguonSangDich);

            themCanhQuyDoi(
                    doThiQuyDoi,
                    quyDoi.getDonViDich(),
                    quyDoi.getDonViNguon(),
                    heSoDichSangNguon);
        }

        return doThiQuyDoi;
    }

    private boolean laQuyDoiHopLe(
            QuyDoiDonVi quyDoi) {
        return quyDoi != null
                && Boolean.TRUE.equals(quyDoi.getTrangThai())
                && quyDoi.getDonViNguon() != null
                && quyDoi.getDonViDich() != null
                && quyDoi.getSoLuongNguon() != null
                && quyDoi.getSoLuongDich() != null
                && quyDoi.getSoLuongNguon()
                        .compareTo(BigDecimal.ZERO) > 0
                && quyDoi.getSoLuongDich()
                        .compareTo(BigDecimal.ZERO) > 0;
    }

    private void themCanhQuyDoi(
            Map<Long, List<BuocQuyDoi>> doThiQuyDoi,
            DonViSanPham donViNguon,
            DonViSanPham donViDich,
            BigDecimal heSo) {
        doThiQuyDoi.computeIfAbsent(
                donViNguon.getMaDonViSanPham(),
                maDonVi -> new ArrayList<>()).add(
                        new BuocQuyDoi(
                                donViDich,
                                heSo));
    }

    private record BuocQuyDoi(
            DonViSanPham donViDich,
            BigDecimal heSo) {

    }

    private record TrangThaiQuyDoi(
            DonViSanPham donViSanPham,
            BigDecimal heSoTuDonViBan) {

    }
}
