import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

interface UnProtectedRouteProps {
  children: React.ReactNode;
}

const UnProtectedRoute: React.FC<UnProtectedRouteProps> = ({ children }) => {
  const { accessToken } = useAuthStore();

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default UnProtectedRoute;
