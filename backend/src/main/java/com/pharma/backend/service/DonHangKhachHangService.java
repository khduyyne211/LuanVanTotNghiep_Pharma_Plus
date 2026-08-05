package com.pharma.backend.service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
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
import com.pharma.backend.enums.donhang.LoaiKhachHang;
import com.pharma.backend.enums.donhang.PhuongThucThanhToan;
import com.pharma.backend.enums.donhang.TrangThaiDonHang;
import com.pharma.backend.enums.donhang.TrangThaiThanhToan;
import com.pharma.backend.repository.ChiTietDonHangRepository;
import com.pharma.backend.repository.ChiTietGioHangRepository;
import com.pharma.backend.repository.DiaChiGiaoHangRepository;
import com.pharma.backend.repository.DonHangRepository;
import com.pharma.backend.repository.DonViSanPhamRepository;
import com.pharma.backend.repository.GioHangRepository;
import com.pharma.backend.repository.QuyDoiDonViRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonHangKhachHangService {

    private static final String CACH_TINH_GIA_THEO_DON_VI =
            "GIA_BAN_THEO_DON_VI";

    private final GioHangRepository gioHangRepository;
    private final ChiTietGioHangRepository chiTietGioHangRepository;
    private final DiaChiGiaoHangRepository diaChiGiaoHangRepository;
    private final DonViSanPhamRepository donViSanPhamRepository;
    private final QuyDoiDonViRepository quyDoiDonViRepository;
    private final DonHangRepository donHangRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;

    @Transactional
    public DonHangResponseDto taoDonHang(
            Long maKhachHang,
            TaoDonHangRequestDto request
    ) {
        DuLieuTaoDonHang duLieu =
                chuanBiDuLieuTaoDonHang(maKhachHang, request);

        List<ChiTietDonHang> danhSachChiTietDonHang =
                taoDanhSachChiTietDonHang(
                        duLieu.getDanhSachChiTietGioHang()
                );

        BigDecimal tongTienHang =
                tinhTongTienHang(danhSachChiTietDonHang);

        DonHang donHang = taoVaLuuDonHang(
                duLieu,
                tongTienHang,
                request.getPhuongThucThanhToan()
        );

        for (ChiTietDonHang chiTiet : danhSachChiTietDonHang) {
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
        return diaChiGiaoHangRepository
                .findByMaDiaChiAndKhachHang_MaKhachHangAndTrangThaiSuDungTrue(
                        maDiaChi,
                        maKhachHang
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Địa chỉ nhận hàng không hợp lệ."
                ));
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

    private Map<Long, BigDecimal> gomSoLuongCanXuatTheoSanPham(
            List<ChiTietGioHang> danhSachChiTiet
    ) {
        Map<Long, BigDecimal> soLuongTheoSanPham =
                new LinkedHashMap<>();
Map<Long, BigDecimal> heSoTheoDonVi =
                new HashMap<>();

        for (ChiTietGioHang chiTiet : danhSachChiTiet) {
            DonViSanPham donViBan =
                    chiTiet.getDonViSanPham();

            kiemTraDonViBanHopLe(donViBan);

            Long maDonViSanPham =
                    donViBan.getMaDonViSanPham();

            BigDecimal heSoQuyDoi =
                    heSoTheoDonVi.get(maDonViSanPham);

            if (heSoQuyDoi == null) {
                heSoQuyDoi =
                        tinhHeSoQuyDoiVeDonViCoSo(donViBan);

                heSoTheoDonVi.put(
                        maDonViSanPham,
                        heSoQuyDoi
                );
            }

            BigDecimal soLuongCanXuat =
                    heSoQuyDoi.multiply(
                            BigDecimal.valueOf(
                                    chiTiet.getSoLuong()
                            )
                    );

            Long maSanPham =
                    donViBan.getSanPham().getMaSanPham();

            soLuongTheoSanPham.merge(
                    maSanPham,
                    soLuongCanXuat,
                    BigDecimal::add
            );
        }

        return soLuongTheoSanPham;
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

        if (!Boolean.TRUE.equals(donViBan.getTrangThai())
                || !Boolean.TRUE.equals(donViBan.getChoPhepBan())) {
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

    private BigDecimal tinhHeSoQuyDoiVeDonViCoSo(
            DonViSanPham donViBan
    ) {
        if (Boolean.TRUE.equals(
                donViBan.getLaDonViCoSo()
        )) {
            return BigDecimal.ONE;
        }

        Long maSanPham =
                donViBan.getSanPham().getMaSanPham();

        DonViSanPham donViCoSo =
                donViSanPhamRepository
                        .findBySanPham_MaSanPhamAndLaDonViCoSoTrueAndTrangThaiTrue(
                                maSanPham
                        )
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
"Sản phẩm chưa được khai báo đơn vị cơ sở."
                        ));

        List<QuyDoiDonVi> danhSachQuyDoi =
                quyDoiDonViRepository
                        .layDanhSachQuyDoiDangHoatDong(
                                maSanPham
                        );

        return timHeSoTrongChuoiQuyDoi(
                donViBan.getMaDonViSanPham(),
                donViCoSo.getMaDonViSanPham(),
                danhSachQuyDoi
        );
    }

    private BigDecimal timHeSoTrongChuoiQuyDoi(
            Long maDonViBatDau,
            Long maDonViCoSo,
            List<QuyDoiDonVi> danhSachQuyDoi
    ) {
        Map<Long, BigDecimal> heSoDaTim =
                new HashMap<>();

        Deque<Long> hangDoi =
                new ArrayDeque<>();

        heSoDaTim.put(
                maDonViBatDau,
                BigDecimal.ONE
        );

        hangDoi.addLast(maDonViBatDau);

        while (!hangDoi.isEmpty()) {
            Long maDonViHienTai =
                    hangDoi.removeFirst();

            BigDecimal heSoHienTai =
                    heSoDaTim.get(maDonViHienTai);

            if (maDonViHienTai.equals(maDonViCoSo)) {
                return heSoHienTai;
            }

            for (QuyDoiDonVi quyDoi : danhSachQuyDoi) {
                kiemTraDuLieuQuyDoi(quyDoi);

                Long maNguon =
                        quyDoi.getDonViNguon()
                                .getMaDonViSanPham();

                Long maDich =
                        quyDoi.getDonViDich()
                                .getMaDonViSanPham();

                if (maDonViHienTai.equals(maNguon)) {
                    BigDecimal heSoBuoc =
                            quyDoi.getSoLuongDich().divide(
                                    quyDoi.getSoLuongNguon(),
                                    MathContext.DECIMAL128
                            );

                    themDonViVaoHangDoi(
                            maDich,
                            heSoHienTai.multiply(heSoBuoc),
                            heSoDaTim,
                            hangDoi
                    );
                }

                if (maDonViHienTai.equals(maDich)) {
                    BigDecimal heSoBuoc =
                            quyDoi.getSoLuongNguon().divide(
                                    quyDoi.getSoLuongDich(),
                                    MathContext.DECIMAL128
                            );

                    themDonViVaoHangDoi(
                            maNguon,
                            heSoHienTai.multiply(heSoBuoc),
                            heSoDaTim,
                            hangDoi
                    );
                }
            }
        }

        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Không tìm thấy đường quy đổi từ đơn vị bán về đơn vị cơ sở."
        );
    }

    private void themDonViVaoHangDoi(
Long maDonVi,
            BigDecimal heSo,
            Map<Long, BigDecimal> heSoDaTim,
            Deque<Long> hangDoi
    ) {
        if (!heSoDaTim.containsKey(maDonVi)) {
            heSoDaTim.put(maDonVi, heSo);
            hangDoi.addLast(maDonVi);
        }
    }

    private void kiemTraDuLieuQuyDoi(
            QuyDoiDonVi quyDoi
    ) {
        boolean khongHopLe =
                quyDoi.getDonViNguon() == null
                        || quyDoi.getDonViDich() == null
                        || quyDoi.getSoLuongNguon() == null
                        || quyDoi.getSoLuongDich() == null
                        || quyDoi.getSoLuongNguon()
                                .compareTo(BigDecimal.ZERO) <= 0
                        || quyDoi.getSoLuongDich()
                                .compareTo(BigDecimal.ZERO) <= 0;

        if (khongHopLe) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Dữ liệu quy đổi đơn vị của sản phẩm không hợp lệ."
            );
        }
    }

    private List<ChiTietDonHang> taoDanhSachChiTietDonHang(
            List<ChiTietGioHang> danhSachChiTietGioHang
    ) {
        List<ChiTietDonHang> danhSachChiTietDonHang =
                new ArrayList<>();

        for (ChiTietGioHang chiTietGioHang
                : danhSachChiTietGioHang) {
            DonViSanPham donViSanPham =
                    chiTietGioHang.getDonViSanPham();

            BigDecimal donGia =
                    donViSanPham.getGiaBanTheoDonVi();

            BigDecimal thanhTien =
                    donGia.multiply(
                            BigDecimal.valueOf(
                                    chiTietGioHang.getSoLuong()
                            )
                    );

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

            chiTietDonHang.setDonGia(donGia);
            chiTietDonHang.setGiamGia(BigDecimal.ZERO);
            chiTietDonHang.setThanhTien(thanhTien);

            chiTietDonHang.setCachTinhGia(
                    CACH_TINH_GIA_THEO_DON_VI
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
            tongTienHang = tongTienHang.add(
                    chiTiet.getThanhTien()
            );
        }

        return tongTienHang;
    }
private DonHang taoVaLuuDonHang(
            DuLieuTaoDonHang duLieu,
            BigDecimal tongTienHang,
            PhuongThucThanhToan phuongThucThanhToan
    ) {
        BigDecimal phiGiaoHang = BigDecimal.ZERO;
        BigDecimal giamGia = BigDecimal.ZERO;

        BigDecimal tongThanhToan =
                tongTienHang
                        .add(phiGiaoHang)
                        .subtract(giamGia);

        DonHang donHang = new DonHang();

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
        donHang.setGiamGia(giamGia);
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
