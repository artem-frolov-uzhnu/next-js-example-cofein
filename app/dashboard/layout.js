// Dashboard Layout — Server Component
// Тиждень 4: замінено статичний сайдбар на DashboardShell (Client)
// DashboardShell приймає children через props — паттерн композиції

import DashboardShell from "@/components/DashboardShell";

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}
