import Navbar from "../components/Navbar";
import { Outlet, useLocation } from "react-router";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "../components/ScrollToTop";

const RootLayout = () => {
  const location = useLocation();
  const hideNavAndFooter = [
    "/login",
    "/register",
    "/dashboard",
    "/overview",
    "/chat",
    "/profile",
  ].includes(location.pathname);

  return (
    <div>
      <ScrollToTop />
      {/* React Hot Toast Notifications */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            fontSize: "14px",
            borderRadius: "8px",
            padding: "12px 16px",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            style: {
              background: "#10B981",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#10B981",
            },
          },
          error: {
            duration: 5000,
            style: {
              background: "#EF4444",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#EF4444",
            },
          },
          loading: {
            style: {
              background: "#3B82F6",
              color: "#fff",
            },
          },
        }}
      />

      {!hideNavAndFooter && <Navbar />}
      <div className={!hideNavAndFooter ? "pt-17 md:pt-24" : undefined}>
        <Outlet />
      </div>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
};

export default RootLayout;
