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
import EmployeeList from "../pages/Dashboard/HR/EmployeeList";
import EmployeeDetails from "../pages/Dashboard/HR/EmployeeDetails";
import Progress from "../pages/Dashboard/HR/Progress";
import Chat from "../pages/Dashboard/Chat";
import Services from "../pages/Services";
import ContactUs from "../pages/ContactUs";
import About from "../pages/About";
import Forbidden from "../pages/Forbidden";
import Error from "../pages/Error";

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
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "work-sheet",
    element: (
      <PrivateRoute>
        <WorkSheet />
      </PrivateRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "payment-history",
    element: (
      <PrivateRoute>
        <PaymentHistory />
      </PrivateRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "overview",
    element: (
      <PrivateRoute>
        <Overview />
      </PrivateRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "chat",
    element: (
      <PrivateRoute>
        <Chat />
      </PrivateRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "employees",
    element: (
      <PrivateRoute>
        <EmployeeList />
      </PrivateRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "details/:slug",
    element: (
      <PrivateRoute>
        <EmployeeDetails />
      </PrivateRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "progress",
    element: (
      <PrivateRoute>
        <Progress />
      </PrivateRoute>
    ),
    errorElement: <Error />,
  },
  {
    path: "profile",
    element: (
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
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
