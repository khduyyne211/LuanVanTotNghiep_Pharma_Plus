package com.pharma.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pharma.backend.dto.xacthuc.DangKyRequestDto;
import com.pharma.backend.service.DangKyService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/xac-thuc/dang-ky")
@RequiredArgsConstructor
public class DangKyController {

    private final DangKyService dangKyService;

    @PostMapping
    public ResponseEntity<Void> dangKy(
            @RequestBody DangKyRequestDto request) {
        dangKyService.dangKy(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }
}