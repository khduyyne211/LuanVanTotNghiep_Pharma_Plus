package com.pharma.backend.service.donhang;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.IntStream;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.donhang.ChiTietDonHangTaiQuayRequest;
import com.pharma.backend.dto.donhang.DonHangChiTietResponse;
import com.pharma.backend.dto.donhang.DonHangTaiQuayRequest;
import com.pharma.backend.dto.donhang.SanPhamBanTaiQuayProjection;
import com.pharma.backend.dto.donhang.SanPhamBanTaiQuayResponse;
import com.pharma.backend.entity.donhang.ChiTietDonHang;
import com.pharma.backend.entity.donhang.DonHang;
import com.pharma.backend.repository.donhang.ChiTietDonHangRepository;
import com.pharma.backend.repository.donhang.DonHangRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonHangTaiQuayService {

    private static final String VANG_LAI = "VANG_LAI";
    private static final String CHO_THANH_TOAN = "CHO_THANH_TOAN";
    private static final String KHONG_CAN_DUYET = "KHONG_CAN_DUYET";
    private static final String DA_DUYET = "DA_DUYET";
    private static final String GIA_BAN_THEO_DON_VI =
            "GIA_BAN_THEO_DON_VI";

    private static final Set<String> PHUONG_THUC_THANH_TOAN_HOP_LE =
            Set.of("TIEN_MAT", "QR");

    private final DonHangRepository donHangRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;
    private final DonHangService donHangService;

    @Transactional(readOnly = true)
    public List<SanPhamBanTaiQuayResponse>
            laySanPhamBanTaiQuay(String keyword) {
        String tuKhoa = keyword == null
                ? null
                : keyword.trim();

        return chiTietDonHangRepository
                .timSanPhamBanTaiQuay(tuKhoa)
                .stream()
                .map(this::toSanPhamResponse)
                .toList();
    }

    @Transactional
    public DonHangChiTietResponse taoDonHangTaiQuay(
            DonHangTaiQuayRequest request
    ) {
        kiemTraRequest(request);

        long maDuocSi = request.getMaDuocSiXuLy();
        kiemTraDuocSi(maDuocSi);

        String phuongThucThanhToan =
                kiemTraPhuongThucThanhToan(
                        request.getPhuongThucThanhToan()
                );

        List<SanPhamBanTaiQuayProjection> danhSachDonVi =
                layDanhSachDonViSanPham(request);

        boolean coThuocKeDon = danhSachDonVi.stream()
                .anyMatch(
                        donVi -> Boolean.TRUE.equals(
                                donVi.getLaThuocKeDon()
                        )
                );

        kiemTraXacNhanDonThuocTaiQuay(
                request,
                coThuocKeDon
        );

        BigDecimal tongTienHang = tinhTongTien(
                request.getDanhSachChiTiet(),
                danhSachDonVi
        );

        DonHang donHang = taoDonHang(
                request,
                maDuocSi,
                phuongThucThanhToan,
                tongTienHang,
                coThuocKeDon
        );

        DonHang donHangDaLuu =
                donHangRepository.saveAndFlush(donHang);

        List<ChiTietDonHang> danhSachChiTiet =
                taoDanhSachChiTiet(
                        donHangDaLuu.getMaDonHang(),
                        request.getDanhSachChiTiet(),
                        danhSachDonVi
                );

        chiTietDonHangRepository.saveAll(danhSachChiTiet);
        chiTietDonHangRepository.flush();

        return donHangService.layChiTietDonHang(
                donHangDaLuu.getMaDonHang()
        );
    }

    private void kiemTraRequest(DonHangTaiQuayRequest request) {
        if (request == null) {
            throw new IllegalArgumentException(
                    "Thông tin tạo đơn không được để trống"
            );
        }

        if (request.getMaDuocSiXuLy() == null
                || request.getMaDuocSiXuLy() <= 0) {
            throw new IllegalArgumentException(
                    "Mã dược sĩ xử lý không hợp lệ"
            );
        }

        if (request.getDanhSachChiTiet() == null
                || request.getDanhSachChiTiet().isEmpty()) {
            throw new IllegalArgumentException(
                    "Đơn hàng phải có ít nhất một sản phẩm"
            );
        }

        Set<Long> maDonViDaChon = new HashSet<>();

        for (ChiTietDonHangTaiQuayRequest chiTiet
                : request.getDanhSachChiTiet()) {
            if (chiTiet == null
                    || chiTiet.getMaDonViSanPham() == null
                    || chiTiet.getMaDonViSanPham() <= 0) {
                throw new IllegalArgumentException(
                        "Đơn vị sản phẩm không hợp lệ"
                );
            }

            if (chiTiet.getSoLuong() == null
                    || chiTiet.getSoLuong() <= 0) {
                throw new IllegalArgumentException(
                        "Số lượng sản phẩm phải lớn hơn 0"
                );
            }

            if (!maDonViDaChon.add(
                    chiTiet.getMaDonViSanPham()
            )) {
                throw new IllegalArgumentException(
                        "Không được chọn trùng một đơn vị sản phẩm"
                );
            }
        }

        kiemTraDoDai(
                request.getGhiChu(),
                "Ghi chú",
                255
        );
        kiemTraDoDai(
                request.getGhiChuKiemDuyet(),
                "Ghi chú kiểm duyệt",
                255
        );
    }

    private void kiemTraDuocSi(long maDuocSi) {
        boolean hopLe =
                donHangRepository.demDuocSiDangLamViec(
                        maDuocSi
                ) > 0;

        if (!hopLe) {
            throw new IllegalArgumentException(
                    "Người lập đơn phải là dược sĩ đang làm việc"
            );
        }
    }

    private String kiemTraPhuongThucThanhToan(
            String phuongThucThanhToan
    ) {
        if (phuongThucThanhToan == null
                || phuongThucThanhToan.trim().isEmpty()) {
            throw new IllegalArgumentException(
                    "Phương thức thanh toán không được để trống"
            );
        }

        String giaTri =
                phuongThucThanhToan.trim().toUpperCase();

        if (!PHUONG_THUC_THANH_TOAN_HOP_LE.contains(giaTri)) {
            throw new IllegalArgumentException(
                    "Phương thức thanh toán chỉ nhận TIEN_MAT hoặc QR"
            );
        }

        return giaTri;
    }

    private void kiemTraXacNhanDonThuocTaiQuay(
            DonHangTaiQuayRequest request,
            boolean coThuocKeDon
    ) {
        if (coThuocKeDon
                && !Boolean.TRUE.equals(
                        request.getXacNhanDaKiemTraDonThuoc()
                )) {
            throw new IllegalArgumentException(
                    "Đơn có thuốc kê đơn, dược sĩ phải xác nhận "
                    + "đã kiểm tra đơn thuốc tại quầy"
            );
        }
    }

    private List<SanPhamBanTaiQuayProjection>
            layDanhSachDonViSanPham(
                    DonHangTaiQuayRequest request
            ) {
        return request.getDanhSachChiTiet()
                .stream()
                .map(
                        chiTiet -> chiTietDonHangRepository
                                .timDonViSanPhamBanTaiQuay(
                                        chiTiet
                                                .getMaDonViSanPham()
                                )
                                .orElseThrow(
                                        () -> new IllegalArgumentException(
                                                "Đơn vị sản phẩm "
                                                + chiTiet
                                                        .getMaDonViSanPham()
                                                + " không được phép bán"
                                        )
                                )
                )
                .toList();
    }

    private BigDecimal tinhTongTien(
            List<ChiTietDonHangTaiQuayRequest> danhSachRequest,
            List<SanPhamBanTaiQuayProjection> danhSachDonVi
    ) {
        BigDecimal tongTien = BigDecimal.ZERO;

        for (int i = 0; i < danhSachRequest.size(); i++) {
            ChiTietDonHangTaiQuayRequest request =
                    danhSachRequest.get(i);
            SanPhamBanTaiQuayProjection donVi =
                    danhSachDonVi.get(i);

            BigDecimal thanhTien =
                    donVi.getGiaBanTheoDonVi()
                            .multiply(
                                    BigDecimal.valueOf(
                                            request.getSoLuong()
                                    )
                            );

            tongTien = tongTien.add(thanhTien);
        }

        return tongTien;
    }

    private DonHang taoDonHang(
            DonHangTaiQuayRequest request,
            long maDuocSi,
            String phuongThucThanhToan,
            BigDecimal tongTienHang,
            boolean coThuocKeDon
    ) {
        LocalDateTime thoiDiemHienTai = LocalDateTime.now();

        DonHang donHang = new DonHang();

        donHang.setMaKhachHang(null);
        donHang.setMaDiaChi(null);
        donHang.setMaVoucher(null);
        donHang.setMaDonThuoc(null);
        donHang.setMaNhanVienXuLy(maDuocSi);
        donHang.setNgayDatHang(thoiDiemHienTai);
        donHang.setLoaiKhach(VANG_LAI);

        donHang.setTongTienHang(tongTienHang);
        donHang.setPhiGiaoHang(BigDecimal.ZERO);
        donHang.setGiamGia(BigDecimal.ZERO);
        donHang.setTongThanhToan(tongTienHang);

        donHang.setPhuongThucThanhToan(
                phuongThucThanhToan
        );
        donHang.setTrangThaiThanhToan(
                CHO_THANH_TOAN
        );
        donHang.setTrangThaiDonHang(
                CHO_THANH_TOAN
        );

        if (coThuocKeDon) {
            donHang.setMaDuocSiDuyet(maDuocSi);
            donHang.setTrangThaiKiemDuyet(DA_DUYET);
            donHang.setNgayKiemDuyet(thoiDiemHienTai);
            donHang.setGhiChuKiemDuyet(
                    taoGhiChuKiemDuyet(request)
            );
        } else {
            donHang.setTrangThaiKiemDuyet(
                    KHONG_CAN_DUYET
            );
        }

        donHang.setGhiChu(chuanHoa(request.getGhiChu()));

        return donHang;
    }

    private String taoGhiChuKiemDuyet(
            DonHangTaiQuayRequest request
    ) {
        String ghiChu = chuanHoa(
                request.getGhiChuKiemDuyet()
        );

        return ghiChu != null
                ? ghiChu
                : "Dược sĩ đã kiểm tra đơn thuốc trực tiếp tại quầy";
    }

    private List<ChiTietDonHang> taoDanhSachChiTiet(
            long maDonHang,
            List<ChiTietDonHangTaiQuayRequest> danhSachRequest,
            List<SanPhamBanTaiQuayProjection> danhSachDonVi
    ) {
        return IntStream
                .range(0, danhSachRequest.size())
                .mapToObj(
                        index -> taoChiTietDonHang(
                                maDonHang,
                                danhSachRequest.get(index),
                                danhSachDonVi.get(index)
                        )
                )
                .toList();
    }

    private ChiTietDonHang taoChiTietDonHang(
            long maDonHang,
            ChiTietDonHangTaiQuayRequest request,
            SanPhamBanTaiQuayProjection donVi
    ) {
        BigDecimal donGia = donVi.getGiaBanTheoDonVi();
        BigDecimal thanhTien =
                donGia.multiply(
                        BigDecimal.valueOf(
                                request.getSoLuong()
                        )
                );

        ChiTietDonHang chiTiet = new ChiTietDonHang();

        chiTiet.setMaDonHang(maDonHang);
        chiTiet.setMaSanPham(donVi.getMaSanPham());
        chiTiet.setMaDonViSanPham(
                donVi.getMaDonViSanPham()
        );
        chiTiet.setSoLuong(request.getSoLuong());
        chiTiet.setDonGia(donGia);
        chiTiet.setGiamGia(BigDecimal.ZERO);
        chiTiet.setThanhTien(thanhTien);
        chiTiet.setCachTinhGia(
                GIA_BAN_THEO_DON_VI
        );

        return chiTiet;
    }

    private SanPhamBanTaiQuayResponse toSanPhamResponse(
            SanPhamBanTaiQuayProjection sanPham
    ) {
        return SanPhamBanTaiQuayResponse.builder()
                .maDonViSanPham(
                        sanPham.getMaDonViSanPham()
                )
                .maSanPham(sanPham.getMaSanPham())
                .tenSanPham(sanPham.getTenSanPham())
                .hinhAnh(sanPham.getHinhAnh())
                .laThuocKeDon(
                        sanPham.getLaThuocKeDon()
                )
                .maDonViTinh(sanPham.getMaDonViTinh())
                .tenDonViTinh(
                        sanPham.getTenDonViTinh()
                )
                .kyHieu(sanPham.getKyHieu())
                .giaBanTheoDonVi(
                        sanPham.getGiaBanTheoDonVi()
                )
                .build();
    }

    private void kiemTraDoDai(
            String giaTri,
            String tenTruong,
            int doDaiToiDa
    ) {
        if (giaTri != null
                && giaTri.trim().length() > doDaiToiDa) {
            throw new IllegalArgumentException(
                    tenTruong
                    + " không được vượt quá "
                    + doDaiToiDa
                    + " ký tự"
            );
        }
    }

    private String chuanHoa(String giaTri) {
        if (giaTri == null || giaTri.trim().isEmpty()) {
            return null;
        }

        return giaTri.trim();
    }
}
