package com.pharma.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation
    .PostMapping;
import org.springframework.web.bind.annotation
    .RequestBody;
import org.springframework.web.bind.annotation
    .RequestMapping;
import org.springframework.web.bind.annotation
    .RestController;

import com.pharma.backend.dto.xacthuc
    .DangKyTrucTiepRequestDto;
import com.pharma.backend.service.DangKyTrucTiepService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(
    "/api/xac-thuc/dang-ky-truc-tiep"
)
@RequiredArgsConstructor
public class DangKyTrucTiepController {

    private final DangKyTrucTiepService dangKyTrucTiepService;

    @PostMapping
    public ResponseEntity<Void> dangKy(
        @RequestBody
        DangKyTrucTiepRequestDto request
    ) {
        dangKyTrucTiepService.dangKy(request);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .build();
    }
}