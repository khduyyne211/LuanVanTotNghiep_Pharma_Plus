package com.pharma.backend.service.khachhang;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    public List<DanhMucNoiBatResponseDto> layDanhMucNoiBat(int gioiHan) {
        kiemTraGioiHanDanhMucNoiBat(gioiHan);

        Pageable pageable = PageRequest.of(0, gioiHan);

        return danhMucSanPhamRepository.timDanhMucNoiBat(pageable)
                .stream()
                .map(this::chuyenSangDanhMucNoiBatResponse)
                .toList();
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