import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

interface ProtectedRouteProps {
  user: any;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  user,
  redirectPath = '/login'
}) => {
  if (user === undefined) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
