markdown# Cấu trúc Router của Dự án (Next.js App Router)

## Hiện tại
Danh sách các route hiện có trong dự án:
- `app/auth/login/page.tsx` → Route: `/auth/login`
- `app/auth/register/page.tsx` → Route: `/auth/register`
- `app/dashboard/page.tsx` → Route: `/dashboard`
- `app/dashboard/groupCustomers/page.tsx` → Route: `/dashboard/groupCustomers`

## Nguyên tắc Tổ chức
- Mỗi thư mục trong `app/` đại diện cho một segment của URL.
- File `page.tsx` là điểm vào để render giao diện người dùng (UI) cho route đó.
- File `layout.tsx` cung cấp layout bao quanh `page.tsx` và các route con.

## Hướng dẫn Tạo Màn hình Mới
### Ví dụ: Tạo màn hình Quản lý Sản phẩm tại `/dashboard/products`

#### Bước 1: Tạo Thư Mục Mới
- Tạo thư mục mới trong `app/`:
app/dashboard/products/
text#### Bước 2: Thêm File `page.tsx`
- Tạo file `page.tsx` trong thư mục `app/dashboard/products/` với nội dung cơ bản:
```tsx
export default function ProductsPage() {
  return <div>Danh sách sản phẩm</div>;
}

Kết quả: Tự động mapping thành route /dashboard/products.

Bước 3: Thêm Layout Riêng (Tùy chọn)

Nếu muốn sử dụng layout riêng, tạo file layout.tsx trong app/dashboard/products/:
tsxexport default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>Quản lý sản phẩm</h1>
      <div>{children}</div>
    </div>
  );
}

Kết quả: Tất cả các route con của /dashboard/products/* sẽ được bọc trong layout này.

Tips Bổ sung

Global Layout: File app/layout.tsx áp dụng cho toàn bộ ứng dụng.
Nested Layout: Đặt file layout.tsx trong thư mục con để chia khu vực (ví dụ: /dashboard/*).
Loading UI: Thêm file loading.tsx để Next.js render giao diện khi chờ dữ liệu.
Error Boundary: Thêm file error.tsx để hiển thị khi có lỗi runtime ở route đó.

Kết luận

Chỉ cần tạo thư mục và file page.tsx trong app/ theo cấu trúc URL mong muốn.
Next.js sẽ tự động sinh route mà không cần cấu hình thủ công.