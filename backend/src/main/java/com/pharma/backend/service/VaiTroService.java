package com.pharma.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.vaitro.VaiTroRequest;
import com.pharma.backend.dto.vaitro.VaiTroResponse;
import com.pharma.backend.entity.VaiTro;
import com.pharma.backend.repository.VaiTroRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VaiTroService {

    private final VaiTroRepository vaiTroRepository;

    @Transactional(readOnly = true)
    public List<VaiTroResponse> layDanhSachVaiTro() {
        return vaiTroRepository.findAllOrderByTenVaiTroAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public VaiTroResponse layChiTietVaiTro(Long maVaiTro) {
        return toResponse(timVaiTroTheoMa(maVaiTro));
    }

    @Transactional
    public VaiTroResponse themVaiTro(VaiTroRequest request) {
        String tenVaiTro = request.getTenVaiTro().trim();

        if (vaiTroRepository.existsByTenVaiTro(tenVaiTro)) {
            throw new IllegalArgumentException("Tên vai trò đã tồn tại");
        }

        VaiTro VaiTro = new VaiTro();
        VaiTro.setTenVaiTro(tenVaiTro);
        VaiTro.setMoTa(chuanHoaChuoiKhongBatBuoc(request.getMoTa()));
        VaiTro.setTrangThai(true);

        return toResponse(vaiTroRepository.save(VaiTro));
    }

    @Transactional
    public VaiTroResponse capNhatVaiTro(
            Long maVaiTro,
            VaiTroRequest request
    ) {
        VaiTro VaiTro = timVaiTroTheoMa(maVaiTro);
        String tenVaiTro = request.getTenVaiTro().trim();

        boolean biTrungTen =
                vaiTroRepository.existsByTenVaiTroAndMaVaiTroNot(
                        tenVaiTro,
                        maVaiTro
                );

        if (biTrungTen) {
            throw new IllegalArgumentException("Tên vai trò đã tồn tại");
        }

        VaiTro.setTenVaiTro(tenVaiTro);
        VaiTro.setMoTa(chuanHoaChuoiKhongBatBuoc(request.getMoTa()));

        return toResponse(vaiTroRepository.save(VaiTro));
    }

    @Transactional
    public VaiTroResponse doiTrangThai(Long maVaiTro) {
        VaiTro vaiTro = vaiTroRepository.findById(maVaiTro)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Không tìm thấy vai trò"
                ));

        vaiTro.setTrangThai(!vaiTro.getTrangThai());

        return toResponse(vaiTroRepository.save(vaiTro));
    }

    private VaiTro timVaiTroTheoMa(Long maVaiTro) {
        return vaiTroRepository.findById(maVaiTro)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Không tìm thấy vai trò"
                        )
                );
    }

    private String chuanHoaChuoiKhongBatBuoc(String giaTri) {
        if (giaTri == null || giaTri.isBlank()) {
            return null;
        }

        return giaTri.trim();
    }

    private VaiTroResponse toResponse(VaiTro VaiTro) {
        return VaiTroResponse.builder()
                .maVaiTro(VaiTro.getMaVaiTro())
                .tenVaiTro(VaiTro.getTenVaiTro())
                .moTa(VaiTro.getMoTa())
                .trangThai(VaiTro.getTrangThai())
                .build();
    }
}