package com.pharma.backend.service.admin;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Queue;
import java.util.Set;
import java.time.LocalDate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.admin.phieunhap.ChiTietPhieuNhapResponse;
import com.pharma.backend.dto.admin.phieunhap.ChiTietPhieuNhapTaoMoiRequest;
import com.pharma.backend.dto.admin.phieunhap.PhieuNhapResponse;
import com.pharma.backend.dto.admin.phieunhap.PhieuNhapTaoMoiRequest;
import com.pharma.backend.entity.ChiTietPhieuNhap;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.DonViTinh;
import com.pharma.backend.entity.NhaCungCap;
import com.pharma.backend.entity.NhanVienNoiBo;
import com.pharma.backend.entity.PhieuNhapKho;
import com.pharma.backend.entity.QuyDoiDonVi;
import com.pharma.backend.entity.SanPham;
import com.pharma.backend.enums.nhapkho.TrangThaiLo;
import com.pharma.backend.enums.nhapkho.TrangThaiPhieuNhap;
import com.pharma.backend.repository.ChiTietPhieuNhapRepository;
import com.pharma.backend.repository.DonViSanPhamRepository;
import com.pharma.backend.repository.NhaCungCapRepository;
import com.pharma.backend.repository.NhanVienNoiBoRepository;
import com.pharma.backend.repository.PhieuNhapKhoRepository;
import com.pharma.backend.repository.QuyDoiDonViRepository;
import com.pharma.backend.repository.SanPhamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PhieuNhapService {

    private static final int SCALE_SO_LUONG = 3;
    private static final int SCALE_HE_SO = 12;

    private final PhieuNhapKhoRepository phieuNhapKhoRepository;
    private final ChiTietPhieuNhapRepository chiTietPhieuNhapRepository;
    private final NhaCungCapRepository nhaCungCapRepository;
    private final NhanVienNoiBoRepository nhanVienNoiBoRepository;
    private final SanPhamRepository sanPhamRepository;
    private final DonViSanPhamRepository donViSanPhamRepository;
    private final QuyDoiDonViRepository quyDoiDonViRepository;

    @Transactional(readOnly = true)
    public List<PhieuNhapResponse> layDanhSachPhieuNhap() {
        return phieuNhapKhoRepository
                .findAllTongQuanOrderByNgayNhapDesc()
                .stream()
                .map(phieuNhap -> toResponse(phieuNhap, false))
                .toList();
    }

    @Transactional(readOnly = true)
    public PhieuNhapResponse layChiTietPhieuNhap(long maPhieuNhap) {
        PhieuNhapKho phieuNhap = phieuNhapKhoRepository
                .findChiTietByMaPhieuNhap(maPhieuNhap)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy phiếu nhập"));

        return toResponse(phieuNhap, true);
    }

    @Transactional
    public PhieuNhapResponse xacNhanNhapKho(long maPhieuNhap) {
        PhieuNhapKho phieuNhap = phieuNhapKhoRepository
                .findChiTietByMaPhieuNhap(maPhieuNhap)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy phiếu nhập"));

        if (phieuNhap.getTrangThaiPhieuNhap() != TrangThaiPhieuNhap.CHO_XAC_NHAN) {
            throw new IllegalArgumentException(
                    "Chỉ được xác nhận phiếu nhập đang chờ xác nhận");
        }

        List<ChiTietPhieuNhap> danhSachChiTiet = phieuNhap.getDanhSachChiTietPhieuNhap();

        if (danhSachChiTiet == null || danhSachChiTiet.isEmpty()) {
            throw new IllegalArgumentException(
                    "Phiếu nhập không có sản phẩm để xác nhận");
        }

        LocalDate ngayHienTai = LocalDate.now();

        for (ChiTietPhieuNhap chiTiet : danhSachChiTiet) {
            if (chiTiet.getHanSuDung() == null
                    || !chiTiet.getHanSuDung().isAfter(ngayHienTai)) {
                throw new IllegalArgumentException(
                        "Không thể nhập kho sản phẩm đã hết hạn hoặc hết hạn trong ngày");
            }
        }

        for (ChiTietPhieuNhap chiTiet : danhSachChiTiet) {
            chiTiet.setSoLuongConLaiTheoQuyDoi(
                    chiTiet.getSoLuongTheoQuyDoi());
            chiTiet.setTrangThaiLo(
                    TrangThaiLo.DANG_SU_DUNG);
        }

        phieuNhap.setTrangThaiPhieuNhap(
                TrangThaiPhieuNhap.DA_NHAP);

        chiTietPhieuNhapRepository.saveAll(danhSachChiTiet);
        phieuNhapKhoRepository.save(phieuNhap);

        return toResponse(phieuNhap, true);
    }

    @Transactional
    public PhieuNhapResponse taoPhieuNhap(PhieuNhapTaoMoiRequest request) {
        NhaCungCap nhaCungCap = timNhaCungCapDangHopTac(
                request.getMaNhaCungCap());
        NhanVienNoiBo nhanVienLap = timNhanVienDangLamViec(
                request.getMaNhanVienLap());

        PhieuNhapKho phieuNhap = new PhieuNhapKho();
        phieuNhap.setNhaCungCap(nhaCungCap);
        phieuNhap.setNhanVienLap(nhanVienLap);
        phieuNhap.setGhiChu(chuanHoaGhiChu(request.getGhiChu()));
        phieuNhap.setTrangThaiPhieuNhap(TrangThaiPhieuNhap.CHO_XAC_NHAN);

        Set<String> khoaChiTietDaCo = new HashSet<>();
        List<ChiTietPhieuNhap> danhSachChiTiet = new ArrayList<>();
        BigDecimal tongTien = BigDecimal.ZERO;

        for (ChiTietPhieuNhapTaoMoiRequest chiTietRequest : request.getDanhSachChiTiet()) {
            String khoaChiTiet = taoKhoaChiTiet(chiTietRequest);
            if (!khoaChiTietDaCo.add(khoaChiTiet)) {
                throw new IllegalArgumentException(
                        "Không được nhập trùng sản phẩm, đơn vị và hạn sử dụng trong cùng phiếu");
            }

            SanPham sanPham = timSanPhamDangHoatDong(
                    chiTietRequest.getMaSanPham());
            DonViSanPham donViNhap = timDonViDuocPhepNhap(
                    sanPham,
                    chiTietRequest.getMaDonViSanPham());

            BigDecimal soLuongTheoQuyDoi = quyDoiVeDonViCoSo(
                    sanPham,
                    donViNhap,
                    chiTietRequest.getSoLuongNhap());
            BigDecimal thanhTien = chiTietRequest
                    .getSoLuongNhap()
                    .multiply(chiTietRequest.getDonGiaNhap())
                    .setScale(2, RoundingMode.HALF_UP);

            ChiTietPhieuNhap chiTiet = new ChiTietPhieuNhap();
            chiTiet.setPhieuNhapKho(phieuNhap);
            chiTiet.setSanPham(sanPham);
            chiTiet.setDonViSanPham(donViNhap);
            chiTiet.setSoLuongNhap(
                    chiTietRequest.getSoLuongNhap()
                            .setScale(SCALE_SO_LUONG, RoundingMode.HALF_UP));
            chiTiet.setSoLuongTheoQuyDoi(soLuongTheoQuyDoi);
            chiTiet.setSoLuongConLaiTheoQuyDoi(
                    new BigDecimal("0.000"));
            chiTiet.setDonGiaNhap(
                    chiTietRequest.getDonGiaNhap()
                            .setScale(2, RoundingMode.HALF_UP));
            chiTiet.setThanhTien(thanhTien);
            chiTiet.setHanSuDung(chiTietRequest.getHanSuDung());
            chiTiet.setTrangThaiLo(TrangThaiLo.NGUNG_SU_DUNG);

            danhSachChiTiet.add(chiTiet);
            phieuNhap.getDanhSachChiTietPhieuNhap().add(chiTiet);
            tongTien = tongTien.add(thanhTien);
        }

        phieuNhap.setTongTien(
                tongTien.setScale(2, RoundingMode.HALF_UP));

        PhieuNhapKho phieuNhapDaLuu = phieuNhapKhoRepository.saveAndFlush(phieuNhap);
        chiTietPhieuNhapRepository.saveAll(danhSachChiTiet);
        chiTietPhieuNhapRepository.flush();

        return toResponse(phieuNhapDaLuu, true);
    }

    @Transactional
    public PhieuNhapResponse huyPhieuNhap(long maPhieuNhap) {
        PhieuNhapKho phieuNhap = phieuNhapKhoRepository
                .findChiTietByMaPhieuNhap(maPhieuNhap)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy phiếu nhập"));

        if (phieuNhap.getTrangThaiPhieuNhap() != TrangThaiPhieuNhap.CHO_XAC_NHAN) {
            throw new IllegalArgumentException(
                    "Chỉ được hủy phiếu nhập đang chờ xác nhận");
        }

        phieuNhap.setTrangThaiPhieuNhap(
                TrangThaiPhieuNhap.DA_HUY);

        return toResponse(
                phieuNhapKhoRepository.save(phieuNhap),
                true);
    }

    private NhaCungCap timNhaCungCapDangHopTac(Long maNhaCungCap) {
        NhaCungCap nhaCungCap = nhaCungCapRepository
                .findById(maNhaCungCap)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy nhà cung cấp"));

        if (!Boolean.TRUE.equals(nhaCungCap.getTrangThaiHopTac())) {
            throw new IllegalArgumentException(
                    "Nhà cung cấp đã ngừng hợp tác");
        }

        return nhaCungCap;
    }

    private NhanVienNoiBo timNhanVienDangLamViec(Long maNhanVien) {
        NhanVienNoiBo nhanVien = nhanVienNoiBoRepository
                .findById(maNhanVien)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy nhân viên lập phiếu"));

        boolean taiKhoanDangHoatDong = nhanVien.getTaiKhoan() != null
                && Boolean.TRUE.equals(
                        nhanVien.getTaiKhoan().getTrangThaiTaiKhoan());

        if (!Boolean.TRUE.equals(nhanVien.getTrangThaiLamViec())
                || !taiKhoanDangHoatDong) {
            throw new IllegalArgumentException(
                    "Nhân viên lập phiếu không còn hoạt động");
        }

        return nhanVien;
    }

    private SanPham timSanPhamDangHoatDong(Long maSanPham) {
        SanPham sanPham = sanPhamRepository
                .findById(maSanPham)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy sản phẩm"));

        if (!Boolean.TRUE.equals(sanPham.getTrangThaiSanPham())) {
            throw new IllegalArgumentException(
                    "Sản phẩm đã ngừng hoạt động");
        }

        return sanPham;
    }

    private DonViSanPham timDonViDuocPhepNhap(
            SanPham sanPham,
            Long maDonViSanPham) {
        DonViSanPham donViSanPham = donViSanPhamRepository
                .findById(maDonViSanPham)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy đơn vị nhập của sản phẩm"));

        Long maSanPhamCuaDonVi = donViSanPham.getSanPham() != null
                ? donViSanPham.getSanPham().getMaSanPham()
                : null;

        if (!Objects.equals(
                maSanPhamCuaDonVi,
                sanPham.getMaSanPham())) {
            throw new IllegalArgumentException(
                    "Đơn vị nhập không thuộc sản phẩm đã chọn");
        }

        if (!Boolean.TRUE.equals(donViSanPham.getTrangThai())) {
            throw new IllegalArgumentException(
                    "Đơn vị nhập đã ngừng hoạt động");
        }

        if (!Boolean.TRUE.equals(donViSanPham.getChoPhepNhap())) {
            throw new IllegalArgumentException(
                    "Đơn vị này không được phép nhập kho");
        }

        return donViSanPham;
    }

    private BigDecimal quyDoiVeDonViCoSo(
            SanPham sanPham,
            DonViSanPham donViNhap,
            BigDecimal soLuongNhap) {
        List<DonViSanPham> danhSachDonVi = donViSanPhamRepository.findBySanPham_MaSanPham(
                sanPham.getMaSanPham());

        List<DonViSanPham> danhSachDonViCoSo = danhSachDonVi
                .stream()
                .filter(donVi -> Boolean.TRUE.equals(donVi.getTrangThai()))
                .filter(donVi -> Boolean.TRUE.equals(donVi.getLaDonViCoSo()))
                .toList();

        if (danhSachDonViCoSo.size() != 1) {
            throw new IllegalArgumentException(
                    "Sản phẩm phải có đúng một đơn vị cơ sở đang hoạt động");
        }

        Long maDonViNhap = donViNhap.getMaDonViSanPham();
        Long maDonViCoSo = danhSachDonViCoSo
                .get(0)
                .getMaDonViSanPham();

        if (Objects.equals(maDonViNhap, maDonViCoSo)) {
            return soLuongNhap.setScale(
                    SCALE_SO_LUONG,
                    RoundingMode.HALF_UP);
        }

        Map<Long, List<CanhQuyDoi>> doThiQuyDoi = taoDoThiQuyDoi(sanPham.getMaSanPham());

        Queue<NutQuyDoi> hangDoi = new ArrayDeque<>();
        Set<Long> donViDaDuyet = new HashSet<>();

        hangDoi.add(new NutQuyDoi(
                maDonViNhap,
                BigDecimal.ONE));
        donViDaDuyet.add(maDonViNhap);

        while (!hangDoi.isEmpty()) {
            NutQuyDoi nutHienTai = hangDoi.remove();

            for (CanhQuyDoi canh : doThiQuyDoi.getOrDefault(
                    nutHienTai.maDonVi(),
                    List.of())) {
                if (!donViDaDuyet.add(canh.maDonViTiepTheo())) {
                    continue;
                }

                BigDecimal heSoMoi = nutHienTai
                        .heSoTichLuy()
                        .multiply(canh.heSo());

                if (Objects.equals(
                        canh.maDonViTiepTheo(),
                        maDonViCoSo)) {
                    return soLuongNhap
                            .multiply(heSoMoi)
                            .setScale(
                                    SCALE_SO_LUONG,
                                    RoundingMode.HALF_UP);
                }

                hangDoi.add(new NutQuyDoi(
                        canh.maDonViTiepTheo(),
                        heSoMoi));
            }
        }

        throw new IllegalArgumentException(
                "Không tìm thấy quy đổi từ đơn vị nhập về đơn vị cơ sở");
    }

    private Map<Long, List<CanhQuyDoi>> taoDoThiQuyDoi(
            Long maSanPham) {
        Map<Long, List<CanhQuyDoi>> doThi = new HashMap<>();

        List<QuyDoiDonVi> danhSachQuyDoi = quyDoiDonViRepository
                .findBySanPham_MaSanPhamOrderByMaQuyDoiAsc(maSanPham);

        for (QuyDoiDonVi quyDoi : danhSachQuyDoi) {
            if (!Boolean.TRUE.equals(quyDoi.getTrangThai())) {
                continue;
            }

            DonViSanPham donViNguon = quyDoi.getDonViNguon();
            DonViSanPham donViDich = quyDoi.getDonViDich();

            if (donViNguon == null
                    || donViDich == null
                    || !Boolean.TRUE.equals(donViNguon.getTrangThai())
                    || !Boolean.TRUE.equals(donViDich.getTrangThai())) {
                continue;
            }

            BigDecimal heSoThuan = quyDoi
                    .getSoLuongDich()
                    .divide(
                            quyDoi.getSoLuongNguon(),
                            SCALE_HE_SO,
                            RoundingMode.HALF_UP);
            BigDecimal heSoNghich = quyDoi
                    .getSoLuongNguon()
                    .divide(
                            quyDoi.getSoLuongDich(),
                            SCALE_HE_SO,
                            RoundingMode.HALF_UP);

            themCanh(
                    doThi,
                    donViNguon.getMaDonViSanPham(),
                    donViDich.getMaDonViSanPham(),
                    heSoThuan);
            themCanh(
                    doThi,
                    donViDich.getMaDonViSanPham(),
                    donViNguon.getMaDonViSanPham(),
                    heSoNghich);
        }

        return doThi;
    }

    private void themCanh(
            Map<Long, List<CanhQuyDoi>> doThi,
            Long maDonViNguon,
            Long maDonViDich,
            BigDecimal heSo) {
        doThi.computeIfAbsent(
                maDonViNguon,
                khoa -> new ArrayList<>()).add(new CanhQuyDoi(maDonViDich, heSo));
    }

    private String taoKhoaChiTiet(
            ChiTietPhieuNhapTaoMoiRequest request) {
        return request.getMaSanPham()
                + "|"
                + request.getMaDonViSanPham()
                + "|"
                + request.getHanSuDung();
    }

    private String chuanHoaGhiChu(String ghiChu) {
        return ghiChu == null || ghiChu.isBlank()
                ? null
                : ghiChu.trim();
    }

    private PhieuNhapResponse toResponse(
            PhieuNhapKho phieuNhap,
            boolean baoGomChiTiet) {
        NhaCungCap nhaCungCap = phieuNhap.getNhaCungCap();
        NhanVienNoiBo nhanVienLap = phieuNhap.getNhanVienLap();

        List<ChiTietPhieuNhapResponse> danhSachChiTiet = baoGomChiTiet
                ? phieuNhap
                        .getDanhSachChiTietPhieuNhap()
                        .stream()
                        .map(this::toChiTietResponse)
                        .toList()
                : List.of();

        return PhieuNhapResponse.builder()
                .maPhieuNhap(phieuNhap.getMaPhieuNhap())
                .maNhaCungCap(
                        nhaCungCap != null
                                ? nhaCungCap.getMaNhaCungCap()
                                : null)
                .tenNhaCungCap(
                        nhaCungCap != null
                                ? nhaCungCap.getTenNhaCungCap()
                                : null)
                .maNhanVienLap(
                        nhanVienLap != null
                                ? nhanVienLap.getMaNhanVien()
                                : null)
                .tenNhanVienLap(
                        nhanVienLap != null
                                ? nhanVienLap.getHoTen()
                                : null)
                .ngayNhap(phieuNhap.getNgayNhap())
                .tongTien(phieuNhap.getTongTien())
                .trangThaiPhieuNhap(
                        phieuNhap.getTrangThaiPhieuNhap())
                .ghiChu(phieuNhap.getGhiChu())
                .danhSachChiTiet(danhSachChiTiet)
                .build();
    }

    private ChiTietPhieuNhapResponse toChiTietResponse(
            ChiTietPhieuNhap chiTiet) {
        SanPham sanPham = chiTiet.getSanPham();
        DonViSanPham donViSanPham = chiTiet.getDonViSanPham();
        DonViTinh donViTinh = donViSanPham != null
                ? donViSanPham.getDonViTinh()
                : null;

        return ChiTietPhieuNhapResponse.builder()
                .maChiTietPhieuNhap(
                        chiTiet.getMaChiTietPhieuNhap())
                .maSanPham(
                        sanPham != null
                                ? sanPham.getMaSanPham()
                                : null)
                .tenSanPham(
                        sanPham != null
                                ? sanPham.getTenSanPham()
                                : null)
                .maDonViSanPham(
                        donViSanPham != null
                                ? donViSanPham.getMaDonViSanPham()
                                : null)
                .maDonViTinh(
                        donViTinh != null
                                ? donViTinh.getMaDonViTinh()
                                : null)
                .tenDonViTinh(
                        donViTinh != null
                                ? donViTinh.getTenDonViTinh()
                                : null)
                .kyHieu(
                        donViTinh != null
                                ? donViTinh.getKyHieu()
                                : null)
                .soLuongNhap(chiTiet.getSoLuongNhap())
                .soLuongTheoQuyDoi(
                        chiTiet.getSoLuongTheoQuyDoi())
                .soLuongConLaiTheoQuyDoi(
                        chiTiet.getSoLuongConLaiTheoQuyDoi())
                .donGiaNhap(chiTiet.getDonGiaNhap())
                .thanhTien(chiTiet.getThanhTien())
                .hanSuDung(chiTiet.getHanSuDung())
                .trangThaiLo(chiTiet.getTrangThaiLo())
                .build();
    }

    private record CanhQuyDoi(
            Long maDonViTiepTheo,
            BigDecimal heSo) {
    }

    private record NutQuyDoi(
            Long maDonVi,
            BigDecimal heSoTichLuy) {
    }
}
