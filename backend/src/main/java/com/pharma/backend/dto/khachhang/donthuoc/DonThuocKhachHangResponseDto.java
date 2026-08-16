package com.pharma.backend.dto.khachhang.donthuoc;

import java.time.LocalDateTime;

import com.pharma.backend.enums.donthuoc.TrangThaiDonThuoc;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DonThuocKhachHangResponseDto {

    private Long maDonThuoc;

    private String anhDonThuoc;

    private LocalDateTime ngayUpload;

    private TrangThaiDonThuoc trangThaiDonThuoc;

    private String tenNhanVienDuyet;

    private String lyDoTuChoi;

    /*
     * Cột ghi_chu hiện được sử dụng
     * cho ghi chú của Dược sĩ sau khi kiểm duyệt.
     */
    private String ghiChuDuocSi;
}