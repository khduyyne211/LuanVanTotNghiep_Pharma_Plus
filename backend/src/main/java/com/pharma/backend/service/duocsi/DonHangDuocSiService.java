package com.pharma.backend.service.duocsi;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.admin.donhang.ChiTietDonHangProjection;
import com.pharma.backend.dto.admin.donhang.DonHangChiTietProjection;
import com.pharma.backend.dto.admin.donhang.DonHangDanhSachProjection;
import com.pharma.backend.dto.common.PhanTrangResponse;
import com.pharma.backend.dto.duocsi.donhang.ChiTietDonHangDuocSiResponse;
import com.pharma.backend.dto.duocsi.donhang.DonHangDuocSiChiTietResponse;
import com.pharma.backend.dto.duocsi.donhang.DonHangDuocSiDanhSachResponse;
import com.pharma.backend.entity.DonHang;
import com.pharma.backend.entity.NhanVienNoiBo;
import com.pharma.backend.enums.donhang.LoaiKhachHang;
import com.pharma.backend.enums.donhang.PhuongThucThanhToan;
import com.pharma.backend.enums.donhang.TrangThaiDonHang;
import com.pharma.backend.enums.donhang.TrangThaiKiemDuyetDonHang;
import com.pharma.backend.enums.donhang.TrangThaiThanhToan;
import com.pharma.backend.enums.donthuoc.TrangThaiDonThuoc;
import com.pharma.backend.repository.ChiTietDonHangRepository;
import com.pharma.backend.repository.DonHangRepository;
import com.pharma.backend.repository.NhanVienNoiBoRepository;
import com.pharma.backend.service.common.XuLyTonKhoDonHangService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonHangDuocSiService {

    private static final int KICH_THUOC_TRANG_TOI_DA = 50;

    private final DonHangRepository donHangRepository;

    private final ChiTietDonHangRepository chiTietDonHangRepository;

    private final NhanVienNoiBoRepository nhanVienNoiBoRepository;

    private final XuLyTonKhoDonHangService xuLyTonKhoDonHangService;

    @Transactional(readOnly = true)
    public PhanTrangResponse<DonHangDuocSiDanhSachResponse> layDanhSachDonHangPhanTrang(
            int page,
            int size,
            String keyword,
            TrangThaiDonHang trangThaiDonHang,
            TrangThaiThanhToan trangThaiThanhToan,
            TrangThaiKiemDuyetDonHang trangThaiKiemDuyet) {

        int pageHopLe = Math.max(
                page,
                0);

        int sizeHopLe = Math.min(
                Math.max(
                        size,
                        1),
                KICH_THUOC_TRANG_TOI_DA);

        Pageable pageable = PageRequest.of(
                pageHopLe,
                sizeHopLe);

        Page<DonHangDanhSachProjection> donHangPage = donHangRepository.timKiemDonHang(
                xuLyChuoiLoc(keyword),
                layTenEnum(trangThaiDonHang),
                layTenEnum(trangThaiThanhToan),
                layTenEnum(trangThaiKiemDuyet),
                pageable);

        return PhanTrangResponse
                .<DonHangDuocSiDanhSachResponse>builder()
                .content(
                        donHangPage
                                .getContent()
                                .stream()
                                .map(this::toDanhSachResponse)
                                .toList())
                .page(
                        donHangPage.getNumber())
                .size(
                        donHangPage.getSize())
                .totalElements(
                        donHangPage.getTotalElements())
                .totalPages(
                        donHangPage.getTotalPages())
                .first(
                        donHangPage.isFirst())
                .last(
                        donHangPage.isLast())
                .build();
    }

    @Transactional(readOnly = true)
    public DonHangDuocSiChiTietResponse layChiTietDonHang(
            Long maDonHang) {
        kiemTraMaDonHang(
                maDonHang);

        DonHangChiTietProjection donHang = donHangRepository
                .timChiTietDonHang(
                        maDonHang)
                .orElseThrow(
                        () -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Không tìm thấy đơn hàng."));

        List<ChiTietDonHangDuocSiResponse> danhSachChiTiet = chiTietDonHangRepository
                .timTheoMaDonHang(
                        maDonHang)
                .stream()
                .map(
                        this::toChiTietResponse)
                .toList();

        if (danhSachChiTiet.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Đơn hàng không có thông tin sản phẩm.");
        }

        return toDonHangChiTietResponse(
                donHang,
                danhSachChiTiet);
    }

    /*
     * Tiếp nhận đơn hàng dành cho Dược sĩ.
     *
     * COD:
     * - Phải còn CHO_XU_LY + CHUA_THANH_TOAN.
     * - Kiểm tra điều kiện kiểm duyệt.
     * - Trừ tồn kho theo FEFO.
     * - Gán Dược sĩ xử lý.
     * - Chuyển sang DANG_XU_LY.
     *
     * ZaloPay:
     * - Callback thanh toán thành công đã trừ tồn kho.
     * - Đơn phải là DANG_XU_LY + DA_THANH_TOAN.
     * - Chỉ gán Dược sĩ xử lý, tuyệt đối không trừ tồn lần hai.
     */
    @Transactional
    public DonHangDuocSiChiTietResponse tiepNhanDonHang(
            Long maDonHang,
            Long maNhanVien) {
        kiemTraMaDonHang(
                maDonHang);

        NhanVienNoiBo nhanVien = timNhanVienXuLy(
                maNhanVien);

        /*
         * Khóa đơn để tránh xung đột giữa:
         * - Dược sĩ tiếp nhận.
         * - Khách hàng hủy COD.
         * - Callback ZaloPay.
         * - Scheduler xử lý đơn ZaloPay quá hạn.
         */
        DonHang donHang = donHangRepository
                .timTheoMaDeCapNhat(
                        maDonHang)
                .orElseThrow(
                        () -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Không tìm thấy đơn hàng."));

        kiemTraChuaCoNhanVienXuLy(
                donHang);

        kiemTraDieuKienKiemDuyet(
                donHang);

        PhuongThucThanhToan phuongThucThanhToan = donHang.getPhuongThucThanhToan();

        if (phuongThucThanhToan == PhuongThucThanhToan.COD) {
            tiepNhanDonCod(
                    donHang,
                    nhanVien);
        } else if (phuongThucThanhToan == PhuongThucThanhToan.ZALOPAY) {
            tiepNhanDonZaloPay(
                    donHang,
                    nhanVien);
        } else {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Đơn hàng này không thuộc luồng tiếp nhận đơn giao hàng.");
        }

        donHangRepository.saveAndFlush(
                donHang);

        return layChiTietDonHangSauCapNhat(
                maDonHang);
    }

    @Transactional
    public DonHangDuocSiChiTietResponse capNhatTrangThaiDonHang(
            Long maDonHang,
            Long maNhanVien,
            TrangThaiDonHang trangThaiMoi) {
        kiemTraMaDonHang(maDonHang);

        if (trangThaiMoi == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Trạng thái đơn hàng không được để trống.");
        }

        DonHang donHang = donHangRepository
                .timTheoMaDeCapNhat(maDonHang)
                .orElseThrow(
                        () -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Không tìm thấy đơn hàng."));

        kiemTraDungDuocSiDangXuLy(
                donHang,
                maNhanVien);

        TrangThaiDonHang trangThaiHienTai = donHang.getTrangThaiDonHang();

        if (trangThaiHienTai == TrangThaiDonHang.DANG_XU_LY
                &&
                trangThaiMoi == TrangThaiDonHang.DANG_GIAO) {
            donHang.setTrangThaiDonHang(
                    TrangThaiDonHang.DANG_GIAO);
        } else if (trangThaiHienTai == TrangThaiDonHang.DANG_GIAO
                &&
                trangThaiMoi == TrangThaiDonHang.HOAN_THANH) {
            hoanThanhDonHang(
                    donHang);
        } else {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Không thể chuyển trạng thái đơn hàng từ "
                            + trangThaiHienTai
                            + " sang "
                            + trangThaiMoi
                            + ".");
        }

        donHangRepository.saveAndFlush(
                donHang);

        return layChiTietDonHangSauCapNhat(
                maDonHang);
    }

    @Transactional
    public DonHangDuocSiChiTietResponse huyDonHang(
            Long maDonHang) {
        kiemTraMaDonHang(
                maDonHang);

        DonHang donHang = donHangRepository
                .timTheoMaDeCapNhat(
                        maDonHang)
                .orElseThrow(
                        () -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Không tìm thấy đơn hàng."));

        if (donHang.getTrangThaiDonHang() != TrangThaiDonHang.CHO_XU_LY) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Chỉ được hủy đơn hàng đang chờ xử lý.");
        }

        if (donHang.getTrangThaiThanhToan() == TrangThaiThanhToan.DA_THANH_TOAN) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Đơn hàng đã thanh toán không thể hủy tại bước này.");
        }

        /*
         * CHO_XU_LY là giai đoạn chưa xuất kho theo nghiệp vụ hiện tại,
         * vì vậy hủy tại đây không cần hoàn tồn.
         */
        donHang.setTrangThaiDonHang(
                TrangThaiDonHang.DA_HUY);

        donHang.setTrangThaiThanhToan(
                TrangThaiThanhToan.DA_HUY);

        donHangRepository.saveAndFlush(
                donHang);

        return layChiTietDonHangSauCapNhat(
                maDonHang);
    }

    private void hoanThanhDonHang(
            DonHang donHang) {
        PhuongThucThanhToan phuongThucThanhToan = donHang.getPhuongThucThanhToan();

        if (phuongThucThanhToan == PhuongThucThanhToan.COD) {
            if (donHang.getTrangThaiThanhToan() != TrangThaiThanhToan.CHUA_THANH_TOAN) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Trạng thái thanh toán của đơn COD không hợp lệ để hoàn thành.");
            }

            donHang.setTrangThaiThanhToan(
                    TrangThaiThanhToan.DA_THANH_TOAN);
        } else if (phuongThucThanhToan == PhuongThucThanhToan.ZALOPAY) {
            if (donHang.getTrangThaiThanhToan() != TrangThaiThanhToan.DA_THANH_TOAN) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Đơn ZaloPay chưa thanh toán thành công.");
            }
        }

        donHang.setTrangThaiDonHang(
                TrangThaiDonHang.HOAN_THANH);
    }

    private void kiemTraDungDuocSiDangXuLy(
            DonHang donHang,
            Long maNhanVien) {
        if (maNhanVien == null
                ||
                maNhanVien <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Không xác định được Dược sĩ đang đăng nhập.");
        }

        if (donHang.getNhanVienXuLy() == null
                ||
                donHang
                        .getNhanVienXuLy()
                        .getMaNhanVien() == null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Đơn hàng chưa được Dược sĩ tiếp nhận.");
        }

        if (!maNhanVien.equals(
                donHang
                        .getNhanVienXuLy()
                        .getMaNhanVien())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Đơn hàng đang được Dược sĩ khác xử lý.");
        }
    }

    private void tiepNhanDonCod(
            DonHang donHang,
            NhanVienNoiBo nhanVien) {
        if (donHang.getTrangThaiDonHang() != TrangThaiDonHang.CHO_XU_LY) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Chỉ được tiếp nhận đơn COD đang chờ xử lý.");
        }

        if (donHang.getTrangThaiThanhToan() != TrangThaiThanhToan.CHUA_THANH_TOAN) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Trạng thái thanh toán của đơn COD không hợp lệ.");
        }

        /*
         * Xuất kho và cập nhật trạng thái nằm trong cùng transaction.
         * Nếu không đủ tồn kho, toàn bộ transaction rollback:
         * - Không trừ tồn một phần.
         * - Không gán nhân viên.
         * - Không đổi trạng thái đơn.
         */
        xuLyTonKhoDonHangService.truTonTheoDonHang(
                donHang.getMaDonHang());

        donHang.setNhanVienXuLy(
                nhanVien);

        donHang.setTrangThaiDonHang(
                TrangThaiDonHang.DANG_XU_LY);
    }

    private void tiepNhanDonZaloPay(
            DonHang donHang,
            NhanVienNoiBo nhanVien) {
        if (donHang.getTrangThaiThanhToan() != TrangThaiThanhToan.DA_THANH_TOAN) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Đơn ZaloPay chưa thanh toán thành công.");
        }

        if (donHang.getTrangThaiDonHang() != TrangThaiDonHang.DANG_XU_LY) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Đơn ZaloPay chưa ở trạng thái cho phép Dược sĩ tiếp nhận.");
        }

        /*
         * Không gọi truTonTheoDonHang tại đây.
         *
         * Tồn kho của đơn ZaloPay đã được trừ trong transaction
         * xử lý callback thanh toán thành công.
         */
        donHang.setNhanVienXuLy(
                nhanVien);
    }

    private void kiemTraChuaCoNhanVienXuLy(
            DonHang donHang) {
        if (donHang.getNhanVienXuLy() != null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Đơn hàng đã được Dược sĩ khác tiếp nhận.");
        }
    }

    private void kiemTraDieuKienKiemDuyet(
            DonHang donHang) {
        TrangThaiKiemDuyetDonHang trangThaiKiemDuyet = donHang.getTrangThaiKiemDuyet();

        if (trangThaiKiemDuyet == TrangThaiKiemDuyetDonHang.CHO_DUYET) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Đơn hàng đang chờ kiểm duyệt và chưa thể tiếp nhận xử lý.");
        }

        if (trangThaiKiemDuyet == TrangThaiKiemDuyetDonHang.TU_CHOI) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Đơn hàng đã bị từ chối kiểm duyệt.");
        }

        if (trangThaiKiemDuyet != TrangThaiKiemDuyetDonHang.KHONG_CAN_DUYET
                &&
                trangThaiKiemDuyet != TrangThaiKiemDuyetDonHang.DA_DUYET) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Trạng thái kiểm duyệt của đơn hàng không hợp lệ.");
        }

        /*
         * Nếu đơn có liên kết đơn thuốc thì đơn thuốc cũng phải
         * thực sự đã được duyệt.
         *
         * Kiểm tra này phòng trường hợp trạng thái đơn hàng và
         * trạng thái đơn thuốc bị lệch dữ liệu.
         */
        if (donHang.getDonThuoc() != null
                &&
                donHang
                        .getDonThuoc()
                        .getTrangThaiDonThuoc() != TrangThaiDonThuoc.DA_DUYET) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Đơn thuốc của đơn hàng chưa được duyệt.");
        }
    }

    private NhanVienNoiBo timNhanVienXuLy(
            Long maNhanVien) {
        if (maNhanVien == null
                ||
                maNhanVien <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Không xác định được Dược sĩ đang đăng nhập.");
        }

        return nhanVienNoiBoRepository
                .findById(
                        maNhanVien)
                .orElseThrow(
                        () -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Không tìm thấy thông tin Dược sĩ."));
    }

    /*
     * Không gọi public layChiTietDonHang() để tránh phụ thuộc
     * vào self-invocation của Spring proxy.
     */
    private DonHangDuocSiChiTietResponse layChiTietDonHangSauCapNhat(
            Long maDonHang) {

        DonHangChiTietProjection donHang = donHangRepository
                .timChiTietDonHang(
                        maDonHang)
                .orElseThrow(
                        () -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Không tìm thấy đơn hàng."));

        List<ChiTietDonHangDuocSiResponse> danhSachChiTiet = chiTietDonHangRepository
                .timTheoMaDonHang(
                        maDonHang)
                .stream()
                .map(
                        this::toChiTietResponse)
                .toList();

        return toDonHangChiTietResponse(
                donHang,
                danhSachChiTiet);
    }

    private DonHangDuocSiChiTietResponse toDonHangChiTietResponse(
            DonHangChiTietProjection donHang,
            List<ChiTietDonHangDuocSiResponse> danhSachChiTiet) {

        return DonHangDuocSiChiTietResponse
                .builder()
                .maDonHang(
                        donHang.getMaDonHang())
                .maKhachHang(
                        donHang.getMaKhachHang())
                .tenKhachHang(
                        donHang.getTenKhachHang())
                .soDienThoaiKhachHang(
                        donHang.getSoDienThoaiKhachHang())
                .maDiaChi(
                        donHang.getMaDiaChi())
                .tenNguoiNhan(
                        donHang.getTenNguoiNhan())
                .soDienThoaiNhan(
                        donHang.getSoDienThoaiNhan())
                .thanhPho(
                        donHang.getThanhPho())
                .phuongKhuVuc(
                        donHang.getPhuongKhuVuc())
                .diaChiChiTiet(
                        donHang.getDiaChiChiTiet())
                .maVoucher(
                        donHang.getMaVoucher())
                .maDonThuoc(
                        donHang.getMaDonThuoc())
                .maNhanVienXuLy(
                        donHang.getMaNhanVienXuLy())
                .tenNhanVienXuLy(
                        donHang.getTenNhanVienXuLy())
                .ngayDatHang(
                        donHang.getNgayDatHang())
                .loaiKhach(
                        chuyenEnum(
                                donHang.getLoaiKhach(),
                                LoaiKhachHang.class,
                                "loai_khach"))
                .tongTienHang(
                        donHang.getTongTienHang())
                .phiGiaoHang(
                        donHang.getPhiGiaoHang())
                .giamGia(
                        donHang.getGiamGia())
                .tongThanhToan(
                        donHang.getTongThanhToan())
                .phuongThucThanhToan(
                        chuyenEnum(
                                donHang.getPhuongThucThanhToan(),
                                PhuongThucThanhToan.class,
                                "phuong_thuc_thanh_toan"))
                .trangThaiThanhToan(
                        chuyenEnum(
                                donHang.getTrangThaiThanhToan(),
                                TrangThaiThanhToan.class,
                                "trang_thai_thanh_toan"))
                .trangThaiDonHang(
                        chuyenEnum(
                                donHang.getTrangThaiDonHang(),
                                TrangThaiDonHang.class,
                                "trang_thai_don_hang"))
                .trangThaiKiemDuyet(
                        chuyenEnum(
                                donHang.getTrangThaiKiemDuyet(),
                                TrangThaiKiemDuyetDonHang.class,
                                "trang_thai_kiem_duyet"))
                .ngayKiemDuyet(
                        donHang.getNgayKiemDuyet())
                .ghiChuKiemDuyet(
                        donHang.getGhiChuKiemDuyet())
                .lyDoTuChoiDuyet(
                        donHang.getLyDoTuChoiDuyet())
                .ghiChu(
                        donHang.getGhiChu())
                .anhDonThuoc(
                        donHang.getAnhDonThuoc())
                .trangThaiDonThuoc(
                        chuyenEnum(
                                donHang.getTrangThaiDonThuoc(),
                                TrangThaiDonThuoc.class,
                                "trang_thai_don_thuoc"))
                .lyDoTuChoiDonThuoc(
                        donHang.getLyDoTuChoiDonThuoc())
                .ghiChuDonThuoc(
                        donHang.getGhiChuDonThuoc())
                .coThuocKeDon(
                        Integer.valueOf(1)
                                .equals(
                                        donHang.getCoThuocKeDon()))
                .danhSachChiTiet(
                        danhSachChiTiet)
                .build();
    }

    private DonHangDuocSiDanhSachResponse toDanhSachResponse(
            DonHangDanhSachProjection donHang) {

        return DonHangDuocSiDanhSachResponse
                .builder()
                .maDonHang(
                        donHang.getMaDonHang())
                .maKhachHang(
                        donHang.getMaKhachHang())
                .tenKhachHang(
                        donHang.getTenKhachHang())
                .soDienThoaiKhachHang(
                        donHang.getSoDienThoaiKhachHang())
                .maDonThuoc(
                        donHang.getMaDonThuoc())
                .maNhanVienXuLy(
                        donHang.getMaNhanVienXuLy())
                .tenNhanVienXuLy(
                        donHang.getTenNhanVienXuLy())
                .ngayDatHang(
                        donHang.getNgayDatHang())
                .loaiKhach(
                        chuyenEnum(
                                donHang.getLoaiKhach(),
                                LoaiKhachHang.class,
                                "loai_khach"))
                .tongThanhToan(
                        donHang.getTongThanhToan())
                .phuongThucThanhToan(
                        chuyenEnum(
                                donHang.getPhuongThucThanhToan(),
                                PhuongThucThanhToan.class,
                                "phuong_thuc_thanh_toan"))
                .trangThaiThanhToan(
                        chuyenEnum(
                                donHang.getTrangThaiThanhToan(),
                                TrangThaiThanhToan.class,
                                "trang_thai_thanh_toan"))
                .trangThaiDonHang(
                        chuyenEnum(
                                donHang.getTrangThaiDonHang(),
                                TrangThaiDonHang.class,
                                "trang_thai_don_hang"))
                .trangThaiKiemDuyet(
                        chuyenEnum(
                                donHang.getTrangThaiKiemDuyet(),
                                TrangThaiKiemDuyetDonHang.class,
                                "trang_thai_kiem_duyet"))
                .coThuocKeDon(
                        Integer.valueOf(1)
                                .equals(
                                        donHang.getCoThuocKeDon()))
                .build();
    }

    private ChiTietDonHangDuocSiResponse toChiTietResponse(
            ChiTietDonHangProjection chiTiet) {

        return ChiTietDonHangDuocSiResponse
                .builder()
                .maChiTietDonHang(
                        chiTiet.getMaChiTietDonHang())
                .maSanPham(
                        chiTiet.getMaSanPham())
                .tenSanPham(
                        chiTiet.getTenSanPham())
                .laThuocKeDon(
                        chiTiet.getLaThuocKeDon())
                .hinhAnh(
                        chiTiet.getHinhAnh())
                .maDonViSanPham(
                        chiTiet.getMaDonViSanPham())
                .maDonViTinh(
                        chiTiet.getMaDonViTinh())
                .tenDonViTinh(
                        chiTiet.getTenDonViTinh())
                .kyHieu(
                        chiTiet.getKyHieu())
                .soLuong(
                        chiTiet.getSoLuong())
                .donGia(
                        chiTiet.getDonGia())
                .giamGia(
                        chiTiet.getGiamGia())
                .thanhTien(
                        chiTiet.getThanhTien())
                .cachTinhGia(
                        chiTiet.getCachTinhGia())
                .build();
    }

    private void kiemTraMaDonHang(
            Long maDonHang) {
        if (maDonHang == null
                ||
                maDonHang <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Mã đơn hàng không hợp lệ.");
        }
    }

    private String xuLyChuoiLoc(
            String giaTri) {
        if (giaTri == null
                ||
                giaTri.trim().isEmpty()) {
            return null;
        }

        return giaTri.trim();
    }

    private String layTenEnum(
            Enum<?> giaTri) {
        return giaTri == null
                ? null
                : giaTri.name();
    }

    private <E extends Enum<E>> E chuyenEnum(
            String giaTri,
            Class<E> kieuEnum,
            String tenCot) {
        if (giaTri == null
                ||
                giaTri.isBlank()) {
            return null;
        }

        try {
            return Enum.valueOf(
                    kieuEnum,
                    giaTri.trim());
        } catch (IllegalArgumentException exception) {
            throw new IllegalStateException(
                    "Giá trị không hợp lệ tại cột "
                            + tenCot
                            + ": "
                            + giaTri,
                    exception);
        }
    }
}
