package com.pharma.backend.dto.admin.hoatchat;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class HoatChatResponse {

    private Long maHoatChat;
    private String tenHoatChat;
    private String donVi;
    private String moTa;
    private Boolean trangThai;
}