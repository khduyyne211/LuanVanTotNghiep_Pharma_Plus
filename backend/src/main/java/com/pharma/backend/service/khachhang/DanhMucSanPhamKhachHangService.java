package com.pharma.backend.service.khachhang;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.khachhang.danhmucsanpham.DanhMucNoiBatResponseDto;
import com.pharma.backend.dto.khachhang.danhmucsanpham.DanhMucSanPhamResponseDto;
import com.pharma.backend.entity.DanhMucSanPham;
import com.pharma.backend.repository.DanhMucSanPhamRepository;
import com.pharma.backend.repository.DanhMucSanPhamRepository.DanhMucNoiBatProjection;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DanhMucSanPhamKhachHangService {

    private static final int GIOI_HAN_DANH_MUC_NOI_BAT_TOI_DA = 24;

    private static final ZoneId MUI_GIO_VIET_NAM =
            ZoneId.of("Asia/Ho_Chi_Minh");

    private static final List<Long> DANH_MUC_THANG_1_DEN_3 = List.of(
            7L,   // Cảm cúm và hô hấp
            18L,  // Tăng cường sức đề kháng
            14L,  // Vitamin và khoáng chất
            21L,  // Nhiệt kế
            23L,  // Máy xông khí dung
            24L,  // Khẩu trang y tế
            6L,   // Giảm đau và hạ sốt
            8L,   // Dị ứng và da liễu
            31L,  // Sữa và dinh dưỡng cho bé
            34L,  // Dinh dưỡng cho mẹ bầu
            28L,  // Chăm sóc răng miệng
            29L   // Vệ sinh cá nhân
    );

    private static final List<Long> DANH_MUC_THANG_4_DEN_6 = List.of(
            30L,  // Chống nắng
            26L,  // Chăm sóc da
            19L,  // Hỗ trợ làm đẹp
            8L,   // Dị ứng và da liễu
            29L,  // Vệ sinh cá nhân
            9L,   // Tiêu hóa
            15L,  // Hỗ trợ tiêu hóa
            14L,  // Vitamin và khoáng chất
            18L,  // Tăng cường sức đề kháng
            33L,  // Chăm sóc da cho bé
            36L,  // Vệ sinh và chăm sóc bé
            25L   // Vật tư sơ cứu
    );

    private static final List<Long> DANH_MUC_THANG_7_DEN_9 = List.of(
            9L,   // Tiêu hóa
            15L,  // Hỗ trợ tiêu hóa
            18L,  // Tăng cường sức đề kháng
            14L,  // Vitamin và khoáng chất
            8L,   // Dị ứng và da liễu
            26L,  // Chăm sóc da
            30L,  // Chống nắng
            29L,  // Vệ sinh cá nhân
            33L,  // Chăm sóc da cho bé
            36L,  // Vệ sinh và chăm sóc bé
            25L,  // Vật tư sơ cứu
            24L   // Khẩu trang y tế
    );

    private static final List<Long> DANH_MUC_THANG_10_DEN_12 = List.of(
            7L,   // Cảm cúm và hô hấp
            18L,  // Tăng cường sức đề kháng
            14L,  // Vitamin và khoáng chất
            6L,   // Giảm đau và hạ sốt
            21L,  // Nhiệt kế
            23L,  // Máy xông khí dung
            24L,  // Khẩu trang y tế
            8L,   // Dị ứng và da liễu
            16L,  // Hỗ trợ xương khớp
            31L,  // Sữa và dinh dưỡng cho bé
            34L,  // Dinh dưỡng cho mẹ bầu
            29L   // Vệ sinh cá nhân
    );

    private final DanhMucSanPhamRepository danhMucSanPhamRepository;

    @Transactional(readOnly = true)
    public List<DanhMucSanPhamResponseDto> layDanhMucMenuKhachHang() {
        List<DanhMucSanPham> danhSachDanhMuc =
                danhMucSanPhamRepository.timDanhMucHienThiChoMenu();

        return danhSachDanhMuc.stream()
                .filter(danhMuc -> danhMuc.getDanhMucCha() == null)
                .map(danhMuc -> chuyenSangDanhMucMenuResponse(
                        danhMuc,
                        danhSachDanhMuc
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<DanhMucNoiBatResponseDto> layDanhMucNoiBat(
            int gioiHan
    ) {
        kiemTraGioiHanDanhMucNoiBat(gioiHan);

        int thangHienTai = LocalDate.now(MUI_GIO_VIET_NAM)
                .getMonthValue();

        List<Long> danhSachMaDanhMucTheoMuaVu =
                layDanhSachMaDanhMucTheoMuaVu(thangHienTai);

        List<DanhMucNoiBatProjection> danhSachDanhMuc =
                danhMucSanPhamRepository
                        .timDanhMucNoiBatTheoDanhSachMa(
                                danhSachMaDanhMucTheoMuaVu
                        );

        return danhSachMaDanhMucTheoMuaVu.stream()
                .map(maDanhMuc ->
                        timDanhMucTheoMa(
                                danhSachDanhMuc,
                                maDanhMuc
                        )
                )
                .filter(danhMuc -> danhMuc != null)
                .limit(gioiHan)
                .map(this::chuyenSangDanhMucNoiBatResponse)
                .toList();
    }

    private List<Long> layDanhSachMaDanhMucTheoMuaVu(int thang) {
        if (thang >= 1 && thang <= 3) {
            return DANH_MUC_THANG_1_DEN_3;
        }

        if (thang >= 4 && thang <= 6) {
            return DANH_MUC_THANG_4_DEN_6;
        }

        if (thang >= 7 && thang <= 9) {
            return DANH_MUC_THANG_7_DEN_9;
        }

        return DANH_MUC_THANG_10_DEN_12;
    }

    private DanhMucNoiBatProjection timDanhMucTheoMa(
            List<DanhMucNoiBatProjection> danhSachDanhMuc,
            Long maDanhMuc
    ) {
        return danhSachDanhMuc.stream()
                .filter(danhMuc ->
                        danhMuc.getMaDanhMuc().equals(maDanhMuc)
                )
                .findFirst()
                .orElse(null);
    }

    private void kiemTraGioiHanDanhMucNoiBat(int gioiHan) {
        if (gioiHan < 1
                || gioiHan > GIOI_HAN_DANH_MUC_NOI_BAT_TOI_DA) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Giới hạn danh mục nổi bật phải từ 1 đến 24."
            );
        }
    }

    private DanhMucNoiBatResponseDto chuyenSangDanhMucNoiBatResponse(
            DanhMucNoiBatProjection danhMuc
    ) {
        return new DanhMucNoiBatResponseDto(
                danhMuc.getMaDanhMuc(),
                danhMuc.getTenDanhMuc(),
                danhMuc.getSoLuongSanPham()
        );
    }

    private DanhMucSanPhamResponseDto chuyenSangDanhMucMenuResponse(
            DanhMucSanPham danhMuc,
            List<DanhMucSanPham> danhSachDanhMuc
    ) {
        List<DanhMucSanPhamResponseDto> danhSachDanhMucCon =
                danhSachDanhMuc.stream()
                        .filter(danhMucCon ->
                                danhMucCon.getDanhMucCha() != null
                                        && danhMucCon.getDanhMucCha()
                                                .getMaDanhMuc()
                                                .equals(
                                                        danhMuc.getMaDanhMuc()
                                                )
                        )
                        .map(danhMucCon ->
                                chuyenSangDanhMucMenuResponse(
                                        danhMucCon,
                                        danhSachDanhMuc
                                )
                        )
                        .toList();

        return new DanhMucSanPhamResponseDto(
                danhMuc.getMaDanhMuc(),
                danhMuc.getTenDanhMuc(),
                danhSachDanhMucCon
        );
    }
}