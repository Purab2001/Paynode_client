import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";
import Loader from "../ui/Loader";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading: authLoading, roleLoading, role } = useAuth();
  const location = useLocation();

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-700">
        <Loader size={120} />
      </div>
    );
  }

  if (!user) {
    return <Navigate state={{ from: location.pathname }} to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <Navigate state={{ from: location.pathname }} to="/forbidden" replace />
    );
  }

  return children;
};

export default RoleProtectedRoute;
