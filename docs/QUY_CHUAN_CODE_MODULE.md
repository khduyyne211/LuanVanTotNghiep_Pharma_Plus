# QUY CHUẨN CODE MODULE – PHARMA+

## 1. Mục đích

Tài liệu này quy định bộ khung dùng chung khi phát triển các module mới trong dự án Pharma+.

Mục tiêu:

- Giữ cấu trúc code thống nhất giữa các chức năng.
- Không để Page hoặc Component phình to rồi mới refactor.
- Tách rõ trách nhiệm giữa giao diện, state, API và backend.
- Hạn chế trùng type, trùng endpoint và trùng nghiệp vụ.
- Giúp review, kiểm thử và merge code dễ hơn.

Module tham chiếu hiện tại:

```text
frontend/src/features/san-pham
```

---

## 2. Luồng tổng thể

```text
Frontend Page
→ Hook
→ API
→ axiosClient
→ Backend Controller
→ Service
→ Repository
→ Entity
→ Database
```

---

# PHẦN I – FRONTEND

## 3. Cấu trúc thư mục chuẩn

```text
frontend/src/features/<ten-feature>/
├── api/
│   └── <tenFeature>Api.ts
├── components/
│   ├── <TenFeature>BoLoc.tsx
│   ├── <TenFeature>Table.tsx
│   ├── <TenFeature>FormModal.tsx
│   ├── <TenFeature>ChiTietModal.tsx
│   └── <nhom-component-con>/
├── hooks/
│   ├── useDanhSach<TenFeature>.ts
│   ├── useChiTiet<TenFeature>.ts
│   └── useForm<TenFeature>.ts
├── pages/
│   └── QuanLy<TenFeature>Page.tsx
├── styles/
│   └── <TenFeature>.css
└── types/
    └── <TenFeature>.ts
```

Không phải module nào cũng cần đủ tất cả file. Module CRUD đơn giản có thể chỉ cần `api`, `components`, `pages`, `types`. Chỉ tạo `hooks` khi có state, xử lý bất đồng bộ hoặc logic dùng chung đủ lớn.

## 4. Trách nhiệm từng phần

### 4.1. Page

Page có trách nhiệm:

- Ghép các component.
- Gọi các custom hook.
- Điều phối giữa nhiều modal hoặc nhiều hook.
- Truyền dữ liệu và callback xuống component.

Page không được:

- Gọi `axiosClient` trực tiếp.
- Chứa validation dài.
- Chứa hàng loạt state chi tiết của form.
- Chứa JSX bảng hoặc modal quá lớn.
- Lặp lại nghiệp vụ đã có trong hook.

### 4.2. Hook

Hook có trách nhiệm:

- Quản lý state của một nhóm nghiệp vụ giao diện.
- Gọi hàm trong file API.
- Xử lý loading, lỗi, tải lại dữ liệu.
- Trả dữ liệu và callback cho Page hoặc Component.

Không tạo hook chỉ để chứa vài dòng state đơn giản.

### 4.3. API

File API là nơi duy nhất trong feature được gọi `axiosClient`.

Quy tắc:

- Tên hàm mô tả đúng hành động nghiệp vụ.
- Endpoint chỉ khai báo một lần.
- Khai báo rõ request type và response type.
- Không viết `axiosClient` trực tiếp trong Page, Hook hoặc Component.
- Không tạo hai hàm API trùng endpoint và mục đích.

### 4.4. Component

Component có trách nhiệm:

- Hiển thị giao diện.
- Nhận dữ liệu qua props.
- Phát sự kiện qua callback.
- Không tự quyết định nghiệp vụ lớn.

Component không được:

- Gọi backend trực tiếp.
- Tự tải dữ liệu khi dữ liệu đã thuộc trách nhiệm của Page hoặc Hook.
- Khai báo type dùng chung bị trùng ở nhiều file.

### 4.5. Types

Type dùng chung trong feature đặt tại:

```text
features/<feature>/types/<Feature>.ts
```

Quy tắc:

