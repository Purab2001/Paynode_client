import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router/router";
import AuthProvider from "./contexts/AuthProvider";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <div className="bg-slate-50">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  </StrictMode>
);
