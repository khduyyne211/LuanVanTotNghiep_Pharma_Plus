package com.pharma.backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.donhang.ChiTietDonHangResponseDto;
import com.pharma.backend.dto.donhang.DonHangDanhSachDto;
import com.pharma.backend.dto.donhang.DonHangResponseDto;
import com.pharma.backend.dto.donhang.SanPhamDonHangTomTatDto;
import com.pharma.backend.dto.donhang.TaoDonHangRequestDto;
import com.pharma.backend.entity.ChiTietDonHang;
import com.pharma.backend.entity.ChiTietGioHang;
import com.pharma.backend.entity.DiaChiGiaoHang;
import com.pharma.backend.entity.DonHang;
import com.pharma.backend.entity.DonViSanPham;
import com.pharma.backend.entity.GioHang;
import com.pharma.backend.entity.QuyDoiDonVi;
import com.pharma.backend.enums.diachigiaohang.TinhThanhGiaoHang;
import com.pharma.backend.enums.donhang.LoaiKhachHang;
import com.pharma.backend.enums.donhang.PhuongThucThanhToan;
import com.pharma.backend.enums.donhang.TrangThaiDonHang;
import com.pharma.backend.enums.donhang.TrangThaiThanhToan;
import com.pharma.backend.repository.ChiTietDonHangRepository;
import com.pharma.backend.repository.ChiTietGioHangRepository;
import com.pharma.backend.repository.DiaChiGiaoHangRepository;
import com.pharma.backend.repository.DonHangRepository;
import com.pharma.backend.repository.GioHangRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonHangKhachHangService {
    private static final BigDecimal PHI_GIAO_HANG_CO_DINH = new BigDecimal("30000.00");

    private final GioHangRepository gioHangRepository;
    private final ChiTietGioHangRepository chiTietGioHangRepository;
    private final DiaChiGiaoHangRepository diaChiGiaoHangRepository;
    private final DonHangRepository donHangRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;

    private final TonKhoSanPhamService tonKhoSanPhamService;
    private final TinhGiaSanPhamService tinhGiaSanPhamService;

    @Transactional
    public DonHangResponseDto taoDonHang(
                Long maKhachHang,
                TaoDonHangRequestDto request
        ) {
        /*
        * Một thời điểm chung được dùng để:
        * - tính khuyến mãi;
        * - ghi thời điểm đặt đơn;
        * - tạo toàn bộ snapshot giá.
        */
        LocalDateTime thoiDiemTaoDon =
                LocalDateTime.now();

        DuLieuTaoDonHang duLieu =
                chuanBiDuLieuTaoDonHang(
                        maKhachHang,
                        request
                );

        List<ChiTietGioHang> danhSachChiTietGioHang =
                duLieu.getDanhSachChiTietGioHang();

        /*
        * Kiểm tra lại tồn kho ngay trước khi tạo đơn.
        * Bước này không trừ tồn.
        */
        kiemTraTonKhoMoiNhat(
                danhSachChiTietGioHang
        );

        List<DonViSanPham> danhSachDonVi =
                layDanhSachDonViKhongTrung(
                        danhSachChiTietGioHang
                );

        Map<Long, KetQuaTinhGiaSanPham>
                ketQuaGiaTheoDonVi =
                tinhGiaSanPhamService
                        .tinhGiaTheoDanhSachDonVi(
                                danhSachDonVi,
                                thoiDiemTaoDon
                        );

        List<ChiTietDonHang> danhSachChiTietDonHang =
                taoDanhSachChiTietDonHang(
                        danhSachChiTietGioHang,
                        ketQuaGiaTheoDonVi
                );

        BigDecimal tongTienHang =
                tinhTongTienHang(
                        danhSachChiTietDonHang
                );

        BigDecimal tongGiamGiaSanPham =
                tinhTongGiamGiaSanPham(
                        danhSachChiTietDonHang
                );

        DonHang donHang = taoVaLuuDonHang(
                duLieu,
                tongTienHang,
                tongGiamGiaSanPham,
                request.getPhuongThucThanhToan(),
                thoiDiemTaoDon
        );

        for (ChiTietDonHang chiTiet
                : danhSachChiTietDonHang) {
                chiTiet.setDonHang(donHang);
        }

        List<ChiTietDonHang> danhSachChiTietDaLuu =
                chiTietDonHangRepository.saveAll(
                        danhSachChiTietDonHang
                );

        chiTietGioHangRepository.xoaTatCaTheoMaGioHang(
                duLieu.getGioHang().getMaGioHang()
        );

        return taoDonHangResponse(
                donHang,
                danhSachChiTietDaLuu
        );
    }

    @Transactional(readOnly = true)
    public List<DonHangDanhSachDto> layDanhSachDonHang(
            Long maKhachHang
    ) {
        kiemTraKhachHangDangNhap(maKhachHang);

        List<DonHang> danhSachDonHang =
                donHangRepository
                        .findByKhachHang_MaKhachHangOrderByNgayDatHangDesc(
                                maKhachHang
                        );

        if (danhSachDonHang.isEmpty()) {
            return List.of();
        }

        List<Long> danhSachMaDonHang = danhSachDonHang.stream()
                .map(DonHang::getMaDonHang)
                .toList();

        List<ChiTietDonHang> danhSachChiTiet =
                chiTietDonHangRepository
                        .layChiTietTheoDanhSachDonHang(
                                danhSachMaDonHang
                        );

        Map<Long, List<ChiTietDonHang>> chiTietTheoMaDonHang =
                gomChiTietTheoMaDonHang(danhSachChiTiet);

        List<DonHangDanhSachDto> ketQua = new ArrayList<>();

        for (DonHang donHang : danhSachDonHang) {
            List<ChiTietDonHang> chiTietCuaDon =
                    chiTietTheoMaDonHang.getOrDefault(
                            donHang.getMaDonHang(),
                            List.of()
                    );

            ketQua.add(
                    taoDonHangDanhSachDto(
                            donHang,
                            chiTietCuaDon
                    )
            );
        }

        return ketQua;
    }

    @Transactional(readOnly = true)
    public DonHangResponseDto layChiTietDonHang(
            Long maKhachHang,
            Long maDonHang
    ) {
        kiemTraKhachHangDangNhap(maKhachHang);

        if (maDonHang == null || maDonHang <= 0) {
            throw new ResponseStatusException(
HttpStatus.BAD_REQUEST,
                    "Mã đơn hàng không hợp lệ."
            );
        }

        DonHang donHang = donHangRepository
                .timChiTietDonHangCuaKhachHang(
                        maDonHang,
                        maKhachHang
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy đơn hàng."
                ));

        List<ChiTietDonHang> danhSachChiTiet =
                chiTietDonHangRepository
                        .layChiTietTheoMaDonHang(maDonHang);

        if (danhSachChiTiet.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Đơn hàng không có thông tin sản phẩm."
            );
        }

        return taoDonHangResponse(
                donHang,
                danhSachChiTiet
        );
    }

        @Transactional
        public void huyDonHang(
                Long maKhachHang,
                Long maDonHang
        ) {
                kiemTraKhachHangDangNhap(maKhachHang);

                if (maDonHang == null || maDonHang <= 0) {
                        throw new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Mã đơn hàng không hợp lệ."
                        );
                }

                /*
                * Khóa đơn hàng để tránh xung đột giữa:
                * - Khách hàng hủy đơn.
                * - Callback ZaloPay.
                * - Scheduler hủy đơn quá hạn.
                * - Nhân viên tiếp nhận xử lý đơn.
                */
                DonHang donHang = donHangRepository
                        .timTheoMaDeCapNhat(maDonHang)
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Không tìm thấy đơn hàng."
                        ));

                if (donHang.getKhachHang() == null
                        || donHang.getKhachHang().getMaKhachHang() == null
                        || !maKhachHang.equals(
                                donHang.getKhachHang().getMaKhachHang()
                        )) {
                        throw new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Không tìm thấy đơn hàng."
                        );
                }

                if (donHang.getTrangThaiDonHang()
                        == TrangThaiDonHang.DA_HUY) {
                        throw new ResponseStatusException(
                                HttpStatus.CONFLICT,
                                "Đơn hàng đã được hủy trước đó."
                        );
                }

                if (donHang.getTrangThaiThanhToan()
                        == TrangThaiThanhToan.DA_THANH_TOAN) {
                        throw new ResponseStatusException(
                                HttpStatus.CONFLICT,
                                "Đơn hàng đã thanh toán. "
                                        + "Vui lòng liên hệ nhà thuốc để được hỗ trợ."
                        );
                }

                boolean coTheHuyDonCod =
                        donHang.getPhuongThucThanhToan()
                                == PhuongThucThanhToan.COD
                        && donHang.getTrangThaiDonHang()
                                == TrangThaiDonHang.CHO_XU_LY
                        && donHang.getTrangThaiThanhToan()
                                == TrangThaiThanhToan.CHUA_THANH_TOAN;

                boolean coTheHuyDonZaloPay =
                        donHang.getPhuongThucThanhToan()
                                == PhuongThucThanhToan.ZALOPAY
                        && donHang.getTrangThaiDonHang()
                                == TrangThaiDonHang.CHO_THANH_TOAN
                        && donHang.getTrangThaiThanhToan()
                                == TrangThaiThanhToan.CHO_THANH_TOAN;

                if (!coTheHuyDonCod && !coTheHuyDonZaloPay) {
                        throw new ResponseStatusException(
                                HttpStatus.CONFLICT,
                                "Đơn hàng không còn ở trạng thái cho phép khách hàng hủy."
                        );
                }

                donHang.setTrangThaiDonHang(
                        TrangThaiDonHang.DA_HUY
                );

                donHang.setTrangThaiThanhToan(
                        TrangThaiThanhToan.DA_HUY
                );

                donHangRepository.save(donHang);
        }

    private DuLieuTaoDonHang chuanBiDuLieuTaoDonHang(
            Long maKhachHang,
            TaoDonHangRequestDto request
    ) {
        kiemTraYeuCauTaoDonHang(maKhachHang, request);

        GioHang gioHang = layGioHangCuaKhachHang(maKhachHang);

        List<ChiTietGioHang> danhSachChiTiet =
                chiTietGioHangRepository
                        .layDanhSachChiTietDeTaoDonHang(
                                gioHang.getMaGioHang()
                        );

        kiemTraGioHangKhongRong(danhSachChiTiet);

        DiaChiGiaoHang diaChiGiaoHang =
                layDiaChiGiaoHangHopLe(
                        request.getMaDiaChi(),
                        maKhachHang
                );

        String ghiChu = chuanHoaGhiChu(
                request.getGhiChu()
        );

        return new DuLieuTaoDonHang(
                gioHang.getKhachHang(),
                gioHang,
                diaChiGiaoHang,
                danhSachChiTiet,
                ghiChu
        );
    }

    private void kiemTraYeuCauTaoDonHang(
            Long maKhachHang,
            TaoDonHangRequestDto request
    ) {
        kiemTraKhachHangDangNhap(maKhachHang);

        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Dữ liệu đặt hàng không hợp lệ."
            );
        }

        if (request.getMaDiaChi() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Vui lòng chọn địa chỉ nhận hàng."
            );
        }

        if (request.getPhuongThucThanhToan() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Vui lòng chọn phương thức thanh toán."
            );
        }

        PhuongThucThanhToan phuongThucThanhToan =
                request.getPhuongThucThanhToan();

        if (phuongThucThanhToan != PhuongThucThanhToan.COD
&& phuongThucThanhToan != PhuongThucThanhToan.ZALOPAY) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Phương thức thanh toán không được hỗ trợ."
            );
        }
    }

    private void kiemTraKhachHangDangNhap(Long maKhachHang) {
        if (maKhachHang == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Không xác định được khách hàng đang đăng nhập."
            );
        }
    }

    private GioHang layGioHangCuaKhachHang(Long maKhachHang) {
        return gioHangRepository
                .layGioHangDeTaoDonHang(maKhachHang)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Giỏ hàng chưa có sản phẩm."
                ));
    }

    private void kiemTraGioHangKhongRong(
            List<ChiTietGioHang> danhSachChiTiet
    ) {
        if (danhSachChiTiet == null
                || danhSachChiTiet.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Giỏ hàng chưa có sản phẩm."
            );
        }

        boolean coSoLuongKhongHopLe =
                danhSachChiTiet.stream()
                        .anyMatch(chiTiet ->
                                chiTiet.getSoLuong() == null
                                        || chiTiet.getSoLuong() <= 0
                        );

        if (coSoLuongKhongHopLe) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Giỏ hàng có sản phẩm với số lượng không hợp lệ."
            );
        }
    }

    private DiaChiGiaoHang layDiaChiGiaoHangHopLe(
                Long maDiaChi,
                Long maKhachHang
        ) {
        DiaChiGiaoHang diaChiGiaoHang =
                diaChiGiaoHangRepository
                        .findByMaDiaChiAndKhachHang_MaKhachHangAndTrangThaiSuDungTrue(
                                maDiaChi,
                                maKhachHang
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Địa chỉ nhận hàng không hợp lệ."
                                )
                        );

        if (!TinhThanhGiaoHang.duocHoTro(
                diaChiGiaoHang.getThanhPho()
        )) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Địa chỉ nhận hàng nằm ngoài "
                                + "khu vực giao hàng được hỗ trợ."
                );
        }

        return diaChiGiaoHang;
    }

    private String chuanHoaGhiChu(String ghiChu) {
        if (ghiChu == null || ghiChu.isBlank()) {
            return null;
        }

        String ghiChuDaChuanHoa = ghiChu.trim();

        if (ghiChuDaChuanHoa.length() > 255) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ghi chú không được vượt quá 255 ký tự."
            );
        }

        return ghiChuDaChuanHoa;
    }

    private void kiemTraDonViBanHopLe(
            DonViSanPham donViBan
    ) {
        if (donViBan == null
                || donViBan.getSanPham() == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Thông tin đơn vị sản phẩm trong giỏ hàng không hợp lệ."
                );
        }

        if (!Boolean.TRUE.equals(
                donViBan.getTrangThai()
        )) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Có đơn vị sản phẩm đã ngừng hoạt động."
                );
        }

        if (!Boolean.TRUE.equals(
                donViBan.getChoPhepBan()
        )) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Có đơn vị sản phẩm không còn được phép bán."
                );
        }

        if (donViBan.getGiaBanTheoDonVi() == null
                || donViBan.getGiaBanTheoDonVi()
                        .compareTo(BigDecimal.ZERO) <= 0) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Giá bán của đơn vị sản phẩm không hợp lệ."
                );
        }
    }

    private void kiemTraTonKhoMoiNhat(
                List<ChiTietGioHang> danhSachChiTiet
        ) {
        for (ChiTietGioHang chiTiet
                : danhSachChiTiet) {
                kiemTraDonViBanHopLe(
                        chiTiet.getDonViSanPham()
                );
        }

        List<Long> danhSachMaSanPham =
                danhSachChiTiet.stream()
                        .map(ChiTietGioHang::getDonViSanPham)
                        .map(DonViSanPham::getSanPham)
                        .map(sanPham ->
                                sanPham.getMaSanPham()
                        )
                        .distinct()
                        .toList();

        Map<Long, List<QuyDoiDonVi>>
                quyDoiTheoSanPham =
                tonKhoSanPhamService
                        .layQuyDoiTheoDanhSachSanPham(
                                danhSachMaSanPham
                        );

        Map<Long, BigDecimal> tonTheoSanPham =
                tonKhoSanPhamService
                        .layTonKhaDungTheoDanhSachSanPham(
                                danhSachMaSanPham
                        );

        Map<Long, BigDecimal> tongCanTheoSanPham =
                new LinkedHashMap<>();

        for (ChiTietGioHang chiTiet
                : danhSachChiTiet) {
                DonViSanPham donViBan =
                        chiTiet.getDonViSanPham();

                Long maSanPham =
                        donViBan.getSanPham()
                                .getMaSanPham();

                List<QuyDoiDonVi> danhSachQuyDoi =
                        quyDoiTheoSanPham.getOrDefault(
                                maSanPham,
                                List.of()
                        );

                BigDecimal heSoQuyDoi =
                        tonKhoSanPhamService
                                .tinhHeSoVeDonViCoSo(
                                        donViBan,
                                        danhSachQuyDoi
                                );

                BigDecimal soLuongCan =
                        heSoQuyDoi.multiply(
                                BigDecimal.valueOf(
                                        chiTiet.getSoLuong()
                                )
                        );

                tongCanTheoSanPham.merge(
                        maSanPham,
                        soLuongCan,
                        BigDecimal::add
                );
        }

        boolean duTon =
                tonKhoSanPhamService.kiemTraDuTon(
                        tongCanTheoSanPham,
                        tonTheoSanPham
                );

        if (!duTon) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Số lượng yêu cầu vượt quá tồn kho hiện có."
                );
        }
    }

    private List<DonViSanPham>
                layDanhSachDonViKhongTrung(
                        List<ChiTietGioHang> danhSachChiTiet
                ) {
        Map<Long, DonViSanPham> donViTheoMa =
                new LinkedHashMap<>();

        for (ChiTietGioHang chiTiet
                : danhSachChiTiet) {
                DonViSanPham donViSanPham =
                        chiTiet.getDonViSanPham();

                donViTheoMa.put(
                        donViSanPham.getMaDonViSanPham(),
                        donViSanPham
                );
        }

        return new ArrayList<>(
                donViTheoMa.values()
        );
    }

    private List<ChiTietDonHang>
                taoDanhSachChiTietDonHang(
                        List<ChiTietGioHang>
                                danhSachChiTietGioHang,
                        Map<Long, KetQuaTinhGiaSanPham>
                                ketQuaGiaTheoDonVi
                ) {
        List<ChiTietDonHang>
                danhSachChiTietDonHang =
                new ArrayList<>();

        for (ChiTietGioHang chiTietGioHang
                : danhSachChiTietGioHang) {
                DonViSanPham donViSanPham =
                        chiTietGioHang.getDonViSanPham();

                KetQuaTinhGiaSanPham ketQuaGia =
                        ketQuaGiaTheoDonVi.get(
                                donViSanPham
                                        .getMaDonViSanPham()
                        );

                if (ketQuaGia == null) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Không tìm thấy kết quả tính giá khi tạo đơn hàng."
                );
                }

                BigDecimal soLuong =
                        BigDecimal.valueOf(
                                chiTietGioHang.getSoLuong()
                        );

                /*
                * donGia là giá gốc của một đơn vị.
                */
                BigDecimal donGia =
                        ketQuaGia.giaGoc();

                /*
                * giamGia là tổng giảm giá của cả dòng.
                */
                BigDecimal giamGia =
                        ketQuaGia
                                .soTienGiamMoiDonVi()
                                .multiply(soLuong);

                /*
                * thanhTien = đơn giá gốc × số lượng
                *             − tổng giảm giá dòng.
                */
                BigDecimal thanhTien =
                        donGia.multiply(soLuong)
                                .subtract(giamGia);

                if (thanhTien.compareTo(
                        BigDecimal.ZERO
                ) < 0) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Kết quả tính giá đơn hàng không hợp lệ."
                );
                }

                String cachTinhGia =
                        ketQuaGia.cachTinhGia();

                if (cachTinhGia != null
                        && cachTinhGia.length() > 100) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Mô tả cách tính giá vượt quá giới hạn lưu trữ."
                );
                }

                ChiTietDonHang chiTietDonHang =
                        new ChiTietDonHang();

                chiTietDonHang.setSanPham(
                        donViSanPham.getSanPham()
                );

                chiTietDonHang.setDonViSanPham(
                        donViSanPham
                );

                chiTietDonHang.setSoLuong(
                        chiTietGioHang.getSoLuong()
                );

                chiTietDonHang.setDonGia(
                        donGia
                );

                chiTietDonHang.setGiamGia(
                        giamGia
                );

                chiTietDonHang.setThanhTien(
                        thanhTien
                );

                chiTietDonHang.setCachTinhGia(
                        cachTinhGia
                );

                danhSachChiTietDonHang.add(
                        chiTietDonHang
                );
        }

        return danhSachChiTietDonHang;
    }

    private BigDecimal tinhTongTienHang(
                List<ChiTietDonHang> danhSachChiTietDonHang
        ) {
                BigDecimal tongTienHang = BigDecimal.ZERO;

        for (ChiTietDonHang chiTiet
                : danhSachChiTietDonHang) {
                BigDecimal tongGiaGocDong =
                        chiTiet.getDonGia().multiply(
                                BigDecimal.valueOf(
                                        chiTiet.getSoLuong()
                                )
                        );

                tongTienHang =
                        tongTienHang.add(
                                tongGiaGocDong
                        );
        }

        return tongTienHang;
    }

    private BigDecimal tinhTongGiamGiaSanPham(
                List<ChiTietDonHang> danhSachChiTietDonHang
        ) {
                BigDecimal tongGiamGiaSanPham =
                BigDecimal.ZERO;

        for (ChiTietDonHang chiTiet
                : danhSachChiTietDonHang) {
                if (chiTiet.getGiamGia() != null) {
                tongGiamGiaSanPham =
                        tongGiamGiaSanPham.add(
                                chiTiet.getGiamGia()
                        );
                }
        }

        return tongGiamGiaSanPham;
    }
        private DonHang taoVaLuuDonHang(
                DuLieuTaoDonHang duLieu,
                BigDecimal tongTienHang,
                BigDecimal tongGiamGiaSanPham,
                PhuongThucThanhToan phuongThucThanhToan,
                LocalDateTime thoiDiemTaoDon
        ) {
                BigDecimal phiGiaoHang =
                        PHI_GIAO_HANG_CO_DINH;

                /*
                * Hiện chưa có voucher.
                * don_hang.giam_gia dành cho giảm cấp đơn hàng/voucher.
                */
                BigDecimal giamGiaVoucher =
                        BigDecimal.ZERO;

                BigDecimal tongThanhToan =
                        tongTienHang
                                .add(phiGiaoHang)
                                .subtract(tongGiamGiaSanPham)
                                .subtract(giamGiaVoucher);

                DonHang donHang = new DonHang();

                donHang.setNgayDatHang(
                        thoiDiemTaoDon
                );

                donHang.setKhachHang(
                        duLieu.getKhachHang()
                );

                donHang.setDiaChiGiaoHang(
                        duLieu.getDiaChiGiaoHang()
                );

                donHang.setLoaiKhach(
                        LoaiKhachHang.CO_TAI_KHOAN
                );

                donHang.setTongTienHang(tongTienHang);
                donHang.setPhiGiaoHang(phiGiaoHang);
                donHang.setGiamGia(giamGiaVoucher);
                donHang.setTongThanhToan(tongThanhToan);

                donHang.setPhuongThucThanhToan(
                        phuongThucThanhToan
                );

                if (phuongThucThanhToan == PhuongThucThanhToan.COD) {
                        donHang.setTrangThaiThanhToan(
                                TrangThaiThanhToan.CHUA_THANH_TOAN
                        );

                        donHang.setTrangThaiDonHang(
                                TrangThaiDonHang.CHO_XU_LY
                        );
                } else if (phuongThucThanhToan == PhuongThucThanhToan.ZALOPAY) {
                        donHang.setTrangThaiThanhToan(
                                TrangThaiThanhToan.CHO_THANH_TOAN
                        );

                        donHang.setTrangThaiDonHang(
                                TrangThaiDonHang.CHO_THANH_TOAN
                        );
                } else {
                        throw new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "Phương thức thanh toán không được hỗ trợ."
                        );
                }

                donHang.setGhiChu(
                        duLieu.getGhiChu()
                );

                return donHangRepository.save(donHang);
        }

    private DonHangResponseDto taoDonHangResponse(
            DonHang donHang,
            List<ChiTietDonHang> danhSachChiTiet
    ) {
        List<ChiTietDonHangResponseDto> danhSachResponse =
                new ArrayList<>();

        for (ChiTietDonHang chiTiet : danhSachChiTiet) {
            DonViSanPham donViSanPham =
                    chiTiet.getDonViSanPham();

            danhSachResponse.add(
                    new ChiTietDonHangResponseDto(
                            chiTiet.getMaChiTietDonHang(),
                            chiTiet.getSanPham().getMaSanPham(),
                            chiTiet.getSanPham().getTenSanPham(),
                            chiTiet.getSanPham().getHinhAnh(),
                            donViSanPham.getMaDonViSanPham(),
                            donViSanPham.getDonViTinh()
                                    .getTenDonViTinh(),
                            chiTiet.getSoLuong(),
                            chiTiet.getDonGia(),
                            chiTiet.getGiamGia(),
                            chiTiet.getThanhTien()
                    )
            );
        }

        DiaChiGiaoHang diaChiGiaoHang =
                donHang.getDiaChiGiaoHang();

        return new DonHangResponseDto(
                donHang.getMaDonHang(),
                donHang.getKhachHang().getMaKhachHang(),
diaChiGiaoHang.getMaDiaChi(),
                diaChiGiaoHang.getTenNguoiNhan(),
                diaChiGiaoHang.getSoDienThoaiNhan(),
                diaChiGiaoHang.getThanhPho(),
                diaChiGiaoHang.getPhuongKhuVuc(),
                diaChiGiaoHang.getDiaChiChiTiet(),
                donHang.getNgayDatHang(),
                donHang.getTongTienHang(),
                donHang.getPhiGiaoHang(),
                donHang.getGiamGia(),
                donHang.getTongThanhToan(),
                donHang.getPhuongThucThanhToan(),
                donHang.getTrangThaiThanhToan(),
                donHang.getTrangThaiDonHang(),
                donHang.getGhiChu(),
                danhSachResponse
        );
    }

    private Map<Long, List<ChiTietDonHang>>
            gomChiTietTheoMaDonHang(
                    List<ChiTietDonHang> danhSachChiTiet
            ) {
        Map<Long, List<ChiTietDonHang>> ketQua =
                new HashMap<>();

        for (ChiTietDonHang chiTiet : danhSachChiTiet) {
            Long maDonHang =
                    chiTiet.getDonHang().getMaDonHang();

            ketQua.computeIfAbsent(
                    maDonHang,
                    key -> new ArrayList<>()
            ).add(chiTiet);
        }

        return ketQua;
    }

    private DonHangDanhSachDto taoDonHangDanhSachDto(
            DonHang donHang,
            List<ChiTietDonHang> danhSachChiTiet
    ) {
        if (danhSachChiTiet.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Đơn hàng mã "
                            + donHang.getMaDonHang()
                            + " không có chi tiết đơn hàng."
            );
        }

        ChiTietDonHang chiTietDauTien =
                danhSachChiTiet.get(0);

        SanPhamDonHangTomTatDto sanPhamDauTien =
                new SanPhamDonHangTomTatDto(
                        chiTietDauTien.getSanPham()
                                .getMaSanPham(),
                        chiTietDauTien.getSanPham()
                                .getTenSanPham(),
                        chiTietDauTien.getSanPham()
                                .getHinhAnh(),
                        chiTietDauTien.getSoLuong(),
                        chiTietDauTien.getDonViSanPham()
                                .getDonViTinh()
                                .getTenDonViTinh(),
                        chiTietDauTien.getDonGia(),
                        chiTietDauTien.getThanhTien()
                );

        int soSanPhamKhac =
                danhSachChiTiet.size() - 1;

        return new DonHangDanhSachDto(
                donHang.getMaDonHang(),
                donHang.getNgayDatHang(),
                donHang.getTrangThaiDonHang(),
                donHang.getTongThanhToan(),
                sanPhamDauTien,
                soSanPhamKhac
        );
    }
}
