import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import PrivateRoute from "../routes/PrivateRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import Overview from "../pages/Dashboard/Overview";
import Chat from "../pages/Dashboard/Chat";

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
        path: "dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
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
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
