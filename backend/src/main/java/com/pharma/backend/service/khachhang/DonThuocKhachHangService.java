package com.pharma.backend.service.khachhang;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.common.PageResponseDto;
import com.pharma.backend.dto.khachhang.donthuoc.DonThuocKhachHangResponseDto;
import com.pharma.backend.dto.khachhang.donthuoc.GuiDonThuocRequestDto;
import com.pharma.backend.entity.DonThuoc;
import com.pharma.backend.entity.KhachHang;
import com.pharma.backend.enums.donthuoc.TrangThaiDonThuoc;
import com.pharma.backend.repository.DonThuocRepository;
import com.pharma.backend.repository.KhachHangRepository;
import com.pharma.backend.service.common.CloudinaryImageService;
import com.pharma.backend.service.common.CloudinaryImageService.KetQuaUploadAnh;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonThuocKhachHangService {

    private static final int
            KICH_THUOC_TRANG_TOI_DA =
            20;

    private final DonThuocRepository
            donThuocRepository;

    private final KhachHangRepository
            khachHangRepository;

    private final CloudinaryImageService
            cloudinaryImageService;

    /*
     * =========================================================
     * GỬI ĐƠN THUỐC
     * =========================================================
     */

    @Transactional
    public DonThuocKhachHangResponseDto
            guiDonThuoc(
                    Long maKhachHang,
                    GuiDonThuocRequestDto request
            ) {

        KhachHang khachHang =
                layKhachHangDangHoatDong(
                        maKhachHang
                );

        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Dữ liệu đơn thuốc không hợp lệ."
            );
        }

        /*
         * Bước 1:
         * upload ảnh lên Cloudinary.
         */
        KetQuaUploadAnh ketQuaUpload =
                cloudinaryImageService
                        .uploadAnhDonThuoc(
                                request.getAnhDonThuoc(),
                                maKhachHang
                        );

        try {
            /*
             * Bước 2:
             * chỉ lưu URL ảnh vào database.
             */
            DonThuoc donThuoc =
                    new DonThuoc();

            donThuoc.setKhachHang(
                    khachHang
            );

            donThuoc.setNhanVienDuyet(
                    null
            );

            donThuoc.setAnhDonThuoc(
                    ketQuaUpload.secureUrl()
            );

            donThuoc.setTrangThaiDonThuoc(
                    TrangThaiDonThuoc.CHO_DUYET
            );

            donThuoc.setLyDoTuChoi(
                    null
            );

            donThuoc.setGhiChu(
                    null
            );

            /*
             * ngayUpload không cần set.
             *
             * Entity DonThuoc đã có
             * @CreationTimestamp.
             */
            DonThuoc donThuocDaLuu =
                    donThuocRepository
                            .saveAndFlush(
                                    donThuoc
                            );

            return chuyenSangResponseDto(
                    donThuocDaLuu
            );

        } catch (RuntimeException exception) {

            /*
             * Nếu DB lỗi sau khi ảnh đã
             * upload thành công thì xóa ảnh
             * Cloudinary vừa tạo.
             */
            cloudinaryImageService
                    .xoaAnhNeuCo(
                            ketQuaUpload.publicId()
                    );

            throw exception;
        }
    }

    /*
     * =========================================================
     * DANH SÁCH ĐƠN THUỐC CỦA KHÁCH
     * =========================================================
     */

    @Transactional(readOnly = true)
    public PageResponseDto<
            DonThuocKhachHangResponseDto
    > layDanhSachCuaToi(
            Long maKhachHang,
            int page,
            int size
    ) {
        /*
         * Kiểm tra khách hiện vẫn tồn tại
         * và hoạt động.
         */
        layKhachHangDangHoatDong(
                maKhachHang
        );

        int pageHopLe =
                Math.max(
                        page,
                        0
                );

        int sizeHopLe =
                Math.min(
                        Math.max(
                                size,
                                1
                        ),
                        KICH_THUOC_TRANG_TOI_DA
                );

        Pageable pageable =
                PageRequest.of(
                        pageHopLe,
                        sizeHopLe
                );

        Page<DonThuoc> trangDonThuoc =
                donThuocRepository
                        .timDanhSachCuaKhachHang(
                                maKhachHang,
                                pageable
                        );

        List<DonThuocKhachHangResponseDto>
                danhSachResponse =
                trangDonThuoc
                        .getContent()
                        .stream()
                        .map(
                                this::chuyenSangResponseDto
                        )
                        .toList();

        return new PageResponseDto<>(
                danhSachResponse,
                trangDonThuoc.getNumber(),
                trangDonThuoc.getSize(),
                trangDonThuoc.getTotalElements(),
                trangDonThuoc.getTotalPages(),
                trangDonThuoc.isLast()
        );
    }

    /*
     * =========================================================
     * CHI TIẾT ĐƠN THUỐC
     * =========================================================
     */

    @Transactional(readOnly = true)
    public DonThuocKhachHangResponseDto
            layChiTietCuaToi(
                    Long maKhachHang,
                    Long maDonThuoc
            ) {

        layKhachHangDangHoatDong(
                maKhachHang
        );

        kiemTraMaDonThuoc(
                maDonThuoc
        );

        /*
         * Truy vấn phải đồng thời đúng:
         *
         * - maDonThuoc
         * - maKhachHang
         *
         * nên khách A không thể xem đơn
         * thuốc của khách B.
         */
        DonThuoc donThuoc =
                donThuocRepository
                        .timChiTietCuaKhachHang(
                                maDonThuoc,
                                maKhachHang
                        )
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.NOT_FOUND,
                                                "Không tìm thấy đơn thuốc."
                                        )
                        );

        return chuyenSangResponseDto(
                donThuoc
        );
    }

    /*
     * =========================================================
     * HÀM DÙNG CHUNG
     * =========================================================
     */

    private KhachHang
            layKhachHangDangHoatDong(
                    Long maKhachHang
            ) {

        kiemTraKhachHangDangNhap(
                maKhachHang
        );

        return khachHangRepository
                .timKhachHangDangHoatDong(
                        maKhachHang
                )
                .orElseThrow(
                        () ->
                                new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "Khách hàng hiện không hoạt động."
                                )
                );
    }

    private void kiemTraKhachHangDangNhap(
            Long maKhachHang
    ) {
        if (maKhachHang == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Không xác định được khách hàng đang đăng nhập."
            );
        }
    }

    private void kiemTraMaDonThuoc(
            Long maDonThuoc
    ) {
        if (maDonThuoc == null
                || maDonThuoc <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Mã đơn thuốc không hợp lệ."
            );
        }
    }

    private DonThuocKhachHangResponseDto
            chuyenSangResponseDto(
                    DonThuoc donThuoc
            ) {

        String tenNhanVienDuyet =
                null;

        if (donThuoc.getNhanVienDuyet()
                != null) {
            tenNhanVienDuyet =
                    donThuoc
                            .getNhanVienDuyet()
                            .getHoTen();
        }

        return DonThuocKhachHangResponseDto
                .builder()

                .maDonThuoc(
                        donThuoc.getMaDonThuoc()
                )

                .anhDonThuoc(
                        donThuoc.getAnhDonThuoc()
                )

                .ngayUpload(
                        donThuoc.getNgayUpload()
                )

                .trangThaiDonThuoc(
                        donThuoc.getTrangThaiDonThuoc()
                )

                .tenNhanVienDuyet(
                        tenNhanVienDuyet
                )

                .lyDoTuChoi(
                        donThuoc.getLyDoTuChoi()
                )

                .ghiChuDuocSi(
                        donThuoc.getGhiChu()
                )

                .build();
    }
}