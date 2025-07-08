import React from "react";
import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import PrivateRoute from "../routes/PrivateRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import Overview from "../pages/Dashboard/Overview";
import WorkSheet from "../pages/Dashboard/worksheet/WorkSheet";
import PaymentHistory from "../pages/Dashboard/PaymentHistory";
import Employees from "../pages/Dashboard/Employees";
import Reports from "../pages/Dashboard/Reports";
import Settings from "../pages/Dashboard/Settings";
import Chat from "../pages/Dashboard/Chat";
import Services from "../pages/Services";
import ContactUs from "../pages/ContactUs";
import About from "../pages/About";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
      {
        path: "services",
        Component: Services,
      },
      {
        path: "contact-us",
        Component: ContactUs,
      },
      {
        path: "about-us",
        Component: About,
      },
    ],
  },
  // Dashboard routes (separate from RootLayout to avoid navbar/footer)
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "work-sheet",
    element: (
      <PrivateRoute>
        <WorkSheet />
      </PrivateRoute>
    ),
  },
  {
    path: "payment-history",
    element: (
      <PrivateRoute>
        <PaymentHistory />
      </PrivateRoute>
    ),
  },
  {
    path: "overview",
    element: (
      <PrivateRoute>
        <Overview />
      </PrivateRoute>
    ),
  },
  {
    path: "chat",
    element: (
      <PrivateRoute>
        <Chat />
      </PrivateRoute>
    ),
  },
  {
    path: "employees",
    element: (
      <PrivateRoute>
        <Employees />
      </PrivateRoute>
    ),
  },
  {
    path: "reports",
    element: (
      <PrivateRoute>
        <Reports />
      </PrivateRoute>
    ),
  },
  {
    path: "settings",
    element: (
      <PrivateRoute>
        <Settings />
      </PrivateRoute>
    ),
  },
  {
    path: "profile",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    ),
  },
]);
