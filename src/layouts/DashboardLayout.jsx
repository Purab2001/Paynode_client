import React from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import ProfileImage from "../ui/ProfileImage";
import logo from "../assets/logo.png";
import { Toaster } from "react-hot-toast";
import {
  FiGrid,
  FiBarChart2,
  FiMessageSquare,
  FiUser,
  FiFileText,
  FiDollarSign,
  FiUsers
} from "react-icons/fi";
import { Button } from "@material-tailwind/react";

const DashboardLayout = ({ children }) => {
  const { user, logOut } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  const dashboardicon = <FiGrid className="w-6 h-6" />;
  const overviewicon = <FiBarChart2 className="w-6 h-6" />;
  const chaticon = <FiMessageSquare className="w-6 h-6" />;
  const profileicon = <FiUser className="w-6 h-6" />;
  const worksheeticon = <FiFileText className="w-6 h-6" />;
  const paymenticon = <FiDollarSign className="w-6 h-6" />;
  const employeesicon = <FiUsers className="w-6 h-6" />;

  // Define all possible sidebar links
  const allSidebarLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: dashboardicon,
      roles: ["Employee", "HR", "Admin"],
    },
    {
      name: "Overview",
      path: "/overview",
      icon: overviewicon,
      roles: ["Employee", "HR", "Admin"],
    },
    {
      name: "Work Sheet",
      path: "/work-sheet",
      icon: worksheeticon,
      roles: ["Employee"],
    },
    // Progress navlink will be moved below Employees
    {
      name: "Payment History",
      path: "/payment-history",
      icon: paymenticon,
      roles: ["Employee"],
    },
    {
      name: "Employees",
      path: "/employees",
      icon: employeesicon,
      roles: ["HR", "Admin"],
    },
    {
      name: "Progress",
      path: "/progress",
      icon: overviewicon,
      roles: ["HR"],
    },
    {
      name: "Chat",
      path: "/chat",
      icon: chaticon,
      roles: ["Employee", "HR", "Admin"],
    },
    {
      name: "Profile",
      path: "/profile",
      icon: profileicon,
      roles: ["Employee", "HR", "Admin"],
    },
  ];

  // Filter sidebar links based on user role
  const sidebarLinks = allSidebarLinks.filter(
    (link) => link.roles.includes(role) || roleLoading // Show all links while loading
  );

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* React Hot Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            style: {
              background: "#10B981",
              color: "#fff",
            },
          },
          error: {
            duration: 5000,
            style: {
              background: "#EF4444",
              color: "#fff",
            },
          },
        }}
      />

      {/* Top Header */}
      <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white transition-all duration-300">
        <Link to="/" className="flex items-center gap-2">
          <img className="h-9" src={logo} alt="PayNode Logo" />
          <span className="text-xl font-bold text-gray-800">PayNode</span>
        </Link>
        <div className="flex items-center gap-4 text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <ProfileImage user={user} size={32} />
            </div>
            <p className="hidden md:block">
              Hi! {user?.displayName || user?.email}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outlined"
            size="sm"
            className="rounded-full text-gray-500 border-gray-500"
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="md:w-64 w-16 border-r min-h-[calc(100vh-73px)] text-base border-gray-300 pt-4 flex flex-col transition-all duration-300 bg-white">
          {sidebarLinks.map((item, index) => (
            <Link
              to={item.path}
              key={index}
              className={`flex items-center py-3 px-4 gap-3 transition-colors ${
                location.pathname === item.path
                  ? "border-r-4 md:border-r-[6px] bg-blue-500/10 border-blue-500 text-blue-500"
                  : "hover:bg-gray-100/90 border-white text-gray-700"
              }`}
            >
              {item.icon}
              <p className="md:block hidden">{item.name}</p>
            </Link>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-6 min-w-0 overflow-x-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
