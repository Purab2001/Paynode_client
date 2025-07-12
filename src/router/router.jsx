import React from "react";
import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import RoleProtectedRoute from "../routes/RoleProtectedRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import Overview from "../pages/Dashboard/Overview";
import EmployeeList from "../pages/Dashboard/HR/EmployeeList";
import AllEmployeeList from "../pages/Dashboard/Admin/AllEmployeeList";
import Payroll from "../pages/Dashboard/Admin/Payroll";
import EmployeeDetails from "../pages/Dashboard/HR/EmployeeDetails";
import Progress from "../pages/Dashboard/HR/Progress";
import Chat from "../pages/Dashboard/Chat";
import ContactUs from "../pages/ContactUs";
import About from "../pages/About";
import Forbidden from "../pages/Forbidden";
import Error from "../pages/Error";
import PaymentHistory from "../pages/Dashboard/Employee/PaymentHistory";
import WorkSheet from "../pages/Dashboard/Employee/WorkSheet";
import Services from "../pages/Services/Services";

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
    element: (
      <RoleProtectedRoute>
        <WorkSheet />
      </RoleProtectedRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "payment-history",
    element: (
      <RoleProtectedRoute>
        <PaymentHistory />
      </RoleProtectedRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "overview",
    element: (
      <RoleProtectedRoute>
        <Overview />
      </RoleProtectedRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "chat",
    element: (
      <RoleProtectedRoute>
        <Chat />
      </RoleProtectedRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "employees",
    element: (
      <RoleProtectedRoute>
        <EmployeeList />
      </RoleProtectedRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "admin/all-employee-list",
    element: (
      <RoleProtectedRoute>
        <AllEmployeeList />
      </RoleProtectedRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "admin/payroll",
    element: (
      <RoleProtectedRoute>
        <Payroll />
      </RoleProtectedRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "details/:slug",
    element: (
      <RoleProtectedRoute>
        <EmployeeDetails />
      </RoleProtectedRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "progress",
    element: (
      <RoleProtectedRoute>
        <Progress />
      </RoleProtectedRoute>
    ),
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
