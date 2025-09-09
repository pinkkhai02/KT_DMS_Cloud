# Quy trình xây dựng màn hình mới

## Bước 1: Interface (types / models)

**Chức năng:** - Định nghĩa cấu trúc dữ liệu (type, interface) cho
request và response API. - Giúp code có type-safety (TypeScript bắt lỗi
khi truyền sai kiểu). - Ví dụ: `LoginRequest`, `LoginResponse`,
`UserProfile`, ...

**Ý nghĩa:**\
Tạo nền tảng để các tầng khác (API, store, hook, UI) dùng chung, tránh
hardcode.

------------------------------------------------------------------------

## Bước 2: Zustand Store

**Chức năng:** - Quản lý state toàn cục liên quan đến màn hình hoặc
module (ví dụ: thông tin user, token, giỏ hàng). - Chứa action để cập
nhật state (set, reset, clear). - Cho phép nhiều component khác nhau
subscribe vào cùng một nguồn dữ liệu.

**Ý nghĩa:**\
Giữ dữ liệu đồng bộ xuyên suốt ứng dụng mà không cần props drilling.

------------------------------------------------------------------------

## Bước 3: ApiService (service layer)

**Chức năng:** - Đóng gói logic gọi API cho 1 resource cụ thể. - Chỉ tập
trung vào CRUD / business logic (login, logout, fetch list, update
item...). - Dùng `apiClient` để thực sự gọi HTTP.

**Ý nghĩa:**\
Tách biệt logic business với hạ tầng gọi API, dễ tái sử dụng và test.

------------------------------------------------------------------------

## Bước 4: apiClient (infrastructure layer)

**Chức năng:** - Cấu hình client HTTP (axios, fetch wrapper). - Gắn
interceptor (thêm token, refresh token, xử lý lỗi global). - Trả về dữ
liệu đã chuẩn hóa (JSON).

**Ý nghĩa:**\
Đây là tầng kết nối hạ tầng, đảm bảo mọi ApiService gọi API đều qua một
cổng duy nhất, dễ quản lý.

------------------------------------------------------------------------

## Bước 5: Custom Hook (useSomething)

**Chức năng:** - Đóng gói logic fetch dữ liệu, mutation, loading, error,
caching (thường dùng `react-query` hoặc trực tiếp Zustand). - Tích hợp
với store để đọc/ghi state. - Trả ra API thân thiện cho component (data,
isLoading, error, actions...).

**Ý nghĩa:**\
Giúp component chỉ cần gọi `const { data, login } = useAuth()` mà không
quan tâm chi tiết bên trong.

------------------------------------------------------------------------

## Bước 6: Component (UI layer)

**Chức năng:** - Hiển thị UI cho người dùng. - Nhận dữ liệu từ custom
hook và render. - Trigger action (login, submit form, load data) thông
qua hook.

**Ý nghĩa:**\
Component chỉ lo hiển thị và giao tiếp với người dùng, tách biệt hẳn với
logic dữ liệu.

------------------------------------------------------------------------

## Sơ đồ luồng dữ liệu (flow chart)

    [ B1: Interface (types) ]
                 ↑
                 |
    [ B4: apiClient (HTTP client) ] ←→ Backend API
                 ↑
                 |
    [ B3: ApiService (business logic) ]
                 ↑
                 |
    [ B5: Custom Hook (fetch/mutation + state) ] ←→ [ B2: Zustand Store (state toàn cục) ]
                 ↑
                 |
    [ B6: Component (UI hiển thị) ]
