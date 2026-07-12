package com.pharma.backend.dto.common;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PhanTrangResponse<T> {

    private List<T> content;

    private int page;
    private int size;

    private long totalElements;
    private int totalPages;

    private boolean first;
    private boolean last;
}