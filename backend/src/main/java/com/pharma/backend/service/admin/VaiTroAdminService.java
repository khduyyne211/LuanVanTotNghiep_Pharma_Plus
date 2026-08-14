package com.pharma.backend.service.admin;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.admin.vaitro.VaiTroRequest;
import com.pharma.backend.dto.admin.vaitro.VaiTroResponse;
import com.pharma.backend.entity.VaiTro;
import com.pharma.backend.repository.VaiTroRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VaiTroAdminService {

    private final VaiTroRepository vaiTroRepository;

    @Transactional(readOnly = true)
    public List<VaiTroResponse> layDanhSachVaiTro() {
        return vaiTroRepository.findAll()
                .stream()
                .sorted(
                        Comparator.comparing(
                                VaiTro::getTenVaiTro,
                                String.CASE_INSENSITIVE_ORDER))
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public VaiTroResponse themVaiTro(VaiTroRequest request) {
        String tenVaiTro = request.getTenVaiTro().trim();

        kiemTraTrungTenVaiTro(
                tenVaiTro,
                null);

        VaiTro vaiTro = new VaiTro();

        vaiTro.setTenVaiTro(tenVaiTro);
        vaiTro.setMoTa(
                chuanHoaChuoiKhongBatBuoc(
                        request.getMoTa()));
        vaiTro.setTrangThai(true);

        return toResponse(
                vaiTroRepository.save(vaiTro));
    }

    @Transactional
    public VaiTroResponse capNhatVaiTro(
            Long maVaiTro,
            VaiTroRequest request) {
        VaiTro vaiTro = vaiTroRepository.findById(maVaiTro)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Không tìm thấy vai trò"));

        String tenVaiTro = request.getTenVaiTro().trim();

        kiemTraTrungTenVaiTro(
                tenVaiTro,
                maVaiTro);

        vaiTro.setTenVaiTro(tenVaiTro);

        vaiTro.setMoTa(
                chuanHoaChuoiKhongBatBuoc(
                        request.getMoTa()));

        return toResponse(
                vaiTroRepository.save(vaiTro));
    }

    @Transactional
    public VaiTroResponse doiTrangThaiVaiTro(
            Long maVaiTro) {
        VaiTro vaiTro = vaiTroRepository.findById(maVaiTro)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Không tìm thấy vai trò"));

        vaiTro.setTrangThai(
                !Boolean.TRUE.equals(
                        vaiTro.getTrangThai()));

        return toResponse(
                vaiTroRepository.save(vaiTro));
    }

    private void kiemTraTrungTenVaiTro(
            String tenVaiTro,
            Long maVaiTroDangCapNhat) {
        boolean daTonTai = vaiTroRepository.findAll()
                .stream()
                .anyMatch(vaiTro -> {
                    boolean trungTen = vaiTro.getTenVaiTro() != null
                            && vaiTro.getTenVaiTro()
                                    .trim()
                                    .equalsIgnoreCase(tenVaiTro);

                    boolean khacVaiTroDangCapNhat = maVaiTroDangCapNhat == null
                            || !vaiTro.getMaVaiTro()
                                    .equals(maVaiTroDangCapNhat);

                    return trungTen
                            && khacVaiTroDangCapNhat;
                });

        if (daTonTai) {
            throw new IllegalArgumentException(
                    "Tên vai trò đã tồn tại");
        }
    }

    private String chuanHoaChuoiKhongBatBuoc(
            String giaTri) {
        if (giaTri == null || giaTri.isBlank()) {
            return null;
        }

        return giaTri.trim();
    }

    private VaiTroResponse toResponse(
            VaiTro vaiTro) {
        return VaiTroResponse.builder()
                .maVaiTro(
                        vaiTro.getMaVaiTro())
                .tenVaiTro(
                        vaiTro.getTenVaiTro())
                .moTa(
                        vaiTro.getMoTa())
                .trangThai(
                        vaiTro.getTrangThai())
                .build();
    }
}