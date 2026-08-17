package com.pharma.backend.service.duocsi;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.duocsi.donhang.ChiTietTaoDonHangDuocSiRequest;
import com.pharma.backend.dto.duocsi.donhang.DonHangDuocSiChiTietResponse;
import com.pharma.backend.dto.duocsi.donhang.TaoDonHangDuocSiRequest;
import com.pharma.backend.entity.ChiTietDonHang;
import com.pharma.backend.entity.DiaChiGiaoHang;
import com.pharma.backend.entity.DonHang;
import com.pharma.backend.entity.DonThuoc;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.KhachHang;
import com.pharma.backend.entity.NhanVienNoiBo;
import com.pharma.backend.entity.QuyDoiDonVi;
import com.pharma.backend.entity.YeuCauTuVan;
import com.pharma.backend.enums.donhang.LoaiKhachHang;
import com.pharma.backend.enums.donhang.PhuongThucThanhToan;
import com.pharma.backend.enums.donhang.TrangThaiDonHang;
import com.pharma.backend.enums.donhang.TrangThaiKiemDuyetDonHang;
import com.pharma.backend.enums.donhang.TrangThaiThanhToan;
import com.pharma.backend.enums.donthuoc.TrangThaiDonThuoc;
import com.pharma.backend.enums.tuvan.TrangThaiTuVan;
import com.pharma.backend.repository.ChiTietDonHangRepository;
import com.pharma.backend.repository.DonHangRepository;
import com.pharma.backend.repository.DonThuocRepository;
import com.pharma.backend.repository.DonViSanPhamRepository;
import com.pharma.backend.repository.KhachHangRepository;
import com.pharma.backend.repository.NhanVienNoiBoRepository;
import com.pharma.backend.repository.YeuCauTuVanRepository;
import com.pharma.backend.service.common.XuLyTonKhoDonHangService;
import com.pharma.backend.service.khachhang.DiaChiGiaoHangService;
import com.pharma.backend.service.khachhang.KetQuaTinhGiaSanPham;
import com.pharma.backend.service.khachhang.TinhGiaSanPhamService;
import com.pharma.backend.service.khachhang.TonKhoSanPhamService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaoDonHangDuocSiService {

    private static final BigDecimal PHI_GIAO_HANG_CO_DINH = new BigDecimal("30000.00");

    private final DonHangRepository donHangRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;
    private final KhachHangRepository khachHangRepository;
    private final NhanVienNoiBoRepository nhanVienNoiBoRepository;
    private final DonViSanPhamRepository donViSanPhamRepository;
    private final YeuCauTuVanRepository yeuCauTuVanRepository;
    private final DonThuocRepository donThuocRepository;

    private final DiaChiGiaoHangService diaChiGiaoHangService;
    private final TonKhoSanPhamService tonKhoSanPhamService;
    private final TinhGiaSanPhamService tinhGiaSanPhamService;
    private final XuLyTonKhoDonHangService xuLyTonKhoDonHangService;
    private final DonHangDuocSiService donHangDuocSiService;

    @Transactional
    public DonHangDuocSiChiTietResponse taoDonHangTuYeuCauTuVan(
            Long maYeuCauTuVan,
            Long maNhanVien,
            TaoDonHangDuocSiRequest request) {
        kiemTraMaNguon(maYeuCauTuVan, "Mã yêu cầu tư vấn không hợp lệ.");
        kiemTraYeuCauTaoDon(request);

        YeuCauTuVan yeuCauTuVan = yeuCauTuVanRepository
                .timTheoMaDeCapNhat(maYeuCauTuVan)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy yêu cầu tư vấn."));

        if (yeuCauTuVan.getTrangThaiTuVan() != TrangThaiTuVan.DA_TU_VAN) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Chỉ được lên đơn từ yêu cầu đã tư vấn.");
        }

        if (yeuCauTuVan.getKhachHang() == null
                || yeuCauTuVan.getKhachHang().getMaKhachHang() == null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Yêu cầu tư vấn chưa liên kết với tài khoản khách hàng, không thể tạo đơn hàng.");
        }

        if (donHangRepository.existsByYeuCauTuVan_MaYeuCauTuVan(maYeuCauTuVan)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Yêu cầu tư vấn này đã được dùng để tạo đơn hàng.");
        }

        Long maKhachHang = yeuCauTuVan.getKhachHang().getMaKhachHang();
        KhachHang khachHang = timKhachHangDangHoatDong(maKhachHang);
        NhanVienNoiBo nhanVien = timNhanVienXuLy(maNhanVien);

        return taoDonHang(
                khachHang,
                nhanVien,
                request,
                yeuCauTuVan,
                null);
    }

    @Transactional
    public DonHangDuocSiChiTietResponse taoDonHangTuDonThuoc(
            Long maDonThuoc,
            Long maNhanVien,
            TaoDonHangDuocSiRequest request) {
        kiemTraMaNguon(maDonThuoc, "Mã đơn thuốc không hợp lệ.");
        kiemTraYeuCauTaoDon(request);

        DonThuoc donThuoc = donThuocRepository
                .timTheoMaDeKiemDuyet(maDonThuoc)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy đơn thuốc."));

        if (donThuoc.getTrangThaiDonThuoc() != TrangThaiDonThuoc.DA_DUYET) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Chỉ được lên đơn từ đơn thuốc đã được duyệt.");
        }

        if (donHangRepository.existsByDonThuoc_MaDonThuoc(maDonThuoc)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Đơn thuốc này đã được dùng để tạo đơn hàng.");
        }

        if (donThuoc.getKhachHang() == null
                || donThuoc.getKhachHang().getMaKhachHang() == null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Đơn thuốc không có thông tin khách hàng hợp lệ.");
        }

        Long maKhachHang = donThuoc.getKhachHang().getMaKhachHang();
        KhachHang khachHang = timKhachHangDangHoatDong(maKhachHang);
        NhanVienNoiBo nhanVien = timNhanVienXuLy(maNhanVien);

        return taoDonHang(
                khachHang,
                nhanVien,
                request,
                null,
                donThuoc);
    }

    private DonHangDuocSiChiTietResponse taoDonHang(
            KhachHang khachHang,
            NhanVienNoiBo nhanVien,
            TaoDonHangDuocSiRequest request,
            YeuCauTuVan yeuCauTuVan,
            DonThuoc donThuoc) {
        LocalDateTime thoiDiemTaoDon = LocalDateTime.now();

        Map<Long, Integer> soLuongTheoDonVi = chuanHoaDanhSachChiTiet(request.getDanhSachChiTiet());
        List<DonViSanPham> danhSachDonVi = layDanhSachDonViHopLe(soLuongTheoDonVi);

        kiemTraTonKho(danhSachDonVi, soLuongTheoDonVi);

        Map<Long, KetQuaTinhGiaSanPham> ketQuaGiaTheoDonVi = tinhGiaSanPhamService
                .tinhGiaTheoDanhSachDonVi(danhSachDonVi, thoiDiemTaoDon);

        List<ChiTietDonHang> danhSachChiTietDonHang = taoDanhSachChiTietDonHang(
                danhSachDonVi,
                soLuongTheoDonVi,
                ketQuaGiaTheoDonVi);

        BigDecimal tongTienHang = tinhTongTienHang(danhSachChiTietDonHang);
        BigDecimal tongGiamGiaSanPham = tinhTongGiamGiaSanPham(danhSachChiTietDonHang);

        DiaChiGiaoHang diaChiGiaoHang = diaChiGiaoHangService.taoDiaChiGiaoHang(
                khachHang.getMaKhachHang(),
                request.getDiaChiGiaoHang());

        DonHang donHang = taoVaLuuDonHang(
                khachHang,
                nhanVien,
                diaChiGiaoHang,
                yeuCauTuVan,
                donThuoc,
                tongTienHang,
                tongGiamGiaSanPham,
                request.getPhuongThucThanhToan(),
                request.getGhiChu(),
                thoiDiemTaoDon);

        for (ChiTietDonHang chiTiet : danhSachChiTietDonHang) {
            chiTiet.setDonHang(donHang);
        }

        chiTietDonHangRepository.saveAllAndFlush(danhSachChiTietDonHang);

        if (request.getPhuongThucThanhToan() == PhuongThucThanhToan.COD) {
            xuLyTonKhoDonHangService.truTonTheoDonHang(donHang.getMaDonHang());
        }

        return donHangDuocSiService.layChiTietDonHang(donHang.getMaDonHang());
    }

    private void kiemTraYeuCauTaoDon(TaoDonHangDuocSiRequest request) {
        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Dữ liệu tạo đơn hàng không hợp lệ.");
        }

        if (request.getDiaChiGiaoHang() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Vui lòng nhập địa chỉ giao hàng.");
        }

        if (request.getDanhSachChiTiet() == null || request.getDanhSachChiTiet().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Đơn hàng phải có ít nhất một sản phẩm.");
        }

        PhuongThucThanhToan phuongThucThanhToan = request.getPhuongThucThanhToan();

        if (phuongThucThanhToan != PhuongThucThanhToan.COD
                && phuongThucThanhToan != PhuongThucThanhToan.ZALOPAY) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Đơn giao cho khách chỉ hỗ trợ thanh toán COD hoặc ZaloPay.");
        }
    }

    private Map<Long, Integer> chuanHoaDanhSachChiTiet(
            List<ChiTietTaoDonHangDuocSiRequest> danhSachChiTiet) {
        Map<Long, Integer> soLuongTheoDonVi = new LinkedHashMap<>();

        for (ChiTietTaoDonHangDuocSiRequest chiTiet : danhSachChiTiet) {
            if (chiTiet == null
                    || chiTiet.getMaDonViSanPham() == null
                    || chiTiet.getMaDonViSanPham() <= 0
                    || chiTiet.getSoLuong() == null
                    || chiTiet.getSoLuong() <= 0) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Thông tin sản phẩm trong đơn hàng không hợp lệ.");
            }

            Integer soLuongCu = soLuongTheoDonVi.putIfAbsent(
                    chiTiet.getMaDonViSanPham(),
                    chiTiet.getSoLuong());

            if (soLuongCu != null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Một đơn vị sản phẩm không được xuất hiện nhiều lần trong đơn hàng.");
            }
        }

        return soLuongTheoDonVi;
    }

    private List<DonViSanPham> layDanhSachDonViHopLe(Map<Long, Integer> soLuongTheoDonVi) {
        List<DonViSanPham> danhSachDaTim = donViSanPhamRepository.findAllById(soLuongTheoDonVi.keySet());
        Map<Long, DonViSanPham> donViTheoMa = new LinkedHashMap<>();

        for (DonViSanPham donViSanPham : danhSachDaTim) {
            donViTheoMa.put(donViSanPham.getMaDonViSanPham(), donViSanPham);
        }

        if (donViTheoMa.size() != soLuongTheoDonVi.size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Có đơn vị sản phẩm không tồn tại.");
        }

        List<DonViSanPham> danhSachKetQua = new ArrayList<>();

        for (Long maDonViSanPham : soLuongTheoDonVi.keySet()) {
            DonViSanPham donViSanPham = donViTheoMa.get(maDonViSanPham);
            kiemTraDonViBanHopLe(donViSanPham);
            danhSachKetQua.add(donViSanPham);
        }

        return danhSachKetQua;
    }

    private void kiemTraDonViBanHopLe(DonViSanPham donViSanPham) {
        if (donViSanPham == null
                || donViSanPham.getSanPham() == null
                || donViSanPham.getSanPham().getMaSanPham() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Thông tin đơn vị sản phẩm không hợp lệ.");
        }

        if (!Boolean.TRUE.equals(donViSanPham.getSanPham().getTrangThaiSanPham())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Có sản phẩm đã ngừng hoạt động.");
        }

        if (!Boolean.TRUE.equals(donViSanPham.getTrangThai())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Có đơn vị sản phẩm đã ngừng hoạt động.");
        }

        if (!Boolean.TRUE.equals(donViSanPham.getChoPhepBan())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Có đơn vị sản phẩm không được phép bán.");
        }

        if (donViSanPham.getGiaBanTheoDonVi() == null
                || donViSanPham.getGiaBanTheoDonVi().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Có đơn vị sản phẩm chưa có giá bán hợp lệ.");
        }
    }

    private void kiemTraTonKho(
            List<DonViSanPham> danhSachDonVi,
            Map<Long, Integer> soLuongTheoDonVi) {
        List<Long> danhSachMaSanPham = danhSachDonVi.stream()
                .map(donViSanPham -> donViSanPham.getSanPham().getMaSanPham())
                .distinct()
                .toList();

        Map<Long, List<QuyDoiDonVi>> quyDoiTheoSanPham = tonKhoSanPhamService
                .layQuyDoiTheoDanhSachSanPham(danhSachMaSanPham);

        Map<Long, BigDecimal> tonTheoSanPham = tonKhoSanPhamService
                .layTonKhaDungTheoDanhSachSanPham(danhSachMaSanPham);

        Map<Long, BigDecimal> tongCanTheoSanPham = new LinkedHashMap<>();

        for (DonViSanPham donViSanPham : danhSachDonVi) {
            Long maSanPham = donViSanPham.getSanPham().getMaSanPham();
            Integer soLuong = soLuongTheoDonVi.get(donViSanPham.getMaDonViSanPham());
            List<QuyDoiDonVi> danhSachQuyDoi = quyDoiTheoSanPham.getOrDefault(maSanPham, List.of());

            BigDecimal soLuongCan = tonKhoSanPhamService.tinhSoLuongCanTheoQuyDoi(
                    donViSanPham,
                    soLuong,
                    danhSachQuyDoi);

            tongCanTheoSanPham.merge(maSanPham, soLuongCan, BigDecimal::add);
        }

        if (!tonKhoSanPhamService.kiemTraDuTon(tongCanTheoSanPham, tonTheoSanPham)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Tồn kho hiện tại không đủ để tạo đơn hàng.");
        }
    }

    private List<ChiTietDonHang> taoDanhSachChiTietDonHang(
            List<DonViSanPham> danhSachDonVi,
            Map<Long, Integer> soLuongTheoDonVi,
            Map<Long, KetQuaTinhGiaSanPham> ketQuaGiaTheoDonVi) {
        List<ChiTietDonHang> danhSachChiTietDonHang = new ArrayList<>();

        for (DonViSanPham donViSanPham : danhSachDonVi) {
            Long maDonViSanPham = donViSanPham.getMaDonViSanPham();
            Integer soLuong = soLuongTheoDonVi.get(maDonViSanPham);
            KetQuaTinhGiaSanPham ketQuaGia = ketQuaGiaTheoDonVi.get(maDonViSanPham);

            if (ketQuaGia == null) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Không tính được giá cho một đơn vị sản phẩm.");
            }

            BigDecimal soLuongDecimal = BigDecimal.valueOf(soLuong);
            BigDecimal donGia = ketQuaGia.giaGoc();
            BigDecimal giamGia = ketQuaGia.soTienGiamMoiDonVi().multiply(soLuongDecimal);
            BigDecimal thanhTien = donGia.multiply(soLuongDecimal).subtract(giamGia);

            if (thanhTien.compareTo(BigDecimal.ZERO) < 0) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Kết quả tính giá đơn hàng không hợp lệ.");
            }

            String cachTinhGia = ketQuaGia.cachTinhGia();

            if (cachTinhGia != null && cachTinhGia.length() > 100) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Mô tả cách tính giá vượt quá giới hạn lưu trữ.");
            }

            ChiTietDonHang chiTietDonHang = new ChiTietDonHang();
            chiTietDonHang.setSanPham(donViSanPham.getSanPham());
            chiTietDonHang.setDonViSanPham(donViSanPham);
            chiTietDonHang.setSoLuong(soLuong);
            chiTietDonHang.setDonGia(donGia);
            chiTietDonHang.setGiamGia(giamGia);
            chiTietDonHang.setThanhTien(thanhTien);
            chiTietDonHang.setCachTinhGia(cachTinhGia);

            danhSachChiTietDonHang.add(chiTietDonHang);
        }

        return danhSachChiTietDonHang;
    }

    private BigDecimal tinhTongTienHang(List<ChiTietDonHang> danhSachChiTietDonHang) {
        BigDecimal tongTienHang = BigDecimal.ZERO;

        for (ChiTietDonHang chiTiet : danhSachChiTietDonHang) {
            BigDecimal tongGiaGocDong = chiTiet.getDonGia()
                    .multiply(BigDecimal.valueOf(chiTiet.getSoLuong()));

            tongTienHang = tongTienHang.add(tongGiaGocDong);
        }

        return tongTienHang;
    }

    private BigDecimal tinhTongGiamGiaSanPham(List<ChiTietDonHang> danhSachChiTietDonHang) {
        BigDecimal tongGiamGiaSanPham = BigDecimal.ZERO;

        for (ChiTietDonHang chiTiet : danhSachChiTietDonHang) {
            if (chiTiet.getGiamGia() != null) {
                tongGiamGiaSanPham = tongGiamGiaSanPham.add(chiTiet.getGiamGia());
            }
        }

        return tongGiamGiaSanPham;
    }

    private DonHang taoVaLuuDonHang(
            KhachHang khachHang,
            NhanVienNoiBo nhanVien,
            DiaChiGiaoHang diaChiGiaoHang,
            YeuCauTuVan yeuCauTuVan,
            DonThuoc donThuoc,
            BigDecimal tongTienHang,
            BigDecimal tongGiamGiaSanPham,
            PhuongThucThanhToan phuongThucThanhToan,
            String ghiChu,
            LocalDateTime thoiDiemTaoDon) {
        BigDecimal giamGiaDonHang = BigDecimal.ZERO;
        BigDecimal tongThanhToan = tongTienHang
                .add(PHI_GIAO_HANG_CO_DINH)
                .subtract(tongGiamGiaSanPham)
                .subtract(giamGiaDonHang);

        DonHang donHang = new DonHang();
        donHang.setNgayDatHang(thoiDiemTaoDon);
        donHang.setKhachHang(khachHang);
        donHang.setDiaChiGiaoHang(diaChiGiaoHang);
        donHang.setNhanVienXuLy(nhanVien);
        donHang.setYeuCauTuVan(yeuCauTuVan);
        donHang.setDonThuoc(donThuoc);
        donHang.setLoaiKhach(LoaiKhachHang.CO_TAI_KHOAN);
        donHang.setTongTienHang(tongTienHang);
        donHang.setPhiGiaoHang(PHI_GIAO_HANG_CO_DINH);
        donHang.setGiamGia(giamGiaDonHang);
        donHang.setTongThanhToan(tongThanhToan);
        donHang.setPhuongThucThanhToan(phuongThucThanhToan);
        donHang.setTrangThaiKiemDuyet(TrangThaiKiemDuyetDonHang.KHONG_CAN_DUYET);
        donHang.setGhiChu(chuanHoaGhiChu(ghiChu));

        if (phuongThucThanhToan == PhuongThucThanhToan.COD) {
            donHang.setTrangThaiDonHang(TrangThaiDonHang.DANG_XU_LY);
            donHang.setTrangThaiThanhToan(TrangThaiThanhToan.CHUA_THANH_TOAN);
        } else if (phuongThucThanhToan == PhuongThucThanhToan.ZALOPAY) {
            donHang.setTrangThaiDonHang(TrangThaiDonHang.CHO_XU_LY);
            donHang.setTrangThaiThanhToan(TrangThaiThanhToan.CHO_THANH_TOAN);
        } else {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Đơn giao cho khách chỉ hỗ trợ thanh toán COD hoặc ZaloPay.");
        }

        return donHangRepository.saveAndFlush(donHang);
    }

    private KhachHang timKhachHangDangHoatDong(Long maKhachHang) {
        return khachHangRepository
                .timThongTinCaNhanDangHoatDong(maKhachHang)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Khách hàng không còn ở trạng thái hoạt động."));
    }

    private NhanVienNoiBo timNhanVienXuLy(Long maNhanVien) {
        if (maNhanVien == null || maNhanVien <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Không xác định được Dược sĩ đang đăng nhập.");
        }

        return nhanVienNoiBoRepository
                .findById(maNhanVien)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy thông tin Dược sĩ."));
    }

    private void kiemTraMaNguon(Long maNguon, String thongBao) {
        if (maNguon == null || maNguon <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, thongBao);
        }
    }

    private String chuanHoaGhiChu(String ghiChu) {
        if (ghiChu == null || ghiChu.isBlank()) {
            return null;
        }

        String ghiChuDaChuanHoa = ghiChu.trim();

        if (ghiChuDaChuanHoa.length() > 255) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ghi chú không được vượt quá 255 ký tự.");
        }

        return ghiChuDaChuanHoa;
    }
}
