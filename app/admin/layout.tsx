import AdminNav from "@/components/admin/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-bg">
      <AdminNav />
      <main className="flex-1 p-4 md:p-8 md:overflow-y-auto">{children}</main>
    </div>
  );
}
