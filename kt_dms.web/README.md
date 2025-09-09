markdown# Tài liệu Dự án

## 1. CÔNG NGHỆ SỬ DỤNG

- **UI/UX**:
  - Next.js
  - React
  - TailwindCSS
  - Radix UI
  - Lucide Icons
- **State Management**:
  - Zustand (trạng thái client)
  - React Query (trạng thái server)
- **Form Handling**:
  - React Hook Form
  - Zod
- **API**: Axios (được bọc trong services)
- **Dev Tools**:
  - ESLint
  - TypeScript
  - PostCSS

---

## 2. CẤU TRÚC THƯ MỤC VÀ VAI TRÒ

### Gốc dự án (`kt_dms.web/`)

```
├── node_modules/ # Thư viện cài qua npm/yarn
├── public/ # File tĩnh (ảnh, favicon, ...)
├── src/ # Code chính
│ ├── app/ # Next.js App Router (pages, layout, route)
│ ├── assets/ # Tài nguyên (hình ảnh, icon, style…)
│ ├── components/ # Các component React
│ │ ├── providers/ # Provider context hoặc wrapper
│ │ ├── SideBar/ # Component sidebar
│ │ └── ui/ # UI component (AppBarChart, FormLogin, Navbar, ProtectedRoute, …)
│ ├── hooks/ # Custom hooks (use-mobile, useAuth, …)
│ ├── layouts/ # Layout dùng chung
│ ├── lib/ # Hàm tiện ích (api.ts, utils.ts, …)
│ ├── services/ # Xử lý logic gọi API (authService.ts)
│ └── stores/ # State management (useUserStore.ts - có thể dùng Zustand/Redux)
├── .env.local # File cấu hình môi trường local
├── .env.production # File cấu hình môi trường production
├── .gitignore # Bỏ qua file khi commit Git
├── components.json # Config cho shadcn/ui (nếu dùng)
├── eslint.config.mjs # Cấu hình ESLint
├── next-env.d.ts # Khai báo type Next.js
├── next.config.ts # Cấu hình Next.js
├── package-lock.json # Lock phiên bản package (npm)
├── package.json # Thông tin project + dependency
├── postcss.config.mjs # Cấu hình PostCSS (thường dùng với TailwindCSS)
├── README.md / README.md.txt # Tài liệu mô tả dự án
└── tsconfig.json # Cấu hình TypeScript
```

text### Chi tiết vai trò

- **`node_modules/`**: Nơi lưu trữ các thư viện được cài đặt bằng npm hoặc yarn.
- **`public/`**: Chứa file tĩnh (ảnh, favicon, manifest.json, robots.txt, …), truy cập trực tiếp qua URL.
- **`src/`** (source code chính):
  - **`app/`**: Sử dụng Next.js App Router, chứa `page.tsx`, `layout.tsx`, `loading.tsx`,… để định nghĩa route, layout và hành vi từng trang.
  - **`assets/`**: Nơi lưu tài nguyên tĩnh (icon, logo, ảnh, CSS, font…).
  - **`components/`**: Các React component tái sử dụng, bao gồm:
    - `providers/`: Provider context (ví dụ: ThemeProvider, AuthProvider).
    - `SideBar/`: Component riêng cho Sidebar.
    - `ui/`: UI component (Button, FormLogin, Navbar, AppBarChart, ProtectedRoute…).
  - **`hooks/`**: Chứa custom hooks (useAuth.ts, use-mobile.ts,…), tách logic khỏi component.
  - **`layouts/`**: Layout tổng thể (ví dụ: DashboardLayout, AuthLayout).
  - **`lib/`**: Thư viện tiện ích tự viết:
    - `api.ts`: Hàm gọi API (axios instance hoặc fetch wrapper).
    - `utils.ts`: Hàm tiện ích chung.
  - **`services/`**: Logic nghiệp vụ gọi API (ví dụ: authService.ts cho login/register/getCurrentUser).
  - **`stores/`**: Quản lý trạng thái (thường dùng Zustand/Redux), ví dụ: useUserStore.ts quản lý thông tin user.
- **File cấu hình & môi trường**:
  - `.env.local`: Biến môi trường cho môi trường local (chạy máy dev).
  - `.env.production`: Biến môi trường khi build production.
  - `.gitignore`: Quy định file/thư mục không push lên Git (node_modules, .env, build output…).
  - `components.json`: Cấu hình cho thư viện shadcn/ui (nếu sử dụng).
  - `eslint.config.mjs`: Cấu hình ESLint (quy tắc kiểm tra code).
  - `next-env.d.ts`: File khai báo type tự động của Next.js, hỗ trợ TypeScript.
  - `next.config.ts`: Cấu hình Next.js (rewrites, redirects, build config…).
  - `package.json`: Thông tin dự án, script (dev, build, start), dependency & devDependency.
  - `package-lock.json`: Lock phiên bản dependency để cài đặt giống nhau trên mọi máy.
  - `postcss.config.mjs`: Cấu hình PostCSS (dùng chung với TailwindCSS).
  - `README.md / README.md.txt`: Tài liệu mô tả dự án (cách cài đặt, chạy, deploy…).
  - `tsconfig.json`: Cấu hình TypeScript (compiler options, path alias, strict mode…).

---

## 3. FLOW HOẠT ĐỘNG FRONTEND → BACKEND

### Quy trình

1. **Client (Next.js Component)**:
   - Người dùng thao tác (ví dụ: nhấn “Đăng nhập”, mở dashboard).
   - Component gọi Custom Hook (ví dụ: useAuth, useUsers).
2. **Custom Hook**:
   - Đóng vai trò trung gian, xử lý logic UI.
   - Gọi Universal API Service để thực hiện request.
   - Cập nhật Zustand Store hoặc React Query cache sau khi nhận dữ liệu.
3. **Universal API Service**:
   - Sử dụng fetch (hoặc axios trước đây) để gọi API.
   - Base URL lấy từ Environment Variables (`process.env.NEXT_PUBLIC_API_URL`).
4. **Zustand Store (Client State)**:
   - Lưu thông tin user, token, cấu hình UI (ví dụ: dark mode, sidebar state).
   - Các component có thể đọc/ghi trực tiếp state từ đây.
5. **.NET Core API (Backend)**:
   - Controller nhận request từ frontend.
   - Service xử lý nghiệp vụ (xác thực user, sinh JWT, tính toán…).
   - Repository thao tác với DbContext để truy vấn SQL Server.
   - DbContext gửi query đến database và trả kết quả ngược lại.
6. **Trả về Dữ liệu**:
   - Repository → Service → Controller → Trả JSON response.
   - Universal API Service nhận JSON → Trả về Hook.
   - Hook cập nhật Store/Cache → Component render UI.

---

## 4. CÁCH CHẠY PROJECT

### Hướng dẫn

1. **Cài đặt Node.js**: Đảm bảo Node.js đã được cài đặt trên máy.
2. **Clone dự án**:
   - Mở terminal và chạy: `git clone <repository-url>`.
3. **Cài đặt phụ thuộc**:
   - Trong thư mục dự án, chạy: `npm i` để cài đặt các gói cần thiết.
4. **Chạy dự án**:
   - Chạy lệnh: `npm run dev` để build và chạy local.
