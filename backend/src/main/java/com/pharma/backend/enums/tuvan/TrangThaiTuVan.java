package com.pharma.backend.enums.tuvan;

public enum TrangThaiTuVan {
    /**
     * Yêu cầu mới được khách hàng gửi
     * và đang chờ dược sĩ tư vấn.
     */
    CHO_TIEP_NHAN,

    /**
     * Dược sĩ đã hoàn thành tư vấn.
     */
    DA_TU_VAN,

    /**
     * Dược sĩ đã thử liên hệ nhưng
     * hiện chưa thể liên lạc với khách hàng.
     */
    KHONG_THE_LIEN_HE,

    /**
     * Yêu cầu tư vấn đã được hủy.
     */
    DA_HUY
}
