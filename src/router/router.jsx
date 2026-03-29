import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import RoleProtectedRoute from "../routes/RoleProtectedRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import ContactUs from "../pages/ContactUs";
import About from "../pages/About";
import Forbidden from "../pages/Forbidden";
import Error from "../pages/Error";
import Services from "../pages/Services/Services";
import Loader from "../ui/Loader";

const Overview = lazy(() => import("../pages/Dashboard/Overview"));
const EmployeeList = lazy(() => import("../pages/Dashboard/HR/EmployeeList"));
const AllEmployeeList = lazy(() => import("../pages/Dashboard/Admin/AllEmployeeList"));
const Payroll = lazy(() => import("../pages/Dashboard/Admin/Payroll"));
const EmployeeDetails = lazy(() => import("../pages/Dashboard/HR/EmployeeDetails"));
const Progress = lazy(() => import("../pages/Dashboard/HR/Progress"));
const Chat = lazy(() => import("../pages/Dashboard/Chat"));
const PaymentHistory = lazy(() => import("../pages/Dashboard/Employee/PaymentHistory"));
const WorkSheet = lazy(() => import("../pages/Dashboard/Employee/WorkSheet"));

const LazyRoute = ({ component: Component }) => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-700"><Loader size={60} /></div>}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <Error />,
    children: [
      {
        index: true,
        Component: Home,
        errorElement: <Error />,
      },
      {
        path: "login",
        Component: Login,
        errorElement: <Error />,
      },
      {
        path: "register",
        Component: Register,
        errorElement: <Error />,
      },
      {
        path: "services",
        Component: Services,
        errorElement: <Error />,
      },
      {
        path: "contact-us",
        Component: ContactUs,
        errorElement: <Error />,
      },
      {
        path: "about-us",
        Component: About,
        errorElement: <Error />,
      },
    ],
  },
  // Dashboard routes (separate from RootLayout to avoid navbar/footer)
  {
    path: "dashboard",
    element: (
      <RoleProtectedRoute>
        <Dashboard />
      </RoleProtectedRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "work-sheet",
    element: <RoleProtectedRoute><LazyRoute component={WorkSheet} /></RoleProtectedRoute>,
    errorElement: <Error />,
  },
  {
    path: "payment-history",
    element: <RoleProtectedRoute><LazyRoute component={PaymentHistory} /></RoleProtectedRoute>,
    errorElement: <Error />,
  },
  {
    path: "overview",
    element: <RoleProtectedRoute><LazyRoute component={Overview} /></RoleProtectedRoute>,
    errorElement: <Error />,
  },
  {
    path: "chat",
    element: <RoleProtectedRoute><LazyRoute component={Chat} /></RoleProtectedRoute>,
    errorElement: <Error />,
  },
  {
    path: "employees",
    element: <RoleProtectedRoute><LazyRoute component={EmployeeList} /></RoleProtectedRoute>,
    errorElement: <Error />,
  },
  {
    path: "admin/all-employee-list",
    element: <RoleProtectedRoute><LazyRoute component={AllEmployeeList} /></RoleProtectedRoute>,
    errorElement: <Error />,
  },
  {
    path: "admin/payroll",
    element: <RoleProtectedRoute><LazyRoute component={Payroll} /></RoleProtectedRoute>,
    errorElement: <Error />,
  },
  {
    path: "details/:slug",
    element: <RoleProtectedRoute><LazyRoute component={EmployeeDetails} /></RoleProtectedRoute>,
    errorElement: <Error />,
  },
  {
    path: "progress",
    element: <RoleProtectedRoute><LazyRoute component={Progress} /></RoleProtectedRoute>,
    errorElement: <Error />,
  },
  {
    path: "profile",
    element: (
      <RoleProtectedRoute>
        <Profile />
      </RoleProtectedRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "forbidden",
    element: <Forbidden />,
    errorElement: <Error />,
  },
  {
    path: "*",
    element: <Error />,
  },
]);
