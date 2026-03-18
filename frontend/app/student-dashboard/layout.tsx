import DashboardLayoutClient from "./layout-client";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
