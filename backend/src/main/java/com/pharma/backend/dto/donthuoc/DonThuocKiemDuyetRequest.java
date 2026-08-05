package com.pharma.backend.dto.donthuoc;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DonThuocKiemDuyetRequest {

    @NotNull(message = "Mã nhân viên duyệt không được để trống")
    private Long maNhanVienDuyet;

    @Size(max = 255, message = "Lý do từ chối không được vượt quá 255 ký tự")
    private String lyDoTuChoi;

    private String ghiChu;
}
