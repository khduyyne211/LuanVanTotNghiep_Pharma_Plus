package com.pharma.backend.service.admin;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.admin.taikhoan.TaiKhoanNhanVienCapNhatRequest;
import com.pharma.backend.dto.admin.taikhoan.TaiKhoanNhanVienResponse;
import com.pharma.backend.dto.admin.taikhoan.TaiKhoanNhanVienTaoRequest;
import com.pharma.backend.entity.NhanVienNoiBo;
import com.pharma.backend.entity.TaiKhoan;
import com.pharma.backend.entity.VaiTro;
import com.pharma.backend.repository.NhanVienNoiBoRepository;
import com.pharma.backend.repository.TaiKhoanRepository;
import com.pharma.backend.repository.VaiTroRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TaiKhoanNhanVienService {

    private static final Set<String> VAI_TRO_NHAN_VIEN_HOP_LE = Set.of("ADMIN", "DUOC_SI");

    private final NhanVienNoiBoRepository nhanVienNoiBoRepository;
    private final TaiKhoanRepository taiKhoanRepository;
    private final VaiTroRepository vaiTroRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<TaiKhoanNhanVienResponse> layDanhSachTaiKhoanNhanVien() {
        return nhanVienNoiBoRepository.findAll()
                .stream()
                .sorted(
                        Comparator.comparing(
                                NhanVienNoiBo::getHoTen,
                                String.CASE_INSENSITIVE_ORDER))
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public TaiKhoanNhanVienResponse themTaiKhoanNhanVien(
            TaiKhoanNhanVienTaoRequest request) {
        String soDienThoai = request.getSoDienThoai().trim();

        if (taiKhoanRepository.existsBySoDienThoai(soDienThoai)) {
            throw new IllegalArgumentException(
                    "Số điện thoại đã được sử dụng");
        }

        Set<VaiTro> danhSachVaiTro = layDanhSachVaiTroHopLe(
                request.getDanhSachMaVaiTro());

        TaiKhoan taiKhoan = new TaiKhoan();

        taiKhoan.setSoDienThoai(soDienThoai);
        taiKhoan.setMatKhau(
                passwordEncoder.encode(
                        request.getMatKhau()));
        taiKhoan.setTrangThaiTaiKhoan(true);
        taiKhoan.setDanhSachVaiTro(
                new HashSet<>(danhSachVaiTro));

        TaiKhoan taiKhoanDaLuu = taiKhoanRepository.save(taiKhoan);

        NhanVienNoiBo nhanVien = new NhanVienNoiBo();

        nhanVien.setTaiKhoan(taiKhoanDaLuu);
        nhanVien.setHoTen(
                request.getHoTen().trim());
        nhanVien.setTrangThaiLamViec(true);

        return toResponse(
                nhanVienNoiBoRepository.save(nhanVien));
    }

    @Transactional
    public TaiKhoanNhanVienResponse capNhatTaiKhoanNhanVien(
            Long maNhanVien,
            TaiKhoanNhanVienCapNhatRequest request) {
        NhanVienNoiBo nhanVien = nhanVienNoiBoRepository.findById(maNhanVien)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Không tìm thấy nhân viên"));

        TaiKhoan taiKhoan = nhanVien.getTaiKhoan();

        String soDienThoaiMoi = request.getSoDienThoai().trim();

        boolean thayDoiSoDienThoai = !taiKhoan.getSoDienThoai()
                .equals(soDienThoaiMoi);

        if (thayDoiSoDienThoai
                && taiKhoanRepository.existsBySoDienThoai(
                        soDienThoaiMoi)) {
            throw new IllegalArgumentException(
                    "Số điện thoại đã được sử dụng");
        }

        Set<VaiTro> danhSachVaiTro = layDanhSachVaiTroHopLe(
                request.getDanhSachMaVaiTro());

        nhanVien.setHoTen(
                request.getHoTen().trim());

        taiKhoan.setSoDienThoai(
                soDienThoaiMoi);

        taiKhoan.setDanhSachVaiTro(
                new HashSet<>(danhSachVaiTro));

        taiKhoanRepository.save(taiKhoan);

        return toResponse(
                nhanVienNoiBoRepository.save(nhanVien));
    }

    @Transactional
    public TaiKhoanNhanVienResponse doiTrangThaiTaiKhoan(
            Long maNhanVien) {
        NhanVienNoiBo nhanVien = nhanVienNoiBoRepository.findById(maNhanVien)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Không tìm thấy nhân viên"));

        TaiKhoan taiKhoan = nhanVien.getTaiKhoan();

        taiKhoan.setTrangThaiTaiKhoan(
                !Boolean.TRUE.equals(
                        taiKhoan.getTrangThaiTaiKhoan()));

        taiKhoanRepository.save(
                taiKhoan);

        return toResponse(
                nhanVien);
    }

    private Set<VaiTro> layDanhSachVaiTroHopLe(
            Set<Long> danhSachMaVaiTro) {
        Set<Long> danhSachMaKhongTrung = new HashSet<>(danhSachMaVaiTro);

        List<VaiTro> danhSachVaiTro = vaiTroRepository.findAllById(
                danhSachMaKhongTrung);

        if (danhSachVaiTro.size() != danhSachMaKhongTrung.size()) {
            throw new IllegalArgumentException(
                    "Có vai trò không tồn tại");
        }

        for (VaiTro vaiTro : danhSachVaiTro) {
            if (!Boolean.TRUE.equals(
                    vaiTro.getTrangThai())) {
                throw new IllegalArgumentException(
                        "Không thể gán vai trò đang ngừng hoạt động");
            }

            String tenVaiTro = vaiTro.getTenVaiTro() == null
                    ? ""
                    : vaiTro.getTenVaiTro()
                            .trim()
                            .toUpperCase();

            if (!VAI_TRO_NHAN_VIEN_HOP_LE.contains(
                    tenVaiTro)) {
                throw new IllegalArgumentException(
                        "Nhân viên nội bộ chỉ được gán vai trò ADMIN hoặc DUOC_SI");
            }
        }

        return new HashSet<>(
                danhSachVaiTro);
    }

    private TaiKhoanNhanVienResponse toResponse(
            NhanVienNoiBo nhanVien) {
        TaiKhoan taiKhoan = nhanVien.getTaiKhoan();

        List<TaiKhoanNhanVienResponse.VaiTroTaiKhoanResponse> danhSachVaiTro = taiKhoan.getDanhSachVaiTro()
                .stream()
                .sorted(
                        Comparator.comparing(
                                VaiTro::getTenVaiTro,
                                String.CASE_INSENSITIVE_ORDER))
                .map(
                        vaiTro -> TaiKhoanNhanVienResponse.VaiTroTaiKhoanResponse
                                .builder()
                                .maVaiTro(
                                        vaiTro.getMaVaiTro())
                                .tenVaiTro(
                                        vaiTro.getTenVaiTro())
                                .trangThai(
                                        vaiTro.getTrangThai())
                                .build())
                .toList();

        return TaiKhoanNhanVienResponse.builder()
                .maNhanVien(
                        nhanVien.getMaNhanVien())
                .maTaiKhoan(
                        taiKhoan.getMaTaiKhoan())
                .hoTen(
                        nhanVien.getHoTen())
                .soDienThoai(
                        taiKhoan.getSoDienThoai())
                .trangThaiTaiKhoan(
                        taiKhoan.getTrangThaiTaiKhoan())
                .trangThaiLamViec(
                        nhanVien.getTrangThaiLamViec())
                .ngayTao(
                        taiKhoan.getNgayTao())
                .danhSachVaiTro(
                        danhSachVaiTro)
                .build();
    }
}