import {
  LayoutGrid,
  ChartColumn,
  FileText,
  Inbox,
  Wallet,
  Users,
  TrendingUp,
  MessageSquare,
  User,
} from "lucide-react";

// Sidebar links per role (see FEATURES.md §4).
export const dashboardNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid, roles: ["Employee", "HR", "admin"], end: true },
  { to: "/dashboard/overview", label: "Overview", icon: ChartColumn, roles: ["Employee", "HR", "admin"] },
  { to: "/dashboard/worksheet", label: "Work sheet", icon: FileText, roles: ["Employee"] },
  { to: "/dashboard/payments", label: "Payment history", icon: Wallet, roles: ["Employee"] },
  { to: "/dashboard/employees", label: "Employees", icon: Users, roles: ["HR"] },
  { to: "/dashboard/progress", label: "Progress", icon: TrendingUp, roles: ["HR"] },
  { to: "/dashboard/people", label: "All employees", icon: Users, roles: ["admin"] },
  { to: "/dashboard/payroll", label: "Payroll", icon: Wallet, roles: ["admin"], badgeKey: "pendingPayroll" },
  { to: "/dashboard/inbox", label: "Inbox", icon: Inbox, roles: ["admin"], badgeKey: "unreadMessages" },
  { to: "/dashboard/chat", label: "Chat", icon: MessageSquare, roles: ["Employee", "HR", "admin"] },
  { to: "/dashboard/profile", label: "Profile", icon: User, roles: ["Employee", "HR", "admin"] },
];
