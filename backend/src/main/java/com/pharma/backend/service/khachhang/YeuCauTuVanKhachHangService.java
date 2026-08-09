package com.pharma.backend.service.khachhang;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.common.PageResponseDto;
import com.pharma.backend.dto.khachhang.tuvan.TaoYeuCauTuVanRequestDto;
import com.pharma.backend.dto.khachhang.tuvan.ThongTinTaoYeuCauTuVanResponseDto;
import com.pharma.backend.dto.khachhang.tuvan.YeuCauTuVanChiTietResponseDto;
import com.pharma.backend.dto.khachhang.tuvan.YeuCauTuVanDanhSachResponseDto;
import com.pharma.backend.entity.KhachHang;
import com.pharma.backend.entity.YeuCauTuVan;
import com.pharma.backend.enums.tuvan.HinhThucLienHe;
import com.pharma.backend.enums.tuvan.TrangThaiTuVan;
import com.pharma.backend.repository.KhachHangRepository;
import com.pharma.backend.repository.YeuCauTuVanRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class YeuCauTuVanKhachHangService {

    private static final int KICH_THUOC_TRANG_TOI_DA = 20;

    private final YeuCauTuVanRepository yeuCauTuVanRepository;
    private final KhachHangRepository khachHangRepository;

    @Transactional(readOnly = true)
    public ThongTinTaoYeuCauTuVanResponseDto layThongTinTaoYeuCauTuVan(
            Long maKhachHang
    ) {
        KhachHang khachHang = layKhachHangDangHoatDong(maKhachHang);

        if (khachHang.getTaiKhoan() == null) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Khách hàng chưa có thông tin tài khoản."
            );
        }

        return new ThongTinTaoYeuCauTuVanResponseDto(
                khachHang.getHoTen(),
                khachHang.getTaiKhoan().getSoDienThoai()
        );
    }

    @Transactional
    public YeuCauTuVanDanhSachResponseDto taoYeuCauTuVan(
            Long maKhachHang,
            TaoYeuCauTuVanRequestDto request
    ) {
        KhachHang khachHang = layKhachHangDangHoatDong(maKhachHang);
        DuLieuYeuCauHopLe duLieu = kiemTraVaChuanHoaDuLieu(request);

        YeuCauTuVan yeuCauTuVan = new YeuCauTuVan();
        yeuCauTuVan.setKhachHang(khachHang);
        yeuCauTuVan.setNhanVienTiepNhan(null);
        yeuCauTuVan.setSanPham(null);
        yeuCauTuVan.setTenKhachHang(duLieu.tenKhachHang());
        yeuCauTuVan.setSoDienThoai(duLieu.soDienThoai());
        yeuCauTuVan.setNoiDungCanTuVan(duLieu.noiDungCanTuVan());
        yeuCauTuVan.setHinhThucLienHe(duLieu.hinhThucLienHe());
yeuCauTuVan.setTrangThaiTuVan(TrangThaiTuVan.CHO_TIEP_NHAN);
        yeuCauTuVan.setKetQuaTuVan(null);
        yeuCauTuVan.setNgayTao(LocalDateTime.now());

        YeuCauTuVan yeuCauDaLuu = yeuCauTuVanRepository.save(yeuCauTuVan);
        return chuyenSangDanhSachResponseDto(yeuCauDaLuu);
    }

    @Transactional(readOnly = true)
    public PageResponseDto<YeuCauTuVanDanhSachResponseDto> layDanhSachCuaToi(
            Long maKhachHang,
            int page,
            int size
    ) {
        kiemTraKhachHangDangNhap(maKhachHang);

        int pageHopLe = Math.max(page, 0);
        int sizeHopLe = Math.min(Math.max(size, 1), KICH_THUOC_TRANG_TOI_DA);
        Pageable pageable = PageRequest.of(pageHopLe, sizeHopLe);

        Page<YeuCauTuVan> trangYeuCau =
                yeuCauTuVanRepository.timDanhSachCuaKhachHang(
                        maKhachHang,
                        pageable
                );

        List<YeuCauTuVanDanhSachResponseDto> danhSachResponse =
                trangYeuCau.getContent()
                        .stream()
                        .map(this::chuyenSangDanhSachResponseDto)
                        .toList();

        return new PageResponseDto<>(
                danhSachResponse,
                trangYeuCau.getNumber(),
                trangYeuCau.getSize(),
                trangYeuCau.getTotalElements(),
                trangYeuCau.getTotalPages(),
                trangYeuCau.isLast()
        );
    }

    @Transactional(readOnly = true)
    public YeuCauTuVanChiTietResponseDto layChiTietCuaToi(
            Long maKhachHang,
            Long maYeuCauTuVan
    ) {
        kiemTraKhachHangDangNhap(maKhachHang);
        kiemTraMaYeuCauTuVan(maYeuCauTuVan);

        YeuCauTuVan yeuCauTuVan =
                yeuCauTuVanRepository.timChiTietCuaKhachHang(
                        maYeuCauTuVan,
                        maKhachHang
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Không tìm thấy yêu cầu tư vấn."
                ));

        return chuyenSangChiTietResponseDto(yeuCauTuVan);
    }

    private KhachHang layKhachHangDangHoatDong(Long maKhachHang) {
        kiemTraKhachHangDangNhap(maKhachHang);

        return khachHangRepository.timKhachHangDangHoatDong(maKhachHang)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN,
                        "Khách hàng hiện không hoạt động."
                ));
    }

    private DuLieuYeuCauHopLe kiemTraVaChuanHoaDuLieu(
            TaoYeuCauTuVanRequestDto request
    ) {
        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Dữ liệu yêu cầu tư vấn không hợp lệ."
            );
        }

        String tenKhachHang = chuanHoaChuoiBatBuoc(
request.getTenKhachHang(),
                "Tên khách hàng",
                100
        );

        String soDienThoai = chuanHoaSoDienThoai(
                request.getSoDienThoai()
        );

        String noiDungCanTuVan = chuanHoaChuoiBatBuoc(
                request.getNoiDungCanTuVan(),
                "Nội dung cần tư vấn",
                2000
        );

        HinhThucLienHe hinhThucLienHe =
                kiemTraHinhThucLienHe(request.getHinhThucLienHe());

        return new DuLieuYeuCauHopLe(
                tenKhachHang,
                soDienThoai,
                noiDungCanTuVan,
                hinhThucLienHe
        );
    }

    private String chuanHoaChuoiBatBuoc(
            String giaTri,
            String tenTruong,
            int doDaiToiDa
    ) {
        if (giaTri == null || giaTri.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    tenTruong + " không được để trống."
            );
        }

        String giaTriDaChuanHoa =
                giaTri.trim().replaceAll("\\s+", " ");

        if (giaTriDaChuanHoa.length() > doDaiToiDa) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    tenTruong + " không được vượt quá "
                            + doDaiToiDa + " ký tự."
            );
        }

        return giaTriDaChuanHoa;
    }

    private String chuanHoaSoDienThoai(String soDienThoai) {
        if (soDienThoai == null || soDienThoai.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Số điện thoại không được để trống."
            );
        }

        String soDienThoaiDaChuanHoa =
                soDienThoai.trim().replaceAll("[\\s.-]", "");

        if (!soDienThoaiDaChuanHoa.matches("^\\+?[0-9]{9,15}$")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Số điện thoại không hợp lệ."
            );
        }

        if (soDienThoaiDaChuanHoa.length() > 20) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Số điện thoại không được vượt quá 20 ký tự."
            );
        }

        return soDienThoaiDaChuanHoa;
    }

    private HinhThucLienHe kiemTraHinhThucLienHe(
            HinhThucLienHe hinhThucLienHe
    ) {
        if (hinhThucLienHe == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Vui lòng chọn hình thức liên hệ."
            );
        }

        if (hinhThucLienHe != HinhThucLienHe.GOI_DIEN
                && hinhThucLienHe != HinhThucLienHe.ZALO) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Hình thức liên hệ chỉ hỗ trợ GOI_DIEN hoặc ZALO."
);
        }

        return hinhThucLienHe;
    }

    private void kiemTraKhachHangDangNhap(Long maKhachHang) {
        if (maKhachHang == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Không xác định được khách hàng đang đăng nhập."
            );
        }
    }

    private void kiemTraMaYeuCauTuVan(Long maYeuCauTuVan) {
        if (maYeuCauTuVan == null || maYeuCauTuVan <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Mã yêu cầu tư vấn không hợp lệ."
            );
        }
    }

    private YeuCauTuVanDanhSachResponseDto chuyenSangDanhSachResponseDto(
            YeuCauTuVan yeuCauTuVan
    ) {
        return new YeuCauTuVanDanhSachResponseDto(
                yeuCauTuVan.getMaYeuCauTuVan(),
                yeuCauTuVan.getNgayTao(),
                yeuCauTuVan.getTrangThaiTuVan()
        );
    }

    private YeuCauTuVanChiTietResponseDto chuyenSangChiTietResponseDto(
            YeuCauTuVan yeuCauTuVan
    ) {
        String tenNhanVienTiepNhan = null;

        if (yeuCauTuVan.getNhanVienTiepNhan() != null) {
            tenNhanVienTiepNhan =
                    yeuCauTuVan.getNhanVienTiepNhan().getHoTen();
        }

        return new YeuCauTuVanChiTietResponseDto(
                yeuCauTuVan.getTenKhachHang(),
                yeuCauTuVan.getSoDienThoai(),
                yeuCauTuVan.getNoiDungCanTuVan(),
                yeuCauTuVan.getHinhThucLienHe(),
                tenNhanVienTiepNhan,
                yeuCauTuVan.getKetQuaTuVan(),
                yeuCauTuVan.getTrangThaiTuVan(),
                yeuCauTuVan.getNgayTao()
        );
    }

    private record DuLieuYeuCauHopLe(
            String tenKhachHang,
            String soDienThoai,
            String noiDungCanTuVan,
            HinhThucLienHe hinhThucLienHe
    ) {
    }
}
