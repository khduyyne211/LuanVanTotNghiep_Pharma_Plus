package com.pharma.backend.service.common;

import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CloudinaryImageService {

    private static final long KICH_THUOC_ANH_TOI_DA =
            5L * 1024L * 1024L;

    private static final Set<String> LOAI_ANH_HOP_LE =
            Set.of(
                    "image/jpeg",
                    "image/png",
                    "image/webp"
            );

    /**
     * Thư mục lưu ảnh đơn thuốc trên Cloudinary.
     */
    private static final String THU_MUC_ANH_DON_THUOC =
            "pharma image/don-thuoc";

    private final RestClient restClient =
            RestClient.create();

    private final String cloudName;

    private final String apiKey;

    private final String apiSecret;

    public CloudinaryImageService(
            @Value("${cloudinary.cloud-name}")
            String cloudName,

            @Value("${cloudinary.api-key}")
            String apiKey,

            @Value("${cloudinary.api-secret}")
            String apiSecret
    ) {
        this.cloudName =
                cloudName;

        this.apiKey =
                apiKey;

        this.apiSecret =
                apiSecret;
    }

    /**
     * Upload ảnh đơn thuốc lên Cloudinary.
     *
     * File ảnh thật được lưu trên Cloudinary.
     * Database chỉ lưu secure_url Cloudinary trả về.
     */
    public KetQuaUploadAnh uploadAnhDonThuoc(
            MultipartFile anhDonThuoc,
            Long maKhachHang
    ) {
        kiemTraCauHinhCloudinary();

        kiemTraAnhDonThuoc(
                anhDonThuoc
        );

        if (maKhachHang == null
                || maKhachHang <= 0) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Mã khách hàng không hợp lệ."
            );
        }

        String publicId =
                taoPublicId(
                        maKhachHang
                );

        try {
            MultiValueMap<String, Object>
                    duLieuMultipart =
                    new LinkedMultiValueMap<>();

            /*
             * File ảnh cần upload.
             */
            duLieuMultipart.add(
                    "file",
                    taoFilePart(
                            anhDonThuoc
                    )
            );

            /*
             * Định danh riêng của ảnh trên Cloudinary.
             */
            duLieuMultipart.add(
                    "public_id",
                    publicId
            );

            /*
             * Thư mục hiển thị trong Media Library.
             *
             * Kết quả:
             *
             * Home
             * └── pharma image
             *     └── don-thuoc
             */
            duLieuMultipart.add(
                    "asset_folder",
                    THU_MUC_ANH_DON_THUOC
            );

            /*
             * Không ghi đè ảnh cũ
             * nếu public_id đã tồn tại.
             */
            duLieuMultipart.add(
                    "overwrite",
                    "false"
            );

            @SuppressWarnings("unchecked")
            Map<String, Object> ketQuaUpload =
                    restClient
                            .post()

                            .uri(
                                    "https://api.cloudinary.com/"
                                            + "v1_1/{cloudName}/image/upload",
                                    cloudName
                            )

                            .headers(
                                    headers ->
                                            headers.setBasicAuth(
                                                    apiKey,
                                                    apiSecret,
                                                    StandardCharsets.UTF_8
                                            )
                            )

                            .contentType(
                                    MediaType.MULTIPART_FORM_DATA
                            )

                            .body(
                                    duLieuMultipart
                            )

                            .retrieve()

                            .body(
                                    Map.class
                            );

            if (ketQuaUpload == null) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Cloudinary không trả về kết quả tải ảnh."
                );
            }

            String secureUrl =
                    layChuoi(
                            ketQuaUpload.get(
                                    "secure_url"
                            )
                    );

            String publicIdDaLuu =
                    layChuoi(
                            ketQuaUpload.get(
                                    "public_id"
                            )
                    );

            if (secureUrl == null
                    || secureUrl.isBlank()) {

                throw new ResponseStatusException(
                        HttpStatus.BAD_GATEWAY,
                        "Cloudinary không trả về đường dẫn ảnh."
                );
            }

            if (publicIdDaLuu == null
                    || publicIdDaLuu.isBlank()) {

                publicIdDaLuu =
                        publicId;
            }

            return new KetQuaUploadAnh(
                    secureUrl,
                    publicIdDaLuu
            );

        } catch (ResponseStatusException exception) {

            throw exception;

        } catch (RestClientException exception) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Không thể tải ảnh đơn thuốc lên Cloudinary.",
                    exception
            );

        } catch (Exception exception) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Không thể xử lý ảnh đơn thuốc.",
                    exception
            );
        }
    }

    /**
     * Xóa ảnh Cloudinary nếu upload thành công
     * nhưng lưu database thất bại.
     */
    public void xoaAnhNeuCo(
            String publicId
    ) {
        if (publicId == null
                || publicId.isBlank()) {

            return;
        }

        if (!cauHinhCloudinaryHopLe()) {
            return;
        }

        MultiValueMap<String, String>
                duLieu =
                new LinkedMultiValueMap<>();

        duLieu.add(
                "public_id",
                publicId
        );

        duLieu.add(
                "invalidate",
                "true"
        );

        try {
            restClient
                    .post()

                    .uri(
                            "https://api.cloudinary.com/"
                                    + "v1_1/{cloudName}/image/destroy",
                            cloudName
                    )

                    .headers(
                            headers ->
                                    headers.setBasicAuth(
                                            apiKey,
                                            apiSecret,
                                            StandardCharsets.UTF_8
                                    )
                    )

                    .contentType(
                            MediaType.APPLICATION_FORM_URLENCODED
                    )

                    .body(
                            duLieu
                    )

                    .retrieve()

                    .toBodilessEntity();

        } catch (Exception exception) {
            /*
             * Đây chỉ là bước dọn ảnh.
             * Không làm hỏng luồng chính
             * nếu xóa ảnh thất bại.
             */
        }
    }

    /**
     * Chuyển MultipartFile thành multipart part
     * để RestClient gửi sang Cloudinary.
     */
    private HttpEntity<ByteArrayResource>
            taoFilePart(
                    MultipartFile file
            ) throws Exception {

        String tenFileGoc =
                file.getOriginalFilename();

        final String tenFileCuoi;

        if (tenFileGoc == null
                || tenFileGoc.isBlank()) {

            tenFileCuoi =
                    "don-thuoc.jpg";

        } else {

            tenFileCuoi =
                    tenFileGoc;
        }

        byte[] duLieuAnh =
                file.getBytes();

        ByteArrayResource resource =
                new ByteArrayResource(
                        duLieuAnh
                ) {
                    @Override
                    public String getFilename() {
                        return tenFileCuoi;
                    }
                };

        HttpHeaders headers =
                new HttpHeaders();

        String contentType =
                file.getContentType();

        if (contentType != null
                && !contentType.isBlank()) {

            headers.setContentType(
                    MediaType.parseMediaType(
                            contentType
                    )
            );
        }

        headers.setContentDisposition(
                ContentDisposition
                        .formData()
                        .name("file")
                        .filename(
                                tenFileCuoi,
                                StandardCharsets.UTF_8
                        )
                        .build()
        );

        return new HttpEntity<>(
                resource,
                headers
        );
    }

    /**
     * Kiểm tra ảnh trước khi gửi lên Cloudinary.
     */
    private void kiemTraAnhDonThuoc(
            MultipartFile anhDonThuoc
    ) {
        if (anhDonThuoc == null
                || anhDonThuoc.isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Vui lòng chọn ảnh đơn thuốc."
            );
        }

        if (anhDonThuoc.getSize()
                > KICH_THUOC_ANH_TOI_DA) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ảnh đơn thuốc không được vượt quá 5 MB."
            );
        }

        String contentType =
                anhDonThuoc.getContentType();

        if (contentType == null
                || !LOAI_ANH_HOP_LE.contains(
                        contentType.toLowerCase()
                )) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ảnh đơn thuốc chỉ hỗ trợ JPG, JPEG, PNG hoặc WEBP."
            );
        }
    }

    /**
     * Kiểm tra cấu hình Cloudinary.
     */
    private void kiemTraCauHinhCloudinary() {

        if (!cauHinhCloudinaryHopLe()) {

            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Cloudinary chưa được cấu hình trên máy chủ."
            );
        }
    }

    private boolean cauHinhCloudinaryHopLe() {

        return cloudName != null
                && !cloudName.isBlank()

                && apiKey != null
                && !apiKey.isBlank()

                && apiSecret != null
                && !apiSecret.isBlank();
    }

    /**
     * Tạo public_id riêng cho từng ảnh đơn thuốc.
     */
    private String taoPublicId(
            Long maKhachHang
    ) {
        return "pharma-plus-don-thuoc"
                + "-khach-hang-"
                + maKhachHang
                + "-"
                + UUID.randomUUID();
    }

    private String layChuoi(
            Object giaTri
    ) {
        if (giaTri == null) {

            return null;
        }

        return giaTri.toString();
    }

    public record KetQuaUploadAnh(
            String secureUrl,
            String publicId
    ) {
    }
}