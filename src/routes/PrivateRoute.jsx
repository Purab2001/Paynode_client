import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    {/* Custom Spinner */}
                    <div className="relative">
                        <div 
                            className="w-16 h-16 border-4 border-gray-200 border-t-[#3B82F6] rounded-full animate-spin"
                            style={{
                                borderTopColor: '#3B82F6'
                            }}
                        ></div>
                        {/* Inner spinning circle for enhanced effect */}
                        <div 
                            className="absolute inset-2 w-8 h-8 border-2 border-transparent border-b-[#3B82F6] rounded-full animate-spin"
                            style={{
                                borderBottomColor: '#3B82F6',
                                animationDirection: 'reverse',
                                animationDuration: '0.75s'
                            }}
                        ></div>
                    </div>
                    {/* Loading Text */}
                    <div className="text-center">
                        <p className="text-[#3B82F6] font-medium text-lg">Loading...</p>
                        <p className="text-gray-500 text-sm mt-1">Please wait while we verify your access</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Navigate state={{ from: location.pathname }} to="/login"></Navigate>
    }

    return children;
};

export default PrivateRoute;