package com.pharma.backend.service.duocsi;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.pharma.backend.dto.common.PageResponseDto;
import com.pharma.backend.dto.duocsi.tuvan.HoanTatYeuCauTuVanRequestDto;
import com.pharma.backend.dto.duocsi.tuvan.YeuCauTuVanDuocSiChiTietResponseDto;
import com.pharma.backend.dto.duocsi.tuvan.YeuCauTuVanDuocSiDanhSachResponseDto;
import com.pharma.backend.entity.NhanVienNoiBo;
import com.pharma.backend.entity.SanPham;
import com.pharma.backend.entity.YeuCauTuVan;
import com.pharma.backend.enums.tuvan.TrangThaiTuVan;
import com.pharma.backend.repository.NhanVienNoiBoRepository;
import com.pharma.backend.repository.YeuCauTuVanRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class YeuCauTuVanDuocSiService {

        private static final int KICH_THUOC_TRANG_TOI_DA = 20;

        private final YeuCauTuVanRepository yeuCauTuVanRepository;

        private final NhanVienNoiBoRepository nhanVienNoiBoRepository;

        @Transactional(readOnly = true)
        public PageResponseDto<YeuCauTuVanDuocSiDanhSachResponseDto> layDanhSach(
                        int page,
                        int size,
                        TrangThaiTuVan trangThai) {

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

                Page<YeuCauTuVan> trangYeuCau = yeuCauTuVanRepository
                                .timDanhSachChoDuocSi(
                                                trangThai,
                                                pageable);

                List<YeuCauTuVanDuocSiDanhSachResponseDto> danhSach = trangYeuCau
                                .getContent()
                                .stream()
                                .map(this::toDanhSachResponse)
                                .toList();

                return new PageResponseDto<>(
                                danhSach,
                                trangYeuCau.getNumber(),
                                trangYeuCau.getSize(),
                                trangYeuCau.getTotalElements(),
                                trangYeuCau.getTotalPages(),
                                trangYeuCau.isLast());
        }

        @Transactional(readOnly = true)
        public YeuCauTuVanDuocSiChiTietResponseDto layChiTiet(
                        Long maYeuCauTuVan) {

                kiemTraMaYeuCau(
                                maYeuCauTuVan);

                YeuCauTuVan yeuCau = yeuCauTuVanRepository
                                .timChiTietChoDuocSi(
                                                maYeuCauTuVan)
                                .orElseThrow(
                                                () -> new ResponseStatusException(
                                                                HttpStatus.NOT_FOUND,
                                                                "Không tìm thấy yêu cầu tư vấn."));

                return toChiTietResponse(
                                yeuCau);
        }

        /*
         * Dược sĩ nhận xử lý yêu cầu.
         *
         * CHO_TIEP_NHAN
         * ↓
         * DANG_TU_VAN
         */
        @Transactional
        public YeuCauTuVanDuocSiChiTietResponseDto tiepNhan(
                        Long maYeuCauTuVan,
                        Long maNhanVien) {

                kiemTraMaYeuCau(
                                maYeuCauTuVan);

                NhanVienNoiBo nhanVien = timNhanVien(
                                maNhanVien);

                YeuCauTuVan yeuCau = timYeuCauDeCapNhat(
                                maYeuCauTuVan);

                if (yeuCau.getTrangThaiTuVan() != TrangThaiTuVan.CHO_TIEP_NHAN) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Yêu cầu tư vấn không còn ở trạng thái chờ tiếp nhận.");
                }

                yeuCau.setNhanVienTiepNhan(
                                nhanVien);

                yeuCau.setTrangThaiTuVan(
                                TrangThaiTuVan.DANG_TU_VAN);

                YeuCauTuVan daLuu = yeuCauTuVanRepository.save(
                                yeuCau);

                return toChiTietResponse(
                                daLuu);
        }

        /*
         * Chỉ Dược sĩ đã tiếp nhận yêu cầu
         * mới được kết thúc yêu cầu đó.
         */
        @Transactional
        public YeuCauTuVanDuocSiChiTietResponseDto hoanTat(
                        Long maYeuCauTuVan,
                        Long maNhanVien,
                        HoanTatYeuCauTuVanRequestDto request) {

                kiemTraMaYeuCau(
                                maYeuCauTuVan);

                kiemTraMaNhanVien(
                                maNhanVien);

                if (request == null) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Dữ liệu xử lý yêu cầu tư vấn không hợp lệ.");
                }

                TrangThaiTuVan trangThaiMoi = request.getTrangThaiTuVan();

                if (trangThaiMoi != TrangThaiTuVan.DA_TU_VAN
                                &&
                                trangThaiMoi != TrangThaiTuVan.KHONG_THE_LIEN_HE) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Trạng thái hoàn tất chỉ có thể là DA_TU_VAN hoặc KHONG_THE_LIEN_HE.");
                }

                YeuCauTuVan yeuCau = timYeuCauDeCapNhat(
                                maYeuCauTuVan);

                if (yeuCau.getTrangThaiTuVan() != TrangThaiTuVan.DANG_TU_VAN) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Yêu cầu tư vấn không ở trạng thái đang tư vấn.");
                }

                if (yeuCau.getNhanVienTiepNhan() == null
                                ||
                                !maNhanVien.equals(
                                                yeuCau
                                                                .getNhanVienTiepNhan()
                                                                .getMaNhanVien())) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "Bạn không phải Dược sĩ đang tiếp nhận yêu cầu này.");
                }

                String ketQua = request
                                .getKetQuaTuVan()
                                .trim();

                yeuCau.setKetQuaTuVan(
                                ketQua);

                yeuCau.setTrangThaiTuVan(
                                trangThaiMoi);

                YeuCauTuVan daLuu = yeuCauTuVanRepository.save(
                                yeuCau);

                return toChiTietResponse(
                                daLuu);
        }

        private YeuCauTuVan timYeuCauDeCapNhat(
                        Long maYeuCauTuVan) {

                return yeuCauTuVanRepository
                                .timTheoMaDeCapNhat(
                                                maYeuCauTuVan)
                                .orElseThrow(
                                                () -> new ResponseStatusException(
                                                                HttpStatus.NOT_FOUND,
                                                                "Không tìm thấy yêu cầu tư vấn."));
        }

        private NhanVienNoiBo timNhanVien(
                        Long maNhanVien) {

                kiemTraMaNhanVien(
                                maNhanVien);

                return nhanVienNoiBoRepository
                                .findById(
                                                maNhanVien)
                                .orElseThrow(
                                                () -> new ResponseStatusException(
                                                                HttpStatus.NOT_FOUND,
                                                                "Không tìm thấy nhân viên đang đăng nhập."));
        }

        private void kiemTraMaYeuCau(
                        Long maYeuCauTuVan) {

                if (maYeuCauTuVan == null
                                || maYeuCauTuVan <= 0) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Mã yêu cầu tư vấn không hợp lệ.");
                }
        }

        private void kiemTraMaNhanVien(
                        Long maNhanVien) {

                if (maNhanVien == null
                                || maNhanVien <= 0) {
                        throw new ResponseStatusException(
                                        HttpStatus.UNAUTHORIZED,
                                        "Không xác định được Dược sĩ đang đăng nhập.");
                }
        }

        private YeuCauTuVanDuocSiDanhSachResponseDto toDanhSachResponse(
                        YeuCauTuVan yeuCau) {

                String tenNhanVien = yeuCau.getNhanVienTiepNhan() == null
                                ? null
                                : yeuCau
                                                .getNhanVienTiepNhan()
                                                .getHoTen();

                return new YeuCauTuVanDuocSiDanhSachResponseDto(
                                yeuCau.getMaYeuCauTuVan(),
                                yeuCau.getTenKhachHang(),
                                yeuCau.getSoDienThoai(),
                                yeuCau.getHinhThucLienHe(),
                                yeuCau.getTrangThaiTuVan(),
                                tenNhanVien,
                                yeuCau.getNgayTao());
        }

        private YeuCauTuVanDuocSiChiTietResponseDto toChiTietResponse(
                        YeuCauTuVan yeuCau) {

                Long maKhachHang = yeuCau.getKhachHang() == null
                                ? null
                                : yeuCau
                                                .getKhachHang()
                                                .getMaKhachHang();

                Long maDonHang = yeuCau.getDonHang() == null
                                ? null
                                : yeuCau
                                                .getDonHang()
                                                .getMaDonHang();

                Long maNhanVien = yeuCau.getNhanVienTiepNhan() == null
                                ? null
                                : yeuCau
                                                .getNhanVienTiepNhan()
                                                .getMaNhanVien();

                String tenNhanVien = yeuCau.getNhanVienTiepNhan() == null
                                ? null
                                : yeuCau
                                                .getNhanVienTiepNhan()
                                                .getHoTen();

                SanPham sanPham = yeuCau.getSanPham();

                Long maSanPham = sanPham == null
                                ? null
                                : sanPham.getMaSanPham();

                String tenSanPham = sanPham == null
                                ? null
                                : sanPham.getTenSanPham();

                String hinhAnh = sanPham == null
                                ? null
                                : sanPham.getHinhAnh();

                Boolean laThuocKeDon = sanPham == null
                                ? null
                                : sanPham.getLaThuocKeDon();

                return new YeuCauTuVanDuocSiChiTietResponseDto(
                                yeuCau.getMaYeuCauTuVan(),
                                maKhachHang,
                                maDonHang,
                                yeuCau.getTenKhachHang(),
                                yeuCau.getSoDienThoai(),
                                yeuCau.getNoiDungCanTuVan(),
                                yeuCau.getHinhThucLienHe(),
                                maNhanVien,
                                tenNhanVien,
                                yeuCau.getKetQuaTuVan(),
                                yeuCau.getTrangThaiTuVan(),
                                yeuCau.getNgayTao(),
                                maSanPham,
                                tenSanPham,
                                hinhAnh,
                                laThuocKeDon);
        }
}
