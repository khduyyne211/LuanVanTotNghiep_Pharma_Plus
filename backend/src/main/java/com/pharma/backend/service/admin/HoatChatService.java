package com.pharma.backend.service.admin;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharma.backend.dto.admin.hoatchat.HoatChatRequest;
import com.pharma.backend.dto.admin.hoatchat.HoatChatResponse;
import com.pharma.backend.entity.HoatChat;
import com.pharma.backend.repository.HoatChatRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class HoatChatService {

    private final HoatChatRepository hoatChatRepository;

    @Transactional(readOnly = true)
    public List<HoatChatResponse> layDanhSachHoatChat() {
        return hoatChatRepository.findAllOrderByTenHoatChatAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public HoatChatResponse layChiTietHoatChat(Long maHoatChat) {
        return toResponse(timHoatChatTheoMa(maHoatChat));
    }

    @Transactional
    public HoatChatResponse themHoatChat(HoatChatRequest request) {
        String tenHoatChat = request.getTenHoatChat().trim();

        if (hoatChatRepository.existsByTenHoatChat(tenHoatChat)) {
            throw new IllegalArgumentException("Tên hoạt chất đã tồn tại");
        }

        HoatChat hoatChat = new HoatChat();
        hoatChat.setTenHoatChat(tenHoatChat);
        hoatChat.setDonVi(chuanHoaChuoiKhongBatBuoc(request.getDonVi()));
        hoatChat.setMoTa(chuanHoaChuoiKhongBatBuoc(request.getMoTa()));
        hoatChat.setTrangThai(true);

        return toResponse(hoatChatRepository.save(hoatChat));
    }

    @Transactional
    public HoatChatResponse capNhatHoatChat(
            Long maHoatChat,
            HoatChatRequest request
    ) {
        HoatChat hoatChat = timHoatChatTheoMa(maHoatChat);
        String tenHoatChat = request.getTenHoatChat().trim();

        boolean biTrungTen =
                hoatChatRepository.existsByTenHoatChatAndMaHoatChatNot(
                        tenHoatChat,
                        maHoatChat
                );

        if (biTrungTen) {
            throw new IllegalArgumentException("Tên hoạt chất đã tồn tại");
        }

        hoatChat.setTenHoatChat(tenHoatChat);
        hoatChat.setDonVi(chuanHoaChuoiKhongBatBuoc(request.getDonVi()));
        hoatChat.setMoTa(chuanHoaChuoiKhongBatBuoc(request.getMoTa()));

        return toResponse(hoatChatRepository.save(hoatChat));
    }

    @Transactional
    public HoatChatResponse anHoatChat(Long maHoatChat) {
        HoatChat hoatChat = timHoatChatTheoMa(maHoatChat);
        hoatChat.setTrangThai(false);

        return toResponse(hoatChatRepository.save(hoatChat));
    }

    @Transactional
    public HoatChatResponse hienHoatChat(Long maHoatChat) {
        HoatChat hoatChat = timHoatChatTheoMa(maHoatChat);
        hoatChat.setTrangThai(true);

        return toResponse(hoatChatRepository.save(hoatChat));
    }

    private HoatChat timHoatChatTheoMa(Long maHoatChat) {
        return hoatChatRepository.findById(maHoatChat)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Không tìm thấy hoạt chất"
                        )
                );
    }

    private String chuanHoaChuoiKhongBatBuoc(String giaTri) {
        if (giaTri == null || giaTri.isBlank()) {
            return null;
        }

        return giaTri.trim();
    }

    private HoatChatResponse toResponse(HoatChat hoatChat) {
        return HoatChatResponse.builder()
                .maHoatChat(hoatChat.getMaHoatChat())
                .tenHoatChat(hoatChat.getTenHoatChat())
                .donVi(hoatChat.getDonVi())
                .moTa(hoatChat.getMoTa())
                .trangThai(hoatChat.getTrangThai())
                .build();
    }
}