- Không khai báo cùng một interface trong nhiều modal.
- Type chỉ dùng riêng cho một component nhỏ có thể đặt cạnh component đó.
- Request type của API có thể đặt trong file API khi chỉ phục vụ endpoint của feature.
- Response type dùng chung nên đặt trong `types/`.

## 5. Quy tắc tách file

Tách file khi:

- Page vượt khoảng 300–400 dòng và có nhiều nhóm trách nhiệm.
- Component vượt khoảng 500–700 dòng và có nhiều phần giao diện độc lập.
- Có từ hai nơi trở lên khai báo cùng một type hoặc cùng một logic.
- Có nhóm state và hàm xử lý có thể gọi tên nghiệp vụ rõ ràng.
- JSX có các bước, tab hoặc bảng độc lập.

Không tách file khi:

- Chỉ có vài dòng state hoặc callback.
- Việc tách làm tăng nhiều props nhưng không giảm trách nhiệm.
- Logic chưa ổn định hoặc đang thay đổi nghiệp vụ.
- Component mới chỉ là lớp bọc không có ý nghĩa.

## 6. Bộ khung CRUD frontend

### 6.1. API

```tsx
export interface FeatureRequest {
  ten: string;
  trangThai: boolean;
}

export const layDanhSachFeature = () => {
  return axiosClient.get<Feature[]>("/feature");
};

export const themFeature = (duLieu: FeatureRequest) => {
  return axiosClient.post<Feature>("/feature", duLieu);
};

export const capNhatFeature = (
  maFeature: number,
  duLieu: FeatureRequest
) => {
  return axiosClient.put<Feature>(
    `/feature/${maFeature}`,
    duLieu
  );
};

export const anFeature = (maFeature: number) => {
  return axiosClient.put<Feature>(
    `/feature/${maFeature}/an`
  );
};

export const hienFeature = (maFeature: number) => {
  return axiosClient.put<Feature>(
    `/feature/${maFeature}/hien`
  );
};
```

### 6.2. Hook danh sách

```tsx
function useDanhSachFeature() {
  const [danhSach, setDanhSach] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);

  const taiDanhSach = useCallback(async () => {
    try {
      setLoading(true);
      const response = await layDanhSachFeature();
      setDanhSach(response.data);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    danhSach,
    loading,
    taiDanhSach,
  };
}
```

### 6.3. Page

```tsx
function QuanLyFeaturePage() {
  const {
    danhSach,
    loading,
    taiDanhSach,
  } = useDanhSachFeature();

  return (
    <FeatureTable
      danhSach={danhSach}
      loading={loading}
    />
  );
}
```

## 7. Quy tắc form nhiều bước

Modal cha giữ:

- State tổng.
- Validation.
- Chuyển bước.
- Submit.
- Gọi API.

Mỗi component bước chỉ giữ phần hiển thị và callback.

```text
FeatureFormModal
├── FeatureThongTinStep
├── FeatureDonViStep
└── FeatureXacNhanStep
```

Không để từng step tự gọi API nếu dữ liệu phải submit chung trong một transaction.

---

# PHẦN II – BACKEND

## 8. Cấu trúc thư mục chuẩn

Dự án dùng cấu trúc theo tầng trước, feature nằm bên trong từng tầng:

```text
backend/src/main/java/com/pharma/backend/
├── controller/<feature>/
│   └── <Feature>Controller.java
├── dto/<feature>/
│   └── <Feature>Dto.java
├── entity/<feature>/
│   └── <Feature>.java
├── repository/<feature>/
│   └── <Feature>Repository.java
├── service/<feature>/
│   └── <Feature>Service.java
├── config/
├── security/
├── exception/
└── util/
```

## 9. Trách nhiệm backend

### 9.1. Controller

- Nhận request.
- Validate dữ liệu đầu vào bằng annotation khi phù hợp.
- Gọi Service.
- Trả response.
- Không chứa nghiệp vụ dài hoặc truy cập Repository trực tiếp.

### 9.2. Service

