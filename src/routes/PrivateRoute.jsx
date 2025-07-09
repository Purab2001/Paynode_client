import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import Loader from '../ui/Loader';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader size={120} />
            </div>
        )
    }

    if (!user) {
        return <Navigate state={{ from: location.pathname }} to="/login"></Navigate>
    }

    return children;
};

export default PrivateRoute;