import DashboardLayoutClient from "./layout-client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