- Kiểm tra nghiệp vụ.
- Điều phối nhiều repository.
- Chuyển đổi Entity/DTO.
- Quản lý transaction.
- Ném exception có ý nghĩa.

Các luồng tạo nhiều bảng phải dùng `@Transactional`.

### 9.3. Repository

- Truy xuất dữ liệu.
- Ưu tiên method có sẵn của Spring Data JPA.
- Chỉ viết query custom khi method name không giải quyết rõ ràng.
- Không chứa nghiệp vụ.

### 9.4. Entity

- Ánh xạ đúng bảng và cột database.
- Không tự ý đổi tên cột đã chốt.
- Quan hệ JPA phải phản ánh đúng lược đồ logic/vật lý.
- Không nhồi nghiệp vụ xử lý vào Entity.

### 9.5. DTO

Ưu tiên một DTO chính cho mỗi entity/feature trong giai đoạn đầu.

Chỉ tách nhiều request/response DTO khi:

- Payload tạo và cập nhật khác nhau rõ rệt.
- Có dữ liệu nhạy cảm không được trả về.
- Một endpoint tổng hợp nhiều bảng.
- Validation đầu vào khác nhau.

## 10. Luồng CRUD backend chuẩn

```text
Controller
→ Service
→ Repository
→ Entity
→ Database
```

---

# PHẦN III – QUY TẮC LÀM VIỆC

## 11. Trình tự phát triển module mới

```text
1. Kiểm tra bảng và nghiệp vụ trong database
2. Kiểm tra Entity
3. Repository
4. Service
5. Controller
6. DTO
7. API frontend
8. Types frontend
9. Hook
10. Component
11. Page
12. Build và kiểm thử
13. Commit
```

## 12. Checklist trước khi commit

### Backend

- [ ] Build thành công.
- [ ] Endpoint trả đúng status.
- [ ] Không sửa nghiệp vụ ngoài phạm vi.
- [ ] Transaction đúng với luồng nhiều bảng.
- [ ] Không truy cập Repository từ Controller.

### Frontend

- [ ] `npm run build` thành công.
- [ ] Không có `axiosClient` trong Page/Hook/Component.
- [ ] Không có type dùng chung bị khai báo trùng.
- [ ] Network trả đúng status.
- [ ] UI giữ nguyên nghiệp vụ.
- [ ] `git diff --check` không báo lỗi.

### Git

- [ ] `git status` chỉ có file đúng phạm vi.
- [ ] Một commit chỉ xử lý một nhóm thay đổi.
- [ ] Không commit file build, file tạm hoặc dữ liệu bí mật.
- [ ] Commit message mô tả đúng nội dung.

## 13. Quy tắc commit

Ví dụ commit tốt:

```text
Thêm API quản lý danh mục sản phẩm
Tách bảng danh mục thành component riêng
Tách xử lý form danh mục sang custom hook
Sửa mapping cột ký hiệu đơn vị tính
```

Không dùng commit message chung chung:

```text
fix
update
code
sửa lỗi
```

## 14. Điểm dừng refactor

Dừng refactor khi:

- Chức năng chạy đúng.
- Build thành công.
- Trách nhiệm chính đã tách rõ.
- Page chỉ còn điều phối.
- API đã tập trung.
- Type dùng chung không còn trùng.
- Việc tách tiếp không giúp tái sử dụng hoặc giảm phụ thuộc rõ rệt.

Sau khi đạt điểm dừng, chỉ quay lại khi:

- Có lỗi nghiệp vụ.
- Có thay đổi yêu cầu.
- Có code trùng phát sinh ở module khác.
- Cần tái sử dụng thực tế.

Không tiếp tục refactor chỉ để giảm số dòng.

## 15. Module tham chiếu

Dùng module sau làm mẫu cho các module Admin tiếp theo:

```text
frontend/src/features/san-pham/
```

Các module tiếp theo như danh mục sản phẩm, nhà sản xuất và đơn vị tính phải áp dụng bộ khung ngay từ đầu để tránh phải refactor lại toàn bộ sau này.
