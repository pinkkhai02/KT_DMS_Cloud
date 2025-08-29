import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý nhóm khách hàng",
  description: "Trang quản nhóm khách hàng",
};
export default function GroupCustomersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Group Customers</h1>
      {children}
    </div>
  );
}
