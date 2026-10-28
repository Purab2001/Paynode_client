import { createBrowserRouter } from "react-router";
import PublicLayout from "@/components/layout/PublicLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { RedirectIfSignedIn, RequireAuth, RequireNeedsProfile, RoleRoute } from "@/components/layout/Guards";
import Home from "@/pages/public/Home";
import NotFound from "@/pages/errors/NotFound";
import Forbidden from "@/pages/errors/Forbidden";

// Code-split a page: React Router loads the module on first navigation.
const lazyPage = (load) => async () => ({ Component: (await load()).default });

export const router = createBrowserRouter([
  {
    Component: PublicLayout,
    errorElement: <NotFound />,
    children: [
      { path: "/", Component: Home },
      { path: "/features", lazy: lazyPage(() => import("@/pages/public/Features")) },
      { path: "/pricing", lazy: lazyPage(() => import("@/pages/public/Pricing")) },
      { path: "/security", lazy: lazyPage(() => import("@/pages/public/Security")) },
      { path: "/about", lazy: lazyPage(() => import("@/pages/public/About")) },
      { path: "/contact", lazy: lazyPage(() => import("@/pages/public/Contact")) },
    ],
  },
  {
    Component: RedirectIfSignedIn,
    children: [
      { path: "/register", lazy: lazyPage(() => import("@/pages/auth/Register")) },
      { path: "/login", lazy: lazyPage(() => import("@/pages/auth/Login")) },
    ],
  },
  {
    Component: RequireNeedsProfile,
    children: [{ path: "/complete-profile", lazy: lazyPage(() => import("@/pages/auth/CompleteProfile")) }],
  },
  {
    path: "/dashboard",
    Component: RequireAuth,
    errorElement: <NotFound />,
    children: [
      {
        Component: DashboardLayout,
        children: [
          { index: true, lazy: lazyPage(() => import("@/pages/dashboard/Dashboard")) },
          { path: "overview", lazy: lazyPage(() => import("@/pages/dashboard/Overview")) },
          { path: "chat", lazy: lazyPage(() => import("@/pages/dashboard/Chat")) },
          { path: "profile", lazy: lazyPage(() => import("@/pages/dashboard/Profile")) },
          {
            element: <RoleRoute roles={["Employee"]} />,
            children: [
              { path: "worksheet", lazy: lazyPage(() => import("@/pages/dashboard/Worksheet")) },
              { path: "payments", lazy: lazyPage(() => import("@/pages/dashboard/Payments")) },
            ],
          },
          {
            element: <RoleRoute roles={["HR"]} />,
            children: [
              { path: "employees", lazy: lazyPage(() => import("@/pages/dashboard/Employees")) },
              { path: "progress", lazy: lazyPage(() => import("@/pages/dashboard/Progress")) },
            ],
          },
          {
            element: <RoleRoute roles={["HR", "admin"]} />,
            children: [{ path: "employees/:id", lazy: lazyPage(() => import("@/pages/dashboard/EmployeeDetails")) }],
          },
          {
            element: <RoleRoute roles={["admin"]} />,
            children: [
              { path: "people", lazy: lazyPage(() => import("@/pages/dashboard/People")) },
              { path: "payroll", lazy: lazyPage(() => import("@/pages/dashboard/Payroll")) },
              { path: "inbox", lazy: lazyPage(() => import("@/pages/dashboard/Inbox")) },
            ],
          },
        ],
      },
    ],
  },
  { path: "/forbidden", Component: Forbidden },
  { path: "*", Component: NotFound },
]);
