package com.pharma.backend.service.khachhang;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.khachhang.giohang.ChiTietGioHangLocalRequestDto;
import com.pharma.backend.dto.khachhang.giohang.KiemTraGioHangRequestDto;
import com.pharma.backend.dto.khachhang.giohang.KiemTraGioHangResponseDto;
import com.pharma.backend.dto.khachhang.giohang.ThongTinKiemTraGioHangDto;
import com.pharma.backend.dto.khachhang.voucher.ApDungVoucherResponseDto;
import com.pharma.backend.dto.khachhang.voucher.KiemTraVoucherRequestDto;
import com.pharma.backend.dto.khachhang.voucher.KiemTraVoucherTheoMaRequestDto;
import com.pharma.backend.dto.khachhang.voucher.VoucherKhachHangResponseDto;
import com.pharma.backend.entity.VoucherDonHang;
import com.pharma.backend.enums.khuyenmai.KieuGiamGia;
import com.pharma.backend.repository.VoucherDonHangRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VoucherDonHangKhachHangService {

    private static final ZoneId MUI_GIO_VIET_NAM =
            ZoneId.of("Asia/Ho_Chi_Minh");

    private static final BigDecimal MOT_TRAM =
            new BigDecimal("100");

    private final VoucherDonHangRepository
            voucherDonHangRepository;

    private final KiemTraGioHangService
            kiemTraGioHangService;

    /*
     * =========================
     * DANH SÁCH VOUCHER
     * =========================
     */

    @Transactional(readOnly = true)
    public List<VoucherKhachHangResponseDto>
            layDanhSachVoucher(
                    KiemTraGioHangRequestDto request
            ) {

        BigDecimal tienHangSauKhuyenMai =
                tinhTienHangSauKhuyenMai(
                        request
                );

        LocalDateTime thoiDiemHienTai =
                LocalDateTime.now(
                        MUI_GIO_VIET_NAM
                );

        return voucherDonHangRepository
                .timVoucherDangCoHieuLuc(
                        thoiDiemHienTai
                )
                .stream()
                .filter(
                        this::cauHinhVoucherHopLe
                )
                .map(voucher ->
                        taoVoucherKhachHangResponse(
                                voucher,
                                tienHangSauKhuyenMai
                        )
                )
                .toList();
    }

    /*
     * =========================
     * KHÁCH NHẬP MÃ VOUCHER
     * =========================
     *
     * Đây chỉ là bước kiểm tra thử.
     *
     * KHÔNG tăng soLuongDaSuDung.
     */
    @Transactional(readOnly = true)
    public ApDungVoucherResponseDto
            kiemTraVaApDungVoucher(
                    KiemTraVoucherRequestDto request
            ) {

        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Dữ liệu voucher không hợp lệ."
            );
        }

        String maGiamGia =
                chuanHoaMaGiamGia(
                        request.getMaGiamGia()
                );

        VoucherDonHang voucher =
                voucherDonHangRepository
                        .findByMaGiamGiaIgnoreCase(
                                maGiamGia
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Mã voucher không tồn tại."
                                )
                        );

        LocalDateTime thoiDiemHienTai =
                LocalDateTime.now(
                        MUI_GIO_VIET_NAM
                );

        kiemTraVoucherConHieuLuc(
                voucher,
                thoiDiemHienTai
        );

        KiemTraGioHangRequestDto
                yeuCauKiemTraGioHang =
                new KiemTraGioHangRequestDto();

        yeuCauKiemTraGioHang
                .setDanhSachChiTiet(
                        request.getDanhSachChiTiet()
                );

        BigDecimal tienHangSauKhuyenMai =
                tinhTienHangSauKhuyenMai(
                        yeuCauKiemTraGioHang
                );

        kiemTraGiaTriDonToiThieu(
                voucher,
                tienHangSauKhuyenMai
        );

        BigDecimal soTienGiam =
                tinhSoTienGiamVoucher(
                        voucher,
                        tienHangSauKhuyenMai
                );

        return new ApDungVoucherResponseDto(
                voucher.getMaVoucher(),
                voucher.getMaGiamGia(),
                voucher.getTenVoucher(),
                voucher.getLoaiGiamGia(),
                voucher.getGiaTriGiam(),
                voucher.getSoTienGiamToiDa(),
                voucher.getDonGiaToiThieu(),
                voucher.getThoiGianKetThuc(),
                tienHangSauKhuyenMai,
                soTienGiam,
                "Áp dụng voucher thành công."
        );
    }

    /*
     * =========================
     * KHÁCH CHỌN VOUCHER TRONG DANH SÁCH
     * =========================
     *
     * Khách chọn bằng maVoucher từ danh sách.
     *
     * Backend vẫn kiểm tra lại:
     * - voucher còn hiệu lực;
     * - còn lượt;
     * - giỏ hàng hợp lệ;
     * - giá trị đơn tối thiểu;
     * - số tiền giảm thực tế.
     *
     * KHÔNG tăng soLuongDaSuDung.
     */
    @Transactional(readOnly = true)
    public ApDungVoucherResponseDto
            kiemTraVaApDungVoucherTheoMaVoucher(
                    KiemTraVoucherTheoMaRequestDto request
            ) {

        if (request == null
                || request.getMaVoucher() == null
                || request.getMaVoucher() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Mã voucher không hợp lệ."
            );
        }

        VoucherDonHang voucher =
                voucherDonHangRepository
                        .findById(
                                request.getMaVoucher()
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Voucher không tồn tại."
                                )
                        );

        LocalDateTime thoiDiemHienTai =
                LocalDateTime.now(
                        MUI_GIO_VIET_NAM
                );

        kiemTraVoucherConHieuLuc(
                voucher,
                thoiDiemHienTai
        );

        KiemTraGioHangRequestDto
                yeuCauKiemTraGioHang =
                new KiemTraGioHangRequestDto();

        yeuCauKiemTraGioHang
                .setDanhSachChiTiet(
                        request.getDanhSachChiTiet()
                );

        BigDecimal tienHangSauKhuyenMai =
                tinhTienHangSauKhuyenMai(
                        yeuCauKiemTraGioHang
                );

        kiemTraGiaTriDonToiThieu(
                voucher,
                tienHangSauKhuyenMai
        );

        BigDecimal soTienGiam =
                tinhSoTienGiamVoucher(
                        voucher,
                        tienHangSauKhuyenMai
                );

        return new ApDungVoucherResponseDto(
                voucher.getMaVoucher(),
                voucher.getMaGiamGia(),
                voucher.getTenVoucher(),
                voucher.getLoaiGiamGia(),
                voucher.getGiaTriGiam(),
                voucher.getSoTienGiamToiDa(),
                voucher.getDonGiaToiThieu(),
                voucher.getThoiGianKetThuc(),
                tienHangSauKhuyenMai,
                soTienGiam,
                "Áp dụng voucher thành công."
        );
    }

    /*
     * =========================
     * GIỮ LƯỢT KHI TẠO ĐƠN
     * =========================
     *
     * Đây mới là bước voucher thực sự được sử dụng.
     *
     * Nếu không có maVoucher:
     * → không sử dụng voucher.
     *
     * Nếu có:
     * → khóa voucher;
     * → kiểm tra lại toàn bộ điều kiện;
     * → tính lại số tiền giảm;
     * → tăng soLuongDaSuDung.
     *
     * Phương thức này được gọi bên trong transaction
     * tạo đơn hàng nên nếu việc tạo đơn thất bại,
     * thay đổi số lượt voucher cũng sẽ rollback.
     */
    @Transactional
    public DuLieuVoucherDonHang giuLuotVoucherKhiTaoDon(
            Long maVoucher,
            BigDecimal tienHangSauKhuyenMai,
            LocalDateTime thoiDiemTaoDon
    ) {

        if (maVoucher == null) {
            return new DuLieuVoucherDonHang(
                    null,
                    BigDecimal.ZERO
            );
        }

        if (maVoucher <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Mã voucher không hợp lệ."
            );
        }

        if (tienHangSauKhuyenMai == null
                || tienHangSauKhuyenMai.compareTo(
                        BigDecimal.ZERO
                ) < 0) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Giá trị đơn hàng để áp dụng voucher không hợp lệ."
            );
        }

        if (thoiDiemTaoDon == null) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Không xác định được thời điểm áp dụng voucher."
            );
        }

        /*
         * Khóa bi quan voucher.
         *
         * Ví dụ voucher còn đúng 1 lượt:
         * hai khách tạo đơn cùng lúc sẽ không thể
         * cùng đọc và sử dụng lượt cuối.
         */
        VoucherDonHang voucher =
                voucherDonHangRepository
                        .timTheoMaDeCapNhat(
                                maVoucher
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Voucher không tồn tại."
                                )
                        );

        kiemTraVoucherConHieuLuc(
                voucher,
                thoiDiemTaoDon
        );

        kiemTraGiaTriDonToiThieu(
                voucher,
                tienHangSauKhuyenMai
        );

        BigDecimal soTienGiam =
                tinhSoTienGiamVoucher(
                        voucher,
                        tienHangSauKhuyenMai
                );

        Integer soLuongDaSuDung =
                voucher.getSoLuongDaSuDung();

        Integer soLuongSuDung =
                voucher.getSoLuongSuDung();

        if (soLuongDaSuDung == null
                || soLuongSuDung == null
                || soLuongDaSuDung < 0
                || soLuongSuDung <= 0
                || soLuongDaSuDung >= soLuongSuDung) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Voucher đã hết lượt sử dụng."
            );
        }

        voucher.setSoLuongDaSuDung(
                soLuongDaSuDung + 1
        );

        VoucherDonHang voucherDaCapNhat =
                voucherDonHangRepository.save(
                        voucher
                );

        return new DuLieuVoucherDonHang(
                voucherDaCapNhat,
                soTienGiam
        );
    }

    /*
     * =========================
     * HOÀN LƯỢT VOUCHER
     * =========================
     *
     * Được gọi khi đơn hàng đã giữ voucher
     * thực sự chuyển sang trạng thái DA_HUY.
     */
    @Transactional
    public void hoanLuotVoucherKhiHuyDon(
            Long maVoucher
    ) {

        if (maVoucher == null) {
            return;
        }

        VoucherDonHang voucher =
                voucherDonHangRepository
                        .timTheoMaDeCapNhat(
                                maVoucher
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.INTERNAL_SERVER_ERROR,
                                        "Không tìm thấy voucher của đơn hàng."
                                )
                        );

        Integer soLuongDaSuDung =
                voucher.getSoLuongDaSuDung();

        if (soLuongDaSuDung == null
                || soLuongDaSuDung <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Số lượt đã sử dụng của voucher không hợp lệ."
            );
        }

        voucher.setSoLuongDaSuDung(
                soLuongDaSuDung - 1
        );

        voucherDonHangRepository.save(
                voucher
        );
    }

    /*
     * =========================
     * TÍNH GIÁ TRỊ GIỎ HÀNG
     * =========================
     */

    private BigDecimal tinhTienHangSauKhuyenMai(
            KiemTraGioHangRequestDto request
    ) {

        KiemTraGioHangResponseDto
                ketQuaKiemTra =
                kiemTraGioHangService
                        .kiemTraGioHang(
                                request
                        );

        if (!ketQuaKiemTra.isHopLe()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Giỏ hàng có sản phẩm không đủ tồn kho."
            );
        }

        Map<Long, Integer>
                soLuongTheoDonVi =
                gomSoLuongTheoDonVi(
                        request
                );

        Map<Long, ThongTinKiemTraGioHangDto>
                thongTinTheoDonVi =
                new LinkedHashMap<>();

        for (ThongTinKiemTraGioHangDto thongTin
                : ketQuaKiemTra
                        .getDanhSachThongTin()) {

            thongTinTheoDonVi.put(
                    thongTin.getMaDonViSanPham(),
                    thongTin
            );
        }

        BigDecimal tongTien =
                BigDecimal.ZERO;

        for (Map.Entry<Long, Integer> entry
                : soLuongTheoDonVi.entrySet()) {

            ThongTinKiemTraGioHangDto thongTin =
                    thongTinTheoDonVi.get(
                            entry.getKey()
                    );

            if (thongTin == null
                    || thongTin.getGiaSauKhuyenMai()
                            == null) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Không xác định được giá sản phẩm khi kiểm tra voucher."
                );
            }

            BigDecimal giaSauKhuyenMai =
                    thongTin.getGiaSauKhuyenMai();

            if (giaSauKhuyenMai.compareTo(
                    BigDecimal.ZERO
            ) < 0) {
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Giá sản phẩm sau khuyến mãi không hợp lệ."
                );
            }

            BigDecimal thanhTien =
                    giaSauKhuyenMai.multiply(
                            BigDecimal.valueOf(
                                    entry.getValue()
                            )
                    );

            tongTien =
                    tongTien.add(
                            thanhTien
                    );
        }

        return tongTien;
    }

    private Map<Long, Integer>
            gomSoLuongTheoDonVi(
                    KiemTraGioHangRequestDto request
            ) {

        if (request == null
                || request.getDanhSachChiTiet() == null
                || request.getDanhSachChiTiet()
                        .isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Giỏ hàng không có sản phẩm."
            );
        }

        Map<Long, Integer>
                soLuongTheoDonVi =
                new LinkedHashMap<>();

        for (ChiTietGioHangLocalRequestDto chiTiet
                : request.getDanhSachChiTiet()) {

            if (chiTiet == null
                    || chiTiet.getMaDonViSanPham()
                            == null
                    || chiTiet.getSoLuong() == null
                    || chiTiet.getSoLuong() <= 0) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Thông tin sản phẩm trong giỏ hàng không hợp lệ."
                );
            }

            soLuongTheoDonVi.merge(
                    chiTiet.getMaDonViSanPham(),
                    chiTiet.getSoLuong(),
                    Integer::sum
            );
        }

        return soLuongTheoDonVi;
    }

    /*
     * =========================
     * RESPONSE DANH SÁCH
     * =========================
     */

    private VoucherKhachHangResponseDto
            taoVoucherKhachHangResponse(
                    VoucherDonHang voucher,
                    BigDecimal tienHangSauKhuyenMai
            ) {

        BigDecimal donGiaToiThieu =
                layDonGiaToiThieu(
                        voucher
                );

        boolean duDieuKien =
                tienHangSauKhuyenMai.compareTo(
                        donGiaToiThieu
                ) >= 0;

        BigDecimal soTienConThieu =
                duDieuKien
                        ? BigDecimal.ZERO
                        : donGiaToiThieu.subtract(
                                tienHangSauKhuyenMai
                        );

        BigDecimal soTienGiamDuKien =
                duDieuKien
                        ? tinhSoTienGiamVoucher(
                                voucher,
                                tienHangSauKhuyenMai
                        )
                        : BigDecimal.ZERO;

        return new VoucherKhachHangResponseDto(
                voucher.getMaVoucher(),
                voucher.getTenVoucher(),
                voucher.getLoaiGiamGia(),
                voucher.getGiaTriGiam(),
                voucher.getSoTienGiamToiDa(),
                donGiaToiThieu,
                voucher.getThoiGianKetThuc(),
                duDieuKien,
                soTienConThieu,
                soTienGiamDuKien
        );
    }

    /*
     * =========================
     * KIỂM TRA VOUCHER
     * =========================
     */

    private void kiemTraVoucherConHieuLuc(
            VoucherDonHang voucher,
            LocalDateTime thoiDiemHienTai
    ) {

        if (!Boolean.TRUE.equals(
                voucher.getTrangThai()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Voucher hiện không hoạt động."
            );
        }

        if (voucher.getThoiGianBatDau() == null
                || voucher.getThoiGianKetThuc()
                        == null) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Thời gian hiệu lực voucher không hợp lệ."
            );
        }

        if (thoiDiemHienTai.isBefore(
                voucher.getThoiGianBatDau()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Voucher chưa đến thời gian sử dụng."
            );
        }

        if (thoiDiemHienTai.isAfter(
                voucher.getThoiGianKetThuc()
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Voucher đã hết hạn."
            );
        }

        if (voucher.getSoLuongSuDung() == null
                || voucher.getSoLuongDaSuDung()
                        == null) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Số lượng sử dụng voucher không hợp lệ."
            );
        }

        if (voucher.getSoLuongDaSuDung()
                >= voucher.getSoLuongSuDung()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Voucher đã hết lượt sử dụng."
            );
        }

        if (!cauHinhVoucherHopLe(
                voucher
        )) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Cấu hình voucher không hợp lệ."
            );
        }
    }

    private void kiemTraGiaTriDonToiThieu(
            VoucherDonHang voucher,
            BigDecimal tienHangSauKhuyenMai
    ) {

        BigDecimal donGiaToiThieu =
                layDonGiaToiThieu(
                        voucher
                );

        if (tienHangSauKhuyenMai.compareTo(
                donGiaToiThieu
        ) < 0) {

            BigDecimal conThieu =
                    donGiaToiThieu.subtract(
                            tienHangSauKhuyenMai
                    );

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Đơn hàng chưa đủ điều kiện sử dụng voucher. "
                            + "Cần mua thêm "
                            + conThieu.stripTrailingZeros()
                                    .toPlainString()
                            + " đồng."
            );
        }
    }

    /*
     * =========================
     * TÍNH GIẢM VOUCHER
     * =========================
     */

    private BigDecimal tinhSoTienGiamVoucher(
            VoucherDonHang voucher,
            BigDecimal tienHangSauKhuyenMai
    ) {

        if (voucher.getLoaiGiamGia() == null
                || voucher.getGiaTriGiam() == null
                || voucher.getGiaTriGiam()
                        .compareTo(BigDecimal.ZERO)
                        <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Giá trị giảm của voucher không hợp lệ."
            );
        }

        BigDecimal soTienGiam;

        if (voucher.getLoaiGiamGia()
                == KieuGiamGia.PHAN_TRAM) {

            soTienGiam =
                    tienHangSauKhuyenMai
                            .multiply(
                                    voucher.getGiaTriGiam()
                            )
                            .divide(
                                    MOT_TRAM,
                                    0,
                                    RoundingMode.HALF_UP
                            );

            if (voucher.getSoTienGiamToiDa()
                    != null) {

                BigDecimal mucGiamToiDa =
                        voucher.getSoTienGiamToiDa()
                                .setScale(
                                        0,
                                        RoundingMode.HALF_UP
                                );

                if (mucGiamToiDa.compareTo(
                        BigDecimal.ZERO
                ) < 0) {
                    throw new ResponseStatusException(
                            HttpStatus.INTERNAL_SERVER_ERROR,
                            "Mức giảm tối đa của voucher không hợp lệ."
                    );
                }

                if (soTienGiam.compareTo(
                        mucGiamToiDa
                ) > 0) {
                    soTienGiam =
                            mucGiamToiDa;
                }
            }

        } else if (voucher.getLoaiGiamGia()
                == KieuGiamGia.SO_TIEN) {

            soTienGiam =
                    voucher.getGiaTriGiam()
                            .setScale(
                                    0,
                                    RoundingMode.HALF_UP
                            );

        } else {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Loại giảm giá của voucher không được hỗ trợ."
            );
        }

        /*
         * Không cho voucher giảm vượt quá
         * giá trị hàng hóa sau khuyến mãi.
         */
        if (soTienGiam.compareTo(
                tienHangSauKhuyenMai
        ) > 0) {
            soTienGiam =
                    tienHangSauKhuyenMai;
        }

        if (soTienGiam.compareTo(
                BigDecimal.ZERO
        ) < 0) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Số tiền giảm voucher không hợp lệ."
            );
        }

        return soTienGiam;
    }

    private BigDecimal layDonGiaToiThieu(
            VoucherDonHang voucher
    ) {

        BigDecimal donGiaToiThieu =
                voucher.getDonGiaToiThieu();

        if (donGiaToiThieu == null
                || donGiaToiThieu.compareTo(
                        BigDecimal.ZERO
                ) < 0) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Giá trị đơn tối thiểu của voucher không hợp lệ."
            );
        }

        return donGiaToiThieu;
    }

    private boolean cauHinhVoucherHopLe(
            VoucherDonHang voucher
    ) {

        if (voucher == null
                || voucher.getLoaiGiamGia() == null
                || voucher.getGiaTriGiam() == null
                || voucher.getGiaTriGiam()
                        .compareTo(BigDecimal.ZERO)
                        <= 0
                || voucher.getDonGiaToiThieu() == null
                || voucher.getDonGiaToiThieu()
                        .compareTo(BigDecimal.ZERO)
                        < 0
                || voucher.getSoLuongSuDung() == null
                || voucher.getSoLuongSuDung() <= 0
                || voucher.getSoLuongDaSuDung() == null
                || voucher.getSoLuongDaSuDung() < 0) {
            return false;
        }

        if (voucher.getLoaiGiamGia()
                == KieuGiamGia.PHAN_TRAM
                && voucher.getSoTienGiamToiDa()
                        != null
                && voucher.getSoTienGiamToiDa()
                        .compareTo(BigDecimal.ZERO)
                        < 0) {
            return false;
        }

        return voucher.getLoaiGiamGia()
                        == KieuGiamGia.PHAN_TRAM
                || voucher.getLoaiGiamGia()
                        == KieuGiamGia.SO_TIEN;
    }

    private String chuanHoaMaGiamGia(
            String maGiamGia
    ) {

        if (maGiamGia == null
                || maGiamGia.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Vui lòng nhập mã voucher."
            );
        }

        String ketQua =
                maGiamGia.trim();

        if (ketQua.length() > 50) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Mã voucher không hợp lệ."
            );
        }

        return ketQua;
    }
}
