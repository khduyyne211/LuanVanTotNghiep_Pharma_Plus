package com.pharma.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.hoatchat.HoatChatRequest;
import com.pharma.backend.dto.hoatchat.HoatChatResponse;
import com.pharma.backend.service.HoatChatService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/hoat-chat")
@RequiredArgsConstructor
public class HoatChatController {

    private final HoatChatService hoatChatService;

    @GetMapping
    public List<HoatChatResponse> layDanhSachHoatChat() {
        return hoatChatService.layDanhSachHoatChat();
    }

    @GetMapping("/{maHoatChat}")
    public HoatChatResponse layChiTietHoatChat(
            @PathVariable Long maHoatChat
    ) {
        return hoatChatService.layChiTietHoatChat(maHoatChat);
    }

    @PostMapping
    public HoatChatResponse themHoatChat(
            @Valid @RequestBody HoatChatRequest request
    ) {
        return hoatChatService.themHoatChat(request);
    }

    @PutMapping("/{maHoatChat}")
    public HoatChatResponse capNhatHoatChat(
            @PathVariable Long maHoatChat,
            @Valid @RequestBody HoatChatRequest request
    ) {
        return hoatChatService.capNhatHoatChat(
                maHoatChat,
                request
        );
    }

    @PutMapping("/{maHoatChat}/an")
    public HoatChatResponse anHoatChat(
            @PathVariable Long maHoatChat
    ) {
        return hoatChatService.anHoatChat(maHoatChat);
    }

    @PutMapping("/{maHoatChat}/hien")
    public HoatChatResponse hienHoatChat(
            @PathVariable Long maHoatChat
    ) {
        return hoatChatService.hienHoatChat(maHoatChat);
    }
}